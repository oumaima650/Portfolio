import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Mail, Phone, Linkedin, Github, Heart, MapPin, X, Home, User, Code, Briefcase, FolderOpen, Star, MessageCircle, Award, Download, ChevronDown, type LucideIcon } from 'lucide-react';
import profileImg from '../imports/image-1.png';
import heroImg from '../imports/image-0.png';
import { t, DATA, CERTIFICATIONS, type Lang } from './translations';

// image map for projects (by id)
const PROJECT_IMAGES: Record<string, string> = {
  'proj-1': heroImg,
  'proj-2': profileImg,
  'proj-3': heroImg,
};

// ── CV DOWNLOAD BUTTON ────────────────────────────────────────────────────────
function CvDownloadButton({ T }: { T: typeof import('./translations').t['fr'] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block mt-6">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0D0D0D] text-white font-bold text-sm hover:bg-[#D4537E] transition-colors group"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <Download size={16} />
        {T.cvDownload}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={15} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-1/2 mt-2 w-52 rounded-2xl bg-white shadow-2xl border border-black/8 overflow-hidden z-50"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {[
              { label: T.cvFr, flag: '🇫🇷', file: '/cv-oumaima-fr.pdf' },
              { label: T.cvEn, flag: '🇬🇧', file: '/cv-oumaima-en.pdf' },
            ].map(({ label, flag, file }, i) => (
              <motion.a
                key={file}
                href={file}
                download
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8F7F2] transition-colors text-[#0D0D0D] text-sm font-semibold border-b border-black/5 last:border-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 4 }}
              >
                <span className="text-lg">{flag}</span>
                {label}
                <Download size={12} className="ml-auto text-[#D4537E]" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>('fr');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const T = t[lang];
  const EXPERIENCES = DATA.experiences[lang];
  const PROJECTS = DATA.projects[lang].map((p) => ({ ...p, image: PROJECT_IMAGES[p.id] }));
  const ACTIVITIES = DATA.activities[lang];

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    ['home', 'about', 'skills', 'experience', 'projects', 'activities', 'certifications', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const nameLines = ['OUMAIMA', 'AMEZIANE'];
  const nameContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
  };
  const letterVariant = {
    hidden: { y: 80, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };

  // Language switcher button
  const LangSwitcher = () => (
    <motion.button
      onClick={() => setLang((l) => (l === 'fr' ? 'en' : 'fr'))}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <span className={lang === 'fr' ? 'text-[#D4537E]' : 'text-white/50'}>FR</span>
      <span className="text-white/30">/</span>
      <span className={lang === 'en' ? 'text-[#D4537E]' : 'text-white/50'}>EN</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">

      {/* ── HERO ── */}
      <motion.section
        id="home"
        ref={heroRef}
        className="relative h-screen bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.4 }}
          style={{ opacity: heroOpacity }}
        >
          <img src={heroImg} alt="Oumaima Ameziane" className="w-full h-full object-cover object-[65%_30%] md:object-right" />
        </motion.div>

        {/* Top-left label */}
        <motion.div
          className="absolute top-5 left-5 md:top-7 md:left-10 z-30 flex flex-col gap-1.5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <h2 className="text-white text-xs md:text-sm tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            {T.jobTitle}
          </h2>
          <p className="text-white/80 text-[11px] leading-relaxed max-w-[140px] md:hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {T.taglineMobile}
          </p>
        </motion.div>

        {/* Top-right: tagline + lang switcher */}
        <motion.div
          className="absolute top-5 right-5 md:top-7 md:right-10 z-30 flex flex-col items-end gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <LangSwitcher />
          <p className="hidden md:block text-white/80 text-xs leading-relaxed text-right max-w-[240px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {T.tagline}
          </p>
        </motion.div>

        {/* Name */}
        <div className="absolute bottom-[90px] md:bottom-0 left-0 right-0 z-30 px-5 md:px-10 md:pb-10 overflow-hidden">
          <motion.h1
            className="text-[28px] md:text-[52px] lg:text-[78px] leading-[0.87] mb-14 md:mb-28 uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, letterSpacing: '-0.02em' }}
            variants={nameContainer}
            initial="hidden"
            animate="visible"
          >
            {nameLines.map((line, li) => (
              <div key={li} className="block">
                {line.split('').map((letter, lei) => (
                  <motion.span
                    key={`${li}-${lei}`}
                    className="inline-block"
                    style={{ color: '#D4537E' }}
                    variants={letterVariant}
                    whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.h1>

          {/* Nav */}
          <motion.div
            className="fixed bottom-5 md:bottom-6 left-0 right-0 z-50 flex justify-center px-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            {/* Desktop nav */}
            <nav
              className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-full"
              style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 32px rgba(0,0,0,0.4)' }}
            >
              {([
                { key: 'home' as const,         id: 'home' },
                { key: 'about' as const,        id: 'about' },
                { key: 'skills' as const,       id: 'skills' },
                { key: 'experience' as const,   id: 'experience' },
                { key: 'projects' as const,     id: 'projects' },
                { key: 'activities' as const,   id: 'activities' },
                { key: 'certifications' as const, id: 'certifications' },
                { key: 'contact' as const,      id: 'contact' },
              ] as { key: keyof typeof T.nav; id: string }[]).map(({ key, id }) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all ${
                    activeSection === id
                      ? 'bg-[#D4537E] text-white shadow-[0_0_12px_rgba(212,83,126,0.5)]'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {T.nav[key]}
                </motion.a>
              ))}
            </nav>

            {/* Mobile nav — icons */}
            <nav
              className="md:hidden inline-flex items-center gap-1 px-3 py-2 rounded-full"
              style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 32px rgba(0,0,0,0.4)' }}
            >
              {([
                { icon: Home,          id: 'home' },
                { icon: User,          id: 'about' },
                { icon: Code,          id: 'skills' },
                { icon: Briefcase,     id: 'experience' },
                { icon: FolderOpen,    id: 'projects' },
                { icon: Star,          id: 'activities' },
                { icon: Award,         id: 'certifications' },
                { icon: MessageCircle, id: 'contact' },
              ] as { icon: LucideIcon; id: string }[]).map(({ icon: Icon, id }) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    activeSection === id
                      ? 'bg-[#D4537E] text-white shadow-[0_0_12px_rgba(212,83,126,0.5)]'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </div>
      </motion.section>

      {/* ── ABOUT ── */}
      <motion.section
        id="about"
        className="relative py-16 md:py-28 overflow-hidden bg-white"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1 }}
      >
        <div className="absolute top-14 left-0 w-full overflow-hidden text-[140px] md:text-[300px] font-black text-[#F8F7F2] select-none pointer-events-none italic tracking-tighter leading-none opacity-50 z-0">
          OUMAI.
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-10 relative z-10">
          <div className="flex flex-col gap-16 md:gap-28">

            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <div className="flex flex-col items-center gap-2 mb-8">
                  <div className="h-[2px] w-10 bg-[#D4537E]" />
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-[#D4537E]">{T.aboutTag}</span>
                </div>

                {/* Animated title — stagger container */}
                <motion.h2
                  className="text-[36px] md:text-[64px] leading-[1.0] font-black mb-8 tracking-tighter"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#0D0D0D' }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                  }}
                >
                  {/* Line 1 */}
                  <span className="block">
                    {T.aboutTitle1.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        className="inline-block mr-[0.25em]"
                        variants={{
                          hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                          visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                    {/* "code" — italic rose with drawing underline */}
                    <motion.span
                      className="relative inline-block italic text-[#D4537E] mr-[0.05em]"
                      variants={{
                        hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
                      }}
                    >
                      code
                      <motion.span
                        className="absolute left-0 rounded-full bg-[#D4537E]"
                        style={{ bottom: '-2px', height: '3px', display: 'block' }}
                        initial={{ width: '0%' }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
                      />
                    </motion.span>
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
                      }}
                    >,</motion.span>
                  </span>

                  {/* Line 2 */}
                  <span className="block">
                    {T.aboutTitle2.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        className="inline-block mr-[0.25em]"
                        variants={{
                          hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                          visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                </motion.h2>

                {/* CV Download button */}
                <CvDownloadButton T={T} />
              </motion.div>
            </div>

            {/* ── BIO + LANGUAGES + STATUS — full redesign ── */}

            {/* Bio — layout éditorial asymétrique */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-0 md:gap-8 items-start">
              {/* Left: tagline + bio */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="pr-0 md:pr-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    className="h-[2px] bg-[#D4537E]"
                    initial={{ width: 0 }}
                    whileInView={{ width: 40 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.35em] font-black text-[#D4537E]">{T.aboutTag}</span>
                </div>
                <p className="text-[#0D0D0D] text-base md:text-lg leading-relaxed font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {T.aboutBio.split(T.aboutBioBold).map((part, i) =>
                    i === 0
                      ? <span key={i}>{part}<span className="font-black text-[#D4537E]">{T.aboutBioBold}</span></span>
                      : <span key={i}>{part}</span>
                  )}
                </p>
                {/* Pills */}
                <div className="flex gap-2 flex-wrap mt-6">
                  {T.aboutPills.map((s, i) => (
                    <motion.span
                      key={s}
                      className="px-3 py-1 rounded-full border border-[#D4537E]/25 text-[#D4537E] font-bold text-[10px] uppercase tracking-widest bg-[#F8F7F2]"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                    >{s}</motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-[#D4537E]/15 self-stretch" />

              {/* Right: languages horizontal */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className="pl-0 md:pl-8"
              >
                <div className="text-[10px] uppercase tracking-[0.35em] font-black text-[#D4537E] mb-5">{T.languagesTitle}</div>
                <div className="flex flex-col gap-0">
                  {T.languages.map((l, i) => (
                    <motion.div
                      key={l.name}
                      className="flex items-center justify-between py-4 border-b border-[#F0EEE8] last:border-0 group"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-[#D4537E] flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                        >
                          {l.name[0]}
                        </motion.div>
                        <span className="text-lg md:text-xl font-black text-[#0D0D0D] group-hover:text-[#D4537E] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{l.name}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-[#9B9B9B] font-bold">{l.level}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Status PFE — full-width horizontal banner */}
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-[#0D0D0D]" />
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(ellipse at 80% 50%, #D4537E 0%, transparent 60%)' }}
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-0">
                {/* Left: big PFE */}
                <div className="flex items-center justify-center px-10 py-8 md:py-0 md:border-r border-white/10 flex-shrink-0">
                  <motion.div
                    className="text-[80px] md:text-[110px] font-black italic leading-none tracking-tighter text-[#D4537E]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    initial={{ opacity: 0, scale: 0.5, rotate: -6 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 90 }}
                  >
                    PFE
                  </motion.div>
                </div>

                {/* Middle: info */}
                <div className="flex-1 px-8 py-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart size={11} fill="#D4537E" className="text-[#D4537E]" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4537E] font-black">{T.statusTag}</span>
                  </div>
                  <h3 className="text-white text-xl md:text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {T.statusTitle.split('\n')[0]}
                  </h3>
                  <p className="text-white/55 text-xs md:text-sm leading-relaxed max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {T.statusDesc}
                  </p>
                </div>

                {/* Right: availability chip */}
                <div className="flex items-center justify-center px-8 py-6 md:py-0 flex-shrink-0">
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      className="w-14 h-14 rounded-full border-2 border-[#D4537E] flex items-center justify-center"
                      animate={{ boxShadow: ['0 0 0 0 rgba(212,83,126,0)', '0 0 0 10px rgba(212,83,126,0.15)', '0 0 0 0 rgba(212,83,126,0)'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                    >
                      <motion.div
                        className="w-4 h-4 rounded-full bg-[#D4537E]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </motion.div>
                    <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold text-center">Jan<br />2027</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="h-[2px] w-12 bg-[#D4537E]" />
                <h4 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-[#D4537E]">{T.educationTag}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                <motion.div className="relative pl-7 md:pl-10 border-l border-[#D4537E]/30" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#D4537E]" />
                  <div className="text-[10px] font-black text-[#D4537E] mb-1">{T.edu1Date}</div>
                  <h5 className="text-2xl font-black mb-0.5 italic" style={{ fontFamily: "'Playfair Display', serif" }}>{T.edu1School}</h5>
                  <div className="text-base font-bold text-[#6B6B6B]">{T.edu1Degree}</div>
                  <div className="text-xs text-[#9B9B9B] mt-1">{T.edu1Spec}</div>
                </motion.div>
                <motion.div className="relative pl-7 md:pl-10 border-l border-[#D4537E]/30" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.15 }}>
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#D4537E]/40" />
                  <div className="text-[10px] font-black text-[#6B6B6B] mb-1">{T.edu2Date}</div>
                  <h5 className="text-2xl font-black mb-0.5 italic" style={{ fontFamily: "'Playfair Display', serif" }}>{T.edu2School}</h5>
                  <div className="text-base font-bold text-[#6B6B6B]">{T.edu2Degree}</div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ── SKILLS ── */}
      <motion.section
        id="skills"
        className="relative py-12 md:py-20 bg-[#F0EEE8] overflow-x-hidden"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9 }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="mb-7 md:mb-10">
            <h2 className="text-[32px] md:text-[48px] leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{T.skillsTitle}</h2>
            <div className="w-20 h-1 bg-[#D4537E]" />
          </div>
          <div className="space-y-5 md:space-y-6">
            {T.skillsCategories.map(({ label, primary, secondary }) => (
              <div key={label}>
                <h3 className="text-[10px] md:text-xs uppercase tracking-wider mb-3 font-semibold text-[#0D0D0D]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</h3>
                <div className="flex gap-2 flex-wrap">
                  {primary.map((s) => (
                    <span key={s} className="px-3 md:px-4 py-1.5 rounded-full bg-[#D4537E] text-white text-[10px] md:text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                  ))}
                  {secondary.map((s) => (
                    <span key={s} className="px-3 md:px-4 py-1.5 rounded-full border-2 border-[#D4537E] bg-transparent text-[10px] md:text-xs font-medium text-[#0D0D0D]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── EXPERIENCE ── */}
      <motion.section
        id="experience"
        className="relative py-14 md:py-24 bg-white"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9 }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
            <div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 text-[#D4537E] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.expTag}</div>
              <h2 className="text-[36px] md:text-[56px] leading-none font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{T.expTitle}</h2>
            </div>
            <div className="hidden md:block w-36 h-1 bg-[#D4537E] mb-3" />
          </div>
          <div className="space-y-8">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div className="relative grid grid-cols-1 lg:grid-cols-[32%_68%] bg-gradient-to-br from-[#F5F4EF] to-white rounded-2xl overflow-hidden shadow-lg border border-[#D4537E]/10">
                  <div className="bg-[#D4537E] p-7 md:p-10 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-[10px] md:text-xs uppercase tracking-wider mb-4 opacity-90 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.date}</div>
                      <h3 className="text-[20px] md:text-[28px] leading-[1.1] mb-3 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{exp.title}</h3>
                    </div>
                    <div>
                      <div className="text-base md:text-xl mb-1 font-extrabold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.company}</div>
                      <div className="text-[11px] opacity-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.location}</div>
                    </div>
                  </div>
                  <div className="p-7 md:p-10 flex flex-col justify-between">
                    <div className="mb-5">
                      <h4 className="text-sm md:text-base mb-3 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.expMission}</h4>
                      <p className="text-[#0D0D0D] text-sm leading-relaxed mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.description}</p>
                      <h4 className="text-[10px] uppercase tracking-wider mb-2 text-[#D4537E] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.expStack}</h4>
                      <div className="flex gap-1.5 flex-wrap mb-6">
                        {exp.tech.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 text-[10px] rounded-full border border-[#D4537E]/20 bg-white font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => openModal(exp)}
                      className="self-start px-6 py-2.5 bg-[#0D0D0D] text-white rounded-full flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-black transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                    >
                      {T.expBtn} <ExternalLink size={13} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PROJECTS ── */}
      <motion.section
        id="projects"
        className="relative py-10 md:py-16 bg-[#0D0D0D]"
        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9 }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 text-[#D4537E] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.projTag}</div>
            <h2 className="text-[28px] md:text-[42px] leading-none text-white mb-4 font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{T.projTitle}</h2>
            <p className="text-white/55 text-sm md:text-base max-w-xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.projSubtitle}</p>
          </div>
          <div className="space-y-5 md:space-y-7">
            {PROJECTS.slice(0, 1).map((proj) => (
              <motion.div
                key={proj.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => openModal(proj)}
                initial={{ opacity: 0, scale: 0.88, y: 24 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55 }}
                whileHover={{ scale: 1.015 }}
              >
                <div className="relative bg-gradient-to-br from-[#D4537E] to-[#B84368] p-7 md:p-10 min-h-[300px] md:min-h-[360px] flex items-end">
                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[60%_40%] gap-7 md:gap-10 text-left">
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        <span className="text-[10px] md:text-xs text-white font-bold tracking-wider uppercase">{proj.category}</span>
                      </div>
                      <h3 className="text-[30px] md:text-[46px] leading-[1.05] mb-3 text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{proj.title}</h3>
                      <p className="text-white/85 text-xs md:text-sm leading-relaxed mb-4">{proj.description}</p>
                    </div>
                    <div className="flex flex-col justify-end items-start md:items-end">
                      <div className="mb-5 w-full text-left md:text-right">
                        <div className="text-[10px] uppercase tracking-wider text-white/65 mb-2 font-bold">{T.projTechLabel}</div>
                        <div className="flex gap-1.5 flex-wrap md:justify-end">
                          {proj.tech.map((tech) => (
                            <span key={tech} className="px-2.5 md:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 text-[10px] font-medium">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <motion.button className="px-5 py-2.5 bg-white text-[#D4537E] rounded-full flex items-center gap-2 text-xs font-bold shadow-lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                        {T.projBtn} <ExternalLink size={13} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 text-left">
              {PROJECTS.slice(1).map((proj, idx) => (
                <motion.div
                  key={proj.id}
                  className="rounded-2xl overflow-hidden cursor-pointer group bg-white border border-black/5"
                  onClick={() => openModal(proj)}
                  initial={{ opacity: 0, scale: 0.88, y: 24 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: 0.1 + idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                >
                  <div className="p-5 md:p-7 min-h-[280px] md:min-h-[340px] flex flex-col">
                    <div className="w-10 h-0.5 bg-[#D4537E] mb-4" />
                    <div className="text-[10px] uppercase tracking-wider text-[#D4537E] font-bold mb-2">{proj.category}</div>
                    <h3 className="text-[22px] md:text-[30px] leading-[1.1] mb-3 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{proj.title}</h3>
                    <p className="text-[#6B6B6B] leading-relaxed mb-4 text-xs md:text-sm">{proj.description}</p>
                    <div className="mt-auto">
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {proj.tech.map((tech) => (
                          <span key={tech} className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md bg-[#F8F7F2] text-black/55 border border-black/5">{tech}</span>
                        ))}
                      </div>
                      <div className="text-[#D4537E] flex items-center gap-1.5 text-xs font-bold group-hover:gap-3 transition-all">
                        {T.projBtn} <ExternalLink size={13} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── ACTIVITIES ── */}
      <motion.section
        id="activities"
        className="relative py-14 md:py-24 bg-white overflow-hidden"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9 }}
      >
        <div className="absolute top-16 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#D4537E]/5 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-10 md:mb-14">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 text-[#D4537E] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.activitiesTag}</div>
            <h2 className="text-[28px] md:text-[42px] leading-none mb-4 font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{T.activitiesTitle}</h2>
            <p className="text-[#6B6B6B] text-xs md:text-sm max-w-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.activitiesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {ACTIVITIES.map((act, idx) => (
              <motion.div
                key={act.id}
                className={`rounded-2xl overflow-hidden group ${idx === 0 ? 'md:col-span-2' : ''}`}
                initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
              >
                {idx === 0 ? (
                  <div className="relative bg-gradient-to-br from-[#D4537E] to-[#B84368] p-7 md:p-10 min-h-[200px] flex flex-col justify-between text-white overflow-hidden">
                    <div className="absolute top-6 right-6 text-[100px] leading-none opacity-5 select-none font-black" style={{ fontFamily: "'Playfair Display', serif" }}>01</div>
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold">{act.date}</span>
                      </div>
                      <h3 className="text-[24px] md:text-[36px] leading-[1.1] mb-1 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{act.title}</h3>
                      <div className="text-sm md:text-base mb-4 opacity-90 font-bold">{act.role}</div>
                      <p className="text-white/75 text-xs md:text-sm leading-relaxed max-w-xl">{act.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F8F7F2] border border-[#D4537E]/15 p-6 md:p-7 h-full flex flex-col min-h-[150px]">
                    <div className="w-8 h-0.5 bg-[#D4537E] mb-4" />
                    <div className="text-[10px] uppercase tracking-wider font-black text-[#D4537E] mb-1">{act.category} · {act.date}</div>
                    <h3 className="text-[18px] md:text-[24px] leading-[1.1] mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{act.title}</h3>
                    <div className="text-xs text-[#D4537E] font-bold mb-2">{act.role}</div>
                    <p className="text-[#6B6B6B] text-xs leading-relaxed">{act.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CERTIFICATIONS ── */}
      <motion.section
        id="certifications"
        className="relative py-14 md:py-24 bg-[#F0EEE8] overflow-hidden"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9 }}
      >
        {/* Decorative background */}
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#D4537E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 text-[#D4537E] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.certTag}</div>
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <h2 className="text-[28px] md:text-[42px] leading-none font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{T.certTitle}</h2>
                <div className="w-16 h-1 bg-[#D4537E] mt-3" />
              </div>
              <Award size={36} className="text-[#D4537E]/30 hidden md:block" />
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div
                key={cert.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#D4537E]/10 hover:shadow-md hover:border-[#D4537E]/30 transition-all"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ y: -4 }}
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-[#D4537E] to-[#B84368]" />

                <div className="p-6 md:p-7 flex flex-col h-full">
                  {/* Badge + date row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#D4537E]/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {cert.badge}
                    </div>
                    <span className="text-[10px] font-black text-[#D4537E]/60 uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#D4537E]/15 bg-[#F8F7F2]">
                      {cert.date}
                    </span>
                  </div>

                  {/* Title + issuer */}
                  <h3 className="text-[16px] md:text-[18px] font-black leading-tight mb-1 text-[#0D0D0D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {cert.title}
                  </h3>
                  <div className="text-xs font-bold text-[#D4537E] mb-3">{cert.issuer}</div>

                  {/* Description */}
                  <p className="text-[#6B6B6B] text-xs leading-relaxed flex-1 mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {cert.description}
                  </p>

                  {/* Link */}
                  {cert.credentialUrl && cert.credentialUrl !== '#' && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D4537E] hover:gap-3 transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {T.certVerify} <ExternalLink size={11} />
                    </a>
                  )}
                  {(!cert.credentialUrl || cert.credentialUrl === '#') && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <Award size={11} /> {T.certVerify}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CONTACT ── */}
      <motion.section
        id="contact"
        className="relative py-10 md:py-16 bg-[#0D0D0D]"
        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9 }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="mb-10 md:mb-14">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 text-[#D4537E] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.contactTag}</div>
            <div className="w-14 h-1 bg-[#D4537E] mb-4" />
            <h2 className="text-[28px] md:text-[42px] leading-none text-white font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{T.contactTitle}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 md:gap-14">
            <div>
              <p className="text-white/65 text-sm md:text-base mb-8 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.contactDesc}</p>
              <div className="space-y-3 md:space-y-4">
                {[
                  { icon: Mail,     label: 'oumaima.ameziane8@gmail.com', href: 'mailto:oumaima.ameziane8@gmail.com' },
                  { icon: Phone,    label: '+212 621 811 707',             href: 'tel:+212621811707' },
                  { icon: MapPin,   label: 'ENSA Tetouan, Maroc',          href: null },
                  { icon: Linkedin, label: 'Ameziane Oumaima',             href: 'https://www.linkedin.com/in/oumaima-ameziane-037473331/' },
                  { icon: Github,   label: 'oumaima650',                   href: 'https://github.com/oumaima650' },
                ].map(({ icon: Icon, label, href }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 flex items-center justify-center group-hover:bg-[#D4537E] transition-all flex-shrink-0">
                      <Icon size={15} className="text-[#D4537E] group-hover:text-white transition-colors" />
                    </div>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-white/75 hover:text-[#D4537E] transition-colors text-xs md:text-sm break-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</a>
                    ) : (
                      <span className="text-white/75 text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <form className="space-y-4">
                {[
                  { type: 'text',  placeholder: T.contactName },
                  { type: 'email', placeholder: T.contactEmail },
                  { type: 'text',  placeholder: T.contactSubject },
                ].map(({ type, placeholder }) => (
                  <input key={placeholder} type={type} placeholder={placeholder}
                    className="w-full px-4 md:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4537E] outline-none transition-all text-xs md:text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                ))}
                <textarea rows={4} placeholder={T.contactMessage}
                  className="w-full px-4 md:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4537E] outline-none resize-none transition-all text-xs md:text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <motion.button type="submit"
                  className="w-full py-3 rounded-xl bg-[#D4537E] text-white uppercase tracking-wider text-xs md:text-sm font-bold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  whileHover={{ scale: 1.015, boxShadow: '0 8px 30px rgba(212,83,126,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {T.contactSend}
                </motion.button>
              </form>
            </div>
          </div>
          <div className="mt-12 md:mt-16 pt-5 border-t border-white/10 text-center">
            <p className="text-white/40 text-[11px] md:text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{T.footer}</p>
          </div>
        </div>
      </motion.section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-7">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 16 }}
              className="relative w-full max-w-4xl max-h-[88vh] bg-[#FDFDFB] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/10 hover:bg-black/20 text-black transition-colors">
                <X size={20} />
              </button>
              <div className="md:w-2/5 relative h-[240px] md:h-auto bg-[#F0EEE8] overflow-hidden">
                <img src={selectedItem.image || profileImg} alt={selectedItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-[10px] uppercase tracking-widest opacity-75 mb-1">{selectedItem.category || selectedItem.type}</div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedItem.title}</h2>
                </div>
              </div>
              <div className="md:w-3/5 p-6 md:p-10 overflow-y-auto bg-white">
                <div className="max-w-xl">
                  <div className="mb-6">
                    {selectedItem.company && <div className="text-base font-bold text-[#D4537E] mb-0.5">{selectedItem.company}</div>}
                    <div className="text-xs text-black/45 font-medium">{selectedItem.date}{selectedItem.location ? ` · ${selectedItem.location}` : ''}</div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-base font-bold mb-3 text-black">{T.modalDetails}</h3>
                    <p className="text-[#6B6B6B] leading-relaxed whitespace-pre-line text-sm">{selectedItem.fullDetails || selectedItem.description}</p>
                  </div>
                  {selectedItem.tech && (
                    <div className="mb-8">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4537E] mb-3">{T.modalTech}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.tech.map((tech: string) => (
                          <span key={tech} className="px-3 py-1.5 bg-[#F8F7F2] border border-[#D4537E]/20 rounded-full text-[10px] font-bold text-black uppercase tracking-wider">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 pt-5 border-t border-black/5">
                    {selectedItem.github && (
                      <a href={selectedItem.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-[#0D0D0D] text-white rounded-full text-xs font-bold hover:bg-black transition-all hover:scale-105">
                        <Github size={15} /> {T.modalGithub}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
