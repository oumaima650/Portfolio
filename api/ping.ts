import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, env: {
    hasDb: !!process.env.DATABASE_URL,
    hasHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasJwt: !!process.env.JWT_SECRET,
    hasTopic: !!process.env.NTFY_TOPIC,
  }});
}
