import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import sql, { initDb } from './_db';

function verifyToken(req: VercelRequest): boolean {
  const auth = req.headers.authorization ?? '';
  const token = auth.replace('Bearer ', '');
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await initDb();
    const { range = '30' } = req.query;
    const days = parseInt(String(range), 10) || 30;

    const [
      totalVisits,
      visitsByDay,
      visitsByDevice,
      visitsByReferrer,
      visitsByLang,
      topProjects,
      topEvents,
      cvDownloads,
      sectionTimes,
      recentVisits,
      scrollDepths,
    ] = await Promise.all([
      // Total visites
      sql`SELECT COUNT(*) as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval`,

      // Visites par jour
      sql`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM visits
        WHERE created_at > NOW() - (${days} || ' days')::interval
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,

      // Par appareil
      sql`
        SELECT device, COUNT(*) as count
        FROM visits
        WHERE created_at > NOW() - (${days} || ' days')::interval
        GROUP BY device ORDER BY count DESC
      `,

      // Par source
      sql`
        SELECT
          CASE
            WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
            WHEN referrer ILIKE '%linkedin%' THEN 'LinkedIn'
            WHEN referrer ILIKE '%github%' THEN 'GitHub'
            WHEN referrer ILIKE '%google%' THEN 'Google'
            ELSE 'Autre'
          END as source,
          COUNT(*) as count
        FROM visits
        WHERE created_at > NOW() - (${days} || ' days')::interval
        GROUP BY source ORDER BY count DESC
      `,

      // Par langue
      sql`
        SELECT lang, COUNT(*) as count
        FROM visits
        WHERE created_at > NOW() - (${days} || ' days')::interval
        GROUP BY lang ORDER BY count DESC
      `,

      // Projets les plus consultés
      sql`
        SELECT label, COUNT(*) as count
        FROM events
        WHERE type = 'project_open'
          AND created_at > NOW() - (${days} || ' days')::interval
        GROUP BY label ORDER BY count DESC LIMIT 10
      `,

      // Events par type
      sql`
        SELECT type, COUNT(*) as count
        FROM events
        WHERE created_at > NOW() - (${days} || ' days')::interval
        GROUP BY type ORDER BY count DESC
      `,

      // CV téléchargés
      sql`
        SELECT value as version, COUNT(*) as count
        FROM events
        WHERE type = 'cv_download'
          AND created_at > NOW() - (${days} || ' days')::interval
        GROUP BY value
      `,

      // Temps moyen par section
      sql`
        SELECT label as section, ROUND(AVG(seconds)) as avg_seconds, COUNT(*) as count
        FROM events
        WHERE type = 'section_time' AND seconds IS NOT NULL
          AND created_at > NOW() - (${days} || ' days')::interval
        GROUP BY label ORDER BY avg_seconds DESC
      `,

      // 20 dernières visites
      sql`
        SELECT created_at, device, browser, os, referrer, ref_param, lang
        FROM visits
        ORDER BY created_at DESC LIMIT 20
      `,

      // Scroll depth
      sql`
        SELECT value as percent, COUNT(*) as count
        FROM events
        WHERE type = 'scroll_depth'
          AND created_at > NOW() - (${days} || ' days')::interval
        GROUP BY value ORDER BY value::int ASC
      `,
    ]);

    return res.status(200).json({
      totalVisits: totalVisits[0]?.count ?? 0,
      visitsByDay,
      visitsByDevice,
      visitsByReferrer,
      visitsByLang,
      topProjects,
      topEvents,
      cvDownloads,
      sectionTimes,
      recentVisits,
      scrollDepths,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
