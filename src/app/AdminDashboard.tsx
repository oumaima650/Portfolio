import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Eye, EyeOff, Download, Github, Linkedin, Clock,
  TrendingUp, Globe, Monitor, Smartphone, LogOut,
  RefreshCw, BarChart2, MessageSquare, Zap, Lock
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
  totalVisits: number;
  visitsByDay: { date: string; count: number }[];
  visitsByDevice: { device: string; count: number }[];
  visitsByReferrer: { source: string; count: number }[];
  visitsByLang: { lang: string; count: number }[];
  topProjects: { label: string; count: number }[];
  topEvents: { type: string; count: number }[];
  cvDownloads: { version: string; count: number }[];
  sectionTimes: { section: string; avg_seconds: number; count: number }[];
  recentVisits: { created_at: string; device: string; browser: string; os: string; referrer: string; ref_param: string; lang: string }[];
  scrollDepths: { percent: string; count: number }[];
}

const PINK = '#D4537E';

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBar({ data, labelKey, valueKey, color = PINK }: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1);
  return (
    <div className="space-y-2 mt-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-28 truncate text-gray-500 flex-shrink-0">{String(d[labelKey])}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${(Number(d[valueKey]) / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            />
          </div>
          <span className="w-8 text-right font-bold text-gray-700">{d[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Sparkline (visites par jour) ──────────────────────────────────────────────
function Sparkline({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return <div className="text-gray-400 text-xs mt-2">Pas encore de données</div>;
  const max = Math.max(...data.map((d) => d.count), 1);
  const w = 400; const h = 60; const pad = 4;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2);
    const y = h - pad - (d.count / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="mt-3 overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minWidth: '200px' }}>
        <polyline fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2);
          const y = h - pad - (d.count / max) * (h - pad * 2);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill={PINK} />
              <title>{d.date}: {d.count} visite(s)</title>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{data[0]?.date?.slice(5)}</span>
        <span>{data[data.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = PINK }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── Login page ────────────────────────────────────────────────────────────────
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

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('30');
  const [error, setError] = useState('');

  const fetchStats = useCallback(async (t: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin-stats?range=${range}`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401) { localStorage.removeItem('admin_token'); setToken(null); return; }
      const data = await res.json();
      if (res.ok) setStats(data);
      else setError(data.error ?? 'Erreur');
    } catch {
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (token) fetchStats(token);
  }, [token, fetchStats]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) return <LoginPage onLogin={setToken} />;

  const totalCv = (stats?.cvDownloads ?? []).reduce((s, d) => s + Number(d.count), 0);
  const githubClicks = stats?.topEvents?.find((e) => e.type === 'github_click')?.count ?? 0;
  const linkedinClicks = stats?.topEvents?.find((e) => e.type === 'linkedin_click')?.count ?? 0;
  const contactForms = stats?.topEvents?.find((e) => e.type === 'contact_form_sent')?.count ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${PINK}18` }}>
            <BarChart2 size={16} style={{ color: PINK }} />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900">Portfolio Analytics</h1>
            <p className="text-[10px] text-gray-400">Oumaima Ameziane · {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
          >
            <option value="7">7 jours</option>
            <option value="30">30 jours</option>
            <option value="90">90 jours</option>
            <option value="365">1 an</option>
          </select>
          <motion.button
            onClick={() => fetchStats(token)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            whileTap={{ rotate: 180 }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <LogOut size={13} /> Déconnexion
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
        )}

        {loading && !stats && (
          <div className="text-center py-20 text-gray-400 text-sm">Chargement des données...</div>
        )}

        <AnimatePresence>
          {stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Visites totales" value={stats.totalVisits} sub={`${range} derniers jours`} />
                <StatCard icon={Download} label="CV téléchargés" value={totalCv} sub={`FR: ${stats.cvDownloads.find(d=>d.version==='FR')?.count??0}  EN: ${stats.cvDownloads.find(d=>d.version==='EN')?.count??0}`} />
                <StatCard icon={Github} label="Clics GitHub" value={githubClicks} />
                <StatCard icon={MessageSquare} label="Messages reçus" value={contactForms} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Linkedin} label="Clics LinkedIn" value={linkedinClicks} color="#0077B5" />
                <StatCard icon={Zap} label="Demos ouvertes" value={stats.topEvents.find(e=>e.type==='live_demo_click')?.count??0} />
                <StatCard icon={Eye} label="Projets consultés" value={stats.topEvents.find(e=>e.type==='project_open')?.count??0} />
                <StatCard icon={TrendingUp} label="Scroll 100%" value={stats.scrollDepths.find(d=>d.percent==='100')?.count??0} sub="ont lu tout le portfolio" />
              </div>

              {/* Visites par jour */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                  <TrendingUp size={15} style={{ color: PINK }} /> Visites par jour
                </h2>
                <Sparkline data={stats.visitsByDay} />
              </div>

              {/* Row: sources + devices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Globe size={15} style={{ color: PINK }} /> Sources de trafic
                  </h2>
                  <MiniBar data={stats.visitsByReferrer} labelKey="source" valueKey="count" />
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Monitor size={15} style={{ color: PINK }} /> Appareils
                  </h2>
                  <MiniBar data={stats.visitsByDevice} labelKey="device" valueKey="count" />
                </div>
              </div>

              {/* Row: projets + sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Eye size={15} style={{ color: PINK }} /> Projets les plus consultés
                  </h2>
                  {stats.topProjects.length ? (
                    <MiniBar data={stats.topProjects} labelKey="label" valueKey="count" />
                  ) : <p className="text-xs text-gray-400 mt-3">Pas encore de données</p>}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Clock size={15} style={{ color: PINK }} /> Temps moyen par section (sec)
                  </h2>
                  {stats.sectionTimes.length ? (
                    <MiniBar data={stats.sectionTimes} labelKey="section" valueKey="avg_seconds" />
                  ) : <p className="text-xs text-gray-400 mt-3">Pas encore de données</p>}
                </div>
              </div>

              {/* Row: langue + scroll depth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Globe size={15} style={{ color: PINK }} /> Langue du portfolio
                  </h2>
                  <MiniBar data={stats.visitsByLang} labelKey="lang" valueKey="count" />
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h2 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Smartphone size={15} style={{ color: PINK }} /> Scroll depth
                  </h2>
                  <MiniBar data={stats.scrollDepths} labelKey="percent" valueKey="count" />
                </div>
              </div>

              {/* Visites récentes */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-gray-800 flex items-center gap-2 mb-4">
                  <Users size={15} style={{ color: PINK }} /> Visites récentes
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="text-left pb-2 font-semibold">Date</th>
                        <th className="text-left pb-2 font-semibold">Appareil</th>
                        <th className="text-left pb-2 font-semibold">Navigateur</th>
                        <th className="text-left pb-2 font-semibold">OS</th>
                        <th className="text-left pb-2 font-semibold">Source</th>
                        <th className="text-left pb-2 font-semibold">Langue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentVisits.map((v, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-2 text-gray-500">{new Date(v.created_at).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</td>
                          <td className="py-2 font-medium">{v.device ?? '-'}</td>
                          <td className="py-2 text-gray-500">{v.browser ?? '-'}</td>
                          <td className="py-2 text-gray-500">{v.os ?? '-'}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${PINK}15`, color: PINK }}>
                              {!v.referrer ? 'Direct' : v.referrer.includes('linkedin') ? 'LinkedIn' : v.referrer.includes('github') ? 'GitHub' : v.referrer.includes('google') ? 'Google' : 'Autre'}
                            </span>
                          </td>
                          <td className="py-2 uppercase font-bold" style={{ color: PINK }}>{v.lang ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!stats.recentVisits.length && (
                    <p className="text-center text-gray-400 py-8 text-xs">Aucune visite pour le moment</p>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
