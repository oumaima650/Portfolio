import type { VercelRequest } from '@vercel/node';
import type { neon } from '@neondatabase/serverless';

export type Sql = ReturnType<typeof neon>;

// ── Init / migration du schéma (idempotent) ───────────────────────────────────
// Les ALTER rattrapent les bases créées avant l'ajout des nouvelles colonnes.
export async function ensureSchema(sql: Sql) {
  await sql`CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
    device TEXT, browser TEXT, os TEXT, country TEXT, city TEXT,
    referrer TEXT, ref_param TEXT, lang TEXT, session_id TEXT UNIQUE,
    duration_seconds INTEGER, returning BOOLEAN DEFAULT FALSE
  )`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS city TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS duration_seconds INTEGER`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS returning BOOLEAN DEFAULT FALSE`;
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
