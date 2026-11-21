import type { VercelRequest } from '@vercel/node';
import type { neon } from '@neondatabase/serverless';
import { isIP } from 'node:net';

export type Sql = ReturnType<typeof neon>;

// ── Init / migration du schéma (idempotent) ───────────────────────────────────
// Les ALTER rattrapent les bases créées avant l'ajout des nouvelles colonnes.
export async function ensureSchema(sql: Sql) {
  await sql`CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
    device TEXT, browser TEXT, os TEXT, country TEXT, city TEXT,
    referrer TEXT, ref_param TEXT, lang TEXT, session_id TEXT UNIQUE,
    duration_seconds INTEGER, is_returning BOOLEAN DEFAULT FALSE,
    company TEXT
  )`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS city TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS duration_seconds INTEGER`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_returning BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS company TEXT`;
  await sql`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT, type TEXT NOT NULL, label TEXT, value TEXT, seconds INTEGER
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_type ON events(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at)`;
}

// ── Géolocalisation fournie par Vercel ────────────────────────────────────────
export function geoFromRequest(req: VercelRequest): { country: string | null; city: string | null } {
  const raw = (name: string) => {
    const v = req.headers[name];
    return Array.isArray(v) ? v[0] : v;
  };
  const country = raw('x-vercel-ip-country') ?? null;
  let city: string | null = raw('x-vercel-ip-city') ?? null;
  if (city) {
    try { city = decodeURIComponent(city); } catch { /* garde la valeur brute */ }
  }
  return { country, city };
}

