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
    aboutTitle1: 'Entre la curiosite',
    aboutTitle2: 'et la creation.',
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
    cvTagline: 'Disponible en français et en anglais.',

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
    aboutTitle1: 'Somewhere between',
    aboutTitle2: 'curiosity and creation.',
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
    cvTagline: 'Available in French and English.',

    // Modal
    modalDetails: 'Details',
    modalTech: 'TECHNOLOGIES',
    modalGithub: 'View on GitHub',
  },
} as const;

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: { fr: string; en: string };
  description: { fr: string; en: string };
  credentialUrl?: string;
  pdfUrl?: string;
  github?: string;
  badge: string;
  inProgress?: boolean;
}

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-0',
    title: 'Introduction to Containers w/ Docker, Kubernetes & OpenShift',
    issuer: 'IBM',
    date: { fr: 'En cours · 2026', en: 'In progress · 2026' },
    description: {
      fr: 'Fondamentaux des conteneurs, création d’images avec Docker, orchestration et gestion de clusters avec Kubernetes et déploiement sur Red Hat OpenShift.',
      en: 'Container fundamentals, building images with Docker, cluster orchestration and management with Kubernetes, and enterprise deployment on Red Hat OpenShift.',
    },
    badge: 'Kubernetes',
    inProgress: true,
  },
  {
    id: 'cert-1',
    title: 'Build a CI/CD Pipeline with Docker: From Code to Deployment',
    issuer: 'Coursera (Proxym France)',
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    description: {
      fr: 'Conception d’un pipeline CI/CD complet avec Docker, du code source jusqu’au déploiement automatisé : conteneurisation d’une application, automatisation des builds et des tests, et livraison continue.',
      en: 'Built a complete CI/CD pipeline with Docker, from source code to automated deployment: containerizing an application, automating builds and tests, and continuous delivery.',
    },
    credentialUrl: 'https://www.coursera.org/verify/XC6SYAVU084N',
    pdfUrl: '/certifications/Coursera XC6SYAVU084N.pdf',
    badge: 'Docker',
  },
  {
    id: 'cert-2',
    title: 'Introduction to GitHub Actions',
    issuer: 'Coursera (Duke University)',
    date: { fr: 'Septembre 2026', en: 'September 2026' },
    description: {
      fr: 'Prise en main de GitHub Actions pour automatiser les workflows d’un dépôt : tests, vérifications du code et intégration continue déclenchés à chaque push.',
      en: 'Hands-on introduction to GitHub Actions to automate repository workflows: tests, code checks, and continuous integration triggered on every push.',
    },
    credentialUrl: 'https://www.coursera.org/verify/OS42YJ4VZUCA',
    pdfUrl: '/certifications/Coursera OS42YJ4VZUCA (1).pdf',
    badge: 'CI/CD',
  },
  {
    id: 'cert-3',
    title: 'Learn Python With 20+ Real World Projects',
    issuer: 'Udemy (Arbaz Khan)',
    date: { fr: 'Février 2026', en: 'February 2026' },
    description: {
      fr: 'Pratique de Python à travers plus de 20 petits projets concrets : manipulation des variables, conditions, boucles, fonctions et structures de données.',
      en: 'Practiced Python through 20+ small real-world projects: variables, conditionals, loops, functions, and data structures.',
    },
    credentialUrl: 'https://ude.my/UC-b755c938-a60c-4343-a186-efb094163e44',
    pdfUrl: '/certifications/1771009406870.pdf',
    github: 'https://github.com/oumaima650/Python-Mini-Projects.git',
    badge: 'Python',
  },
  {
    id: 'cert-4',
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    date: { fr: 'Janvier 2025', en: 'January 2025' },
    description: {
      fr: 'Bases des réseaux : types de réseaux et composants, protocoles et standards, Ethernet, adressage IPv4 et IPv6, rôle des routeurs, tests de connectivité et configuration d’un routeur sans fil sécurisé.',
      en: 'Networking fundamentals: network types and components, protocols and standards, Ethernet, IPv4 and IPv6 addressing, how routers work, connectivity troubleshooting, and secure wireless router setup.',
    },
    pdfUrl: '/certifications/1753277670516.pdf',
    badge: 'Cisco',
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
        github: 'https://github.com/oumaima650/Autocad-map-3d-PostgreSQL-Connector.git',
        images: [],
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
        github: 'https://github.com/oumaima650/CRATECH.git',
        images: [],
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
        github: 'https://github.com/oumaima650/Autocad-map-3d-PostgreSQL-Connector.git',
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
        github: 'https://github.com/oumaima650/CRATECH.git',
      },
    ],
  },

  projects: {
    fr: [
      {
        id: 'proj-1',
        title: 'RAWABET',
        category: 'CRM IA - Immobilier',
        description: "CRM pour agences immobilieres : suivi des clients, priorisation des leads et automatisation du suivi commercial avec chatbot IA et moteur RAG.",
        fullDetails: "Plateforme CRM immobiliere alimentee par IA optimisant le scoring de leads, la recommandation de biens et la gestion documentaire.\n\n• Backend monolithique modulaire Spring Boot 3 / Java 21 avec Spring Security JWT (Admin, Agent, Client).\n• Moteur RAG avec Spring AI, pgvector et API NVIDIA NIM — scoring automatise des leads (0-100) et analyse de risques contractuels.\n• Deux applications React 18 / TypeScript avec TanStack Router/Query, Recharts et Leaflet pour la cartographie.\n• Flux evenementiels asynchrones : Spring Events, webhooks n8n, SendGrid (emails) et Cloudinary (medias).",
        tech: ['Spring Boot 3', 'Java 21', 'React 18', 'Spring AI', 'RAG', 'pgvector', 'NVIDIA NIM', 'JWT', 'n8n', 'PostgreSQL'],
        github: 'https://github.com/oumaima650/RAWABET-CRM.git',
        date: 'Mai 2026',
        images: [],
      },
      {
        id: 'proj-2',
        title: 'SGITU',
        category: 'Microservice - Transport Urbain',
        description: "Microservice Java 21 / Spring Boot gerant le cycle de vie complet des abonnements de transport urbain avec architecture evenementielle Kafka.",
        fullDetails: "Microservice robuste gerant souscription, renouvellement, pause, annulation avec remboursement au prorata et suspension administrative.\n\n• Resilience4j (Circuit Breaker, Retry, Bulkhead) + schedulers idempotents pour reprise automatique.\n• 13 types d'evenements Kafka pour notifications et traces analytiques.\n• Dockerfile multi-stage + pipeline CI/CD GitHub Actions avec publication Docker Hub.\n• Spring Cloud OpenFeign pour la communication inter-services.",
        tech: ['Spring Boot 3', 'Java 21', 'Kafka', 'Docker', 'CI/CD', 'Kubernetes', 'Resilience4j', 'MySQL', 'Flyway'],
        github: 'https://github.com/oumaima650/SGITU-Microservices-Abonnements.git',
        date: 'Mai 2026',
        images: [],
      },
      {
        id: 'proj-3',
        title: 'AURORA',
        category: 'Machine Learning - Meteo Spatiale',
        description: "Systeme de prediction des tempetes geomagnetiques 6h a l'avance a partir des donnees satellites NASA. Random Forest optimise : 98,72% de rappel.",
        fullDetails: "Pipeline end-to-end de prediction de meteorologie spatiale anticipant les tempetes geomagnetiques pour proteger les reseaux electriques et satellites.\n\n• Ingestion automatisee de 43 207 observations horaires NASA OMNI2 & DONKI sur 5 ans, avec feature engineering physique (lag 6h, rolling windows, encodage cyclique).\n• Random Forest + RandomUnderSampler (classe minoritaire 8,5%) — Recall 98,72%, PR-AUC 0,767 au seuil optimal 0,28.\n• API REST FastAPI (Pydantic, Swagger) + interface Streamlit, orchestrees via Docker Compose.",
        tech: ['Python', 'Scikit-learn', 'FastAPI', 'Docker', 'Streamlit', 'Pandas', 'NumPy', 'NASA APIs'],
        github: 'https://github.com/oumaima650/ML_AURORA_PROJECT.git',
        date: 'Avril 2026',
        images: [],
      },
      {
        id: 'proj-4',
        title: 'SOUK 212',
        category: 'E-Commerce - Cooperatives Marocaines',
        description: "Plateforme e-commerce multi-cooperatives ASP.NET Core 8 integrant un assistant IA (n8n + Gemini) pour digitaliser la vente de produits regionaux marocains.",
        fullDetails: "Plateforme e-commerce complete pour les cooperatives artisanales et agricoles marocaines (cosmetique, nutritive, artisanat, agricole).\n\n• Architecture multi-roles securisee (Super Admin, Admin Cooperative, Client) avec authentification par session.\n• Gestion de catalogue a variantes (prix, stock, taille, couleur, poids, seuils d'alerte) et suivi logistique automatise.\n• Agent IA conversationnel via n8n et Google Gemini API avec introspection securisee du schema SQL Server.\n• Plus de 20 procedures stockees T-SQL et tableau de bord interactif Chart.js.\n• Deploiement Azure App Service.",
        tech: ['ASP.NET Core 8', 'C#', 'SQL Server', 'Entity Framework Core', 'n8n', 'Gemini API', 'Chart.js', 'Azure'],
        github: 'https://github.com/oumaima650/Souk212.git',
        date: '2026',
        images: [],
      },
      {
        id: 'proj-5',
        title: 'HELPORA',
        category: 'Plateforme de Services Locaux - Web',
        description: "Application web multi-services Laravel 12 / Livewire 3 facilitant la mise en relation, reservation et gestion de prestations a domicile (babysitting, soutien scolaire, garde d'animaux).",
        fullDetails: "Plateforme Laravel 12 / Livewire 3 gerant le cycle de vie complet des prestations de services aux particuliers.\n\n• Authentification multi-roles (Client, Intervenant, Admin) avec dashboards dedies.\n• Geocodage automatique via Observers Eloquent et API OpenStreetMap Nominatim.\n• Automatisation des taches d'arriere-plan (Laravel Schedule/Cron) : annulations automatiques, emails transactionnels post-intervention et rappels d'avis avec cache anti-doublon.\n• Pipeline CI/CD GitHub Actions avec deploiement FTP vers Hostinger.",
        tech: ['Laravel 12', 'Livewire 3', 'PHP 8.4', 'MySQL', 'Tailwind CSS', 'Vite', 'GitHub Actions', 'OpenStreetMap API'],
        github: 'https://github.com/oumaima650/service-plateform.git',
        date: '2025',
        images: [],
      },
      {
        id: 'proj-6',
        title: 'PRESTO',
        category: 'Marketplace Mobile - Flutter',
        description: "Application mobile et web cross-platform Flutter/Firebase connectant clients et experts de services locaux avec systeme d'abonnement SaaS et dashboard d'administration.",
        fullDetails: "Plateforme SaaS-like Flutter/Firebase multi-roles (Client, Expert, Admin) pour la mise en relation de services locaux geolocalises.\n\n• Authentification hybride (Email/OTP SMS) + routage dynamique securise GoRouter avec filtres par role et mode maintenance.\n• Systeme d'abonnement Freemium/Premium (99 DH/mois) avec controle dynamique de visibilite par plan via batchs Firestore.\n• Dashboard admin KPI temps reel : revenus, inscriptions, moderation documentaire (CIN, casier judiciaire), export PDF/CSV.\n• Firebase Firestore + FCM v1 + Cloudinary + flutter_map (geolocalisation interactive).",
        tech: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'FCM', 'Cloudinary', 'GoRouter', 'fl_chart', 'flutter_map'],
        github: 'https://github.com/oumaima650/PRESTO-marketplace_services_mobile_app.git',
        date: '2025-2026',
        images: [],
      },
      {
        id: 'proj-7',
        title: 'CHRIONLINE',
        category: 'E-Commerce Securise - Java',
        description: "Plateforme e-commerce Java 21 multi-client/serveur avec architecture de Defense en Profondeur (TLS 1.3, JWT, AES-256 GCM, HashiCorp Vault, protection anti-DoS).",
        fullDetails: "Application e-commerce Java architecturee sur Sockets TCP/UDP avec modele de securite multicouche.\n\n• Serveur multithreade Java 21 Virtual Threads + TLS 1.3, authentification JWT RS256 avec refresh tokens, reCAPTCHA et protection anti-rejeu.\n• Chiffrement AES-256 GCM probabiliste (PII au repos) + deterministe (recherche SQL securisee sans dechiffrement).\n• Gestion des secrets via HashiCorp Vault + KeyStore PKCS12 + derivation Argon2id/BCrypt.\n• Interface desktop JavaFX pour clients et administrateurs + audit Log4j2.",
        tech: ['Java 21', 'Virtual Threads', 'TLS 1.3', 'JWT', 'AES-256', 'HashiCorp Vault', 'JavaFX', 'MySQL', 'Docker'],
        github: 'https://github.com/oumaima650/Application-E-Commerce-ChriOnline-.git',
        date: '2025',
        images: [],
      },
    ],
    en: [
      {
        id: 'proj-1',
        title: 'RAWABET',
        category: 'AI CRM - Real Estate',
        description: "AI-powered real estate CRM for lead scoring, property recommendation and document management with Spring Boot and React.",
        fullDetails: "Real estate CRM platform powered by AI, optimizing lead scoring, property recommendation and document management.\n\n• Modular monolithic backend Spring Boot 3 / Java 21 with Spring Security JWT (Admin, Agent, Client).\n• RAG engine with Spring AI, pgvector and NVIDIA NIM API — automated lead scoring (0-100) and contract risk analysis.\n• Two React 18 / TypeScript apps with TanStack Router/Query, Recharts and Leaflet for mapping.\n• Async event flows: Spring Events, n8n webhooks, SendGrid (email) and Cloudinary (media).",
        tech: ['Spring Boot 3', 'Java 21', 'React 18', 'Spring AI', 'RAG', 'pgvector', 'NVIDIA NIM', 'JWT', 'n8n', 'PostgreSQL'],
        github: 'https://github.com/oumaima650/RAWABET-CRM.git',
        date: 'May 2026',
        images: [],
      },
      {
        id: 'proj-2',
        title: 'SGITU',
        category: 'Microservice - Urban Transit',
        description: "Java 21 / Spring Boot microservice managing the full subscription lifecycle for urban transit with Kafka event-driven architecture.",
        fullDetails: "Robust microservice managing subscription, renewal, pause, cancellation with prorated refund and administrative suspension.\n\n• Resilience4j (Circuit Breaker, Retry, Bulkhead) + idempotent schedulers for automatic recovery.\n• 13 Kafka event types for notifications and analytics traces.\n• Multi-stage Dockerfile + CI/CD GitHub Actions pipeline with Docker Hub publishing.\n• Spring Cloud OpenFeign for inter-service communication.",
        tech: ['Spring Boot 3', 'Java 21', 'Kafka', 'Docker', 'CI/CD', 'Kubernetes', 'Resilience4j', 'MySQL', 'Flyway'],
        github: 'https://github.com/oumaima650/SGITU-Microservices-Abonnements.git',
        date: 'May 2026',
        images: [],
      },
      {
        id: 'proj-3',
        title: 'AURORA',
        category: 'Machine Learning - Space Weather',
        description: "Geomagnetic storm prediction system 6h in advance from NASA satellite data. Optimized Random Forest: 98.72% recall.",
        fullDetails: "End-to-end space weather prediction pipeline anticipating geomagnetic storms to protect power grids and satellites.\n\n• Automated ingestion of 43,207 hourly NASA OMNI2 & DONKI observations over 5 years, with physical feature engineering (6h lag, rolling windows, cyclic encoding).\n• Random Forest + RandomUnderSampler (8.5% minority class) — 98.72% Recall, PR-AUC 0.767 at optimal threshold 0.28.\n• REST FastAPI (Pydantic, Swagger) + Streamlit interface, orchestrated with Docker Compose.",
        tech: ['Python', 'Scikit-learn', 'FastAPI', 'Docker', 'Streamlit', 'Pandas', 'NumPy', 'NASA APIs'],
        github: 'https://github.com/oumaima650/ML_AURORA_PROJECT.git',
        date: 'April 2026',
        images: [],
      },
      {
        id: 'proj-4',
        title: 'SOUK 212',
        category: 'E-Commerce - Moroccan Cooperatives',
        description: "Multi-cooperative e-commerce platform on ASP.NET Core 8 with AI assistant (n8n + Gemini) to digitalize sales of Moroccan regional products.",
        fullDetails: "Complete e-commerce platform for Moroccan artisanal and agricultural cooperatives (cosmetic, nutritional, crafts, agricultural).\n\n• Secure multi-role architecture (Super Admin, Cooperative Admin, Client) with session-based authentication.\n• Product catalog management with variants (price, stock, size, color, weight, alert thresholds) and automated logistics tracking.\n• Conversational AI agent via n8n and Google Gemini API with secure SQL Server schema introspection.\n• 20+ T-SQL stored procedures and interactive Chart.js dashboard.\n• Azure App Service deployment.",
        tech: ['ASP.NET Core 8', 'C#', 'SQL Server', 'Entity Framework Core', 'n8n', 'Gemini API', 'Chart.js', 'Azure'],
        github: 'https://github.com/oumaima650/Souk212.git',
        date: '2026',
        images: [],
      },
      {
        id: 'proj-5',
        title: 'HELPORA',
        category: 'Local Services Platform - Web',
        description: "Laravel 12 / Livewire 3 multi-service web app for connecting clients with home service providers (babysitting, tutoring, pet care).",
        fullDetails: "Laravel 12 / Livewire 3 platform managing the complete lifecycle of home services.\n\n• Multi-role authentication (Client, Provider, Admin) with dedicated dashboards.\n• Automatic geocoding via Eloquent Observers and OpenStreetMap Nominatim API.\n• Background task automation (Laravel Schedule/Cron): automatic cancellations, post-service transactional emails and review reminders with cache deduplication.\n• CI/CD pipeline GitHub Actions with FTP deployment to Hostinger.",
        tech: ['Laravel 12', 'Livewire 3', 'PHP 8.4', 'MySQL', 'Tailwind CSS', 'Vite', 'GitHub Actions', 'OpenStreetMap API'],
        github: 'https://github.com/oumaima650/service-plateform.git',
        date: '2025',
        images: [],
      },
      {
        id: 'proj-6',
        title: 'PRESTO',
        category: 'Mobile Marketplace - Flutter',
        description: "Cross-platform Flutter/Firebase mobile and web app connecting clients with local service experts with SaaS subscription system.",
        fullDetails: "SaaS-like Flutter/Firebase multi-role platform (Client, Expert, Admin) for geolocated local services.\n\n• Hybrid authentication (Email/OTP SMS) + secure dynamic routing with GoRouter role filters and maintenance mode.\n• Freemium/Premium subscription system (99 MAD/month) with dynamic visibility control via Firestore batches.\n• Real-time KPI admin dashboard: revenue, registrations, document moderation (ID, background check), PDF/CSV export.\n• Firebase Firestore + FCM v1 + Cloudinary + flutter_map (interactive geolocation).",
        tech: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'FCM', 'Cloudinary', 'GoRouter', 'fl_chart', 'flutter_map'],
        github: 'https://github.com/oumaima650/PRESTO-marketplace_services_mobile_app.git',
        date: '2025-2026',
        images: [],
      },
      {
        id: 'proj-7',
        title: 'CHRIONLINE',
        category: 'Secure E-Commerce - Java',
        description: "Java 21 multi-client/server e-commerce platform with Defense-in-Depth architecture (TLS 1.3, JWT, AES-256 GCM, HashiCorp Vault, anti-DoS).",
        fullDetails: "Java e-commerce application built on TCP/UDP Sockets with multilayer security model.\n\n• Multithreaded Java 21 Virtual Threads server + TLS 1.3, JWT RS256 authentication with refresh tokens, reCAPTCHA and anti-replay protection.\n• Probabilistic AES-256 GCM encryption (PII at rest) + deterministic (secure SQL search without decryption).\n• Secret management via HashiCorp Vault + PKCS12 KeyStore + Argon2id/BCrypt derivation.\n• JavaFX desktop interface for clients and admins + Log4j2 audit trail.",
        tech: ['Java 21', 'Virtual Threads', 'TLS 1.3', 'JWT', 'AES-256', 'HashiCorp Vault', 'JavaFX', 'MySQL', 'Docker'],
        github: 'https://github.com/oumaima650/Application-E-Commerce-ChriOnline-.git',
        date: '2025',
        images: [],
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
