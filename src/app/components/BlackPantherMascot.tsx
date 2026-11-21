import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X, Send } from 'lucide-react';
import { trackCompanyMascot } from '../analytics';

/* ────────────────────────────────────────────────────────────────────────────
   RÉGLAGES RAPIDES
   ──────────────────────────────────────────────────────────────────────────── */
const ACCENT = '#D4537E';        // rose de la marque (bouton HOME / titres)
const APPEAR_DELAY_MS = 2600;    // délai avant l'apparition de la panthère (ms)
const FADE_DURATION_S = 1.5;     // durée du fondu d'apparition / disparition (s)
const HALO_STRENGTH = 0.42;      // intensité du halo rose (0 = invisible, 1 = fort)
const BADGE_DURATION_MS = 3000;  // durée d'affichage du badge entreprise (ms)
const MAX_COMPANY = 40;          // longueur maximale du nom d'entreprise

const BUBBLE_BG = '#160D20';     // fond opaque noir-violet (bulle + médaillon)
const FRAME_W = 380;             // largeur du médaillon (unités SVG)
const FRAME_H = 230;             // hauteur du médaillon

/* Textes — modifie-les librement ici (fr = français, en = anglais). */
const COPY = {
  fr: {
    question: 'Coucou ! Je note qui visite. Tu travailles dans quelle entreprise ?',
    thanks: (c: string) => `Ravie de vous rencontrer, ${c} !`,
    placeholder: 'Votre entreprise…',
    send: 'Envoyer',
    close: 'Fermer',
  },
  en: {
    question: "Hey! I'm keeping track of visitors. Which company do you work for?",
    thanks: (c: string) => `Nice to meet you, ${c}!`,
    placeholder: 'Your company…',
    send: 'Send',
    close: 'Close',
  },
} as const;

type Lang = 'fr' | 'en';
type Phase = 'idle' | 'appearing' | 'asking' | 'thanking' | 'leaving';

/* La mascotte n'apparaît qu'une fois par visite (sessionStorage = durée de l'onglet).
   En développement le garde est ignoré pour pouvoir la revoir à chaque rechargement. */
const SEEN_KEY = 'pf_mascot_done';
const IS_DEV = import.meta.env.DEV;

/* ────────────────────────────────────────────────────────────────────────────
   DESSIN — panthère de profil, en marche lente et basse, museau à gauche.
   Grand félin et non chat : tête petite et fine au museau allongé, petites
   oreilles arrondies, cou épais, garrot haut, long dos légèrement cambré,
   croupe puissante, quatre pattes nettement détachées (deux en retrait plus
   sombres), longue queue qui retombe d'un seul mouvement.
   Le torse et chaque patte sont des tracés séparés : les pattes arrière du
   plan lointain passent derrière le torse, les pattes avant devant.
   ──────────────────────────────────────────────────────────────────────────── */

// Torse (tête + encolure + corps), sens horaire depuis le museau :
// museau → chanfrein → front → oreilles → nuque → garrot → dos → croupe →
// arrière-train → ventre → poitrail → gorge → mâchoire → museau.
const BODY_D =
  'M 34 90 ' +
  'C 44 82 52 77 60 74 ' +
  'C 62 68 64 58 70 56 ' +
  'C 75 59 77 67 79 73 ' +
  'C 84 67 87 58 92 56 ' +
  'C 97 59 99 67 101 72 ' +
  'C 106 74 110 78 114 82 ' +
  'C 122 79 129 77 136 78 ' +
  'C 170 74 212 78 250 80 ' +
  'C 268 82 282 88 294 98 ' +
  'C 306 110 312 126 308 142 ' +
  'C 305 150 299 155 290 156 ' +
  'C 262 158 226 157 196 156 ' +
  'C 174 155 160 153 150 149 ' +
  'C 154 142 154 133 149 126 ' +
  'C 144 119 136 113 126 109 ' +
  'C 116 105 106 103 96 104 ' +
  'C 74 106 52 100 34 90 Z';

// Liseré lumineux (lumière venant du dessus) : museau, front, oreilles, nuque,
// garrot, dos, croupe et arrière-train.
const RIM_D =
  'M 34 90 ' +
  'C 44 82 52 77 60 74 ' +
  'C 62 68 64 58 70 56 ' +
  'C 75 59 77 67 79 73 ' +
  'C 84 67 87 58 92 56 ' +
  'C 97 59 99 67 101 72 ' +
  'C 106 74 110 78 114 82 ' +
  'C 122 79 129 77 136 78 ' +
  'C 170 74 212 78 250 80 ' +
  'C 268 82 282 88 294 98 ' +
  'C 306 110 312 126 308 142';

