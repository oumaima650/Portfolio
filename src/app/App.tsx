import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Download, ExternalLink, Mail, Phone, Linkedin, Github, GraduationCap, Globe, Heart, MapPin, X } from 'lucide-react';
import profileImg from '../imports/image-1.png';
import heroImg from '../imports/image-0.png';

export default function App() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(1);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Structured Data
  const EXPERIENCES = [
    {
      id: 'exp-1',
      type: 'experience',
      title: 'Software Development Intern',
      company: 'AGILE SQUARE',
      date: 'Summer 2025 (Expected)',
      location: 'Maroc',
      description: 'A deep dive into full-stack development within a dynamic consulting environment. Focused on building scalable solutions and mastering agile methodologies.',
      fullDetails: `As a Software Development Intern at Agile Square, I am tasked with contributing to high-impact projects that bridge the gap between complex engineering requirements and user-centric design.

My role involves:
- Architecting responsive front-end interfaces using React and TypeScript.
- Developing robust REST APIs with Node.js to handle high-traffic data flows.
- Optimizing database queries in PostgreSQL to enhance application performance.
- Collaborating in a multi-disciplinary team using Scrum and Kanban workflows.`,
      tech: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Git', 'Agile'],
      github: 'https://github.com/oumaima650',
    }
  ];

  const PROJECTS = [
    {
      id: 'proj-1',
      title: 'E-Commerce Platform',
      category: 'Featured Project',
      description: 'A comprehensive full-stack e-commerce solution featuring user authentication, dynamic product catalog, and secure payments.',
      fullDetails: `This E-Commerce platform was built to demonstrate a production-ready shopping experience. It handles everything from the initial product browsing to a complex checkout flow.

Key Features:
- **Secure Authentication**: JWT-based login and session management.
- **Dynamic Catalog**: Real-time filtering and search for products.
- **Stripe Integration**: Fully functional payment gateway with webhooks.
- **Admin Dashboard**: A specialized view for managing inventory and orders.`,
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind'],
      github: 'https://github.com/oumaima650',
      image: heroImg // Using heroImg as placeholder for now
    },
    {
      id: 'proj-2',
      title: 'Task Management System',
      category: 'Web App',
      description: 'Real-time collaborative task management application with team features and live updates.',
      fullDetails: `A productivity tool designed for teams to coordinate tasks in real-time. It focuses on low-latency updates and an intuitive drag-and-drop interface.

Highlights:
- **WebSocket Sync**: Tasks move instantly across all users' screens.
- **Team Workspaces**: Private and shared areas for different departments.
- **Activity Logs**: Track every change made to a task for full accountability.`,
      tech: ['Vue.js', 'Firebase', 'Tailwind', 'WebSocket'],
      github: 'https://github.com/oumaima650',
      image: profileImg
    },
    {
      id: 'proj-3',
      title: 'Portfolio Website',
      category: 'Creative Web',
      description: 'Modern, responsive portfolio website with smooth animations and dark mode.',
      fullDetails: `This very website! Built with a focus on immersive user experience (UX) and "breath-taking" visuals.

Features:
- **Framer Motion**: Advanced staggered animations and parallax effects.
- **Bento Grid**: A custom-designed responsive layout for the highlights section.
- **Glassmorphism**: Modern UI aesthetic using backdrop filters.`,
      tech: ['React', 'Motion', 'TypeScript', 'Vite'],
      github: 'https://github.com/oumaima650',
      image: heroImg
    }
  ];

  const ACTIVITIES = [
    {
      id: 'act-1',
      title: 'Tech Club',
      role: 'Active Member',
      date: '2023 - Present',
      description: 'Contributing to technical workshops, peer coding sessions, and organizing tech talks.',
      fullDetails: `Member of the leading tech community at ENSA Tétouan. I actively participate in shaping the technical culture of the campus.

Impact:
- Organized 5+ workshops on React fundamentals for 100+ students.
- Led peer-to-peer coding sessions for competitive programming preparation.
- Acted as a bridge between industry guest speakers and the student body.`,
      category: 'Leadership',
      github: 'https://github.com/oumaima650'
    }
  ];

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

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
            className="w-full h-full object-cover object-[65%_30%] md:object-right"
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
            className="text-[32px] md:text-[60px] lg:text-[90px] leading-[0.85] mb-16 md:mb-32 uppercase relative max-w-full"
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
            className="fixed bottom-6 md:bottom-8 left-0 right-0 z-50 flex justify-center w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
            transition={{ duration: 0.8, delay: showIntro ? 0 : 0.8 }}
          >
            <motion.nav
              className="inline-flex items-center gap-0 md:gap-2 px-1.5 md:px-4 py-2 md:py-2.5 rounded-full max-w-full overflow-x-auto no-scrollbar"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
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
                  className={`px-2 md:px-5 py-2 rounded-full text-[8.5px] md:text-[11px] uppercase tracking-wider transition-all relative group flex-shrink-0 ${activeSection === link.id
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

      {/* FRAME 2: THE EDITORIAL NARRATIVE - ABOUT COMPLETED OVERHAUL */}
      <motion.section
        id="about"
        className="relative py-24 md:py-40 overflow-hidden bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Background Narrative Lettering */}
        <div className="absolute top-20 left-0 w-full text-[200px] md:text-[400px] font-black text-[#F8F7F2] select-none pointer-events-none italic tracking-tighter leading-none opacity-50 z-0">
          OUMAI.
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col gap-24 md:gap-40">
            
            {/* Block 1: THE NARRATIVE MONOLOGUE (Bio without photo) */}
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="flex flex-col items-center gap-3 mb-12">
                  <div className="h-[2px] w-12 bg-[#D4537E]" />
                  <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-black text-[#D4537E]">DISCOVER THE JOURNEY</span>
                </div>
                <h2
                  className="text-[48px] md:text-[82px] leading-[0.95] font-black mb-12 tracking-tighter"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#0D0D0D' }}
                >
                  Passionate about <span className="italic text-[#D4537E]">code</span>, 
                  <br className="hidden md:block" /> design & impact.
                </h2>
                <div className="flex gap-3 justify-center flex-wrap mb-12">
                  {['Creative Problem Solver', 'Team Collaborator', 'Continuous Learner'].map((skill) => (
                    <span
                      key={skill}
                      className="px-6 py-2 rounded-full border border-[#D4537E]/20 text-[#D4537E] font-bold text-xs uppercase tracking-widest bg-[#F8F7F2]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[#4A4A4A] text-xl md:text-3xl leading-relaxed max-w-3xl mx-auto font-medium mb-10">
                  Currently a 4th-year <span className="text-[#0D0D0D] font-bold">Computer Engineering</span> student at ENSA Tétouan. 
                  I bridge the gap between technical complexity and user-centric design.
                </p>
              </motion.div>
            </div>

            {/* Block 2: THE DETAILS CLUSTER (Non-card layout) */}
            <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-20 items-end">
              {/* Specialized Skills / Languages Aura */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <div className="mb-12">
                   <h3 className="text-4xl font-bold mb-8 italic" style={{ fontFamily: "'Playfair Display', serif" }}>Linguistic Edge</h3>
                   <div className="space-y-6">
                      {[
                        { name: 'Arabic', level: 'Native / Mother Tongue' },
                        { name: 'French', level: 'DELF B2 / Proficient' },
                        { name: 'English', level: 'Level B2 / Fluent' }
                      ].map((lang) => (
                        <div key={lang.name} className="group border-b border-[#F0EEE8] pb-4">
                           <div className="text-xs uppercase tracking-widest text-[#D4537E] font-black mb-1 opacity-60">{lang.level}</div>
                           <div className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tight group-hover:text-[#D4537E] transition-colors">{lang.name}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>

              {/* Character & Commitment */}
              <motion.div
                className="relative bg-[#F8F7F2] p-12 md:p-16 rounded-[60px] overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4537E]/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                   <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl flex-shrink-0">
                      <div className="text-2xl font-black text-[#D4537E]">100%</div>
                   </div>
                   <div>
                      <h4 className="text-3xl font-bold mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>Committed & Driven</h4>
                      <div className="text-[#D4537E] text-2xl md:text-3xl font-black leading-tight tracking-tight">
                        "Excellence is not an act, but a habit."
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>

            {/* Block 3: THE STATUS RIBBON (Editorial Banner) */}
            <motion.div
              className="relative py-12 md:py-20 bg-[#D4537E] text-white overflow-hidden rounded-[40px] md:rounded-[80px] shadow-3xl shadow-[#D4537E]/30"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
              <div className="px-8 md:px-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="max-w-xl text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                       <Heart size={16} fill="white" />
                       <span className="text-xs uppercase tracking-[0.4em] font-black opacity-80">CURRENT STATUS</span>
                    </div>
                    <h3 className="text-[36px] md:text-[60px] leading-[0.9] font-black tracking-tighter mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                       Open for PFA Internship 2025
                    </h3>
                    <p className="text-white/80 text-lg md:text-xl font-medium tracking-tight">
                       Eager to solve complex problems and contribute to innovative tech solutions. Available starting Summer 2025.
                    </p>
                 </div>
                 <div className="p-10 md:p-14 rounded-[40px] bg-white/10 backdrop-blur-3xl border border-white/20 text-center scale-110 md:scale-125">
                    <div className="text-6xl md:text-8xl font-black mb-1 italic tracking-tighter">PFA</div>
                    <div className="text-xs md:text-sm uppercase font-black tracking-[0.4em] opacity-60">Seeker</div>
                 </div>
              </div>
            </motion.div>

            {/* Block 4: THE TIMELINE AXIS */}
            <div>
               <div className="flex items-center gap-4 mb-16">
                  <div className="h-[2px] w-16 bg-[#D4537E]" />
                  <h4 className="text-xs md:text-sm uppercase tracking-[0.4em] font-black text-[#D4537E]">Educational Path</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
                  {/* Vertical Axis Line */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#D4537E]/10" />
                  
                  <motion.div
                    className="relative pl-8 md:pl-12 border-l border-[#D4537E]/30 text-left"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                     <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#D4537E]" />
                     <div className="text-xs font-black text-[#D4537E] mb-2">2022 — PRESENT</div>
                     <h5 className="text-3xl font-black mb-1 italic tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>ENSA Tétouan</h5>
                     <div className="text-xl font-bold text-[#6B6B6B]">Computer Engineering</div>
                  </motion.div>

                  <motion.div
                    className="relative pl-8 md:pl-12 border-l border-[#D4537E]/30 text-left"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                     <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#D4537E]/40" />
                     <div className="text-xs font-black text-[#6B6B6B] mb-2">2022 GRADUATE</div>
                     <h5 className="text-3xl font-black mb-1 italic tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Lycée Charif Idrissi</h5>
                     <div className="text-xl font-bold text-[#6B6B6B]">Baccalauréat</div>
                  </motion.div>
               </div>
            </div>

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
        <div className="max-w-5xl mx-auto px-4 md:px-8">
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
        <div className="max-w-5xl mx-auto px-4 md:px-8">
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

            {/* Experience Cards */}
            <div className="space-y-12">
              {EXPERIENCES.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Giant background number */}
                  <div
                    className="absolute -top-8 md:-top-16 -left-4 md:-left-8 text-[180px] md:text-[280px] leading-none opacity-[0.03] select-none pointer-events-none"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
                  >
                    0{index + 1}
                  </div>

                  <div className="relative grid grid-cols-1 lg:grid-cols-[35%_65%] gap-0 bg-gradient-to-br from-[#F5F4EF] to-white rounded-3xl overflow-hidden shadow-2xl border border-[#D4537E]/10">
                    {/* Left Panel - Pink Accent */}
                    <div className="bg-[#D4537E] p-8 md:p-12 flex flex-col justify-between text-white">
                      <div>
                        <div className="text-xs md:text-sm uppercase tracking-wider mb-6 opacity-90" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                          {exp.date}
                        </div>
                        <h3
                          className="text-[32px] md:text-[42px] leading-[1.1] mb-4"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                        >
                          {exp.title}
                        </h3>
                      </div>
                      <div>
                        <div className="text-xl md:text-2xl mb-2" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                          {exp.company}
                        </div>
                        <div className="text-xs md:text-sm opacity-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {exp.location}
                        </div>
                      </div>
                    </div>

                    {/* Right Panel - Description */}
                    <div className="p-8 md:p-12 flex flex-col justify-between">
                      <div className="mb-6 md:mb-8">
                        <h4 className="text-lg md:text-xl mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                          Strategic Impact
                        </h4>
                        <p className="text-[#0D0D0D] leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {exp.description}
                        </p>

                        <h4 className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: '#D4537E' }}>
                          Core Stack
                        </h4>
                        <div className="flex gap-2 flex-wrap mb-8">
                          {exp.tech.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs rounded-full border border-[#D4537E]/20 bg-white"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                            >
                              {tech}
                            </span>
                          ))}
                          {exp.tech.length > 4 && <span className="text-xs text-[#D4537E] font-bold">+{exp.tech.length - 4} more</span>}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => openModal(exp)}
                        className="self-start px-8 py-3 bg-[#0D0D0D] text-white rounded-full flex items-center gap-2 text-sm md:text-base transition-all hover:bg-black"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Full Case Study
                        <ExternalLink size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section
        id="projects"
        className="relative py-8 md:py-16 bg-[#0F172A]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
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
                className="text-[32px] md:text-[48px] leading-none text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
              >
                Featured Projects
              </h2>
              <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                A curated collection of projects showcasing technical skills and creative problem-solving
              </p>
            </div>

            {/* Projects Grid */}
            <div className="space-y-6 md:space-y-8">
              {/* Featured Project */}
              {PROJECTS.slice(0, 1).map((proj) => (
                <motion.div
                  key={proj.id}
                  className="relative rounded-3xl overflow-hidden cursor-pointer group"
                  onClick={() => openModal(proj)}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative bg-gradient-to-br from-[#D4537E] to-[#B84368] p-8 md:p-12 min-h-[350px] md:min-h-[400px] flex items-end">
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-black/10 rounded-full blur-3xl" />

                    <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 md:gap-12 text-left">
                      <div>
                        <div className="inline-block px-3 md:px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4 md:mb-6">
                          <span className="text-xs md:text-sm text-white font-bold tracking-wider uppercase">
                            {proj.category}
                          </span>
                        </div>
                        <h3
                          className="text-[36px] md:text-[56px] leading-[1.1] mb-4 text-white"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                        >
                          {proj.title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-lg leading-relaxed mb-6">
                          {proj.description}
                        </p>
                      </div>
                      <div className="flex flex-col justify-end items-start md:items-end">
                        <div className="mb-6 w-full text-left md:text-right">
                          <div className="text-xs md:text-sm uppercase tracking-wider text-white/70 mb-3 font-bold">
                            Core Technologies
                          </div>
                          <div className="flex gap-2 flex-wrap md:justify-end">
                            {proj.tech.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 md:px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <motion.button
                          className="px-6 py-3 bg-white text-[#D4537E] rounded-full flex items-center gap-2 text-sm font-bold shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Explore Details
                          <ExternalLink size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Side by Side Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
                {PROJECTS.slice(1).map((proj, idx) => (
                  <motion.div
                    key={proj.id}
                    className="rounded-3xl overflow-hidden cursor-pointer group bg-white border border-black/5"
                    onClick={() => openModal(proj)}
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                    whileHover={{ y: -8, scale: 1.01 }}
                  >
                    <div className="p-6 md:p-8 min-h-[320px] md:min-h-[380px] flex flex-col">
                      <div className="w-12 md:w-16 h-1 bg-[#D4537E] mb-6" />
                      <h3
                        className="text-[28px] md:text-[36px] leading-[1.1] mb-4"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                      >
                        {proj.title}
                      </h3>
                      <p className="text-[#6B6B6B] leading-relaxed mb-6 text-sm md:text-base">
                        {proj.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex gap-2 flex-wrap mb-6">
                          {proj.tech.map((t) => (
                            <span key={t} className="px-2 md:px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#F8F7F2] text-black/60 border border-black/5">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div
                          className="text-[#D4537E] flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all"
                        >
                          View Project Details
                          <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                className="text-[32px] md:text-[48px] leading-none mb-6"
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

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 text-left">
              {ACTIVITIES.map((act, idx) => (
                <motion.div
                  key={act.id}
                  className="md:col-span-7 md:row-span-2 rounded-3xl overflow-hidden cursor-pointer group"
                  onClick={() => openModal(act)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative bg-gradient-to-br from-[#D4537E] to-[#B84368] p-8 md:p-12 h-full min-h-[350px] md:min-h-[400px] flex flex-col justify-between text-white overflow-hidden">
                    <div className="absolute top-8 right-8 text-[120px] md:text-[180px] leading-none opacity-5 select-none" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
                      0{idx + 1}
                    </div>
                    <div className="relative z-10">
                      <div className="inline-block px-3 md:px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        <span className="text-xs uppercase tracking-wider font-bold">
                          {act.date}
                        </span>
                      </div>
                      <h3
                        className="text-[36px] md:text-[48px] leading-[1.1] mb-2"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                      >
                        {act.title}
                      </h3>
                      <div className="text-lg md:text-xl mb-6 opacity-90 font-bold">
                        {act.role}
                      </div>
                      <p className="text-white/80 leading-relaxed max-w-md text-sm md:text-base mb-8">
                        {act.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm font-bold bg-white/10 self-start px-4 py-2 rounded-full border border-white/20">
                        Read Story
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Other activity cards (Static placeholders for variety) */}
              <motion.div
                className="md:col-span-5 rounded-3xl overflow-hidden bg-white border-2 border-[#D4537E]/20 p-6 md:p-8 h-full flex flex-col min-h-[200px]"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 md:w-12 h-1 bg-[#D4537E] mb-6" />
                <div className="mb-2 text-xs uppercase tracking-wider font-bold text-[#D4537E]">2024</div>
                <h3 className="text-[24px] md:text-[32px] leading-[1.1] mb-3 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Hackathon Participant
                </h3>
                <p className="text-[#6B6B6B] text-xs md:text-sm">Competed in 24-hour coding challenges, building innovative solutions under pressure.</p>
              </motion.div>

              <motion.div
                className="md:col-span-12 lg:col-span-5 rounded-3xl overflow-hidden bg-[#0F172A] p-8 text-white min-h-[180px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -6 }}
              >
                <div className="mb-3 text-xs uppercase tracking-wider text-[#D4537E] font-bold">2024 - Present</div>
                <h3 className="text-[28px] md:text-[36px] leading-[1.1] mb-3 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Student Council
                </h3>
                <p className="text-white/70 text-sm">Representing engineering students and bridging communication between students and faculty.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FRAME 6: CONTACT / FOOTER */}
      <motion.section
        id="contact"
        className="relative py-8 md:py-16 bg-[#0F172A]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
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
                className="text-[32px] md:text-[48px] leading-none text-white"
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
      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#FDFDFB] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/10 hover:bg-black/20 text-black transition-colors"
              >
                <X size={24} />
              </button>

              {/* Left Column: Visual & Quick Info */}
              <div className="md:w-2/5 relative h-[300px] md:h-auto bg-[#F0EEE8] overflow-hidden">
                <img
                  src={selectedItem.image || profileImg}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="text-xs uppercase tracking-widest opacity-80 mb-2">
                    {selectedItem.category || selectedItem.type}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] leading-none">
                    {selectedItem.title}
                  </h2>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white">
                <div className="max-w-2xl">
                  {/* Item Header (Mobile Only / Extra detail) */}
                  <div className="mb-8">
                    {selectedItem.company && (
                      <div className="text-xl font-bold text-[#D4537E] mb-1">{selectedItem.company}</div>
                    )}
                    <div className="text-sm text-black/50 font-medium">
                      {selectedItem.date} {selectedItem.location && `• ${selectedItem.location}`}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="prose prose-slate max-w-none mb-12">
                    <h3 className="text-xl font-bold mb-4 text-black">Project Overview</h3>
                    <p className="text-[#6B6B6B] leading-relaxed whitespace-pre-line text-lg">
                      {selectedItem.fullDetails || selectedItem.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-12">
                    <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4537E] mb-4">TECHNOLOGIES</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tech?.map((t: string) => (
                        <span key={t} className="px-4 py-2 bg-[#F8F7F2] border border-[#D4537E]/20 rounded-full text-xs font-bold text-black uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-8 border-t border-black/5">
                    {selectedItem.github && (
                      <a
                        href={selectedItem.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-3 bg-[#0D0D0D] text-white rounded-full font-bold hover:bg-black transition-all hover:scale-105"
                      >
                        <Github size={20} />
                        View Source
                      </a>
                    )}
                    {selectedItem.live && (
                      <a
                        href={selectedItem.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-3 bg-[#D4537E] text-white rounded-full font-bold hover:bg-[#B84368] transition-all hover:scale-105"
                      >
                        <ExternalLink size={20} />
                        Live Demo
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
