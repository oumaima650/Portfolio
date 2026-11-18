import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, verifyToken } from './_schema';

// Parcours complet d'une visite : infos de la visite + tous les événements
// horodatés, pour reconstituer ce que l'utilisateur a fait.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  if (!(await verifyToken(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sid = String(req.query.s ?? '');
  if (!sid) return res.status(400).json({ error: 'Missing session id' });

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    await ensureSchema(sql);

    const [visit, events] = await Promise.all([
      sql`SELECT created_at, device, browser, os, country, city, referrer, ref_param, lang, duration_seconds, returning, session_id
          FROM visits WHERE session_id = ${sid} LIMIT 1`,
      sql`SELECT created_at, type, label, value, seconds FROM events
          WHERE session_id = ${sid} ORDER BY created_at ASC`,
    ]);

    return res.status(200).json({ visit: visit[0] ?? null, events });
  } catch (err) {
    console.error('Session error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
