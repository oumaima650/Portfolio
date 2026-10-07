export type Lang = 'fr' | 'en';

export const t = {
  fr: {
    // Hero
    jobTitle: 'INGENIEURE INFORMATIQUE',
    tagline: "De l'idee a la solution — je construis le pont entre les deux.",
    taglineMobile: "De l'idee a la solution.",

    // Nav
    nav: {
      home: 'HOME',
      about: 'A PROPOS',
      skills: 'SKILLS',
      experience: 'EXPERIENCE',
      projects: 'PROJETS',
      activities: 'ACTIVITES',
      certifications: 'CERTIFICATIONS',
      contact: 'CONTACT',
    },

    // About
    aboutTag: 'LE PARCOURS',
    aboutTitle1: 'Passionnee par le',
    aboutTitle2: "l'IA et l'impact.",
    aboutPills: ['Full Stack', 'IA & Data', 'DevOps'],
    aboutBio: "Eleve ingeniere en 5eme annee Genie Informatique a l'ENSA Tetouan, specialite Systemes Informatiques et Aide a la Decision. Je combine expertise en developpement full stack, integration IA et outils DevOps.",
    aboutBioBold: 'Genie Informatique',
    languagesTitle: 'Langues',
    languages: [
      { name: 'Arabe', level: 'Langue maternelle' },
      { name: 'Francais', level: 'DELF B2' },
      { name: 'Anglais', level: 'Niveau B2' },
    ],
    statusTag: 'STATUT ACTUEL',
    statusTitle: 'Recherche Stage PFE\na partir de Janvier 2027',
    statusDesc: 'Disponible des janvier 2027. Prete a contribuer a des projets innovants en developpement logiciel, IA ou DevOps.',
    educationTag: 'Parcours Academique',
    edu1Date: '2024 — PRESENT',
    edu1School: 'ENSA Tetouan',
    edu1Degree: 'Cycle Ingenieur — Genie Informatique',
    edu1Spec: 'Specialite : Systemes Informatiques et Aide a la Decision',
    edu2Date: '2022 — 2024',
    edu2School: 'ENSA Tetouan',
    edu2Degree: 'Cycle Preparatoire Integre',

    // Skills
    skillsTitle: 'Competences Techniques',
    skillsCategories: [
      { label: 'Developpement Full Stack', primary: ['Spring Boot', 'React', 'Laravel', 'TypeScript'], secondary: ['Java', 'PHP', 'Python', 'Dart', 'C#', 'Tailwind'] },
      { label: 'IA & Data Science', primary: ['Python', 'Spring AI', 'RAG', 'Machine Learning'], secondary: ['Scikit-learn', 'Pandas', 'NumPy', 'FastAPI', 'Streamlit'] },
      { label: 'DevOps & Conteneurisation', primary: ['Docker', 'Kubernetes', 'CI/CD'], secondary: ['Git', 'GitHub Actions', 'Linux'] },
      { label: 'Bases de Donnees', primary: ['PostgreSQL', 'pgvector', 'MySQL'], secondary: ['PostGIS', 'Oracle BD', 'PL/SQL'] },
      { label: 'Architecture & Securite', primary: ['Microservices', 'Kafka', 'Keycloak'], secondary: ['OAuth2', 'JWT', 'RBAC', 'REST API', 'Resilience4j'] },
      { label: 'Methodologies & Outils', primary: ['Agile', 'Scrum'], secondary: ['Jira', 'Prometheus', 'Grafana'] },
    ],

    // Experience
    expTag: 'PARCOURS PROFESSIONNEL',
    expTitle: 'Experience',
    expMission: 'Mission',
    expStack: 'Stack Utilise',
    expBtn: 'Voir Details',

    // Projects
    projTag: 'PROJETS SELECTIONNES',
    projTitle: 'Projets Phares',
    projSubtitle: 'Une selection de projets melant full stack, IA et architecture microservices',
    projTechLabel: 'Technologies',
    projBtn: 'Voir Details',

    // Activities
    activitiesTag: 'AU-DELA DU CODE',
    activitiesTitle: 'Activites Parascolaires',
    activitiesSubtitle: "Impliquee dans la vie etudiante, les initiatives communautaires et les evenements techniques de l'ENSA Tetouan.",

    // Contact
    contactTag: 'CONTACTEZ-MOI',
    contactTitle: 'Restons en Contact',
    contactDesc: 'Je recherche un stage de fin d\'etudes (PFE) a partir de janvier 2027. N\'hesitez pas a me contacter !',
    contactName: 'Votre Nom',
    contactEmail: 'Votre Email',
    contactSubject: 'Sujet',
    contactMessage: 'Votre Message',
    contactSend: 'Envoyer le Message',
    footer: '© 2026 Oumaima Ameziane · ENSA Tetouan · Genie Informatique',

    // Certifications
    certTag: 'FORMATIONS & CERTIFICATIONS',
    certTitle: 'Certifications',
    certVerify: 'Voir le certificat',
    cvDownload: 'Télécharger le CV',
    cvFr: 'Version Française',
    cvEn: 'English Version',

    // Modal
    modalDetails: 'Details',
    modalTech: 'TECHNOLOGIES',
    modalGithub: 'Voir sur GitHub',
  },

  en: {
    // Hero
    jobTitle: 'COMPUTER ENGINEER',
    tagline: 'From idea to solution — I build the bridge between the two.',
    taglineMobile: 'From idea to solution.',

    // Nav
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      skills: 'SKILLS',
      experience: 'EXPERIENCE',
      projects: 'PROJECTS',
      activities: 'ACTIVITIES',
      certifications: 'CERTIFICATIONS',
      contact: 'CONTACT',
    },

    // About
    aboutTag: 'THE JOURNEY',
    aboutTitle1: 'Passionate about',
    aboutTitle2: 'AI & impact.',
    aboutPills: ['Full Stack', 'AI & Data', 'DevOps'],
    aboutBio: "5th-year Computer Engineering student at ENSA Tetouan, specializing in Information Systems and Decision Support. I combine expertise in full stack development, AI integration, and DevOps tools.",
    aboutBioBold: 'Computer Engineering',
    languagesTitle: 'Languages',
    languages: [
      { name: 'Arabic', level: 'Native language' },
      { name: 'French', level: 'DELF B2' },
      { name: 'English', level: 'Level B2' },
    ],
    statusTag: 'CURRENT STATUS',
    statusTitle: 'Seeking Internship (PFE)\nStarting January 2027',
    statusDesc: 'Available from January 2027. Ready to contribute to innovative projects in software development, AI, or DevOps.',
    educationTag: 'Academic Path',
    edu1Date: '2024 — PRESENT',
    edu1School: 'ENSA Tetouan',
    edu1Degree: 'Engineering Degree — Computer Science',
    edu1Spec: 'Specialization: Information Systems & Decision Support',
    edu2Date: '2022 — 2024',
    edu2School: 'ENSA Tetouan',
    edu2Degree: 'Integrated Preparatory Cycle',

    // Skills
    skillsTitle: 'Technical Skills',
    skillsCategories: [
      { label: 'Full Stack Development', primary: ['Spring Boot', 'React', 'Laravel', 'TypeScript'], secondary: ['Java', 'PHP', 'Python', 'Dart', 'C#', 'Tailwind'] },
      { label: 'AI & Data Science', primary: ['Python', 'Spring AI', 'RAG', 'Machine Learning'], secondary: ['Scikit-learn', 'Pandas', 'NumPy', 'FastAPI', 'Streamlit'] },
      { label: 'DevOps & Containerization', primary: ['Docker', 'Kubernetes', 'CI/CD'], secondary: ['Git', 'GitHub Actions', 'Linux'] },
      { label: 'Databases', primary: ['PostgreSQL', 'pgvector', 'MySQL'], secondary: ['PostGIS', 'Oracle DB', 'PL/SQL'] },
      { label: 'Architecture & Security', primary: ['Microservices', 'Kafka', 'Keycloak'], secondary: ['OAuth2', 'JWT', 'RBAC', 'REST API', 'Resilience4j'] },
      { label: 'Methodologies & Tools', primary: ['Agile', 'Scrum'], secondary: ['Jira', 'Prometheus', 'Grafana'] },
    ],

    // Experience
    expTag: 'PROFESSIONAL JOURNEY',
    expTitle: 'Experience',
    expMission: 'Mission',
    expStack: 'Tech Stack',
    expBtn: 'View Details',

    // Projects
    projTag: 'SELECTED WORK',
    projTitle: 'Featured Projects',
    projSubtitle: 'A selection of projects combining full stack, AI, and microservices architecture',
    projTechLabel: 'Technologies',
    projBtn: 'View Details',

    // Activities
    activitiesTag: 'BEYOND THE CODE',
    activitiesTitle: 'Extracurricular Activities',
    activitiesSubtitle: 'Actively engaged in student life, community initiatives, and technical events at ENSA Tetouan.',

    // Contact
    contactTag: 'GET IN TOUCH',
    contactTitle: "Let's Connect",
    contactDesc: "I'm looking for a final-year internship (PFE) starting January 2027. Feel free to reach out!",
    contactName: 'Your Name',
    contactEmail: 'Your Email',
    contactSubject: 'Subject',
    contactMessage: 'Your Message',
    contactSend: 'Send Message',
    footer: '© 2026 Oumaima Ameziane · ENSA Tetouan · Computer Engineering',

    // Certifications
    certTag: 'TRAINING & CERTIFICATIONS',
    certTitle: 'Certifications',
    certVerify: 'View certificate',
    cvDownload: 'Download CV',
    cvFr: 'French Version',
    cvEn: 'English Version',

    // Modal
    modalDetails: 'Details',
    modalTech: 'TECHNOLOGIES',
    modalGithub: 'View on GitHub',
  },
} as const;