// Extrait un nom d'entreprise lisible à partir d'un referrer (domaine hors TLD connu).
export function companyFromReferrer(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  let host = referrer;
  try {
    host = new URL(referrer).hostname || referrer;
  } catch { /* garde la valeur brute */ }
  const parts = host.replace(/^www\./, '').split('.');
  if (parts.length < 2) return null;
  const tlds = new Set(['com', 'fr', 'ma', 'net', 'org', 'io', 'co', 'gov', 'edu', 'info', 'biz', 'dev', 'app', 'me', 'io', 'ai']);
  const name = parts[parts.length - 2]?.toLowerCase();
  if (!name) return null;
  const known: Record<string, string> = {
    linkedin: 'LinkedIn', github: 'GitHub', google: 'Google', facebook: 'Facebook',
    twitter: 'Twitter / X', x: 'Twitter / X', youtube: 'YouTube', instagram: 'Instagram',
    indeed: 'Indeed', glassdoor: 'Glassdoor', oracle: 'Oracle', microsoft: 'Microsoft',
    amazon: 'Amazon', apple: 'Apple', meta: 'Meta', atlassian: 'Atlassian',
  };
  if (known[name]) return known[name];
  if (tlds.has(name)) return null;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function publicClientIp(req: VercelRequest): string | null {
  const header = req.headers['x-forwarded-for'] ?? req.headers['x-real-ip'];
  const raw = Array.isArray(header) ? header[0] : header;
  const ip = raw?.split(',')[0]?.trim();
  if (!ip) return null;

  const version = isIP(ip);
  if (version === 4) {
    const [a, b] = ip.split('.').map(Number);
    if (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) return null;
    return ip;
  }

  if (version === 6) {
    const normalized = ip.toLowerCase();
    if (
      normalized === '::' || normalized === '::1' ||
      /^(fc|fd|ff|fe[89ab])/.test(normalized)
    ) return null;
    return ip;
  }

  return null;
}

export type GeoSource = {
  name: string;
  country: string | null;
  city: string | null;
  region?: string | null;
};

// Use a city only when ipwho.is and ip-api.com agree for the same client IP.
// If they disagree, retain Vercel's estimate instead of guessing.
export async function resolveGeoFromRequest(
  req: VercelRequest,
  knownSources?: GeoSource[],
): Promise<{ country: string | null; city: string | null; region?: string | null }> {
  const vercelGeo = geoFromRequest(req);
  const ip = publicClientIp(req);
  if (!ip) return vercelGeo;

  try {
    const primarySources = knownSources?.filter((source) =>
      source.name === 'ipwho.is' || source.name === 'ip-api.com',
    ) ?? await fetchPrimaryGeoSources(ip);
    const who = primarySources.find((source) => source.name === 'ipwho.is');
    const api = primarySources.find((source) => source.name === 'ip-api.com');
    const country = who?.country;
    const city = who?.city;
    const apiCity = api?.city;
    const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    if (
      !country ||
      country !== api?.country ||
      !city ||
      !apiCity ||
      normalized(city) !== normalized(apiCity) ||
      (vercelGeo.country && vercelGeo.country.toUpperCase() !== country)
    ) return vercelGeo;

    return {
      country,
      city,
      region: who?.region || api?.region || null,
    };
  } catch {
    return vercelGeo;
  }
}

// ── Diagnostic géolocalisation (temporaire, GEO_DEBUG=1) ──────────────────────
// Compare plusieurs bases IP sur la même requête pour savoir laquelle localise
// le mieux les IP concernées. Aucune donnée n'est stockée ; rien n'est envoyé
// si la variable d'environnement GEO_DEBUG n'est pas à « 1 ».
const asText = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);
const asCountry = (v: unknown): string | null => {
  const s = asText(v)?.toUpperCase();
  return s && /^[A-Z]{2}$/.test(s) ? s : null;
};

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(2500) });
    if (!r.ok) return null;
    return (await r.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function fetchPrimaryGeoSources(ip: string): Promise<GeoSource[]> {
  const id = encodeURIComponent(ip);
  const [who, api] = await Promise.all([
    fetchJson(`https://ipwho.is/${id}`),
    fetchJson(`http://ip-api.com/json/${id}?fields=status,countryCode,city,regionName`),
  ]);
  return [
    {
      name: 'ipwho.is',
      country: who?.success === true ? asCountry(who.country_code) : null,
      city: who?.success === true ? asText(who.city) : null,
      region: who?.success === true ? asText(who.region) : null,
    },
    {
      name: 'ip-api.com',
      country: api?.status === 'success' ? asCountry(api.countryCode) : null,
      city: api?.status === 'success' ? asText(api.city) : null,
      region: api?.status === 'success' ? asText(api.regionName) : null,
    },
  ];
}

export async function geoSources(req: VercelRequest): Promise<GeoSource[]> {
  const vercel = geoFromRequest(req);
  const sources: GeoSource[] = [{ name: 'Vercel', country: vercel.country, city: vercel.city }];

  const ip = publicClientIp(req);
  if (!ip) return sources;

  const id = encodeURIComponent(ip);
  const [primary, co, dbip] = await Promise.all([
    fetchPrimaryGeoSources(ip),
    fetchJson(`https://ipapi.co/${id}/json/`),
    fetchJson(`https://api.db-ip.com/v2/free/${id}`),
  ]);

  sources.push(
    ...primary,
    { name: 'ipapi.co', country: asCountry(co?.country_code), city: asText(co?.city) },
    { name: 'db-ip.com', country: asCountry(dbip?.countryCode), city: asText(dbip?.city) },
  );
  return sources;
}

// ── Auth admin (JWT) ──────────────────────────────────────────────────────────
export async function verifyToken(req: VercelRequest): Promise<boolean> {
  const auth = req.headers.authorization ?? '';
  const token = auth.replace('Bearer ', '');
  if (!token) return false;
  try {
    const jwt = await import('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
}

// ── Notification ntfy ─────────────────────────────────────────────────────────
export async function sendNtfy(title: string, body: string, priority = 3) {
  const topic = process.env.NTFY_TOPIC ?? 'oumaima-pf-2027-secret';
  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: { 'Title': title, 'Priority': String(priority), 'Tags': 'portfolio', 'Content-Type': 'text/plain; charset=utf-8' },
      body,
    });
  } catch { /* échec silencieux */ }
}
