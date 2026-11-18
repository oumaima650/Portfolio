import type { VercelRequest, VercelResponse } from '@vercel/node';

const NTFY_TOPIC = process.env.NTFY_TOPIC ?? 'oumaima-pf-2027-secret';

// ── Init du schéma (idempotent) ──────────────────────────────────────────────
// Les colonnes country / city sont ajoutées via ALTER pour rattraper les bases
// créées avant l'ajout de la géolocalisation.
async function ensureSchema(sql: ReturnType<typeof import('@neondatabase/serverless').neon>) {
  await sql`CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
    device TEXT, browser TEXT, os TEXT, country TEXT, city TEXT,
    referrer TEXT, ref_param TEXT, lang TEXT, session_id TEXT UNIQUE
  )`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT`;
  await sql`ALTER TABLE visits ADD COLUMN IF NOT EXISTS city TEXT`;
  await sql`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT, type TEXT NOT NULL, label TEXT, value TEXT, seconds INTEGER
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_type ON events(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at)`;
}

async function sendNtfy(title: string, body: string, priority = 3) {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: { 'Title': title, 'Priority': String(priority), 'Tags': 'portfolio', 'Content-Type': 'text/plain; charset=utf-8' },
      body,
    });
  } catch { /* silently fail */ }
}

// Géolocalisation fournie par Vercel (headers ajoutés automatiquement).
function geoFromRequest(req: VercelRequest) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    await ensureSchema(sql);

    const { type, sessionId, label, value, seconds, meta } = req.body ?? {};
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (type === 'visit') {
      const { device, browser, os, referrer, refParam, lang } = meta ?? {};
      const { country, city } = geoFromRequest(req);
      const existing = await sql`SELECT id FROM visits WHERE session_id = ${sessionId} LIMIT 1`;
      if (existing.length === 0) {
        await sql`INSERT INTO visits (session_id, device, browser, os, country, city, referrer, ref_param, lang)
                  VALUES (${sessionId}, ${device}, ${browser}, ${os}, ${country}, ${city}, ${referrer}, ${refParam}, ${lang})`;
        const src = !referrer ? 'Direct' : referrer.includes('linkedin') ? 'LinkedIn' : referrer.includes('github') ? 'GitHub' : referrer.includes('google') ? 'Google' : referrer.substring(0, 30);
        const where = [city, country].filter(Boolean).join(', ');
        const lines = [
          `${device} · ${browser} · ${os}`,
          where ? `Localisation : ${where}` : null,
          `Source : ${src}${refParam ? ` (campagne ${refParam})` : ''}`,
          `Heure : ${time}`,
        ].filter(Boolean).join('\n');
        await sendNtfy('Nouvelle visite - Portfolio', lines, 3);
      }
      return res.status(200).json({ ok: true });
    }

    await sql`INSERT INTO events (session_id, type, label, value, seconds) VALUES (${sessionId}, ${type}, ${label}, ${value}, ${seconds ?? null})`;

    if (type === 'cv_download') await sendNtfy(`CV telecharge - Version ${value}`, `Heure : ${time}`, 4);
    else if (type === 'github_click') await sendNtfy('GitHub ouvert', `Projet : ${label}\nHeure : ${time}`, 2);
    else if (type === 'linkedin_click') await sendNtfy('LinkedIn clique', `Heure : ${time}`, 2);
    else if (type === 'contact_form_sent') await sendNtfy('Message recu !', `"${value?.substring(0, 100)}"\nHeure : ${time}`, 5);
    else if (type === 'live_demo_click') await sendNtfy('Demo live ouverte', `Projet : ${label}\nHeure : ${time}`, 2);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
