import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { toast, Toaster } from 'sonner';
import { ExternalLink, Mail, Phone, Linkedin, Github, Heart, MapPin, X, Home, User, Code, Briefcase, FolderOpen, Star, MessageCircle, Award, Download, ChevronDown, ChevronLeft, ChevronRight, Send, Maximize2, Eye, FileText, Images, type LucideIcon } from 'lucide-react';
import profileImg from '../imports/image-1.png';
import heroImg from '../imports/image-0.webp';
import { t, DATA, CERTIFICATIONS, type Lang, type CertificationItem } from './translations';

// image map for projects (by id) — remplace par tes vraies images dans public/projets/
const PROJECT_IMAGES: Record<string, string> = {
  'proj-1': heroImg,
  'proj-2': profileImg,
  'proj-3': heroImg,
  'proj-4': profileImg,
  'proj-5': heroImg,
  'proj-6': profileImg,
  'proj-7': heroImg,
  'proj-8': profileImg,
  'proj-9': heroImg,
  'proj-10': profileImg,
};

// ── IMAGE GALLERY ─────────────────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive((curr) => (curr - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive((curr) => (curr + 1) % images.length);
  };

  return (
    <div className="relative bg-[#141414] border-b border-black/5">
      {/* Main image */}
      <div className="relative h-64 md:h-80 overflow-hidden flex items-center justify-center bg-black/40">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${title} ${active + 1}`}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {/* Prev / Next controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#D4537E] text-white backdrop-blur-sm transition-all cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#D4537E] text-white backdrop-blur-sm transition-all cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-3 right-4 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails scroll strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 px-6 py-3 overflow-x-auto bg-[#0D0D0D]/90 border-t border-white/10">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${i === active ? 'border-[#D4537E] ring-2 ring-[#D4537E]/40 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CV DOWNLOAD BUTTON ────────────────────────────────────────────────────────
function CvDownloadButton({ T }: { T: typeof import('./translations').t['fr'] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
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
              { label: T.cvFr, flag: '🇫🇷', file: '/CV_Ameziane_Oumaima_Software_Engineer.pdf' },
              { label: T.cvEn, flag: '🇬🇧', file: '/Resume_Ameziane_Oumaima_Software_Engineer.pdf' },
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
const EMAILJS_SERVICE_ID  = 'service_xf6wlzq';
const EMAILJS_TEMPLATE_ID = 'template_50yx5ji';
const EMAILJS_PUBLIC_KEY  = 'iMfMME6SkHJDTNTxY';

export default function App() {
  const [lang, setLang] = useState<Lang>('fr');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Certification modal state
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  // PDF Report modal state (experiences & projects)
  const [selectedReport, setSelectedReport] = useState<{
    title: string;
    subtitle: string;
    pdfUrl: string;
    github?: string;
  } | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formStatus !== 'idle') setFormStatus('idle');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      return;
    }
    setIsSending(true);
    setFormStatus('idle');
    const isFr = lang === 'fr';
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.name,
          from_email: formData.email,
          name:       formData.name,
          email:      formData.email,
          subject:    formData.subject || (isFr ? 'Message depuis le portfolio' : 'Message from portfolio'),
          message:    formData.message,

          // Auto-Reply dynamic variables (FR / EN)
          reply_subject: isFr
            ? 'Accusé de réception — Merci pour votre message !'
            : 'Confirmation — Thank you for reaching out!',
          greeting: isFr ? 'Bonjour' : 'Hello',
          reply_body: isFr
            ? "Merci d'avoir pris le temps de me contacter via mon portfolio. J'ai bien reçu votre message et je reviendrai vers vous dans les plus brefs délais."
            : "Thank you for reaching out through my portfolio. I have received your message and will get back to you shortly.",
          signoff: isFr ? 'Bien cordialement' : 'Best regards',
          role: isFr ? 'Élève Ingénieure en Génie Informatique' : 'Computer Engineering Student',
        },
        EMAILJS_PUBLIC_KEY
      );
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormStatus('error');
    } finally {
      setIsSending(false);
    }
  };

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
    hidden: {},
    visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
  };
  const lineVariant = {
    hidden: { y: '110%', opacity: 0, skewY: 4 },
    visible: {
      y: '0%',
      opacity: 1,
      skewY: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
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
    <div className="min-h-screen bg-white w-full">
      <Toaster position="top-center" richColors />

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
          <img src={heroImg} alt="Oumaima Ameziane" className="w-full h-full object-cover object-[65%_30%] md:object-right" fetchPriority="high" />
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
        <div className="absolute bottom-[90px] md:bottom-0 left-0 right-0 z-30 px-5 md:px-10 md:pb-10">
          <motion.h1
            className="text-[36px] md:text-[62px] lg:text-[88px] leading-[0.85] mb-14 md:mb-28 uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, letterSpacing: '-0.03em' }}
            variants={nameContainer}
            initial="hidden"
            animate="visible"
          >
            {nameLines.map((line, li) => (
              <div key={li} className="block overflow-hidden">
                <motion.span
                  className="block"
                  style={{ color: '#D4537E' }}
                  variants={lineVariant}
                >
                  {line}
                </motion.span>
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

            <div className="flex flex-col items-start text-left max-w-3xl mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <div className="flex flex-col items-start gap-2 mb-8">
                  <div className="h-[2px] w-10 bg-[#D4537E]" />
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-[#D4537E]">{T.aboutTag}</span>
                </div>

                {/* Animated title — stagger container */}
                <motion.h2
                  className="text-[36px] md:text-[64px] leading-[1.05] font-black mb-8 tracking-tighter"
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
                    {lang === 'en' ? 'Somewhere between' : 'Entre la'}{' '}
                    <motion.span
                      className="relative inline-block italic text-[#D4537E]"
                      variants={{
                        hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
                      }}
                    >
                      {lang === 'en' ? 'curiosity' : 'curiosité'}
                      <motion.span
                        className="absolute left-0 rounded-full bg-[#D4537E]"
                        style={{ bottom: '-2px', height: '3px', display: 'block' }}
                        initial={{ width: '0%' }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
                      />
                    </motion.span>
                  </span>

                  {/* Line 2 */}
                  <span className="block">
                    <motion.span
                      className="inline-block mr-[0.25em]"
                      variants={{
                        hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
                      }}
                    >
                      {lang === 'en' ? 'and' : 'et la'}
                    </motion.span>
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
                      }}
                    >
                      {lang === 'en' ? 'creation.' : 'création.'}
                    </motion.span>
                  </span>
                </motion.h2>

                {/* CV Download — left aligned with phrase */}
                <motion.div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
                >
                  {/* Phrase */}
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4537E] font-black">
                      {lang === 'en' ? 'My resume' : 'Mon CV'}
                    </span>
                    <p className="text-[#6B6B6B] text-xs md:text-sm font-medium leading-snug max-w-[200px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {T.cvTagline}
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    className="hidden sm:flex items-center text-[#D4537E]/40"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                      <path d="M0 6h28M24 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>

                  {/* Button */}
                  <CvDownloadButton T={T} />
                </motion.div>
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
          {/* Header animé */}
          <motion.div
            className="mb-10 md:mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[32px] md:text-[48px] leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{T.skillsTitle}</h2>
            <motion.div
              className="h-1 bg-[#D4537E] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            />
          </motion.div>

          <div className="space-y-8 md:space-y-10">
            {T.skillsCategories.map(({ label, primary, secondary }, catIdx) => {
              const allSkills = [...primary, ...secondary];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: catIdx * 0.07 }}
                >
                  {/* Category label */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.28em] font-black text-[#0D0D0D]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                    <div className="flex-1 h-px bg-[#D4537E]/15" />
                  </div>

                  {/* Badges — all unified style, stagger in */}
                  <motion.div
                    className="flex gap-2 flex-wrap"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.04, delayChildren: catIdx * 0.07 } },
                    }}
                  >
                    {allSkills.map((s) => {
                      return (
                        <motion.span
                          key={s}
                          className="skill-badge px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold cursor-default select-none bg-white text-[#0D0D0D] border border-black/10"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          variants={{
                            hidden: { opacity: 0, scale: 0.7, y: 10 },
                            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
                          }}
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {s}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                </motion.div>
              );
            })}
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
                <div className="relative grid grid-cols-1 lg:grid-cols-[340px_1fr] bg-gradient-to-br from-[#F5F4EF] to-white rounded-2xl overflow-hidden shadow-lg border border-[#D4537E]/10">
                  {/* Left Column: Header & Direct Report Cover Preview */}
                  <div className="bg-[#D4537E] flex flex-col text-white">
                    <div className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] md:text-xs uppercase tracking-wider mb-2 opacity-90 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.date}</div>
                        <h3 className="text-[20px] md:text-[24px] leading-[1.15] mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{exp.title}</h3>
                        {(exp as any).role && (
                          <div className="text-xs font-semibold text-white/90 mb-2.5 pb-2 border-b border-white/20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {(exp as any).role}
                          </div>
                        )}
                        <div className="text-base md:text-lg font-extrabold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.company}</div>
                        <div className="text-[11px] opacity-80 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{exp.location}</div>
                      </div>
                    </div>


                  </div>

                  {/* Right Column: Mission, Stack, Actions */}
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

                    <div className="flex items-center gap-3 flex-wrap">
                      <motion.button
                        onClick={() => openModal(exp)}
                        className="px-6 py-2.5 bg-[#0D0D0D] text-white rounded-full flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-black transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      >
                        {T.expBtn} <ExternalLink size={13} />
                      </motion.button>

                      {exp.reportPdfUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport({
                              title: exp.title,
                              subtitle: `${exp.company} · ${lang === 'fr' ? 'Rapport de stage' : 'Internship report'}`,
                              pdfUrl: exp.reportPdfUrl,
                              github: exp.github,
                            });
                          }}
                          className="px-4 py-2.5 bg-[#F8F7F2] border border-[#D4537E]/30 text-[#0D0D0D] hover:bg-[#D4537E] hover:text-white rounded-full flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          title={lang === 'fr' ? 'Consulter le rapport complet' : 'View full report'}
                        >
                          <FileText size={13} />
                          {lang === 'fr' ? 'Rapport PDF' : 'PDF Report'}
                        </button>
                      )}
                    </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {(showAllProjects ? PROJECTS : PROJECTS.slice(0, 4)).map((proj, idx) => (
              <motion.div
                key={proj.id}
                className="rounded-2xl overflow-hidden cursor-pointer group bg-white border border-black/5 flex flex-col"
                onClick={() => openModal(proj)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.04 + (idx % 2) * 0.07 }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}
              >
                {/* ── Image zone ── */}
                <div className="relative h-44 md:h-48 w-full overflow-hidden bg-[#141414] flex-shrink-0">
                  {((proj as any).previewImage || (proj.images && proj.images.length > 0)) ? (
                    <img
                      src={(proj as any).previewImage || proj.images[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a1a20] flex items-center justify-center">
                      <span className="text-[#D4537E]/20 text-6xl font-black italic" style={{ fontFamily: "'Playfair Display', serif" }}>{proj.title[0]}</span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* GitHub button — top right of image */}
                  {proj.github && (
                    <motion.a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-[#D4537E] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="GitHub"
                    >
                      <Github size={14} className="text-white" />
                    </motion.a>
                  )}

                  {/* Bottom overlay: category + photo count */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-white/90 font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">{proj.category}</span>
                    {proj.images && proj.images.length > 1 && (
                      <span className="text-[9px] text-white font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <FolderOpen size={10} className="text-[#D4537E]" /> {proj.images.length} photos
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Title + date */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-[18px] md:text-[20px] leading-tight font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{proj.title}</h3>
                    <span className="text-[9px] uppercase tracking-wider text-[#9B9B9B] font-bold flex-shrink-0 mt-1">{proj.date}</span>
                  </div>

                  {/* Description — 2 lines */}
                  <p className="text-[#6B6B6B] text-xs md:text-sm leading-relaxed line-clamp-2 mb-4">{proj.description}</p>

                  {/* Bottom: tech + actions */}
                  <div className="mt-auto">
                    {/* Tech chips — all */}
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {proj.tech.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-[#F8F7F2] text-black/50 border border-black/5">{tech}</span>
                      ))}
                    </div>

                    {/* Action row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {/* Left: voir détails + demo */}
                      <div className="flex items-center gap-2">
                        <div className="text-[#D4537E] flex items-center gap-1.5 text-xs font-bold group-hover:gap-3 transition-all">
                          {T.projBtn} <ExternalLink size={12} />
                        </div>
                        {(proj as any).liveUrl && (
                          <a
                            href={(proj as any).liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4537E] text-white text-[10px] font-bold hover:bg-[#B84368] transition-all"
                          >
                            <ExternalLink size={10} />
                            Demo
                          </a>
                        )}
                      </div>
                      {/* Right: rapport PDF */}
                      {(proj as any).reportPdfUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport({
                              title: proj.title,
                              subtitle: `${proj.category} · ${lang === 'fr' ? 'Rapport' : 'Report'}`,
                              pdfUrl: (proj as any).reportPdfUrl,
                              github: proj.github,
                            });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F7F2] border border-[#D4537E]/20 hover:bg-[#D4537E] hover:text-white hover:border-[#D4537E] text-[#0D0D0D] text-[10px] font-bold transition-all"
                          title={lang === 'fr' ? 'Rapport PDF' : 'PDF Report'}
                        >
                          <FileText size={11} className="text-[#D4537E]" />
                          {lang === 'fr' ? 'Rapport' : 'Report'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton voir plus / voir moins */}
          {PROJECTS.length > 4 && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setShowAllProjects((v) => !v)}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-[#D4537E] text-[#D4537E] font-bold text-sm hover:bg-[#D4537E] hover:text-white transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {showAllProjects
                  ? (lang === 'fr' ? 'Voir moins' : 'Show less')
                  : (lang === 'fr' ? `Voir tous les projets (${PROJECTS.length})` : `View all projects (${PROJECTS.length})`)}
                <motion.span
                  animate={{ rotate: showAllProjects ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>
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
                className="rounded-2xl overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
                onClick={() => openModal(act)}
              >
                <div className="bg-[#F8F7F2] border border-[#D4537E]/15 h-full flex flex-col min-h-[150px] overflow-hidden">
                  {(act as any).previewImage && (
                    <div className="relative h-36 w-full overflow-hidden flex-shrink-0">
                      <img
                        src={(act as any).previewImage}
                        alt={act.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {(act as any).images?.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Images size={9} className="text-[#D4537E]" />{(act as any).images.length}</div>
                      )}
                    </div>
                  )}
                  <div className="p-6 md:p-7 flex flex-col flex-1">
                    <div className="w-8 h-0.5 bg-[#D4537E] mb-4" />
                    <div className="text-[10px] uppercase tracking-wider font-black text-[#D4537E] mb-1">{act.category} · {act.date}</div>
                    <h3 className="text-[18px] md:text-[24px] leading-[1.1] mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{act.title}</h3>
                    <div className="text-xs text-[#D4537E] font-bold mb-2">{act.role}</div>
                    <p className="text-[#6B6B6B] text-xs leading-relaxed">{act.description}</p>
                    {(act as any).instagram && (
                      <a
                        href={(act as any).instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#D4537E] hover:underline"
                      >
                        <ExternalLink size={10} /> Instagram
                      </a>
                    )}
                  </div>
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div
                key={cert.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#D4537E]/15 hover:shadow-xl hover:border-[#D4537E]/40 transition-all flex flex-col cursor-pointer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCert(cert)}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 bg-gradient-to-r ${cert.inProgress ? 'from-amber-500 via-pink-500 to-[#D4537E]' : 'from-[#D4537E] via-[#F48FB1] to-[#D4537E]'}`} />

                {/* PDF Interactive Preview Thumbnail or In-Progress Canvas */}
                <div className="relative h-44 bg-[#0D0D0D] overflow-hidden border-b border-black/5 flex items-center justify-center group-hover:brightness-105 transition-all">
                  {cert.pdfUrl ? (
                    <>
                      <iframe
                        src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={cert.title}
                        className="w-full h-full pointer-events-none opacity-85 scale-100"
                      />
                      {/* Overlay on hover to invite zoom */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all flex items-center justify-center gap-2 text-white">
                        <div className="px-4 py-2 rounded-full bg-[#D4537E] text-xs font-bold flex items-center gap-2 shadow-lg">
                          <Maximize2 size={13} />
                          {lang === 'fr' ? 'Agrandir le certificat' : 'Enlarge certificate'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Award size={24} className="text-[#D4537E]" />
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.2em] font-black text-[#D4537E]">
                        {lang === 'fr' ? 'Formation en cours de complétion' : 'Course in progress'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-7 flex flex-col flex-1">
                  {/* Badge + date row */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-black text-[#D4537E] uppercase tracking-wider px-3 py-1 rounded-full border border-[#D4537E]/20 bg-[#D4537E]/10 flex items-center gap-1.5">
                      <Award size={12} className="text-[#D4537E]" />
                      {cert.badge}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                      cert.inProgress
                        ? 'text-amber-600 bg-amber-500/10 border-amber-500/30'
                        : 'text-[#6B6B6B] border-black/10 bg-[#F8F7F2]'
                    }`}>
                      {cert.date[lang]}
                    </span>
                  </div>

                  {/* Title + issuer */}
                  <h3 className="text-[16px] md:text-[18px] font-black leading-tight mb-1 text-[#0D0D0D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {cert.title}
                  </h3>
                  <div className="text-xs font-bold text-[#D4537E] mb-3">{cert.issuer}</div>

                  {/* Description */}
                  <p className="text-[#6B6B6B] text-xs leading-relaxed flex-1 mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {cert.description[lang]}
                  </p>

                  {/* Action Links */}
                  <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                    {/* Zoom trigger */}
                    {cert.pdfUrl ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCert(cert);
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D0D0D] hover:text-[#D4537E] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <Eye size={13} className="text-[#D4537E]" />
                        {lang === 'fr' ? 'Aperçu' : 'Preview'}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        {lang === 'fr' ? 'En cours' : 'In progress'}
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      {cert.github && (
                        <a
                          href={cert.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D0D0D] hover:text-[#D4537E] transition-colors"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          title="GitHub Repository"
                        >
                          <Github size={13} /> GitHub
                        </a>
                      )}

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4537E] hover:gap-2.5 transition-all"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {T.certVerify} <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
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
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <input
                  type="text" name="name" placeholder={T.contactName} value={formData.name} onChange={handleFormChange} required
                  className="w-full px-4 md:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4537E] outline-none transition-all text-xs md:text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <input
                  type="email" name="email" placeholder={T.contactEmail} value={formData.email} onChange={handleFormChange} required
                  className="w-full px-4 md:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4537E] outline-none transition-all text-xs md:text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <input
                  type="text" name="subject" placeholder={T.contactSubject} value={formData.subject} onChange={handleFormChange}
                  className="w-full px-4 md:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4537E] outline-none transition-all text-xs md:text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <textarea
                  name="message" rows={4} placeholder={T.contactMessage} value={formData.message} onChange={handleFormChange} required
                  className="w-full px-4 md:px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4537E] outline-none resize-none transition-all text-xs md:text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />

                {/* Inline feedback message */}
                <AnimatePresence>
                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 text-white"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Heart size={14} fill="#D4537E" className="text-[#D4537E] flex-shrink-0" />
                      <span className="text-xs md:text-sm font-medium text-white/90">
                        {lang === 'fr'
                          ? 'Message bien reçu, je vous répondrai très bientôt.'
                          : 'Message received, I will get back to you very soon.'}
                      </span>
                    </motion.div>
                  )}
                  {formStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-white"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <span className="text-xs md:text-sm font-medium text-red-200">
                        {lang === 'fr'
                          ? 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
                          : 'An error occurred while sending. Please try again.'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-[#D4537E] text-white uppercase tracking-wider text-xs md:text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  whileHover={isSending ? {} : { scale: 1.015, boxShadow: '0 8px 30px rgba(212,83,126,0.4)' }}
                  whileTap={isSending ? {} : { scale: 0.98 }}
                >
                  {isSending ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Send size={14} />
                      </motion.span>
                      {lang === 'fr' ? 'Envoi…' : 'Sending…'}
                    </>
                  ) : (
                    <>{T.contactSend}</>
                  )}
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
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Panel — full height on desktop, bottom sheet on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full md:max-w-5xl md:max-h-[90vh] max-h-[92vh] bg-white md:rounded-[28px] rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={closeModal} className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/8 hover:bg-black/15 flex items-center justify-center transition-colors">
                <X size={16} />
              </button>

              {/* Header band */}
              <div className="bg-[#0D0D0D] px-6 md:px-10 pt-8 pb-6 flex-shrink-0">
                <div className="flex items-start gap-4">
                  {/* Icon / initial */}
                  <div className="w-12 h-12 rounded-2xl bg-[#D4537E] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {selectedItem.title?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4537E] font-black mb-1">
                      {selectedItem.category || selectedItem.type}
                    </div>
                    <h2 className="text-white text-2xl md:text-3xl font-black leading-tight truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {selectedItem.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {selectedItem.company && (
                        <span className="text-[#D4537E] text-xs font-bold">{selectedItem.company}</span>
                      )}
                      {(selectedItem.date || selectedItem.location) && (
                        <span className="text-white/40 text-xs">
                          {selectedItem.date}{selectedItem.location ? ` · ${selectedItem.location}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto">
                {/* Image gallery — shows if images exist */}
                {selectedItem.images && selectedItem.images.length > 0 && (
                  <ImageGallery images={selectedItem.images} title={selectedItem.title} />
                )}

                {/* Content */}
                <div className="px-6 md:px-10 py-7 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
                  {/* Left: description — formatted */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] font-black text-[#D4537E] mb-4">{T.modalDetails}</h3>
                    <div className="space-y-3 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {(selectedItem.fullDetails || selectedItem.description).split('\n').map((line: string, i: number) => {
                        if (!line.trim()) return <div key={i} className="h-1" />;
                        if (line.startsWith('•')) return (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="text-[#D4537E] font-black mt-0.5 flex-shrink-0">•</span>
                            <span className="text-[#4A4A4A] leading-relaxed">{line.slice(1).trim()}</span>
                          </div>
                        );
                        if (line.endsWith(':') || (line.length < 60 && line === line.toUpperCase())) return (
                          <p key={i} className="text-[10px] uppercase tracking-[0.2em] font-black text-[#D4537E] pt-2">{line}</p>
                        );
                        if (/^[A-Z\u00C0-\u00DC].{0,40}:$/.test(line) || /^(Problématique|Problematique|Problem|Solution|Description|Poste|Role|Entreprise|Company|Période|Period|Stack|Projet|Project)\s*:?/i.test(line)) return (
                          <p key={i} className="font-bold text-[#0D0D0D] mt-3 text-[13px] uppercase tracking-wider text-[#D4537E]">{line}</p>
                        );
                        return <p key={i} className="text-[#4A4A4A] leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Right: tech + link */}
                  <div className="flex flex-col gap-6">
                    {/* Tech stack */}
                    {selectedItem.tech && selectedItem.tech.length > 0 && (
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] font-black text-[#D4537E] mb-3">{T.modalTech}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedItem.tech.map((tech: string) => (
                            <motion.span
                              key={tech}
                              className="px-3 py-1.5 bg-[#F8F7F2] border border-[#D4537E]/20 rounded-full text-[10px] font-bold text-[#0D0D0D] uppercase tracking-wider"
                              whileHover={{ scale: 1.05, backgroundColor: '#D4537E', color: '#fff', borderColor: '#D4537E' }}
                              transition={{ duration: 0.15 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Report PDF section */}
                    {selectedItem.reportPdfUrl && (
                      <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#D4537E]/25">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-[#D4537E]" />
                            <h4 className="text-xs uppercase tracking-[0.2em] font-black text-[#0D0D0D]">
                              {selectedItem.type === 'experience'
                                ? (lang === 'fr' ? 'Rapport de stage' : 'Internship report')
                                : (lang === 'fr' ? 'Rapport de projet' : 'Project report')}
                            </h4>
                          </div>
                          <a
                            href={selectedItem.reportPdfUrl}
                            download
                            className="p-1.5 rounded-lg bg-white border border-[#D4537E]/30 text-[#D4537E] hover:bg-[#D4537E] hover:text-white transition-colors"
                            title={lang === 'fr' ? 'Télécharger le rapport' : 'Download report'}
                          >
                            <Download size={13} />
                          </a>
                        </div>
                        <div
                          onClick={() => setSelectedReport({
                            title: selectedItem.title,
                            subtitle: `${selectedItem.type === 'experience' ? selectedItem.company : selectedItem.category} · ${selectedItem.type === 'experience' ? (lang === 'fr' ? 'Rapport de stage' : 'Internship report') : (lang === 'fr' ? 'Rapport de projet' : 'Project report')}`,
                            pdfUrl: selectedItem.reportPdfUrl,
                            github: selectedItem.github,
                          })}
                          className="relative h-44 rounded-xl overflow-hidden bg-black/5 border border-black/10 cursor-pointer group/report"
                        >
                          <iframe
                            src={`${selectedItem.reportPdfUrl}#page=1&toolbar=0&navpanes=0&view=FitH`}
                            title="Aperçu rapport"
                            className="w-full h-full border-0 pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/report:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                            <div className="px-3 py-1.5 rounded-full bg-[#D4537E] text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                              <Maximize2 size={12} />
                              {lang === 'fr' ? 'Aperçu plein écran' : 'Fullscreen preview'}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedReport({
                            title: selectedItem.title,
                            subtitle: `${selectedItem.type === 'experience' ? selectedItem.company : selectedItem.category} · ${selectedItem.type === 'experience' ? (lang === 'fr' ? 'Rapport de stage' : 'Internship report') : (lang === 'fr' ? 'Rapport de projet' : 'Project report')}`,
                            pdfUrl: selectedItem.reportPdfUrl,
                            github: selectedItem.github,
                          })}
                          className="mt-3 w-full py-2 px-3 rounded-xl bg-[#0D0D0D] hover:bg-[#D4537E] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <Maximize2 size={12} />
                          {lang === 'fr' ? 'Aperçu plein écran' : 'Fullscreen preview'}
                        </button>
                      </div>
                    )}

                    {/* GitHub link */}
                    {selectedItem.github && (
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] font-black text-[#D4537E] mb-3">REPOSITORY</h4>
                        <motion.a
                          href={selectedItem.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl border border-black/8 hover:border-[#D4537E]/40 hover:bg-[#F8F7F2] transition-all group"
                          whileHover={{ x: 3 }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
                            <Github size={14} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#0D0D0D] truncate">{selectedItem.github.replace('https://github.com/', '')}</div>
                            <div className="text-[10px] text-[#9B9B9B]">github.com</div>
                          </div>
                          <ExternalLink size={12} className="ml-auto text-[#D4537E] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </motion.a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Report Zoom Lightbox Modal (Experiences & Projects) */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
            />

            <motion.div
              className="relative w-full max-w-5xl h-[88vh] bg-[#141414] rounded-2xl md:rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-[#D4537E]/20 border border-[#D4537E]/40 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#D4537E]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-sm md:text-base font-bold truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {selectedReport.title}
                    </h3>
                    <p className="text-white/50 text-xs truncate">
                      {selectedReport.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedReport.github && (
                    <a
                      href={selectedReport.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Github size={12} />
                      GitHub
                    </a>
                  )}

                  <a
                    href={selectedReport.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4537E] text-white text-xs font-bold hover:bg-[#b84368] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {lang === 'fr' ? 'Ouvrir' : 'Open'} <ExternalLink size={12} />
                  </a>

                  <a
                    href={selectedReport.pdfUrl}
                    download
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title={lang === 'fr' ? 'Télécharger le rapport' : 'Download report'}
                  >
                    <Download size={16} />
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-[#D4537E] text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer Body */}
              <div className="flex-1 w-full bg-[#0D0D0D] relative">
                <iframe
                  src={`${selectedReport.pdfUrl}#toolbar=1&navpanes=0&view=Fit`}
                  title={selectedReport.title}
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Certification Zoom Lightbox Modal */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
            />

            {/* Modal Box */}
            <motion.div
              className="relative w-full max-w-5xl h-[88vh] bg-[#141414] rounded-2xl md:rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-[#D4537E]/20 border border-[#D4537E]/40 flex items-center justify-center flex-shrink-0">
                    <Award size={18} className="text-[#D4537E]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-sm md:text-base font-bold truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {selectedCert.title}
                    </h3>
                    <p className="text-white/50 text-xs truncate">
                      {selectedCert.issuer} · {selectedCert.date[lang]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Direct verification link */}
                  {selectedCert.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4537E] text-white text-xs font-bold hover:bg-[#b84368] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {T.certVerify} <ExternalLink size={12} />
                    </a>
                  )}

                  {/* Download PDF button */}
                  <a
                    href={selectedCert.pdfUrl}
                    download
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title={lang === 'fr' ? 'Télécharger le PDF' : 'Download PDF'}
                  >
                    <Download size={16} />
                  </a>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-[#D4537E] text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer Body */}
              <div className="flex-1 w-full bg-[#0D0D0D] relative">
                <iframe
                  src={`${selectedCert.pdfUrl}#toolbar=1&navpanes=0&view=Fit`}
                  title={selectedCert.title}
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
