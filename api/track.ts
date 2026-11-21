import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, resolveGeoFromRequest, sendNtfy, companyFromReferrer, geoSources, publicClientIp } from './_schema';

function normalizeCompany(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const company = value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
  return company || null;
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
    await ensureSchema(sql);

    const { type, sessionId, label, value, seconds, meta } = req.body ?? {};
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // ── Visite ────────────────────────────────────────────────────────────────
    if (type === 'visit') {
      const { device, browser, os, referrer, refParam, lang, returning } = meta ?? {};
      const companyFromLink = normalizeCompany(meta?.company);
      const entryId = typeof meta?.entryId === 'string' && /^[\w-]{8,80}$/.test(meta.entryId)
        ? meta.entryId
        : null;
      const existing = await sql`SELECT id, company FROM visits WHERE session_id = ${sessionId} LIMIT 1`;
      if (existing.length === 0) {
        const { country, city } = await resolveGeoFromRequest(req);
        const company = companyFromLink || companyFromReferrer(referrer);
        await sql`INSERT INTO visits (session_id, device, browser, os, country, city, referrer, ref_param, lang, is_returning, company)
                  VALUES (${sessionId}, ${device}, ${browser}, ${os}, ${country}, ${city}, ${referrer}, ${refParam}, ${lang}, ${!!returning}, ${company})`;
        await sql`INSERT INTO events (session_id, type, label, value, seconds)
                  VALUES (${sessionId}, 'visit', 'arrivee', ${lang}, NULL)`;
        if (companyFromLink && entryId) {
          await sql`INSERT INTO events (session_id, type, label, value, seconds)
                    VALUES (${sessionId}, 'company_link_visit', ${companyFromLink}, ${entryId}, NULL)`;
        }
        const src = !referrer ? 'Direct' : referrer.includes('linkedin') ? 'LinkedIn' : referrer.includes('github') ? 'GitHub' : referrer.includes('google') ? 'Google' : referrer.substring(0, 30);
        const where = [city, country].filter(Boolean).join(', ');
        const lines = [
          `${device} · ${browser} · ${os}`,
          companyFromLink ? `Entreprise ciblée : ${companyFromLink}` : null,
          where ? `Ville estimée par IP : ${where}` : null,
          `Source : ${src}${refParam ? ` (campagne ${refParam})` : ''}`,
          returning ? 'Visiteur de retour' : 'Nouveau visiteur',
          `Heure : ${time}`,
        ].filter(Boolean).join('\n');
        let body = lines;
        // Comparatif temporaire des bases IP (activer GEO_DEBUG=1 sur Vercel).
        if (process.env.GEO_DEBUG === '1') {
          const sources = await geoSources(req);
          const debugIp = publicClientIp(req);
          body += '\n\n— Diagnostic géoloc —'
            + (debugIp ? `\nIP : ${debugIp}` : '')
            + '\n' + sources
              .map((s) => `${s.name} : ${[s.city, s.country].filter(Boolean).join(', ') || '—'}`)
              .join('\n');
        }
        await sendNtfy(
          companyFromLink ? `Lien de candidature - ${companyFromLink}` : 'Nouvelle visite - Portfolio',
          body,
          companyFromLink ? 4 : 3,
        );
      } else if (companyFromLink) {
        const loggedEntry = entryId
          ? await sql`SELECT id FROM events
                      WHERE session_id = ${sessionId} AND type = 'company_link_visit' AND value = ${entryId}
                      LIMIT 1`
          : [];
        if (loggedEntry.length === 0) {
          await sql`UPDATE visits SET company = ${companyFromLink} WHERE session_id = ${sessionId}`;
          if (entryId) {
            await sql`INSERT INTO events (session_id, type, label, value, seconds)
                      VALUES (${sessionId}, 'company_link_visit', ${companyFromLink}, ${entryId}, NULL)`;
          }
          const { country, city } = await resolveGeoFromRequest(req);
          const where = [city, country].filter(Boolean).join(', ');
          await sendNtfy(
            `Lien de candidature - ${companyFromLink}`,
            [
              `Entreprise ciblée : ${companyFromLink}`,
              where ? `Ville estimée par IP : ${where}` : null,
              `Heure : ${time}`,
            ].filter(Boolean).join('\n'),
            4,
          );
        }
      }
      return res.status(200).json({ ok: true });
    }

    // ── Fin de session : durée totale sur le portfolio ────────────────────────
    if (type === 'session_end') {
      const secs = Math.round(Number(seconds) || 0);
      if (secs > 0) {
        await sql`UPDATE visits SET duration_seconds = GREATEST(COALESCE(duration_seconds, 0), ${secs})
                  WHERE session_id = ${sessionId}`;
        await sql`INSERT INTO events (session_id, type, label, value, seconds)
                  VALUES (${sessionId}, 'session_end', 'session', ${String(secs)}, ${secs})`;
      }
      return res.status(200).json({ ok: true });
    }

    // ── Autres événements ─────────────────────────────────────────────────────
    await sql`INSERT INTO events (session_id, type, label, value, seconds) VALUES (${sessionId}, ${type}, ${label}, ${value}, ${seconds ?? null})`;

    if (type === 'cv_download') await sendNtfy(`CV telecharge - Version ${value}`, `Heure : ${time}`, 4);
    else if (type === 'github_click') await sendNtfy('GitHub ouvert', `Projet : ${label}\nHeure : ${time}`, 2);
    else if (type === 'linkedin_click') await sendNtfy('LinkedIn clique', `Heure : ${time}`, 2);
    else if (type === 'contact_form_sent') await sendNtfy('Message recu !', `"${value?.substring(0, 100)}"\nHeure : ${time}`, 5);
    else if (type === 'live_demo_click') await sendNtfy('Demo live ouverte', `Projet : ${label}\nHeure : ${time}`, 2);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
