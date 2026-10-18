// ── Validation / assainissement du formulaire de contact ──────────────────────
// Module partagé volontairement sans dépendance :
//   - utilisé par le frontend (retour immédiat à l'utilisateur) ;
//   - utilisé par la fonction serverless api/contact.ts (validation qui fait foi).
// Les champs utilisateur sont traités comme du TEXTE BRUT : on ne fait que
// supprimer les caractères de contrôle et appliquer des listes blanches.
// L'échappement HTML est fait séparément (escapeHtml) au moment de l'affichage
// dans le corps de l'e-mail HTML.

export type ContactLang = 'fr' | 'en';

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactField = keyof ContactPayload;

export type ContactErrorCode =
  | 'name_required'
  | 'name_length'
  | 'name_format'
  | 'email_required'
  | 'email_invalid'
  | 'subject_too_long'
  | 'message_required'
  | 'message_too_short'
  | 'message_too_long';

export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

export type ContactValidationResult = {
  ok: boolean;
  errors: ContactErrors;
  value: ContactPayload;
  lang: ContactLang;
};

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  subjectMax: 120,
  messageMin: 10,
  messageMax: 2000,
} as const;

// Nom : lettres Unicode (accents inclus), marques combinantes, espaces, tirets,
// apostrophes. Tout le reste (<, >, &, ", chiffres, URLs…) est refusé.
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u;

// E-mail : liste blanche stricte. Ne peut contenir aucun métacaractère HTML
// (<, >, ", ') ni espace : la valeur validée est donc sûre telle quelle.
const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

// Caractères de contrôle interdits (on conserve \n et \t).
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g;

// Traite la valeur comme du texte brut : type vérifié, retours à la ligne
// normalisés, caractères de contrôle retirés, espaces superflus nettoyés.
function toPlainText(value: unknown, singleLine: boolean): string {
  if (typeof value !== 'string') return '';
  const cleaned = value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARS, '');
  return singleLine ? cleaned.replace(/\s+/g, ' ').trim() : cleaned.trim();
}

// Échappement HTML — à utiliser pour toute donnée utilisateur insérée dans du
// HTML (corps d'e-mail HTML, injection dans un template…).
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function validateContactForm(input: unknown, lang?: unknown): ContactValidationResult {
  const source = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;

  const name = toPlainText(source.name, true);
  const email = toPlainText(source.email, true).toLowerCase();
  const subject = toPlainText(source.subject, true);
  const message = toPlainText(source.message, false);

  const errors: ContactErrors = {};

  if (!name) errors.name = 'name_required';
  else if (name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax) errors.name = 'name_length';
  else if (!NAME_PATTERN.test(name)) errors.name = 'name_format';

  if (!email) errors.email = 'email_required';
  else if (email.length > CONTACT_LIMITS.emailMax || !EMAIL_PATTERN.test(email)) errors.email = 'email_invalid';

  if (subject.length > CONTACT_LIMITS.subjectMax) errors.subject = 'subject_too_long';

  if (!message) errors.message = 'message_required';
  else if (message.length < CONTACT_LIMITS.messageMin) errors.message = 'message_too_short';
  else if (message.length > CONTACT_LIMITS.messageMax) errors.message = 'message_too_long';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, email, subject, message },
    lang: lang === 'en' ? 'en' : 'fr',
  };
}
