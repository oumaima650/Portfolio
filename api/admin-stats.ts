import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, verifyToken } from './_schema';

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
    await ensureSchema(sql);

    const { range = '30' } = req.query;
    const days = parseInt(String(range), 10) || 30;
    const prevDays = days * 2;

    const [
      totalVisits, prevVisits, uniqueVisitors, visitsToday, avgDuration, totalDuration, returningVisits,
      visitsByDay, visitsByDevice, visitsByReferrer, visitsByLang, visitsByCountry,
      visitsByBrowser, visitsByOs,
      topProjects, topEvents, cvDownloads, sectionTimes, recentVisits, recentCompanyLinks, scrollDepths, messages,
      topReports, topCerts,
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval`,
      sql`SELECT COUNT(*)::int as count FROM visits WHERE created_at <= NOW() - (${days} || ' days')::interval AND created_at > NOW() - (${prevDays} || ' days')::interval`,
      sql`SELECT COUNT(DISTINCT session_id)::int as count FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval`,
      sql`SELECT COUNT(*)::int as count FROM visits WHERE created_at >= CURRENT_DATE`,
      sql`SELECT COALESCE(ROUND(AVG(duration_seconds)), 0)::int as value FROM visits WHERE duration_seconds IS NOT NULL AND created_at > NOW() - (${days} || ' days')::interval`,
      sql`SELECT COALESCE(SUM(duration_seconds), 0)::int as value FROM visits WHERE created_at > NOW() - (${days} || ' days')::interval`,
      sql`SELECT COUNT(*)::int as count FROM visits WHERE is_returning = TRUE AND created_at > NOW() - (${days} || ' days')::interval`,
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
      sql`SELECT label as section, ROUND(AVG(seconds))::int as avg_seconds, COUNT(*)::int as count, SUM(seconds)::int as total_seconds FROM events WHERE type = 'section_time' AND seconds IS NOT NULL AND created_at > NOW() - (${days} || ' days')::interval GROUP BY label ORDER BY avg_seconds DESC`,
      sql`SELECT created_at, device, browser, os, country, city, referrer, ref_param, lang, duration_seconds, is_returning, session_id, company FROM visits ORDER BY created_at DESC LIMIT 40`,
      sql`SELECT e.created_at, e.label AS company, e.session_id, v.city, v.country, v.device
          FROM events e LEFT JOIN visits v ON v.session_id = e.session_id
          WHERE e.type = 'company_link_visit' AND e.created_at > NOW() - (${days} || ' days')::interval
          ORDER BY e.created_at DESC LIMIT 40`,
      sql`SELECT value as percent, COUNT(*)::int as count FROM events WHERE type = 'scroll_depth' AND created_at > NOW() - (${days} || ' days')::interval GROUP BY value ORDER BY value::int ASC`,
      sql`SELECT value, created_at FROM events WHERE type = 'contact_form_sent' ORDER BY created_at DESC LIMIT 20`,
      sql`SELECT label, COUNT(*)::int as count FROM events WHERE type = 'report_open' AND created_at > NOW() - (${days} || ' days')::interval GROUP BY label ORDER BY count DESC LIMIT 10`,
      sql`SELECT label, COUNT(*)::int as count FROM events WHERE type = 'cert_open' AND created_at > NOW() - (${days} || ' days')::interval GROUP BY label ORDER BY count DESC LIMIT 10`,
    ]);

    return res.status(200).json({
      range: days,
      generatedAt: new Date().toISOString(),
      totalVisits: totalVisits[0]?.count ?? 0,
      prevVisits: prevVisits[0]?.count ?? 0,
      uniqueVisitors: uniqueVisitors[0]?.count ?? 0,
      visitsToday: visitsToday[0]?.count ?? 0,
      avgDuration: avgDuration[0]?.value ?? 0,
      totalDuration: totalDuration[0]?.value ?? 0,
      returningVisits: returningVisits[0]?.count ?? 0,
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
      recentCompanyLinks,
      scrollDepths,
      messages,
      topReports,
      topCerts,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