// Pattes du plan lointain (assombries, dessinées derrière le torse).
const FAR_LEGS_D = [
  // Patte avant lointaine (rejetée en arrière)
  'M 156 100 C 162 122 170 146 176 166 C 180 182 182 192 180 197 ' +
    'C 172 199 166 195 167 186 C 169 166 162 144 154 126 ' +
    'C 151 116 152 106 158 101 Z',
  // Patte arrière lointaine (avancée)
  'M 276 122 C 274 142 268 164 262 180 C 258 191 254 197 250 198 ' +
    'C 242 199 238 194 241 186 C 248 168 254 146 252 128 ' +
    'C 251 118 258 112 266 116 Z',
];

// Pattes du plan proche (nettement visibles, dessinées devant le torse).
const NEAR_LEGS_D = [
  // Patte avant proche (avancée)
  'M 138 100 C 142 120 144 142 140 162 C 136 180 130 192 122 197 ' +
    'C 114 199 108 195 111 186 C 116 168 120 146 118 126 ' +
    'C 117 116 122 106 129 101 Z',
  // Patte arrière proche (rejetée en arrière)
  'M 300 120 C 306 140 310 162 310 180 C 310 190 308 196 304 198 ' +
    'C 295 200 289 196 291 188 C 294 170 292 150 286 134 ' +
    'C 283 124 286 114 294 116 Z',
];

// Longue queue qui retombe depuis la croupe en une seule courbe fluide.
const TAIL_D =
  'M 306 108 ' +
  'C 338 116 356 140 356 170 ' +
  'C 356 192 344 205 326 208 ' +
  'C 318 209 312 204 314 197 ' +
  'C 334 193 344 179 344 161 ' +
  'C 344 139 332 122 300 114 ' +
  'C 296 111 302 105 306 108 Z';

const TAIL_RIM_D =
  'M 308 112 C 338 120 352 142 352 170 C 352 189 342 200 328 205';

// Œil en amande étiré.
const EYE_D = 'M 84 82 C 79 77 68 77 62 82 C 68 87 79 86 84 82 Z';
const EYE_C = { x: 73, y: 82 };

// Moustaches très fines.
const WHISKERS_D = [
  'M 40 90 C 30 89 20 88 10 88',
  'M 39 95 C 29 96 18 98 8 100',
  'M 41 100 C 31 103 22 107 15 112',
];

// Particules roses discrètes qui montent doucement dans le cadre.
const PARTICLES = [
  { cx: 92, cy: 200, r: 2.0, dur: 7.6, delay: 0 },
  { cx: 318, cy: 190, r: 1.6, dur: 8.6, delay: 1.4 },
  { cx: 148, cy: 214, r: 2.3, dur: 6.8, delay: 2.6 },
  { cx: 262, cy: 210, r: 1.8, dur: 9.2, delay: 0.8 },
  { cx: 206, cy: 206, r: 1.5, dur: 7.8, delay: 3.2 },
];

