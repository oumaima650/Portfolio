import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Download, ExternalLink, Mail, Phone, Linkedin, Github, GraduationCap, Globe, Heart, MapPin } from 'lucide-react';
import profileImg from '../imports/image-1.png';
import heroImg from '../imports/image-0.png';

export default function App() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(1);
  const [activeSection, setActiveSection] = useState('home');
  const heroRef = useRef<HTMLDivElement>(null);

  // Intro animation sequence
  useEffect(() => {
    // Step 1: Show monogram (0s to 1.5s)
    const step2Timer = setTimeout(() => {
      setIntroStep(2); // Expand to full name
    }, 1500);

    // Step 2 to 3: Start transition (2.5s)
    const step3Timer = setTimeout(() => {
      setIntroStep(3); // Begin transition
    }, 2500);

    // Step 3 to 4: Hide intro, show hero (3.5s)
    const hideIntroTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(hideIntroTimer);
    };
  }, []);

  // Detect active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Detect when middle of section passes middle of screen
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'activities', 'contact'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  // Split name into letters for animation
  const nameLines = ['OUMAIMA', 'AMEZIANE'];

  // Container variants for stagger
  const nameContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      }
    }
  };

  const letterVariant = {
    hidden: {
      y: 100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Intro animation variants
  const fullName = 'OUMAIMA AMEZIANE';
  const monogramVariants = {
    initial: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fullNameContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0
      }
    }
  };

  const fullNameLetterVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* INTRO SCREEN */}
      {showIntro && (
        <motion.div
          className="fixed inset-0 bg-black z-[9998] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: introStep === 3 ? 0 : 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Step 1: Monogram */}
          {introStep === 1 && (
            <motion.div
              className="flex gap-4"
              variants={monogramVariants}
              initial="initial"
              animate="visible"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900 }}
            >
              <span className="text-[120px] leading-none" style={{ color: '#FF2D9B' }}>O</span>
              <span className="text-[120px] leading-none" style={{ color: '#FF2D9B' }}>A</span>
            </motion.div>
          )}

          {/* Step 2: Expanded full name */}
          {introStep >= 2 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex justify-center gap-1 flex-wrap px-4"
                variants={fullNameContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {fullName.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    className="text-[60px] md:text-[80px] leading-none"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 900,
                      color: '#FF2D9B',
                    }}
                    variants={fullNameLetterVariants}
                  >
                    {letter === ' ' ? '\u00A0\u00A0\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* FRAME 1: FULL-SCREEN HERO SECTION */}
      <motion.section
        id="home"
        ref={heroRef}
        className="relative h-screen bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >


        {/* Full-Screen Background Image with Zoom Animation and Parallax - Positioned Right */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: showIntro ? 1.05 : 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: showIntro ? 0 : 0.5 }}
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <img
            src={heroImg}
            alt="Oumaima Ameziane"
            className="w-full h-full object-cover object-[65%_30%] md:object-right scale-75 md:scale-100"
          />
        </motion.div>

        {/* Top Left Text Stack - Job Title and Tagline - After intro */}
        <motion.div
          className="absolute top-6 md:top-8 left-6 md:left-12 z-30 flex flex-col gap-2"
          initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
          animate={{ opacity: showIntro ? 0 : 1, x: showIntro ? -30 : 0, filter: showIntro ? "blur(8px)" : "blur(0px)" }}
          transition={{ duration: 0.8, delay: showIntro ? 0 : 1.2 }}
        >
          <h2
            className="text-white text-sm md:text-base tracking-wider"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            COMPUTER ENGINEER
          </h2>
          <p
            className="text-white/90 text-[13px] md:text-sm leading-relaxed max-w-[160px] md:max-w-[280px] md:hidden"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Every idea deserves a solution—I build the bridge between the two.
          </p>
        </motion.div>

        {/* Top Right Tagline - Desktop Only - After intro */}
        <motion.div
          className="hidden md:block absolute top-6 md:top-12 right-6 md:right-12 z-30 max-w-[200px] md:max-w-[280px]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: showIntro ? 0 : 1, x: showIntro ? 30 : 0 }}
          transition={{ duration: 0.8, delay: showIntro ? 0 : 1.4 }}
        >
          <p
            className="text-white/90 text-xs md:text-sm leading-relaxed text-right"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Every idea deserves a solution—I build the bridge between the two.
          </p>
        </motion.div>

        {/* Bottom Hero Content */}
        <div className="absolute bottom-[100px] md:bottom-0 left-0 right-0 z-30 px-5 md:px-12 md:pb-8 md:pb-12 overflow-hidden">
          {/* Bold Name Headline - Letter by Letter Animation with Glow Pulse */}
          <motion.h1
            className="text-[48px] md:text-[80px] lg:text-[120px] leading-[0.85] mb-24 md:mb-48 uppercase relative max-w-full"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
            variants={nameContainer}
            initial="hidden"
            animate={showIntro ? "hidden" : "visible"}
          >
            {nameLines.map((line, lineIndex) => (
              <div key={lineIndex} className="block">
                {line.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${lineIndex}-${letterIndex}`}
                    className="inline-block"
                    style={{
                      color: '#D4537E',
                    }}
                    variants={letterVariant}
                    whileHover={{
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            ))}
            {/* Pulsing Glow Effect */}
            <motion.div
              className="absolute inset-0 -z-10"
              style={{
                textShadow: '0 0 40px rgba(212, 83, 126, 0.6), 0 0 80px rgba(212, 83, 126, 0.4)',
                color: '#D4537E',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {nameLines.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </motion.div>
          </motion.h1>

          {/* Navigation Bar - Bottom Positioned */}
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
            transition={{ duration: 0.8, delay: showIntro ? 0 : 0.8 }}
          >
            <motion.nav
              className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}
            >
              {[
                { label: 'HOME', id: 'home' },
                { label: 'ABOUT', id: 'about' },
                { label: 'SKILLS', id: 'skills' },
                { label: 'EXPERIENCE', id: 'experience' },
                { label: 'PROJECTS', id: 'projects' },
                { label: 'ACTIVITIES', id: 'activities' },
                { label: 'CONTACT', id: 'contact' },
              ].map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-3 md:px-5 py-2 rounded-full text-[10px] md:text-[11px] uppercase tracking-wider transition-all relative group ${
                    activeSection === link.id 
                      ? 'bg-[#D4537E] text-white shadow-[0_0_15px_rgba(212,83,126,0.5)]' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        </div>
      </motion.section>

      {/* WHO I AM SECTION */}
      <motion.section
        className="relative py-16 md:py-24 bg-[#F5F4EF] overflow-x-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Section Header */}
            <div className="mb-12 md:mb-16">
              <div className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                WHO I AM
              </div>
              <div className="w-16 md:w-20 h-1 bg-[#D4537E] mb-6" />
              <h2
                className="text-[48px] md:text-[72px] leading-none"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
              >
                About Me
              </h2>
            </div>

            {/* Three Cards Grid - Staggered Pop-up Animation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1: Engineering Student */}
              <motion.div
                className="bg-white p-8 md:p-10 rounded-3xl border border-[#D4537E]/10 hover:border-[#D4537E]/30 transition-all"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(212, 83, 126, 0.1)' }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#D4537E]/10 flex items-center justify-center mb-6">
                  <GraduationCap size={28} className="text-[#D4537E] md:w-8 md:h-8" />
                </div>
                <h3
                  className="text-[24px] md:text-[28px] leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                >
                  Engineering Student
                </h3>
                <p className="text-[#6B6B6B] leading-relaxed text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  4th year Computer Engineering at ENSA Tétouan, building a strong foundation in software development and systems design.
                </p>
              </motion.div>

              {/* Card 2: Multilingual */}
              <motion.div
                className="bg-white p-8 md:p-10 rounded-3xl border border-[#D4537E]/10 hover:border-[#D4537E]/30 transition-all"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(212, 83, 126, 0.1)' }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#D4537E]/10 flex items-center justify-center mb-6">
                  <Globe size={28} className="text-[#D4537E] md:w-8 md:h-8" />
                </div>
                <h3
                  className="text-[24px] md:text-[28px] leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                >
                  Multilingual
                </h3>
                <p className="text-[#6B6B6B] leading-relaxed text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Arabic (Native), French (DELF B2), English (B2) — comfortable working in multicultural environments.
                </p>
              </motion.div>

              {/* Card 3: Passionate & Driven */}
              <motion.div
                className="bg-white p-8 md:p-10 rounded-3xl border-2 border-[#D4537E]"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(212, 83, 126, 0.2)' }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#D4537E] flex items-center justify-center mb-6">
                  <Heart size={28} className="text-white md:w-8 md:h-8" fill="white" />
                </div>
                <h3
                  className="text-[24px] md:text-[28px] leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                >
                  Passionate & Driven
                </h3>
                <p className="text-[#6B6B6B] leading-relaxed text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Seeking a PFA internship to apply technical skills in real-world projects and contribute to innovative solutions.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FRAME 2: ABOUT SECTION */}
      <motion.section
        id="about"
        className="relative py-16 md:py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 md:gap-16 items-center">
            {/* Left column - Slide in from left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2
                className="text-[40px] md:text-[64px] leading-[1.1] mb-6 md:mb-8 italic"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#0D0D0D'
                }}
              >
                "Passionate about code,
                <br />
                design & impact."
              </h2>

              <div className="flex gap-3 flex-wrap mb-8 md:mb-12">
                {['Creative Problem Solver', 'Team Collaborator', 'Continuous Learner'].map((skill) => (
                  <div
                    key={skill}
                    className="px-4 md:px-5 py-2 rounded-full bg-[#F0EEE8] border border-[#D4537E]/20"
                  >
                    <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#0D0D0D' }}>
                      {skill}
                    </span>
                  </div>
                ))}
              </div>

              {/* Education Timeline */}
              <div className="space-y-6">
                <h3 className="text-xs md:text-sm uppercase tracking-wider mb-6" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                  Education
                </h3>

                <div className="relative pl-6 md:pl-8 border-l-2 border-[#D4537E]/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#D4537E]" />
                  <div className="mb-1 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                    ENSA Tétouan
                  </div>
                  <div className="text-xs md:text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B' }}>
                    Computer Engineering
                  </div>
                  <div className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                    2022 – Present
                  </div>
                </div>

                <div className="relative pl-6 md:pl-8 border-l-2 border-[#D4537E]/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#D4537E]/50" />
                  <div className="mb-1 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                    Lycée Charif Idrissi
                  </div>
                  <div className="text-xs md:text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B6B6B' }}>
                    Baccalauréat
                  </div>
                  <div className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                    2022
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column - Photo - Slide in from right */}
            <motion.div
              className="relative order-first lg:order-last"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                {/* Decorative border */}
                <div className="absolute -inset-4 border-2 border-[#D4537E] rounded-3xl rotate-3" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={profileImg}
                    alt="Oumaima Ameziane"
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FRAME 3: SKILLS SECTION */}
      <motion.section
        id="skills"
        className="relative py-16 md:py-24 bg-[#F0EEE8] overflow-x-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-8 md:mb-12">
              <h2
                className="text-[40px] md:text-[56px] leading-none mb-2 inline-block"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                Technical Skills
              </h2>
              <div className="w-24 md:w-32 h-1 bg-[#D4537E]" />
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Frontend */}
              <div>
                <h3 className="text-xs md:text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#0D0D0D' }}>
                  Frontend Development
                </h3>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {['React', 'TypeScript', 'Next.js'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full bg-[#D4537E] text-white"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                  {['Tailwind CSS', 'Vue.js', 'HTML/CSS'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full border-2 border-[#D4537E] bg-transparent"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#0D0D0D' }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <h3 className="text-xs md:text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#0D0D0D' }}>
                  Backend Development
                </h3>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {['Node.js', 'Python', 'Java'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full bg-[#D4537E] text-white"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                  {['Express', 'Django', 'Spring Boot'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full border-2 border-[#D4537E] bg-transparent"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#0D0D0D' }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database */}
              <div>
                <h3 className="text-xs md:text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#0D0D0D' }}>
                  Databases
                </h3>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {['PostgreSQL', 'MongoDB'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full bg-[#D4537E] text-white"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                  {['MySQL', 'Redis', 'Firebase'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full border-2 border-[#D4537E] bg-transparent"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#0D0D0D' }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DevOps & Tools */}
              <div>
                <h3 className="text-xs md:text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#0D0D0D' }}>
                  DevOps & Tools
                </h3>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {['Git', 'Docker'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full bg-[#D4537E] text-white"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                  {['CI/CD', 'AWS', 'Linux'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full border-2 border-[#D4537E] bg-transparent"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#0D0D0D' }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design */}
              <div>
                <h3 className="text-xs md:text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#0D0D0D' }}>
                  Design & Tools
                </h3>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {['Figma', 'UI/UX'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full bg-[#D4537E] text-white"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                  {['Adobe XD', 'Responsive Design'].map((skill) => (
                    <div
                      key={skill}
                      className="px-4 md:px-5 py-2 rounded-full border-2 border-[#D4537E] bg-transparent"
                    >
                      <span className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#0D0D0D' }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* EXPERIENCE SECTION */}
      <motion.section
        id="experience"
        className="relative py-20 md:py-32 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
              <div>
                <div className="text-xs md:text-sm uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                  PROFESSIONAL JOURNEY
                </div>
                <h2
                  className="text-[48px] md:text-[72px] leading-none"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
                >
                  Experience
                </h2>
              </div>
              <div className="hidden md:block w-48 lg:w-64 h-1 bg-[#D4537E] mb-4" />
            </div>

            {/* Experience Card - Large Format */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Giant background number */}
              <div
                className="absolute -top-8 md:-top-16 -left-4 md:-left-8 text-[180px] md:text-[280px] leading-none opacity-[0.03] select-none pointer-events-none"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
              >
                01
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-[35%_65%] gap-0 bg-gradient-to-br from-[#F5F4EF] to-white rounded-3xl overflow-hidden shadow-2xl border border-[#D4537E]/10">
                {/* Left Panel - Pink Accent */}
                <div className="bg-[#D4537E] p-8 md:p-12 flex flex-col justify-between text-white">
                  <div>
                    <div className="text-xs md:text-sm uppercase tracking-wider mb-6 opacity-90" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      Summer 2025
                    </div>
                    <h3
                      className="text-[32px] md:text-[42px] leading-[1.1] mb-4"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                    >
                      Software Development Intern
                    </h3>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl mb-2" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                      AGILE SQUARE
                    </div>
                    <div className="text-xs md:text-sm opacity-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Technology Consulting Firm
                    </div>
                  </div>
                </div>

                {/* Right Panel - Description */}
                <div className="p-8 md:p-12">
                  <div className="mb-6 md:mb-8">
                    <h4 className="text-lg md:text-xl mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                      Key Contributions
                    </h4>
                    <ul className="space-y-3 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif", color: '#0D0D0D' }}>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D4537E] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Developed and maintained full-stack web applications using React, Node.js, and PostgreSQL
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D4537E] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Collaborated with cross-functional teams in agile environment to deliver features on schedule
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D4537E] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Implemented responsive UI components following modern design systems and accessibility standards
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D4537E] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">
                          Participated in code reviews and contributed to improving development workflows
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs md:text-sm uppercase tracking-wider mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                      Technologies Used
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Git', 'Agile'].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-full border-2 border-[#D4537E]/30 bg-white"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section
        id="projects"
        className="relative py-20 md:py-32 bg-[#0F172A]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <div className="text-xs md:text-sm uppercase tracking-[0.3em] mb-4 text-[#D4537E]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                SELECTED WORK
              </div>
              <h2
                className="text-[48px] md:text-[80px] leading-none text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
              >
                Featured Projects
              </h2>
              <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                A curated collection of projects showcasing technical skills and creative problem-solving
              </p>
            </div>

            {/* Projects Grid - Asymmetric Layout */}
            <div className="space-y-6 md:space-y-8">
              {/* Project 1 - Large Featured */}
              <motion.div
                className="relative rounded-3xl overflow-hidden cursor-pointer group"
                onMouseEnter={() => setHoveredProject(0)}
                onMouseLeave={() => setHoveredProject(null)}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative bg-gradient-to-br from-[#D4537E] to-[#B84368] p-8 md:p-12 min-h-[350px] md:min-h-[400px] flex items-end">
                  {/* Decorative pattern */}
                  <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-black/10 rounded-full blur-3xl" />

                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 md:gap-12">
                    <div>
                      <div className="inline-block px-3 md:px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4 md:mb-6">
                        <span className="text-xs md:text-sm text-white" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                          Featured Project
                        </span>
                      </div>
                      <h3
                        className="text-[36px] md:text-[56px] leading-[1.1] mb-4 text-white"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                      >
                        E-Commerce Platform
                      </h3>
                      <p className="text-white/90 text-sm md:text-lg leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        A comprehensive full-stack e-commerce solution featuring user authentication,
                        dynamic product catalog, shopping cart functionality, and secure payment integration
                        with Stripe. Built with modern web technologies and responsive design principles.
                      </p>
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="mb-6">
                        <div className="text-xs md:text-sm uppercase tracking-wider text-white/70 mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                          Tech Stack
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind'].map((tech) => (
                            <span
                              key={tech}
                              className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <motion.button
                        className="self-start px-5 md:px-6 py-2 md:py-3 bg-white text-[#D4537E] rounded-full flex items-center gap-2 text-sm md:text-base"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                        <ExternalLink size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Projects 2 & 3 - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Project 2 */}
                <motion.div
                  className="rounded-3xl overflow-hidden cursor-pointer group"
                  onMouseEnter={() => setHoveredProject(1)}
                  onMouseLeave={() => setHoveredProject(null)}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="bg-white p-6 md:p-8 min-h-[320px] md:min-h-[380px] flex flex-col">
                    <div className="mb-4">
                      <div className="w-12 md:w-16 h-1 bg-[#8B5CF6] mb-6" />
                      <h3
                        className="text-[28px] md:text-[36px] leading-[1.1] mb-4"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                      >
                        Task Management System
                      </h3>
                      <p className="text-[#6B6B6B] leading-relaxed mb-6 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Real-time collaborative task management application with team features,
                        live updates via WebSocket, and intuitive drag-and-drop interface.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex gap-2 flex-wrap mb-6">
                        {['Vue.js', 'Firebase', 'Tailwind', 'WebSocket'].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 md:px-3 py-1 text-xs rounded-full bg-[#F0EEE8] border border-[#8B5CF6]/20"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <motion.button
                        className="text-[#8B5CF6] flex items-center gap-2 text-sm md:text-base"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                        whileHover={{ gap: '12px' }}
                      >
                        Learn More
                        <ExternalLink size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Project 3 */}
                <motion.div
                  className="rounded-3xl overflow-hidden cursor-pointer group"
                  onMouseEnter={() => setHoveredProject(2)}
                  onMouseLeave={() => setHoveredProject(null)}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="bg-gradient-to-br from-[#F5F4EF] to-white p-6 md:p-8 min-h-[320px] md:min-h-[380px] flex flex-col border-2 border-[#D4537E]/20">
                    <div className="mb-4">
                      <div className="w-12 md:w-16 h-1 bg-[#D4537E] mb-6" />
                      <h3
                        className="text-[28px] md:text-[36px] leading-[1.1] mb-4"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                      >
                        Portfolio Website
                      </h3>
                      <p className="text-[#6B6B6B] leading-relaxed mb-6 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Modern, responsive portfolio website with smooth animations,
                        dark/light mode toggle, and optimized performance.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex gap-2 flex-wrap mb-6">
                        {['React', 'Motion', 'TypeScript', 'Vite'].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 md:px-3 py-1 text-xs rounded-full bg-white border border-[#D4537E]/30"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <motion.button
                        className="text-[#D4537E] flex items-center gap-2 text-sm md:text-base"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                        whileHover={{ gap: '12px' }}
                      >
                        Learn More
                        <ExternalLink size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* EXTRACURRICULAR ACTIVITIES SECTION */}
      <motion.section
        id="activities"
        className="relative py-20 md:py-32 bg-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1 }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#D4537E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-[#F0EEE8] rounded-full blur-3xl" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="mb-16 md:mb-20">
              <div className="text-xs md:text-sm uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                BEYOND THE CODE
              </div>
              <h2
                className="text-[48px] md:text-[72px] leading-none mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
              >
                Extracurricular
                <br />
                Activities
              </h2>
              <p className="text-[#6B6B6B] text-sm md:text-lg max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Actively engaged in student life, community initiatives, and continuous learning opportunities
              </p>
            </div>

            {/* Activities Grid - Magazine Style Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              {/* Large Feature Card - Tech Club */}
              <motion.div
                className="md:col-span-7 md:row-span-2 rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative bg-gradient-to-br from-[#D4537E] to-[#B84368] p-8 md:p-12 h-full min-h-[350px] md:min-h-[400px] flex flex-col justify-between text-white overflow-hidden">
                  {/* Decorative number */}
                  <div className="absolute top-8 right-8 text-[120px] md:text-[180px] leading-none opacity-5 select-none" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
                    01
                  </div>
                  <div className="relative z-10">
                    <div className="inline-block px-3 md:px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                      <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        2023 - Present
                      </span>
                    </div>
                    <h3
                      className="text-[36px] md:text-[48px] leading-[1.1] mb-4"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                    >
                      Tech Club
                    </h3>
                    <div className="text-lg md:text-xl mb-6 opacity-90" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      Active Member
                    </div>
                    <p className="text-white/80 leading-relaxed max-w-md text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Contributing to technical workshops, peer coding sessions, and organizing tech talks
                      with industry professionals. Mentoring junior students in web development.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Hackathon Card */}
              <motion.div
                className="md:col-span-5 rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="bg-white border-2 border-[#D4537E]/20 p-6 md:p-8 h-full flex flex-col min-h-[200px]">
                  <div className="w-10 md:w-12 h-1 bg-[#D4537E] mb-6" />
                  <div className="mb-2 text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                    2024
                  </div>
                  <h3
                    className="text-[24px] md:text-[32px] leading-[1.1] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                  >
                    Hackathon Participant
                  </h3>
                  <p className="text-[#6B6B6B] text-xs md:text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Competed in 24-hour coding challenges, building innovative solutions under pressure
                  </p>
                </div>
              </motion.div>

              {/* Community Outreach Card */}
              <motion.div
                className="md:col-span-5 rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="bg-gradient-to-br from-[#F5F4EF] to-[#F0EEE8] p-6 md:p-8 h-full flex flex-col border border-[#D4537E]/10 min-h-[200px]">
                  <div className="w-10 md:w-12 h-1 bg-[#D4537E] mb-6" />
                  <div className="mb-2 text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                    2023 - Present
                  </div>
                  <h3
                    className="text-[24px] md:text-[32px] leading-[1.1] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                  >
                    Community Volunteer
                  </h3>
                  <p className="text-[#6B6B6B] text-xs md:text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Teaching basic coding skills to underserved youth in local community centers
                  </p>
                </div>
              </motion.div>

              {/* Student Council Card */}
              <motion.div
                className="md:col-span-7 rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -6 }}
              >
                <div className="bg-[#0F172A] p-8 md:p-10 h-full flex items-center justify-between text-white relative overflow-hidden min-h-[180px]">
                  <div className="absolute -right-12 -top-12 w-48 md:w-64 h-48 md:h-64 bg-[#D4537E]/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="mb-3 text-xs uppercase tracking-wider text-[#D4537E]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      2024 - Present
                    </div>
                    <h3
                      className="text-[28px] md:text-[40px] leading-[1.1] mb-3"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                    >
                      Student Council Representative
                    </h3>
                    <p className="text-white/70 leading-relaxed max-w-md text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Representing engineering students, organizing events, and bridging communication between students and faculty
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Additional Activities - Small Cards */}
              <motion.div
                className="md:col-span-3 rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-white border-2 border-[#D4537E] p-6 h-full flex flex-col justify-center text-center min-h-[150px]">
                  <div className="w-8 h-1 bg-[#D4537E] mb-4 mx-auto" />
                  <h4 className="text-base md:text-lg mb-1" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                    Study Groups
                  </h4>
                  <p className="text-xs text-[#6B6B6B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Organizer
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-2 rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ rotate: 3, scale: 1.05 }}
              >
                <div className="bg-[#D4537E] p-6 h-full flex flex-col justify-center items-center text-center text-white min-h-[150px]">
                  <div className="w-8 h-1 bg-white/50 mb-3" />
                  <h4 className="text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                    Innovation Lab
                  </h4>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FRAME 6: CONTACT / FOOTER */}
      <motion.section
        id="contact"
        className="relative py-20 md:py-32 bg-[#0F172A]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="mb-12 md:mb-16">
              <div className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                GET IN TOUCH
              </div>
              <div className="w-16 md:w-20 h-1 bg-[#D4537E] mb-6" />
              <h2
                className="text-[48px] md:text-[72px] leading-none text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900
                }}
              >
                Let's Connect
              </h2>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 md:gap-16">
              {/* Left: Contact Info */}
              <div>
                <p className="text-white/70 text-sm md:text-lg mb-10 md:mb-12 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  I'm currently looking for a PFA internship. Feel free to reach out if you'd like to collaborate or have an opportunity!
                </p>

                <div className="space-y-4 md:space-y-6">
                  {/* Email */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 flex items-center justify-center group-hover:bg-[#D4537E] transition-all flex-shrink-0">
                      <Mail size={18} className="text-[#D4537E] group-hover:text-white transition-colors md:w-5 md:h-5" />
                    </div>
                    <a
                      href="mailto:oumaima.ameziane@etu.uae.ac.ma"
                      className="text-white/80 hover:text-[#D4537E] transition-colors text-sm md:text-base break-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      oumaima.ameziane@etu.uae.ac.ma
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 flex items-center justify-center group-hover:bg-[#D4537E] transition-all flex-shrink-0">
                      <Phone size={18} className="text-[#D4537E] group-hover:text-white transition-colors md:w-5 md:h-5" />
                    </div>
                    <a
                      href="tel:+212621811707"
                      className="text-white/80 hover:text-[#D4537E] transition-colors text-sm md:text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      +212 621 811 707
                    </a>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 flex items-center justify-center group-hover:bg-[#D4537E] transition-all flex-shrink-0">
                      <MapPin size={18} className="text-[#D4537E] group-hover:text-white transition-colors md:w-5 md:h-5" />
                    </div>
                    <span className="text-white/80 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      ENSA Tétouan, Maroc
                    </span>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 flex items-center justify-center group-hover:bg-[#D4537E] transition-all flex-shrink-0">
                      <Linkedin size={18} className="text-[#D4537E] group-hover:text-white transition-colors md:w-5 md:h-5" />
                    </div>
                    <a
                      href="#"
                      className="text-white/80 hover:text-[#D4537E] transition-colors text-sm md:text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      LinkedIn
                    </a>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4537E]/10 border border-[#D4537E]/30 flex items-center justify-center group-hover:bg-[#D4537E] transition-all flex-shrink-0">
                      <Github size={18} className="text-[#D4537E] group-hover:text-white transition-colors md:w-5 md:h-5" />
                    </div>
                    <a
                      href="#"
                      className="text-white/80 hover:text-[#D4537E] transition-colors text-sm md:text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      GitHub — oumaima650
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div>
                <form className="space-y-5 md:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-5 md:px-6 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4537E] focus:bg-white/10 outline-none transition-all text-sm md:text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-5 md:px-6 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4537E] focus:bg-white/10 outline-none transition-all text-sm md:text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <textarea
                      rows={5}
                      placeholder="Your Message"
                      className="w-full px-5 md:px-6 py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4537E] focus:bg-white/10 outline-none resize-none transition-all text-sm md:text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full py-3 md:py-4 rounded-xl bg-[#D4537E] text-white uppercase tracking-wider text-sm md:text-base"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(212, 83, 126, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(212, 83, 126, 0)',
                        '0 0 0 8px rgba(212, 83, 126, 0.2)',
                        '0 0 0 0 rgba(212, 83, 126, 0)',
                      ],
                    }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 md:mt-20 pt-6 md:pt-8 border-t border-white/10 text-center">
              <p className="text-white/50 text-xs md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                © 2026 Oumaima Ameziane. Designed with passion.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
