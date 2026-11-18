import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { password } = req.body ?? {};

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.JWT_SECRET;

    // Debug: vérifier que les env vars sont présentes
    if (!hash || !secret) {
      console.error('Missing env vars:', { hash: !!hash, secret: !!secret });
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const valid = await bcrypt.compare(String(password), String(hash));

    if (!valid) {
      await new Promise((r) => setTimeout(r, 1000));
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ admin: true }, secret, { expiresIn: '24h' });
    return res.status(200).json({ token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: String(err) });
  }
}