export const CERTIFICATIONS = [
  {
    id: 'cert-1',
    title: 'Certification Placeholder 1',
    issuer: 'Organisme émetteur',
    date: '2025',
    description: 'Description de la certification — compétences acquises, contenu de la formation.',
    credentialUrl: '#',
    badge: '🏅',
  },
  {
    id: 'cert-2',
    title: 'Certification Placeholder 2',
    issuer: 'Organisme émetteur',
    date: '2025',
    description: 'Description de la certification — compétences acquises, contenu de la formation.',
    credentialUrl: '#',
    badge: '🎓',
  },
  {
    id: 'cert-3',
    title: 'Certification Placeholder 3',
    issuer: 'Organisme émetteur',
    date: '2024',
    description: 'Description de la certification — compétences acquises, contenu de la formation.',
    credentialUrl: '#',
    badge: '⭐',
  },
  {
    id: 'cert-4',
    title: 'Certification Placeholder 4',
    issuer: 'Organisme émetteur',
    date: '2024',
    description: 'Description de la certification — compétences acquises, contenu de la formation.',
    credentialUrl: '#',
    badge: '🚀',
  },
];
export const DATA = {
  experiences: {
    fr: [
      {
        id: 'exp-1',
        type: 'experience',
        title: 'Stagiaire Developpement Logiciel (PFA)',
        company: 'INFRANET ENGINEERING SARL AU',
        date: 'Juil - Aout 2026',
        location: 'Tetouan, Maroc',
        description: "Conception d'une solution open-source remplacant un connecteur commercial payant pour utiliser PostgreSQL/PostGIS comme stockage spatial des Modeles Metiers Autodesk AutoCAD Map 3D.",
        fullDetails: "Conception d'une solution open-source remplacant un connecteur commercial payant, pour utiliser PostgreSQL/PostGIS comme stockage spatial des Modeles Metiers Autodesk AutoCAD Map 3D.\n\n• Developpement en Python d'un moteur de traduction des metadonnees Autodesk en schemas PostGIS et d'un service de synchronisation temps reel.\n• Mise en place d'un monitoring Docker Compose (Prometheus, Grafana) et d'un installateur Windows automatise.",
        tech: ['Python', 'PostgreSQL', 'PostGIS', 'Docker', 'Prometheus', 'Grafana'],
        github: 'https://github.com/oumaima650',
      },
      {
        id: 'exp-2',
        type: 'experience',
        title: 'Stagiaire Developpement Web',
        company: 'AGILE SQUARE',
        date: 'Juil - Aout 2025',
        location: 'Casablanca, Maroc',
        description: "Conception et developpement d'une application web de gestion des comptes rendus d'activite (CRA) avec Laravel et MySQL.",
        fullDetails: "Conception et developpement d'une application web de gestion des comptes rendus d'activite (CRA) selon une architecture MVC avec Laravel et MySQL.\n\n• Mise en place d'une authentification securisee via Keycloak (OAuth2) et d'un systeme de gestion des roles et des acces.\n• Automatisation de la saisie, amelioration de la tracabilite des activites et optimisation de la gestion des donnees.",
        tech: ['Laravel', 'MySQL', 'Keycloak', 'OAuth2', 'PHP', 'MVC'],
        github: 'https://github.com/oumaima650',
      },
    ],
    en: [
      {
        id: 'exp-1',
        type: 'experience',
        title: 'Software Development Intern (PFA)',
        company: 'INFRANET ENGINEERING SARL AU',
        date: 'Jul - Aug 2026',
        location: 'Tetouan, Morocco',
        description: 'Designed an open-source solution replacing a paid commercial connector to use PostgreSQL/PostGIS as spatial storage for Autodesk AutoCAD Map 3D Business Models.',
        fullDetails: "Designed an open-source solution replacing a paid commercial connector to use PostgreSQL/PostGIS as spatial storage for Autodesk AutoCAD Map 3D Business Models.\n\n• Developed a Python engine to translate Autodesk metadata into PostGIS schemas and a real-time synchronization service.\n• Set up Docker Compose monitoring (Prometheus, Grafana) and an automated Windows installer.",
        tech: ['Python', 'PostgreSQL', 'PostGIS', 'Docker', 'Prometheus', 'Grafana'],
        github: 'https://github.com/oumaima650',
      },
      {
        id: 'exp-2',
        type: 'experience',
        title: 'Web Development Intern',
        company: 'AGILE SQUARE',
        date: 'Jul - Aug 2025',
        location: 'Casablanca, Morocco',
        description: 'Designed and developed a web application for managing activity reports (CRA) using an MVC architecture with Laravel and MySQL.',
        fullDetails: "Designed and developed a web application for managing activity reports (CRA) using an MVC architecture with Laravel and MySQL.\n\n• Implemented secure authentication via Keycloak (OAuth2) and a role and access management system.\n• Automated data entry, improved activity traceability, and optimized data management.",
        tech: ['Laravel', 'MySQL', 'Keycloak', 'OAuth2', 'PHP', 'MVC'],
        github: 'https://github.com/oumaima650',
      },
    ],
  },

  projects: {
    fr: [
      {
        id: 'proj-1',
        title: 'RAWABET',
        category: 'CRM IA - Agences Immobilieres',
        description: "CRM pour agences immobilieres : suivi des clients, priorisation des leads et automatisation du suivi commercial avec chatbot IA et moteur RAG.",
        fullDetails: "CRM pour agences immobilieres : suivi des clients, priorisation des leads et automatisation du suivi commercial.\n\n• Chatbot IA et moteur RAG (Spring AI, pgvector) analysant les documents et attribuant aux leads un score de 0 a 100.\n• Deux applications React (agence et client) avec carte interactive, tableaux de bord et acces par roles (JWT).",
        tech: ['Spring Boot 3', 'React', 'Spring AI', 'RAG', 'pgvector', 'JWT'],
        github: 'https://github.com/oumaima650',
      },
      {
        id: 'proj-2',
        title: 'SGITU',
        category: 'Microservice - Transport Urbain',
        description: "Service d'abonnements pour le transport urbain : souscription, pause, suspension et remboursement calcule au prorata. Architecture evenementielle Kafka.",
        fullDetails: "Service d'abonnements pour le transport urbain : souscription, pause, suspension et remboursement calcule au prorata.\n\n• Architecture orientee evenements avec 13 types d'evenements Kafka et reprise automatique sur panne (Resilience4j).\n• Conteneurisation Docker multi-stage et deploiement automatise par un pipeline CI/CD GitHub Actions.",
        tech: ['Spring Boot 3', 'Kafka', 'Docker', 'CI/CD', 'Kubernetes', 'Resilience4j'],
        github: 'https://github.com/oumaima650',
      },
      {
        id: 'proj-3',
        title: 'AURORA',
        category: 'Machine Learning - Meteo Spatiale',
        description: "Modele predisant les tempetes geomagnetiques 6h a l'avance. Pipeline sur 43 207 observations NASA, Random Forest optimise : 98,72% de rappel.",
        fullDetails: "Modele predisant les tempetes geomagnetiques 6h a l'avance pour proteger les reseaux electriques et les satellites.\n\n• Pipeline de 43 207 observations NASA sur 5 ans et Random Forest optimise pour le rappel : 98,72% (PR-AUC 0,767).\n• API REST FastAPI et interface Streamlit, conteneurisees et orchestrees avec Docker Compose.",
        tech: ['Python', 'Scikit-learn', 'FastAPI', 'Docker', 'Streamlit', 'Pandas'],
        github: 'https://github.com/oumaima650',
      },
    ],
    en: [
      {
        id: 'proj-1',
        title: 'RAWABET',
        category: 'AI CRM - Real Estate Agencies',
        description: 'CRM for real estate agencies: client tracking, lead prioritization, and sales follow-up automation with AI chatbot and RAG engine.',
        fullDetails: "CRM for real estate agencies: client tracking, lead prioritization, and commercial follow-up automation.\n\n• AI chatbot and RAG engine (Spring AI, pgvector) analyzing documents and assigning leads a score from 0 to 100.\n• Two React apps (agency and client) with interactive map, dashboards, and role-based access (JWT).",
        tech: ['Spring Boot 3', 'React', 'Spring AI', 'RAG', 'pgvector', 'JWT'],
        github: 'https://github.com/oumaima650',
      },
      {
        id: 'proj-2',
        title: 'SGITU',
        category: 'Microservice - Urban Transit',
        description: 'Subscription service for urban transit: subscribe, pause, suspend, and prorated refund. Event-driven Kafka architecture.',
        fullDetails: "Subscription service for urban transit: subscribe, pause, suspend, and prorated refund calculation.\n\n• Event-driven architecture with 13 Kafka event types and automatic failure recovery (Resilience4j).\n• Multi-stage Docker containerization and automated deployment via CI/CD GitHub Actions pipeline.",
        tech: ['Spring Boot 3', 'Kafka', 'Docker', 'CI/CD', 'Kubernetes', 'Resilience4j'],
        github: 'https://github.com/oumaima650',
      },
      {
        id: 'proj-3',
        title: 'AURORA',
        category: 'Machine Learning - Space Weather',
        description: 'Model predicting geomagnetic storms 6h in advance. Pipeline on 43,207 NASA observations, optimized Random Forest: 98.72% recall.',
        fullDetails: "Model predicting geomagnetic storms 6h in advance to protect power grids and satellites.\n\n• Pipeline on 43,207 NASA observations over 5 years and Random Forest optimized for recall: 98.72% (PR-AUC 0.767).\n• REST FastAPI and Streamlit interface, containerized and orchestrated with Docker Compose.",
        tech: ['Python', 'Scikit-learn', 'FastAPI', 'Docker', 'Streamlit', 'Pandas'],
        github: 'https://github.com/oumaima650',
      },
    ],
  },

  activities: {
    fr: [
      { id: 'act-1', title: 'Club InfoTech', role: 'Membre actif', date: '2022 - Present', description: "Participation aux ateliers techniques, sessions de coding et evenements organises au sein de l'ENSA Tetouan.", category: 'Club Technique', github: 'https://github.com/oumaima650' },
      { id: 'act-2', title: 'Don du Sang', role: 'Membre organisateur', date: '2023 - 2025', description: "Organisation de l'evenement annuel Don du Sang a l'ENSA Tetouan (editions 2023-2024 et 2024-2025).", category: 'Action Humanitaire' },
      { id: 'act-3', title: 'Conference IT', role: 'Membre organisateur', date: '2024 - 2025', description: "Contribution a l'organisation d'une conference IT a l'ENSA Tetouan pour l'edition 2024-2025.", category: 'Evenement Tech' },
      { id: 'act-4', title: 'Forum des Entreprises ENS', role: 'Membre organisateur', date: '2024 - 2025', description: "Participation a l'organisation du Forum des Entreprises ENSA Tetouan, facilitant la mise en relation entre etudiants et recruteurs.", category: 'Evenement Carriere' },
    ],
    en: [
      { id: 'act-1', title: 'InfoTech Club', role: 'Active Member', date: '2022 - Present', description: 'Participation in technical workshops, coding sessions, and events organized at ENSA Tetouan.', category: 'Tech Club', github: 'https://github.com/oumaima650' },
      { id: 'act-2', title: 'Blood Donation', role: 'Event Organizer', date: '2023 - 2025', description: 'Organization of the annual Blood Donation event at ENSA Tetouan (2023-2024 and 2024-2025 editions).', category: 'Humanitarian' },
      { id: 'act-3', title: 'IT Conference', role: 'Event Organizer', date: '2024 - 2025', description: 'Contributed to organizing an IT conference at ENSA Tetouan for the 2024-2025 edition.', category: 'Tech Event' },
      { id: 'act-4', title: 'ENS Career Fair', role: 'Event Organizer', date: '2024 - 2025', description: 'Participated in organizing the ENSA Tetouan Career Fair, facilitating connections between students and recruiters.', category: 'Career Event' },
    ],
  },
};
