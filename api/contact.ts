// ── POST /api/contact ─────────────────────────────────────────────────────────
// Fonction serverless (Vercel). Elle constitue la frontière serveur du
// formulaire de contact :
//   1. revalide nom / e-mail / sujet / message (le front ne fait que du confort) ;
//   2. échappe les champs utilisateur avant de les injecter dans l'e-mail HTML ;
//   3. appelle l'API REST EmailJS avec la clé PRIVÉE, qui ne quitte jamais le
//      serveur (l'ancien appel `emailjs.send(...)` côté navigateur est supprimé) ;
//   4. limite le débit par IP et ignore les envois qui remplissent le champ piège.
//
// Variables d'environnement (Vercel > Settings > Environment Variables) :
//   EMAILJS_PRIVATE_KEY   (obligatoire, secret — ne jamais committer)
//   EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY  (optionnelles,
//   valeurs publiques par défaut ci-dessous)

// L'extension `.js` est obligatoire : le projet est en ESM ("type": "module"),
// et Node refuse les imports relatifs sans extension dans la fonction déployée.
// Le bundler Vercel résout bien `.js` vers le fichier source `.ts`.
import { escapeHtml, validateContactForm } from '../src/lib/contactValidation.js';

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID ?? 'service_xf6wlzq';
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? 'template_50yx5ji';
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY ?? 'iMfMME6SkHJDTNTxY';
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY ?? '';

// Le formulaire ne dépasse jamais quelques Ko : on coupe court aux gros corps.
const MAX_BODY_BYTES = 10_000;

// ── Anti-spam : quota par IP ──────────────────────────────────────────────────
// Compteur en mémoire, donc par instance serverless réutilisée : c'est une
// première barrière sans dépendance externe. Pour un quota réellement global,
// brancher un stockage partagé (Vercel KV / Upstash Redis).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_MAX_IPS = 5_000;

const requestLog = new Map<string, number[]>();

function clientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] ?? req.headers['x-real-ip'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value ? String(value).split(',')[0].trim() : 'unknown';
}

// Retourne le délai d'attente en secondes si le quota est dépassé, sinon null.
function rateLimitRetryAfter(ip: string): number | null {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return Math.ceil((RATE_LIMIT_WINDOW_MS - (now - recent[0])) / 1000);
  }

  recent.push(now);
  requestLog.set(ip, recent);

  if (requestLog.size > RATE_LIMIT_MAX_IPS) {
    for (const [key, hits] of requestLog) {
      if (hits.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }

  return null;
}

// Champ piège : invisible pour un visiteur, souvent rempli par les robots.
const HONEYPOT_FIELD = 'contact_website';

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const ip = clientIp(req);
  const retryAfter = rateLimitRetryAfter(ip);
  if (retryAfter !== null) {
    console.warn('[api/contact] quota dépassé pour', ip);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ ok: false, error: 'rate_limited' });
    return;
  }

  if (!PRIVATE_KEY) {
    console.error('[api/contact] EMAILJS_PRIVATE_KEY manquante : envoi refusé.');
    res.status(500).json({ ok: false, error: 'server_misconfigured' });
    return;
  }

  // Vercel parse le JSON automatiquement ; on gère aussi le corps brut.
  let payload: unknown;
  if (typeof req.body === 'string') {
    if (req.body.length > MAX_BODY_BYTES) {
      res.status(413).json({ ok: false, error: 'payload_too_large' });
      return;
    }
    try {
      payload = JSON.parse(req.body || '{}');
    } catch {
      res.status(400).json({ ok: false, error: 'invalid_json' });
      return;
    }
  } else {
    payload = req.body;
  }

  const source = (typeof payload === 'object' && payload !== null ? payload : {}) as Record<string, unknown>;

  // Robot détecté : on renvoie une réussite factice (aucun envoi) pour ne pas
  // lui apprendre que le champ est un piège.
  const trap = source[HONEYPOT_FIELD];
  if (typeof trap === 'string' && trap.trim() !== '') {
    console.warn('[api/contact] champ piège rempli — envoi ignoré');
    res.status(200).json({ ok: true });
    return;
  }

  const { ok, errors, value, lang } = validateContactForm(source, source.lang);
  if (!ok) {
    res.status(400).json({ ok: false, error: 'validation_failed', errors });
    return;
  }

  // Depuis ce point, toutes les valeurs respectent les listes blanches ci-dessus.
  const isFr = lang === 'fr';

  const template_params = {
    from_name: escapeHtml(value.name),
    from_email: value.email, // liste blanche stricte : aucun métacaractère HTML possible
    name: escapeHtml(value.name),
    email: value.email,
    subject: escapeHtml(
      value.subject || (isFr ? 'Message depuis le portfolio' : 'Message from portfolio')
    ),
    message: escapeHtml(value.message),

    // Auto-reply (FR / EN)
    reply_subject: isFr
      ? 'Accusé de réception — Merci pour votre message !'
      : 'Confirmation — Thank you for reaching out!',
    greeting: isFr ? 'Bonjour' : 'Hello',
    reply_body: isFr
      ? "Merci d'avoir pris le temps de me contacter via mon portfolio. J'ai bien reçu votre message et je reviendrai vers vous dans les plus brefs délais."
      : 'Thank you for reaching out through my portfolio. I have received your message and will get back to you shortly.',
    signoff: isFr ? 'Bien cordialement' : 'Best regards',
    role: isFr ? 'Élève Ingénieure en Génie Informatique' : 'Computer Engineering Student',
  };

  try {
    const upstream = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        accessToken: PRIVATE_KEY,
        template_params,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('[api/contact] EmailJS a refusé la requête', upstream.status, detail.slice(0, 300));
      res.status(502).json({ ok: false, error: 'email_provider_error' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[api/contact] EmailJS injoignable', error);
    res.status(502).json({ ok: false, error: 'email_provider_unreachable' });
  }
}
