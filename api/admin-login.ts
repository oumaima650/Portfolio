import type { VercelRequest, VercelResponse } from '@vercel/node';
import { geoFromRequest, publicClientIp, sendNtfy } from './_schema';

function describeClient(req: VercelRequest): string {
  const { country, city } = geoFromRequest(req);
  const ip = publicClientIp(req);
  const time = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  return [
    [city, country].filter(Boolean).join(', ') || null,
    ip ? `IP : ${ip}` : null,
    `Heure : ${time}`,
  ].filter(Boolean).join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { password } = req.body ?? {};
    if (!password) return res.status(400).json({ error: 'Missing password' });

    // Import dynamique pour éviter les problèmes de bundling
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    const hash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.JWT_SECRET;

    if (!hash || !secret) {
      console.error('Missing env:', { hasHash: !!hash, hasSecret: !!secret });
      return res.status(500).json({ error: 'Missing configuration' });
    }

    const valid = await bcrypt.compare(String(password), String(hash));
    if (!valid) {
      await sendNtfy(
        'Alerte - Acces admin refuse',
        `Mot de passe incorrect.\n${describeClient(req)}`,
        4,
      );
      await new Promise((r) => setTimeout(r, 800));
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ admin: true }, secret, { expiresIn: '24h' });
    await sendNtfy(
      'Connexion admin reussie',
      `Quelqu'un a ouvert le dashboard admin.\n${describeClient(req)}`,
      3,
    );
    return res.status(200).json({ token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
