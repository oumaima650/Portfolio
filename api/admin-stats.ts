import type { VercelRequest, VercelResponse } from '@vercel/node';

async function verifyToken(req: VercelRequest): Promise<boolean> {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  if (!(await verifyToken(req))) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);

    // Init / migration du schéma (idempotent, rattrape les anciennes bases).
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

    const { range = '30' } = req.query;
    const days = parseInt(String(range), 10) || 30;
    const prevDays = days * 2;

    const [
      totalVisits, prevVisits, uniqueVisitors, visitsToday,
      visitsByDay, visitsByDevice, visitsByReferrer, visitsByLang, visitsByCountry,
      visitsByBrowser, visitsByOs,
      topProjects, topEvents, cvDownloads, sectionTimes, recentVisits, scrollDepths, messages,
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval`,
      sql`SELECT COUNT(*)::int as count FROM visits WHERE created_at <= NOW() - (${days} || ' days')::interval AND created_at > NOW() - (${prevDays} || ' days')::interval`,
      sql`SELECT COUNT(DISTINCT session_id)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval`,
      sql`SELECT COUNT(*)::int as count FROM visits WHERE created_at >= CURRENT_DATE`,
      sql`SELECT DATE(created_at) as date, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY DATE(created_at) ORDER BY date ASC`,
      sql`SELECT COALESCE(NULLIF(device, ''), 'Inconnu') as device, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY device ORDER BY count DESC`,
      sql`SELECT CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' WHEN referrer ILIKE '%linkedin%' THEN 'LinkedIn' WHEN referrer ILIKE '%github%' THEN 'GitHub' WHEN referrer ILIKE '%google%' THEN 'Google' ELSE 'Autre' END as source, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY source ORDER BY count DESC`,
      sql`SELECT UPPER(COALESCE(NULLIF(lang, ''), 'FR')) as lang, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY UPPER(COALESCE(NULLIF(lang, ''), 'FR')) ORDER BY count DESC`,
      sql`SELECT COALESCE(NULLIF(country, ''), 'Inconnu') as country, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY COALESCE(NULLIF(country, ''), 'Inconnu') ORDER BY count DESC LIMIT 12`,
      sql`SELECT COALESCE(NULLIF(browser, ''), 'Inconnu') as browser, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY browser ORDER BY count DESC`,
      sql`SELECT COALESCE(NULLIF(os, ''), 'Inconnu') as os, COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY os ORDER BY count DESC`,
      sql`SELECT label, COUNT(*)::int as count FROM events WHERE type = 'project_open' AND created_at > NOW() - (${days} || ' days')::interval GROUP BY label ORDER BY count DESC LIMIT 10`,
      sql`SELECT type, COUNT(*)::int as count FROM events WHERE created_at > NOW() - (${days} || ' days')::interval GROUP BY type ORDER BY count DESC`,
      sql`SELECT value as version, COUNT(*)::int as count FROM events WHERE type = 'cv_download' AND created_at > NOW() - (${days} || ' days')::interval GROUP BY value`,
      sql`SELECT label as section, ROUND(AVG(seconds))::int as avg_seconds, COUNT(*)::int as count FROM events WHERE type = 'section_time' AND seconds IS NOT NULL AND created_at > NOW() - (${days} || ' days')::interval GROUP BY label ORDER BY avg_seconds DESC`,
      sql`SELECT created_at, device, browser, os, country, city, referrer, ref_param, lang FROM visits ORDER BY created_at DESC LIMIT 30`,
      sql`SELECT value as percent, COUNT(*)::int as count FROM events WHERE type = 'scroll_depth' AND created_at > NOW() - (${days} || ' days')::interval GROUP BY value ORDER BY value::int ASC`,
      sql`SELECT value, created_at FROM events WHERE type = 'contact_form_sent' ORDER BY created_at DESC LIMIT 20`,
    ]);

    return res.status(200).json({
      range: days,
      generatedAt: new Date().toISOString(),
      totalVisits: totalVisits[0]?.count ?? 0,
      prevVisits: prevVisits[0]?.count ?? 0,
      uniqueVisitors: uniqueVisitors[0]?.count ?? 0,
      visitsToday: visitsToday[0]?.count ?? 0,
      visitsByDay,
      visitsByDevice,
      visitsByReferrer,
      visitsByLang,
      visitsByCountry,
      visitsByBrowser,
      visitsByOs,
      topProjects,
      topEvents,
      cvDownloads,
      sectionTimes,
      recentVisits,
      scrollDepths,
      messages,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
