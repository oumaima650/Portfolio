import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mot de passe hashé de "Lovexo2004-" — généré avec bcrypt rounds=12
// NE JAMAIS stocker le mot de passe en clair ici
const PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
const JWT_SECRET   = process.env.JWT_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body ?? {};
  if (!password) return res.status(400).json({ error: 'Missing password' });

  const valid = await bcrypt.compare(password, PASSWORD_HASH);
  if (!valid) {
    // Délai anti-brute-force
    await new Promise((r) => setTimeout(r, 1000));
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
  return res.status(200).json({ token });
}
