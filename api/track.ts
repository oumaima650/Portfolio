import type { VercelRequest, VercelResponse } from '@vercel/node';

const NTFY_TOPIC = process.env.NTFY_TOPIC ?? 'oumaima-pf-2027-secret';

async function sendNtfy(title: string, body: string, priority = 3) {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: { 'Title': title, 'Priority': String(priority), 'Tags': 'portfolio', 'Content-Type': 'text/plain; charset=utf-8' },
      body,
    });
  } catch { /* silently fail */ }
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

    // Init tables
    await sql`CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
      device TEXT, browser TEXT, os TEXT, referrer TEXT, ref_param TEXT, lang TEXT, session_id TEXT UNIQUE
    )`;
    await sql`CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(),
      session_id TEXT, type TEXT NOT NULL, label TEXT, value TEXT, seconds INTEGER
    )`;

    const { type, sessionId, label, value, seconds, meta } = req.body ?? {};
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (type === 'visit') {
      const { device, browser, os, referrer, refParam, lang } = meta ?? {};
      const existing = await sql`SELECT id FROM visits WHERE session_id = ${sessionId} LIMIT 1`;
      if (existing.length === 0) {
        await sql`INSERT INTO visits (session_id, device, browser, os, referrer, ref_param, lang) VALUES (${sessionId}, ${device}, ${browser}, ${os}, ${referrer}, ${refParam}, ${lang})`;
        const src = !referrer ? '🔗 Direct' : referrer.includes('linkedin') ? '💼 LinkedIn' : referrer.includes('github') ? '🐙 GitHub' : referrer.includes('google') ? '🔍 Google' : `🔗 ${referrer.substring(0, 30)}`;
        await sendNtfy('👤 Nouvelle visite — Portfolio', `${device} · ${browser} · ${os}\n${src}${refParam ? `\n🎯 Campagne : ${refParam}` : ''}\n🕐 ${time}`, 3);
      }
      return res.status(200).json({ ok: true });
    }

    await sql`INSERT INTO events (session_id, type, label, value, seconds) VALUES (${sessionId}, ${type}, ${label}, ${value}, ${seconds ?? null})`;

    if (type === 'cv_download') await sendNtfy(`📄 CV téléchargé — Version ${value}`, `🕐 ${time}`, 4);
    else if (type === 'github_click') await sendNtfy(`🐙 GitHub ouvert`, `Projet : ${label}\n🕐 ${time}`, 2);
    else if (type === 'linkedin_click') await sendNtfy(`💼 LinkedIn cliqué`, `🕐 ${time}`, 2);
    else if (type === 'contact_form_sent') await sendNtfy(`📧 Message reçu !`, `💬 "${value?.substring(0, 100)}"\n🕐 ${time}`, 5);
    else if (type === 'live_demo_click') await sendNtfy(`🚀 Demo live ouverte`, `Projet : ${label}\n🕐 ${time}`, 2);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