function PantherSVG({
  gaze,
  reduced,
  svgRef,
}: {
  gaze: { x: number; y: number };
  reduced: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      className="h-auto w-[152px] sm:w-[200px]"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Fond du médaillon : dégradé noir-violet très sombre. */}
        <linearGradient id="pf-frame" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2={FRAME_W - 10} y2={FRAME_H}>
          <stop offset="0%" stopColor="#2E1B45" />
          <stop offset="46%" stopColor="#180F28" />
          <stop offset="100%" stopColor="#08060E" />
        </linearGradient>

        {/* Corps : du noir-violet très sombre au noir (dégradé continu partagé). */}
        <linearGradient id="panther-body" gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="340" y2="210">
          <stop offset="0%" stopColor="#2A1C3E" />
          <stop offset="45%" stopColor="#150E1F" />
          <stop offset="100%" stopColor="#05040A" />
        </linearGradient>

        {/* Lueur du liseré et des yeux. */}
        <filter id="panther-rim" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="panther-eyeglow" x="-140%" y="-140%" width="380%" height="380%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Halo rose très flou, derrière la panthère. */}
        <radialGradient id="panther-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={HALO_STRENGTH} />
          <stop offset="50%" stopColor={ACCENT} stopOpacity={HALO_STRENGTH * 0.32} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>

        {/* Brume sombre aux pieds. */}
        <radialGradient id="panther-mist" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#241634" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#241634" stopOpacity="0" />
        </radialGradient>

        {/* Le cadre arrondi clippe halo, brume et particules. */}
        <clipPath id="pf-clip">
          <rect x="1.5" y="1.5" width={FRAME_W - 3} height={FRAME_H - 3} rx="26" />
        </clipPath>
      </defs>

      <g clipPath="url(#pf-clip)">
        {/* Fond du médaillon */}
        <rect x="0" y="0" width={FRAME_W} height={FRAME_H} fill="url(#pf-frame)" />

        {/* Halo pulsant */}
        <motion.ellipse
          cx="196"
          cy="132"
          rx="168"
          ry="116"
          fill="url(#panther-halo)"
          style={{ transformOrigin: '196px 132px', transformBox: 'view-box' }}
          animate={reduced ? undefined : { scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
          transition={reduced ? undefined : { duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Brume sombre qui dérive lentement */}
        {!reduced && (
          <motion.ellipse
            cx="196"
            cy="208"
            rx="150"
            ry="26"
            fill="url(#panther-mist)"
            animate={{ x: [-12, 12, -12], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Ombre au sol */}
        <ellipse cx="198" cy="205" rx="132" ry="12" fill="#000" opacity="0.28" />

        {/* Queue (ondule très lentement) */}
        <motion.g
          style={{ transformOrigin: '322px 122px', transformBox: 'view-box' }}
          animate={reduced ? undefined : { rotate: [0, 1.4, 0, -1.1, 0] }}
          transition={reduced ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d={TAIL_D} fill="url(#panther-body)" />
          <path
            d={TAIL_RIM_D}
            fill="none"
            stroke={ACCENT}
            strokeWidth={1.5}
            strokeLinecap="round"
            filter="url(#panther-rim)"
            opacity={0.9}
          />
        </motion.g>

        {/* Silhouette principale */}
        <path d={BODY_D} fill="url(#panther-body)" strokeLinejoin="round" />

        {/* Liseré lumineux : museau, front, oreilles, nuque, dos, croupe */}
        <path
          d={RIM_D}
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#panther-rim)"
          opacity={0.92}
        />
        {/* Ombre douce détachant la patte avant */}
        <path
          d={LEG_SEP_D}
          fill="none"
          stroke="#05040A"
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.55}
        />

        {/* Moustaches très fines */}
        {WHISKERS_D.map((d) => (
          <path key={d} d={d} stroke="#E9A9C2" strokeWidth={0.7} strokeLinecap="round" opacity={0.4} />
        ))}

        {/* Œil : amande rose lumineuse + pupille fendue qui suit légèrement le curseur */}
        <g filter="url(#panther-eyeglow)">
          <path d={EYE_D} fill={ACCENT} opacity={0.95} />
          <ellipse cx={EYE_C.x + gaze.x} cy={EYE_C.y + gaze.y} rx={1.5} ry={4.4} fill="#0A0508" />
        </g>

        {/* Particules roses minuscules */}
        {!reduced &&
          PARTICLES.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={ACCENT}
              initial={{ opacity: 0 }}
              animate={{ y: [0, -84], opacity: [0, 0.8, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}

        {/* Grain lumineux très léger en bas du cadre */}
        <ellipse cx="196" cy={FRAME_H} rx="150" ry="40" fill={ACCENT} opacity="0.06" />
      </g>

      {/* Bordure rose fine du médaillon */}
      <rect
        x="1.5"
        y="1.5"
        width={FRAME_W - 3}
        height={FRAME_H - 3}
        rx="26"
        fill="none"
        stroke="rgba(212,83,126,0.42)"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Composant principal
   ──────────────────────────────────────────────────────────────────────────── */
export default function BlackPantherMascot({ lang }: { lang: Lang }) {
  const reduced = !!useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [company, setCompany] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const startedRef = useRef(false);

  // Paramètres d'URL : ?c=NomEntreprise (salue directement) et ?mascotte=0 (désactive).
  const urlCompany = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = new URLSearchParams(window.location.search).get('c');
    const clean = raw?.trim().replace(/\s+/g, ' ').slice(0, MAX_COMPANY);
    return clean && clean.length >= 2 ? clean : null;
  }, []);
  const disabled = useMemo(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mascotte') === '0',
    [],
  );

  const t = COPY[lang];
  const thanksMsg = company ? t.thanks(company) : '';

  // ── Apparition : quelques secondes après l'arrivée, une seule fois par visite ──
  useEffect(() => {
    if (disabled) return;
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch { /* stockage indisponible */ }
    if (alreadySeen && !IS_DEV) return;

    const timer = window.setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (!IS_DEV) { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ } }
      setVisible(true);
      setPhase('appearing');
    }, reduced ? 500 : APPEAR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, disabled]);

  // ── Après le fondu : question, ou salut direct si ?c= ───────────────────────
  useEffect(() => {
    if (phase !== 'appearing') return;
    const timer = window.setTimeout(() => {
      if (urlCompany) {
        setCompany(urlCompany);
        trackCompanyMascot(urlCompany);
        setPhase('thanking');
      } else {
        setPhase('asking');
      }
    }, reduced ? 150 : FADE_DURATION_S * 1000);
    return () => window.clearTimeout(timer);
  }, [phase, reduced, urlCompany]);

  // ── Le badge (et la réponse) reste ~3 s, puis tout disparaît en fondu ───────
  useEffect(() => {
    if (phase !== 'thanking') return;
    const timer = window.setTimeout(() => setPhase('leaving'), BADGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    const timer = window.setTimeout(() => setVisible(false), reduced ? 200 : FADE_DURATION_S * 1000);
    return () => window.clearTimeout(timer);
  }, [phase, reduced]);

  // ── Le regard suit légèrement le curseur (quelques pixels) ──────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Position de l'œil dans le médaillon (≈ 68/380 ; 95/230).
      const cx = rect.left + rect.width * 0.179;
      const cy = rect.top + rect.height * 0.413;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const amount = Math.min(dist / 220, 1) * 1.7;
      setGaze({ x: (dx / dist) * amount, y: (dy / dist) * amount });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Machine à écrire ────────────────────────────────────────────────────────
  const fullText = phase === 'asking' ? t.question : phase === 'thanking' ? thanksMsg : '';
  useEffect(() => {
    if (!fullText) return;
    if (reduced) { setText(fullText); return; }
    setText('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, [fullText, reduced]);

  const typingDone = fullText.length > 0 && text.length === fullText.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = input.trim().replace(/\s+/g, ' ').slice(0, MAX_COMPANY);
    if (name.length < 2) return;
    setCompany(name);
    trackCompanyMascot(name);
    setPhase('thanking');
  };

  const close = () => setPhase('leaving');

  if (!visible || disabled) return null;

  const departing = phase === 'leaving';
  const showBubble = phase === 'asking' || phase === 'thanking';

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-3 z-[60] select-none sm:bottom-6 sm:right-6"
      aria-live="polite"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.div
        className="flex flex-col items-end gap-3 sm:flex-row sm:items-end sm:gap-3"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: departing ? 0 : 1, y: departing ? 10 : 0 }}
        transition={{ duration: reduced ? 0.25 : FADE_DURATION_S, ease: 'easeInOut' }}
      >
        {/* Bulle de dialogue (fond noir-violet opaque, coins très arrondis) */}
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.5, ease: 'easeOut' }}
            className="pointer-events-auto relative w-[min(78vw,320px)] rounded-3xl border p-4 pr-10 shadow-[0_18px_50px_-16px_rgba(0,0,0,0.8)]"
            style={{ background: BUBBLE_BG, borderColor: 'rgba(212,83,126,0.5)' }}
          >
            {/* Flèche vers la panthère — desktop : vers la droite */}
            <span
              className="pointer-events-none absolute hidden h-3.5 w-3.5 sm:block"
              style={{
                right: '-7px',
                bottom: '22px',
                background: BUBBLE_BG,
                borderRight: '1px solid rgba(212,83,126,0.5)',
                borderBottom: '1px solid rgba(212,83,126,0.5)',
                transform: 'rotate(-45deg)',
              }}
            />
            {/* Flèche vers la panthère — mobile : vers le bas */}
            <span
              className="pointer-events-none absolute h-3.5 w-3.5 sm:hidden"
              style={{
                right: '34px',
                bottom: '-7px',
                background: BUBBLE_BG,
                borderRight: '1px solid rgba(212,83,126,0.5)',
                borderBottom: '1px solid rgba(212,83,126,0.5)',
                transform: 'rotate(45deg)',
              }}
            />

            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="absolute right-2.5 top-2.5 rounded-full p-1 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={15} />
            </button>

            <p className="text-[13px] leading-relaxed text-[#F5F4EF]">
              {text}
              {!typingDone && (
                <span
                  className="ml-0.5 inline-block h-[13px] w-[1px] animate-pulse align-middle"
                  style={{ background: ACCENT }}
                />
              )}
            </p>

            {phase === 'asking' && typingDone && (
              <form onSubmit={submit} className="mt-3 flex items-center gap-2">
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_COMPANY}
                  placeholder={t.placeholder}
                  className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-[13px] text-[#F5F4EF] outline-none transition-colors placeholder:text-white/35"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(212,83,126,0.35)' }}
                />
                <button
                  type="submit"
                  aria-label={t.send}
                  disabled={input.trim().length < 2}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: ACCENT }}
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Médaillon : panthère (respiration très subtile) */}
        <motion.div
          className="relative"
          style={{ transformOrigin: 'bottom center' }}
          animate={reduced ? undefined : { scale: [1, 1.012, 1] }}
          transition={reduced ? undefined : { duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Badge rose au nom de l'entreprise (3 s) */}
          {company && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduced ? 0.2 : 0.45, ease: 'easeOut' }}
              className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg"
              style={{ background: ACCENT }}
            >
              {company}
            </motion.div>
          )}

          <PantherSVG gaze={gaze} reduced={reduced} svgRef={svgRef} />
        </motion.div>
      </motion.div>
    </div>
  );
}
