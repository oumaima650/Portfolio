import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Eye, EyeOff, Download, Github, Linkedin, Clock,
  TrendingUp, Globe, Monitor, Smartphone, Tablet,
  LogOut, RefreshCw, BarChart2, MessageSquare, Zap, Lock, MapPin,
  MousePointerClick, Inbox, ArrowUpRight, ArrowDownRight, Layers,
  Compass, FileText, Activity, Award, X, Route,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
  range: number;
  generatedAt: string;
  totalVisits: number;
  prevVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  avgDuration: number;
  totalDuration: number;
  returningVisits: number;
  visitsByDay: { date: string; count: number }[];
  visitsByDevice: { device: string; count: number }[];
  visitsByReferrer: { source: string; count: number }[];
  visitsByLang: { lang: string; count: number }[];
  visitsByCountry: { country: string; count: number }[];
  visitsByBrowser: { browser: string; count: number }[];
  visitsByOs: { os: string; count: number }[];
  topProjects: { label: string; count: number }[];
  topEvents: { type: string; count: number }[];
  cvDownloads: { version: string; count: number }[];
  sectionTimes: { section: string; avg_seconds: number; count: number; total_seconds: number }[];
  recentVisits: RecentVisit[];
  recentCompanyLinks: CompanyLinkVisit[];
  scrollDepths: { percent: string; count: number }[];
  messages: { value: string; created_at: string }[];
  topReports: { label: string; count: number }[];
  topCerts: { label: string; count: number }[];
}

interface RecentVisit {
  created_at: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
  ref_param: string | null;
  lang: string | null;
  duration_seconds: number | null;
  is_returning: boolean | null;
  session_id: string;
  company: string | null;
}

interface CompanyLinkVisit {
  created_at: string;
  company: string;
  session_id: string;
  city: string | null;
  country: string | null;
  device: string | null;
}

interface SessionEvent {
  created_at: string;
  type: string;
  label: string | null;
  value: string | null;
  seconds: number | null;
}

const PINK = '#D4537E';
const PALETTE = ['#D4537E', '#7C6BF0', '#2AA198', '#E0A458', '#5B8DEF', '#9B59B6', '#16A085', '#E74C3C'];

const DEVICE_ICONS: Record<string, React.ElementType> = {
  Desktop: Monitor, Mobile: Smartphone, Tablette: Tablet,
};

// Quelques libellés de pays pour un rendu plus lisible (sinon code brut).
const COUNTRY_NAMES: Record<string, string> = {
  MA: 'Maroc', FR: 'France', US: 'États-Unis', GB: 'Royaume-Uni', DE: 'Allemagne',
  ES: 'Espagne', IT: 'Italie', BE: 'Belgique', NL: 'Pays-Bas', CA: 'Canada',
  CH: 'Suisse', SE: 'Suède', AE: 'Émirats', SA: 'Arabie saoudite', DZ: 'Algérie',
  TN: 'Tunisie', EG: 'Égypte', IN: 'Inde', CN: 'Chine', JP: 'Japon',
  BR: 'Brésil', PT: 'Portugal', TR: 'Turquie', RU: 'Russie', AU: 'Australie',
  IE: 'Irlande', PL: 'Pologne', SN: 'Sénégal', CI: "Côte d'Ivoire", ZA: 'Afrique du Sud',
};
const countryLabel = (code: string) => {
  if (code === 'Inconnu') return 'Inconnu';
  const c = code.toUpperCase();
  return COUNTRY_NAMES[c] ? `${COUNTRY_NAMES[c]} (${c})` : c;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function trendPct(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function fmtDay(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function relativeTime(value: string): string {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '-';
  const diff = Math.round((Date.now() - then) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? 'hier' : `il y a ${days} j`;
}

function fmtDur(seconds: number | null | undefined): string {
  const s = Number(seconds) || 0;
  if (s <= 0) return '-';
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m < 60) return rest ? `${m} min ${rest} s` : `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${String(m % 60).padStart(2, '0')}`;
}

function clockTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function sourceLabel(v: RecentVisit): string {
  if (!v.referrer) return 'Direct';
  if (v.referrer.includes('linkedin')) return 'LinkedIn';
  if (v.referrer.includes('github')) return 'GitHub';
  if (v.referrer.includes('google')) return 'Google';
  return 'Autre';
}

// ── Primitives UI ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children, action }: {
  title: string; icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-1">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${PINK}15` }}>
            <Icon size={16} style={{ color: PINK }} />
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ label = 'Pas encore de données' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
      <Inbox size={28} />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = PINK, trend }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  color?: string; trend?: number | null;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className="text-sm font-bold text-gray-700 leading-tight">{label}</div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-none tabular-nums">{value}</div>
        {trend !== undefined && trend !== null && (
          <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ color: up ? '#16A085' : '#E74C3C', backgroundColor: up ? '#16A08518' : '#E74C3C18' }}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <div className="text-xs text-gray-500 mt-2.5">{sub}</div>}
    </div>
  );
}

