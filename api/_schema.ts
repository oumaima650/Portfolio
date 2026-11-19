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
    duration_seconds INTEGER, is_returning BOOLEAN DEFAULT FALSE
  )`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS city TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS duration_seconds INTEGER`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_returning BOOLEAN DEFAULT FALSE`;
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

// The external lookup is best-effort; Vercel's result remains the fallback.
export async function resolveGeoFromRequest(req: VercelRequest): Promise<{ country: string | null; city: string | null }> {
  const vercelGeo = geoFromRequest(req);
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
      city: data.city?.trim() || vercelGeo.city,
    };
  } catch {
    return vercelGeo;
  }
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
