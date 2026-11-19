import type { VercelRequest, VercelResponse } from '@vercel/node';
import { geoFromRequest, publicClientIp, sendNtfy } from './_schema';

// Anti-spam : une notification maximum par IP sur cette fenêtre (mémoire d'instance).
const WINDOW_MS = 60_000;
const recent = new Map<string, number>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const ip = publicClientIp(req) ?? 'inconnue';
  const now = Date.now();

  if (now - (recent.get(ip) ?? 0) < WINDOW_MS) {
    return res.status(200).json({ ok: true, throttled: true });
  }
  recent.set(ip, now);
  if (recent.size > 500) {
    for (const [key, seen] of recent) if (now - seen > WINDOW_MS) recent.delete(key);
  }

  const { country, city } = geoFromRequest(req);
  const heure = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const body = [
    "Quelqu'un vient d'ouvrir la page du dashboard admin.",
    [city, country].filter(Boolean).join(', ') || null,
    `IP : ${ip}`,
    `Heure : ${heure}`,
  ].filter(Boolean).join('\n');

  await sendNtfy('Ouverture du dashboard admin', body, 3);
  return res.status(200).json({ ok: true });
}
