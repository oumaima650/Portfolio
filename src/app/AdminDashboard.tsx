import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Eye, EyeOff, Download, Github, Linkedin, Clock,
  TrendingUp, Globe, Monitor, Smartphone, Tablet,
  LogOut, RefreshCw, BarChart2, MessageSquare, Zap, Lock, MapPin,
  MousePointerClick, Inbox, ArrowUpRight, ArrowDownRight, Layers,
  Compass, FileText, Activity,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
  range: number;
  generatedAt: string;
  totalVisits: number;
  prevVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
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
  sectionTimes: { section: string; avg_seconds: number; count: number }[];
  recentVisits: RecentVisit[];
  scrollDepths: { percent: string; count: number }[];
  messages: { value: string; created_at: string }[];
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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
          <Icon size={15} style={{ color: PINK }} /> {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ label = 'Pas encore de données' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-300">
      <Inbox size={26} />
      <p className="text-xs font-medium text-gray-400">{label}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = PINK, trend }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  color?: string; trend?: number | null;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && trend !== null && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ color: up ? '#16A085' : '#E74C3C', backgroundColor: up ? '#16A08518' : '#E74C3C18' }}>
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-gray-900 leading-none">{value}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1.5">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
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
    <div className="space-y-2.5 mt-4">
      {data.map((d, i) => {
        const raw = String(d[labelKey]);
        return (
          <div key={i} className="flex items-center gap-3 text-xs">
            <span className="w-32 truncate text-gray-600 font-medium shrink-0" title={raw}>
              {fmtLabel ? fmtLabel(raw) : raw}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${(Number(d[valueKey]) / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              />
            </div>
            <span className="w-10 text-right font-bold text-gray-700 tabular-nums">{d[valueKey]}</span>
            <span className="w-10 text-right text-gray-400 tabular-nums hidden sm:inline">
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
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
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
      <div className="flex-1 w-full space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="flex-1 text-gray-600 font-medium truncate">{d.label}</span>
            <span className="font-bold text-gray-700 tabular-nums">{d.count}</span>
            <span className="text-gray-400 tabular-nums w-10 text-right">{Math.round((d.count / total) * 100)}%</span>
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
  { id: 'content', label: 'Contenu', icon: Layers },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
] as const;
type TabId = typeof TABS[number]['id'];

// ── Dashboard ─────────────────────────────────────────────────────────────────
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
  const evt = (type: string) => s?.topEvents?.find((e) => e.type === type)?.count ?? 0;
  const visitsTrend = s ? trendPct(s.totalVisits, s.prevVisits) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between gap-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${PINK}18` }}>
            <BarChart2 size={16} style={{ color: PINK }} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-gray-900 truncate">Portfolio Analytics</h1>
            <p className="text-[10px] text-gray-400 truncate">
              Oumaima Ameziane
              {lastUpdate && <> · MAJ {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors"
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

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-6">{error}</div>
        )}

        {loading && !s && <Skeleton />}

        {s && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-full overflow-x-auto">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="relative flex-1 min-w-max flex items-center justify-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    style={{ color: active ? '#fff' : '#6b7280' }}
                  >
                    {active && (
                      <motion.span layoutId="tab-bg" className="absolute inset-0 rounded-lg" style={{ backgroundColor: PINK }} />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={14} /> {t.label}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={Users} label="Visites" value={s.totalVisits} sub={`vs ${s.prevVisits} période préc.`} trend={visitsTrend} />
                      <StatCard icon={Globe} label="Visiteurs uniques" value={s.uniqueVisitors} color="#7C6BF0" />
                      <StatCard icon={Zap} label="Aujourd'hui" value={s.visitsToday} color="#E0A458" />
                      <StatCard icon={MessageSquare} label="Messages reçus" value={s.messages.length} color="#2AA198" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Pays des visiteurs" icon={MapPin}>
                        <BarList data={s.visitsByCountry} labelKey="country" valueKey="count" color="#7C6BF0" fmtLabel={countryLabel} />
                      </SectionCard>
                      <SectionCard title="Projets les plus consultés" icon={Eye}>
                        <BarList data={s.topProjects} labelKey="label" valueKey="count" color="#2AA198" />
                      </SectionCard>
                    </div>

                    <SectionCard title="Dernières visites" icon={Clock}
                      action={
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Activity size={12} /> temps réel
                        </span>
                      }>
                      <RecentTable visits={s.recentVisits.slice(0, 8)} compact />
                    </SectionCard>
                  </>
                )}

                {/* ── TRAFIC ── */}
                {tab === 'traffic' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={Users} label="Visites (période)" value={s.totalVisits} trend={visitsTrend} />
                      <StatCard icon={Globe} label="Visiteurs uniques" value={s.uniqueVisitors} color="#7C6BF0" />
                      <StatCard icon={TrendingUp} label="Tendance" value={`${visitsTrend ?? 0}%`} sub="vs période précédente" color="#2AA198" />
                      <StatCard icon={Clock} label="Pages / visiteur" value={s.uniqueVisitors ? (s.totalVisits / s.uniqueVisitors).toFixed(1) : '0'} color="#E0A458" />
                    </div>

                    <SectionCard title="Visites par jour" icon={TrendingUp}>
                      <AreaChart data={s.visitsByDay} />
                    </SectionCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Sources de trafic" icon={Globe}>
                        <BarList data={s.visitsByReferrer} labelKey="source" valueKey="count" />
                      </SectionCard>
                      <SectionCard title="Pays" icon={MapPin}>
                        <BarList data={s.visitsByCountry} labelKey="country" valueKey="count" color="#7C6BF0" fmtLabel={countryLabel} />
                      </SectionCard>
                      <SectionCard title="Navigateurs" icon={Compass}>
                        <BarList data={s.visitsByBrowser} labelKey="browser" valueKey="count" color="#2AA198" />
                      </SectionCard>
                      <SectionCard title="Systèmes d'exploitation" icon={Monitor}>
                        <BarList data={s.visitsByOs} labelKey="os" valueKey="count" color="#9B59B6" />
                      </SectionCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SectionCard title="Langue du portfolio" icon={Globe}>
                        <BarList data={s.visitsByLang} labelKey="lang" valueKey="count" color="#E0A458" />
                      </SectionCard>
                      <SectionCard title="Appareils" icon={Smartphone}>
                        <Donut
                          centerLabel="VISITES"
                          data={s.visitsByDevice.map((d, i) => ({ label: d.device, count: Number(d.count), color: PALETTE[i % PALETTE.length] }))}
                        />
                      </SectionCard>
                    </div>

                    <SectionCard title="Toutes les visites récentes" icon={Clock}>
                      <RecentTable visits={s.recentVisits} />
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
                            <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
                                  <MessageSquare size={12} style={{ color: PINK }} /> Message #{s.messages.length - i}
                                </span>
                                <span className="text-[11px] text-gray-400">{relativeTime(m.created_at)}</span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{m.value || '(vide)'}</p>
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
  };
  return map[type] ?? type;
}

// ── Table des visites récentes ────────────────────────────────────────────────
function RecentTable({ visits, compact = false }: { visits: RecentVisit[]; compact?: boolean }) {
  if (!visits.length) return <EmptyState label="Aucune visite pour le moment" />;
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <th className="text-left pb-2 font-semibold">Quand</th>
            <th className="text-left pb-2 font-semibold">Appareil</th>
            {!compact && <th className="text-left pb-2 font-semibold">Navigateur</th>}
            {!compact && <th className="text-left pb-2 font-semibold">OS</th>}
            <th className="text-left pb-2 font-semibold">Lieu</th>
            <th className="text-left pb-2 font-semibold">Source</th>
            {!compact && <th className="text-left pb-2 font-semibold">Langue</th>}
          </tr>
        </thead>
        <tbody>
          {visits.map((v, i) => {
            const Dev = DEVICE_ICONS[v.device ?? ''] ?? Monitor;
            return (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                <td className="py-2.5 text-gray-500 whitespace-nowrap" title={new Date(v.created_at).toLocaleString('fr-FR')}>
                  {relativeTime(v.created_at)}
                </td>
                <td className="py-2.5 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Dev size={13} className="text-gray-400" /> {v.device ?? '-'}
                  </span>
                </td>
                {!compact && <td className="py-2.5 text-gray-500">{v.browser ?? '-'}</td>}
                {!compact && <td className="py-2.5 text-gray-500">{v.os ?? '-'}</td>}
                <td className="py-2.5 text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} className="text-gray-300" />
                    {[v.city, v.country].filter(Boolean).join(', ') || '-'}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: `${PINK}15`, color: PINK }}>
                    {sourceLabel(v)}
                  </span>
                </td>
                {!compact && <td className="py-2.5 uppercase font-bold" style={{ color: PINK }}>{v.lang ?? '-'}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
