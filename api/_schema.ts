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

// Vercel's own headers are the primary source (its geo database is more
// reliable than third parties, which often misplace entire ISP blocks).
// The external lookup is best-effort and only fills in what Vercel omits.
export async function resolveGeoFromRequest(req: VercelRequest): Promise<{ country: string | null; city: string | null }> {
  const vercelGeo = geoFromRequest(req);
  // Vercel already gave us both fields: no need to query a less reliable third party.
  if (vercelGeo.country && vercelGeo.city) return vercelGeo;

  const ip = publicClientIp(req);
  if (!ip) return vercelGeo;

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(1800),
    });
    if (!response.ok) return vercelGeo;

    const data = await response.json() as {
      success?: boolean;
      country_code?: string;
      city?: string;
    };
    const country = data.country_code?.toUpperCase();
    if (!data.success || !country || !/^[A-Z]{2}$/.test(country)) return vercelGeo;

    // Keep Vercel's location if providers disagree on the country.
    if (vercelGeo.country && vercelGeo.country.toUpperCase() !== country) return vercelGeo;

    return {
      country,
      // Vercel's city always wins; the third party only fills the gap.
      city: vercelGeo.city || data.city?.trim() || null,
    };
  } catch {
    return vercelGeo;
  }
}

// ── Diagnostic géolocalisation (temporaire, GEO_DEBUG=1) ──────────────────────
// Compare plusieurs bases IP sur la même requête pour savoir laquelle localise
// le mieux les IP concernées. Aucune donnée n'est stockée ; rien n'est envoyé
// si la variable d'environnement GEO_DEBUG n'est pas à « 1 ».
export type GeoSource = { name: string; country: string | null; city: string | null };

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

export async function geoSources(req: VercelRequest): Promise<GeoSource[]> {
  const vercel = geoFromRequest(req);
  const sources: GeoSource[] = [{ name: 'Vercel', country: vercel.country, city: vercel.city }];

  const ip = publicClientIp(req);
  if (!ip) return sources;

  const id = encodeURIComponent(ip);
  const [who, api, co, dbip] = await Promise.all([
    fetchJson(`https://ipwho.is/${id}`),
    fetchJson(`http://ip-api.com/json/${id}?fields=status,countryCode,city,regionName`),
    fetchJson(`https://ipapi.co/${id}/json/`),
    fetchJson(`https://api.db-ip.com/v2/free/${id}`),
  ]);

  sources.push(
    { name: 'ipwho.is', country: asCountry(who?.country_code), city: asText(who?.city) },
    { name: 'ip-api.com', country: asCountry(api?.countryCode), city: asText(api?.city) },
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