function BarList({ data, labelKey, valueKey, color = PINK, fmtLabel }: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  color?: string;
  fmtLabel?: (v: string) => string;
}) {
  if (!data.length) return <EmptyState />;
  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1);
  const total = data.reduce((s, d) => s + Number(d[valueKey]), 0) || 1;
  return (
    <div className="space-y-3 mt-5">
      {data.map((d, i) => {
        const raw = String(d[labelKey]);
        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-24 sm:w-40 md:w-44 truncate text-gray-700 font-semibold shrink-0" title={raw}>
              {fmtLabel ? fmtLabel(raw) : raw}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${(Number(d[valueKey]) / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              />
            </div>
            <span className="w-12 text-right font-bold text-gray-800 tabular-nums">{d[valueKey]}</span>
            <span className="w-11 text-right text-gray-500 tabular-nums hidden sm:inline">
              {Math.round((Number(d[valueKey]) / total) * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AreaChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return <EmptyState />;
  const w = 720; const h = 180; const padX = 8; const padY = 16;
  const max = Math.max(...data.map((d) => d.count), 1);
  const x = (i: number) => padX + (i / Math.max(data.length - 1, 1)) * (w - padX * 2);
  const y = (v: number) => h - padY - (v / max) * (h - padY * 2);
  const line = data.map((d, i) => `${x(i)},${y(d.count)}`).join(' ');
  const area = `${padX},${h - padY} ${line} ${x(data.length - 1)},${h - padY}`;

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 180 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PINK} stopOpacity="0.28" />
            <stop offset="100%" stopColor={PINK} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={padX} x2={w - padX} y1={padY + g * (h - padY * 2)} y2={padY + g * (h - padY * 2)}
            stroke="#000" strokeOpacity="0.04" strokeWidth="1" />
        ))}
        <polygon points={area} fill="url(#areaFill)" />
        <polyline points={line} fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.count)} r="3" fill="#fff" stroke={PINK} strokeWidth="2">
            <title>{fmtDay(d.date)} : {d.count} visite(s)</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
        <span>{fmtDay(data[0].date)}</span>
        <span>{fmtDay(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}

function Donut({ data, centerLabel }: { data: { label: string; count: number; color: string }[]; centerLabel: string }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return <EmptyState />;
  const size = 150; const thickness = 20; const r = (size - thickness) / 2; const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 mt-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((d, i) => {
            const len = (d.count / total) * c;
            const el = (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color}
                strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900" style={{ fontSize: 22, fontWeight: 900 }}>{total}</text>
        <text x="50%" y="61%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400" style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{centerLabel}</text>
      </svg>
      <div className="flex-1 w-full space-y-2.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="flex-1 text-gray-700 font-semibold truncate">{d.label}</span>
            <span className="font-bold text-gray-800 tabular-nums">{d.count}</span>
            <span className="text-gray-500 tabular-nums w-11 text-right">{Math.round((d.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />)}
      </div>
      <div className="h-64 bg-white rounded-2xl border border-gray-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-56 bg-white rounded-2xl border border-gray-100" />
        <div className="h-56 bg-white rounded-2xl border border-gray-100" />
      </div>
    </div>
  );
}

// ── Parcours d'une visite ─────────────────────────────────────────────────────
function describeEvent(e: SessionEvent): { icon: React.ElementType; text: string; detail?: string } {
  const secs = e.seconds ?? 0;
  switch (e.type) {
    case 'section_time': return { icon: Layers, text: `Section « ${e.label} »`, detail: `Temps passé : ${fmtDur(secs)}` };
    case 'session_end': return { icon: LogOut, text: 'Fin de la visite', detail: `Durée totale : ${fmtDur(secs)}` };
    case 'scroll_depth': return { icon: TrendingUp, text: `Scroll atteint ${e.value ?? ''}%` };
    case 'cv_download': return { icon: Download, text: `CV téléchargé (${e.value ?? ''})` };
    case 'project_open': return { icon: Eye, text: `Projet ouvert : ${e.label ?? ''}` };
    case 'report_open': return { icon: FileText, text: `Rapport consulté : ${e.label ?? ''}` };
    case 'report_download': return { icon: Download, text: `Rapport téléchargé : ${e.label ?? ''}` };
    case 'cert_open': return { icon: Award, text: `Certificat consulté : ${e.label ?? ''}` };
    case 'github_click': return { icon: Github, text: `Lien GitHub : ${e.label ?? ''}` };
    case 'linkedin_click': return { icon: Linkedin, text: 'Lien LinkedIn ouvert' };
    case 'live_demo_click': return { icon: MousePointerClick, text: `Démo live : ${e.label ?? ''}` };
    case 'company_link_visit': return { icon: MousePointerClick, text: `Lien de candidature ouvert : ${e.label ?? ''}` };
    case 'contact_form_sent': return { icon: MessageSquare, text: 'Message envoyé via le formulaire' };
    case 'visit': return { icon: Users, text: 'Arrivée sur le portfolio' };
    default: return { icon: Activity, text: e.label ?? e.type };
  }
}

function SessionJourney({ token, sessionId, onClose }: {
  token: string; sessionId: string; onClose: () => void;
}) {
  const [data, setData] = useState<{ visit: RecentVisit | null; events: SessionEvent[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setShowAll(false);
    fetch(`/api/admin-session?s=${encodeURIComponent(sessionId)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (alive) setData(d); })
      .catch(() => { if (alive) setData({ visit: null, events: [] }); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token, sessionId]);

  const visit = data?.visit ?? null;
  const events = (data?.events ?? []).filter((e) => e.type !== 'session_end');
  const totalDur = visit?.duration_seconds ?? 0;

  const sections = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.events ?? []).forEach((e) => {
      if (e.type === 'section_time' && e.label) map[e.label] = (map[e.label] ?? 0) + (e.seconds ?? 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [data]);

  // Durée cumulée des sections (fiable même si session_end n'a pas été enregistré).
  const sectionsTotal = useMemo(
    () => (data?.events ?? []).reduce((sum, e) => sum + (e.type === 'section_time' ? (e.seconds ?? 0) : 0), 0),
    [data],
  );
  const displayedDuration = Math.max(totalDur, sectionsTotal);

  // Aperçu des actions : 5 premières, puis "Voir plus".
  const PREVIEW_COUNT = 5;
  const visibleEvents = showAll ? events : events.slice(0, PREVIEW_COUNT);
  const hasMore = events.length > PREVIEW_COUNT;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${PINK}15` }}>
              <Route size={17} style={{ color: PINK }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-gray-900">Parcours de la visite</h3>
              <p className="text-xs text-gray-500 truncate">
                {visit ? `${new Date(visit.created_at).toLocaleString('fr-FR')} · durée ${fmtDur(displayedDuration)}` : sessionId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" title="Fermer">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5">
          {loading && <p className="text-xs text-gray-400 text-center py-8">Chargement du parcours...</p>}

          {!loading && !visit && <EmptyState label="Visite introuvable" />}

          {!loading && visit && (
            <>
              {/* Résumé visiteur */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  visit.device, visit.browser, visit.os,
                  [visit.city, visit.country].filter(Boolean).join(', ') || null,
                  visit.is_returning ? 'Visiteur de retour' : 'Nouveau visiteur',
                  `Langue ${visit.lang ?? '-'}`,
                ].filter(Boolean).map((chip, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{chip}</span>
                ))}
              </div>

              {/* Temps total + temps par section */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-gray-500">Temps sur le site</div>
                  <div className="text-2xl font-black text-gray-900 mt-1">{fmtDur(displayedDuration)}</div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-gray-500">Actions réalisées</div>
                  <div className="text-2xl font-black text-gray-900 mt-1">{events.length}</div>
                </div>
              </div>

              {sections.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs uppercase tracking-wider font-black text-gray-500 mb-3">Temps par section</h4>
                  <div className="space-y-2.5">
                    {sections.map(([name, secs]) => (
                      <div key={name} className="flex items-center gap-3 text-sm">
                        <span className="w-24 sm:w-28 truncate text-gray-700 font-semibold capitalize">{name}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min((secs / (sections[0][1] || 1)) * 100, 100)}%`, backgroundColor: PINK }} />
                        </div>
                        <span className="w-16 text-right font-bold text-gray-800 tabular-nums">{fmtDur(secs)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chronologie */}
              <h4 className="text-xs uppercase tracking-wider font-black text-gray-500 mb-3">Chronologie des actions</h4>
              {events.length === 0 ? (
                <EmptyState label="Aucune action enregistrée" />
              ) : (
                <div>
                  {visibleEvents.map((e, i) => {
                    const { icon: Icon, text, detail } = describeEvent(e);
                    const isLastVisible = i === visibleEvents.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${PINK}12` }}>
                            <Icon size={13} style={{ color: PINK }} />
                          </div>
                          {!isLastVisible && <div className="w-px flex-1 bg-gray-100 my-1" />}
                        </div>
                        <div className="pb-4 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-sm font-semibold text-gray-800 break-words">{text}</span>
                            <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">{clockTime(e.created_at)}</span>
                          </div>
                          {detail && <p className="text-xs text-gray-500 mt-0.5">{detail}</p>}
                        </div>
                      </div>
                    );
                  })}
                  {hasMore && (
                    <button
                      onClick={() => setShowAll((s) => !s)}
                      className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold transition-colors"
                      style={{ backgroundColor: `${PINK}12`, color: PINK }}
                    >
                      {showAll ? 'Voir moins' : `Voir plus (${events.length - PREVIEW_COUNT} autres)`}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        onLogin(data.token);
      } else {
        setError('Mot de passe incorrect');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${PINK}18` }}>
            <Lock size={24} style={{ color: PINK }} />
          </div>
        </div>
        <h1 className="text-xl font-black text-center text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Portfolio Analytics</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 outline-none text-sm pr-11"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-50"
            style={{ backgroundColor: PINK }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Connexion...' : 'Accéder au dashboard'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: "Vue d'ensemble", icon: Activity },
  { id: 'traffic', label: 'Trafic', icon: Compass },
  { id: 'sessions', label: 'Sessions', icon: Route },
  { id: 'content', label: 'Contenu', icon: Layers },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
] as const;
type TabId = typeof TABS[number]['id'];

// ── Dashboard ─────────────────────────────────────────────────────────────────
// Évite un double appel de notification (StrictMode / re-render).
let openNotified = false;

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('30');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<TabId>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [journey, setJourney] = useState<string | null>(null);

  // Prévient la propriétaire dès qu'une personne ouvre la page du dashboard.
  useEffect(() => {
    if (openNotified) return;
    openNotified = true;
    fetch('/api/admin-open', { method: 'POST' }).catch(() => { /* silencieux */ });
  }, []);

  const fetchStats = useCallback(async (t: string, silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin-stats?range=${range}`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401) { localStorage.removeItem('admin_token'); setToken(null); return; }
      const data = await res.json();
      if (res.ok) { setStats(data); setLastUpdate(new Date()); }
      else setError(data.error ?? 'Erreur');
    } catch {
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    if (token) fetchStats(token);
  }, [token, fetchStats]);

  useEffect(() => {
    if (!token || !autoRefresh) return;
    const id = setInterval(() => fetchStats(token, true), 60_000);
    return () => clearInterval(id);
  }, [token, autoRefresh, fetchStats]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setStats(null);
  };

  if (!token) return <LoginPage onLogin={setToken} />;

  const s = stats;
  const cvTotal = (s?.cvDownloads ?? []).reduce((sum, d) => sum + Number(d.count), 0);
  const reportsTotal = (s?.topReports ?? []).reduce((sum, d) => sum + Number(d.count), 0);
  const evt = (type: string) => s?.topEvents?.find((e) => e.type === type)?.count ?? 0;
  const visitsTrend = s ? trendPct(s.totalVisits, s.prevVisits) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${PINK}18` }}>
            <BarChart2 size={16} style={{ color: PINK }} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black text-gray-900 truncate">Portfolio Analytics</h1>
            <p className="text-xs text-gray-500 truncate">
              Oumaima Ameziane
              {lastUpdate && <> · MAJ {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors"
            style={autoRefresh
              ? { borderColor: `${PINK}55`, color: PINK, backgroundColor: `${PINK}10` }
              : { borderColor: '#e5e7eb', color: '#9ca3af' }}
            title="Rafraîchissement automatique toutes les 60 s"
          >
            <span className="relative flex h-2 w-2">
              {autoRefresh && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: PINK }} />}
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: autoRefresh ? PINK : '#d1d5db' }} />
            </span>
            Live
          </button>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white"
          >
            <option value="7">7 jours</option>
            <option value="30">30 jours</option>
            <option value="90">90 jours</option>
            <option value="365">1 an</option>
          </select>
          <button
            onClick={() => token && fetchStats(token, true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            title="Rafraîchir"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={13} /> <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-6">{error}</div>
        )}

        {loading && !s && <Skeleton />}

        {s && (
          <>
            {/* Tabs */}
            <div className="flex gap-1.5 mb-6 bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm w-full overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="relative min-w-max snap-start flex items-center justify-center gap-2 text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl transition-colors shrink-0"
                    style={{ color: active ? '#fff' : '#4b5563' }}
                  >
                    {active && (
                      <motion.span layoutId="tab-bg" className="absolute inset-0 rounded-xl" style={{ backgroundColor: PINK }} />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={16} /> {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* ── VUE D'ENSEMBLE ── */}
                {tab === 'overview' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <StatCard icon={Users} label="Visites" value={s.totalVisits} sub={`vs ${s.prevVisits} période préc.`} trend={visitsTrend} />
                      <StatCard icon={Globe} label="Visiteurs uniques" value={s.uniqueVisitors} color="#7C6BF0" />
                      <StatCard icon={Clock} label="Temps moyen" value={fmtDur(s.avgDuration)} color="#2AA198" sub={`Total ${fmtDur(s.totalDuration)}`} />
                      <StatCard icon={RefreshCw} label="Visiteurs de retour" value={s.returningVisits} color="#E0A458" />
                      <StatCard icon={Zap} label="Aujourd'hui" value={s.visitsToday} color="#E0A458" />
                      <StatCard icon={MessageSquare} label="Messages reçus" value={s.messages.length} color="#2AA198" />
                      <StatCard icon={Download} label="CV téléchargés" value={cvTotal} color="#7C6BF0" />
                      <StatCard icon={FileText} label="Rapports consultés" value={reportsTotal} color="#9B59B6" />
                    </div>

                    <SectionCard title="Visites par jour" icon={TrendingUp}>
                      <AreaChart data={s.visitsByDay} />
                    </SectionCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Appareils" icon={Monitor}>
                        <Donut
                          centerLabel="VISITES"
                          data={s.visitsByDevice.map((d, i) => ({ label: d.device, count: Number(d.count), color: PALETTE[i % PALETTE.length] }))}
                        />
                      </SectionCard>
                      <SectionCard title="Sources de trafic" icon={Globe}>
                        <BarList data={s.visitsByReferrer} labelKey="source" valueKey="count" />
                      </SectionCard>
                    </div>
                  </>
                )}

                {/* ── TRAFIC ── */}
                {tab === 'traffic' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Pays des visiteurs" icon={MapPin}>
                        <BarList data={s.visitsByCountry} labelKey="country" valueKey="count" color="#7C6BF0" fmtLabel={countryLabel} />
                      </SectionCard>
                      <SectionCard title="Navigateurs" icon={Compass}>
                        <BarList data={s.visitsByBrowser} labelKey="browser" valueKey="count" color="#2AA198" />
                      </SectionCard>
                      <SectionCard title="Systèmes d'exploitation" icon={Monitor}>
                        <BarList data={s.visitsByOs} labelKey="os" valueKey="count" color="#9B59B6" />
                      </SectionCard>
                      <SectionCard title="Langue du portfolio" icon={Globe}>
                        <BarList data={s.visitsByLang} labelKey="lang" valueKey="count" color="#E0A458" />
                      </SectionCard>
                    </div>
                  </>
                )}

                {/* ── SESSIONS ── */}
                {tab === 'sessions' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      <StatCard icon={Clock} label="Temps moyen / visite" value={fmtDur(s.avgDuration)} color="#2AA198" />
                      <StatCard icon={Activity} label="Temps cumulé" value={fmtDur(s.totalDuration)} color="#7C6BF0" />
                      <StatCard icon={RefreshCw} label="Visiteurs de retour" value={s.returningVisits} color="#E0A458" />
                    </div>

                    <SectionCard
                      title="Parcours des visiteurs"
                      icon={Route}
                      action={<span className="text-xs text-gray-500 flex items-center gap-1"><MousePointerClick size={13} /> cliquez sur une visite</span>}
                    >
                      <RecentTable visits={s.recentVisits} onOpen={setJourney} />
                    </SectionCard>

                    <SectionCard title="Ouvertures des liens de candidature" icon={MousePointerClick}>
                      <CompanyLinksTable visits={s.recentCompanyLinks} onOpen={setJourney} />
                    </SectionCard>
                  </>
                )}

                {/* ── CONTENU ── */}
                {tab === 'content' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={Download} label="CV téléchargés" value={cvTotal}
                        sub={`FR ${s.cvDownloads.find((d) => d.version === 'FR')?.count ?? 0} · EN ${s.cvDownloads.find((d) => d.version === 'EN')?.count ?? 0}`} />
                      <StatCard icon={Github} label="Clics GitHub" value={evt('github_click')} color="#333" />
                      <StatCard icon={Linkedin} label="Clics LinkedIn" value={evt('linkedin_click')} color="#0077B5" />
                      <StatCard icon={MousePointerClick} label="Demos ouvertes" value={evt('live_demo_click')} color="#2AA198" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Projets les plus consultés" icon={Eye}>
                        <BarList data={s.topProjects} labelKey="label" valueKey="count" color="#2AA198" />
                      </SectionCard>
                      <SectionCard title="Temps moyen par section (sec)" icon={Clock}>
                        <BarList data={s.sectionTimes} labelKey="section" valueKey="avg_seconds" color="#7C6BF0" />
                      </SectionCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Profondeur de scroll" icon={TrendingUp}>
                        <BarList data={s.scrollDepths.map((d) => ({ percent: `${d.percent}%`, count: d.count }))} labelKey="percent" valueKey="count" color="#E0A458" />
                      </SectionCard>
                      <SectionCard title="Téléchargements du CV" icon={FileText}>
                        <BarList data={s.cvDownloads.map((d) => ({ version: d.version || '-', count: d.count }))} labelKey="version" valueKey="count" />
                      </SectionCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Rapports consultés" icon={FileText}>
                        <BarList data={s.topReports} labelKey="label" valueKey="count" color="#9B59B6" />
                      </SectionCard>
                      <SectionCard title="Certificats consultés" icon={Award}>
                        <BarList data={s.topCerts} labelKey="label" valueKey="count" color="#E0A458" />
                      </SectionCard>
                    </div>

                    <SectionCard title="Tous les événements" icon={Layers}>
                      <BarList data={s.topEvents} labelKey="type" valueKey="count" color="#9B59B6" fmtLabel={eventLabel} />
                    </SectionCard>
                  </>
                )}

                {/* ── MESSAGES ── */}
                {tab === 'messages' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={MessageSquare} label="Messages reçus" value={s.messages.length} color="#2AA198" />
                      <StatCard icon={Activity} label="Dernier message"
                        value={s.messages[0] ? relativeTime(s.messages[0].created_at) : '-'} color="#D4537E" />
                    </div>

                    <SectionCard title="Messages du formulaire de contact" icon={Inbox}>
                      {s.messages.length === 0 ? (
                        <EmptyState label="Aucun message pour le moment" />
                      ) : (
                        <div className="space-y-3 mt-4">
                          {s.messages.map((m, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50/60">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                  <MessageSquare size={13} style={{ color: PINK }} /> Message #{s.messages.length - i}
                                </span>
                                <span className="text-xs text-gray-500">{relativeTime(m.created_at)}</span>
                              </div>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{m.value || '(vide)'}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </SectionCard>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {journey && <SessionJourney token={token} sessionId={journey} onClose={() => setJourney(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Événements : libellés lisibles ────────────────────────────────────────────
function eventLabel(type: string): string {
  const map: Record<string, string> = {
    visit: 'Visites', github_click: 'Clics GitHub', linkedin_click: 'Clics LinkedIn',
    cv_download: 'CV téléchargés', project_open: 'Projets ouverts',
    contact_form_sent: 'Messages', section_time: 'Temps par section',
    live_demo_click: 'Demos live', scroll_depth: 'Scroll depth',
    report_open: 'Rapports consultés', report_download: 'Rapports téléchargés',
    cert_open: 'Certificats consultés', session_end: 'Fins de visite',
    company_mascot: 'Entreprises déclarées',
    company_link_visit: 'Liens de candidature ouverts',
  };
  return map[type] ?? type;
}

// ── Table des visites récentes ────────────────────────────────────────────────
function RecentTable({ visits, compact = false, onOpen }: {
  visits: RecentVisit[]; compact?: boolean; onOpen?: (sessionId: string) => void;
}) {
  if (!visits.length) return <EmptyState label="Aucune visite pour le moment" />;
  const clickable = typeof onOpen === 'function';
  return (
    <div className="overflow-x-auto mt-5 -mx-4 sm:mx-0 px-4 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
            <th className="text-left pb-2.5 font-bold">Quand</th>
            <th className="text-left pb-2.5 font-bold">Appareil</th>
            {!compact && <th className="hidden md:table-cell text-left pb-2.5 font-bold">Entreprise</th>}
            {!compact && <th className="hidden md:table-cell text-left pb-2.5 font-bold">Navigateur</th>}
            {!compact && <th className="hidden lg:table-cell text-left pb-2.5 font-bold">OS</th>}
            <th className="text-left pb-2.5 font-bold" title="Ville estimée à partir de l'adresse IP, sans GPS">
              Lieu estimé (IP)
            </th>
            <th className="hidden sm:table-cell text-left pb-2.5 font-bold">Source</th>
            <th className="text-left pb-2.5 font-bold">Durée</th>
            {!compact && <th className="hidden sm:table-cell text-left pb-2.5 font-bold">Langue</th>}
            {clickable && <th className="text-left pb-2.5 font-bold">Détail</th>}
          </tr>
        </thead>
        <tbody>
          {visits.map((v, i) => {
            const Dev = DEVICE_ICONS[v.device ?? ''] ?? Monitor;
            return (
              <tr
                key={v.session_id ?? i}
                onClick={clickable ? () => onOpen!(v.session_id) : undefined}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${clickable ? 'cursor-pointer' : ''}`}
              >
                <td className="py-3 text-gray-600 whitespace-nowrap" title={new Date(v.created_at).toLocaleString('fr-FR')}>
                  <span className="inline-flex items-center gap-1.5">
                    {relativeTime(v.created_at)}
                    {v.is_returning && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#E0A45820', color: '#B8802F' }} title="Visiteur de retour">
                        <RefreshCw size={10} /> retour
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-3 font-semibold text-gray-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Dev size={14} className="text-gray-400" /> {v.device ?? '-'}
                  </span>
                </td>
                {!compact && (
                  <td className="hidden md:table-cell py-3 text-gray-700 font-semibold">
                    {v.company ?? (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                )}
                {!compact && <td className="hidden md:table-cell py-3 text-gray-600">{v.browser ?? '-'}</td>}
                {!compact && <td className="hidden lg:table-cell py-3 text-gray-600">{v.os ?? '-'}</td>}
                <td className="py-3 text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    {[v.city, v.country].filter(Boolean).join(', ') || '-'}
                  </span>
                </td>
                <td className="hidden sm:table-cell py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ backgroundColor: `${PINK}15`, color: PINK }}>
                    {sourceLabel(v)}
                  </span>
                </td>
                <td className="py-3 text-gray-600 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} className="text-gray-400" /> {fmtDur(v.duration_seconds)}
                  </span>
                </td>
                {!compact && <td className="hidden sm:table-cell py-3 uppercase font-bold" style={{ color: PINK }}>{v.lang ?? '-'}</td>}
                {clickable && (
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap" style={{ color: PINK }}>
                      <Route size={13} /> parcours
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CompanyLinksTable({ visits, onOpen }: {
  visits: CompanyLinkVisit[]; onOpen?: (sessionId: string) => void;
}) {
  if (!visits.length) return <EmptyState label="Aucun lien d’entreprise ouvert pour le moment" />;
  return (
    <div className="overflow-x-auto mt-5 -mx-4 sm:mx-0 px-4 sm:px-0">
      <table className="w-full text-sm min-w-[460px]">
        <thead>
          <tr className="text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
            <th className="text-left pb-2.5 font-bold">Quand</th>
            <th className="text-left pb-2.5 font-bold">Entreprise ciblée</th>
            <th className="text-left pb-2.5 font-bold">Lieu estimé</th>
            <th className="text-left pb-2.5 font-bold">Appareil</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit, index) => {
            const DeviceIcon = DEVICE_ICONS[visit.device ?? ''] ?? Monitor;
            return (
              <tr
                key={`${visit.session_id}-${visit.created_at}-${index}`}
                onClick={onOpen ? () => onOpen(visit.session_id) : undefined}
                className={`border-b border-gray-100 ${onOpen ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              >
                <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                  {relativeTime(visit.created_at)}
                </td>
                <td className="py-3 pr-4 font-bold text-gray-900">{visit.company}</td>
                <td className="py-3 pr-4 text-gray-600">
                  {[visit.city, visit.country].filter(Boolean).join(', ') || '-'}
                </td>
                <td className="py-3 text-gray-600 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <DeviceIcon size={14} className="text-gray-400" /> {visit.device ?? '-'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
