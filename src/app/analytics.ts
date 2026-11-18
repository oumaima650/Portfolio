// ── ANALYTICS — envoie vers /api/track (Vercel serverless) ───────────────────
// GA4 : G-6B9S8WMGT4  |  ntfy géré côté serveur

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

function ga(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params ?? {});
  }
}

// Session ID unique par visite
function getSessionId(): string {
  let sid = sessionStorage.getItem('pf_sid');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('pf_sid', sid);
  }
  return sid;
}

function getDeviceMeta() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  return {
    device: isTablet ? 'Tablette' : isMobile ? 'Mobile' : 'Desktop',
    browser: /Chrome/i.test(ua) ? 'Chrome' : /Firefox/i.test(ua) ? 'Firefox' : /Safari/i.test(ua) ? 'Safari' : /Edge/i.test(ua) ? 'Edge' : 'Autre',
    os: /Windows/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'macOS' : /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iOS' : /Linux/i.test(ua) ? 'Linux' : 'Autre',
    referrer: document.referrer || '',
    refParam: new URLSearchParams(window.location.search).get('ref') ?? '',
    lang: (document.documentElement.lang || 'fr').toUpperCase(),
  };
}

async function track(payload: Record<string, unknown>) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, sessionId: getSessionId() }),
    });
  } catch { /* silently fail */ }
}

// ── EVENTS PUBLICS ────────────────────────────────────────────────────────────

export async function trackVisit() {
  ga('portfolio_visit');
  await track({ type: 'visit', meta: getDeviceMeta() });
}

export function trackGithubClick(projectName: string) {
  ga('github_click', { project: projectName });
  track({ type: 'github_click', label: projectName });
}

export function trackLinkedinClick() {
  ga('linkedin_click');
  track({ type: 'linkedin_click', label: 'linkedin' });
}

export function trackCvDownload(version: 'FR' | 'EN') {
  ga('cv_download', { version });
  track({ type: 'cv_download', label: 'cv', value: version });
}

export function trackProjectOpen(projectTitle: string) {
  ga('project_open', { project: projectTitle });
  track({ type: 'project_open', label: projectTitle });
}

export function trackContactFormSent(message: string) {
  ga('contact_form_sent');
  track({ type: 'contact_form_sent', label: 'contact', value: message.substring(0, 200) });
}

export function trackSectionTime(section: string, seconds: number) {
  if (seconds < 3) return;
  ga('section_time', { section, seconds });
  track({ type: 'section_time', label: section, seconds });
}

export function trackLiveDemoClick(projectTitle: string) {
  ga('live_demo_click', { project: projectTitle });
  track({ type: 'live_demo_click', label: projectTitle });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100) {
  ga('scroll_depth', { percent });
  track({ type: 'scroll_depth', label: 'scroll', value: String(percent) });
}
