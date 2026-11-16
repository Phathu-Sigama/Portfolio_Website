/**
 * Single source of truth for all CV content.
 * Both the desktop (Phathu OS 9) and mobile (Phathu Mobile) interfaces read from this file.
 * Everything here is taken from Phathu_Sigama_CV_2026.pdf — do not add details that are not on the CV.
 */

export type SectionId =
  | "profile"
  | "education"
  | "projects"
  | "experience"
  | "skills"
  | "certifications"
  | "contact";

export interface Section {
  id: SectionId;
  label: string;
  /** Short description used for accessible names and list views. */
  summary: string;
}

export interface Identity {
  name: string;
  title: string;
  degree: string;
  location: string;
  expected: string;
}

export interface EducationEntry {
  qualification: string;
  institution: string;
  status: string;
  subjects?: string[];
}

export interface ExperienceEntry {
  role: string;
  organisation: string;
  period: string;
  highlights: string[];
}

export interface ProjectEntry {
  name: string;
  tagline?: string;
  status?: string;
  context?: string;
  link?: { label: string; href: string };
  stack: string[];
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Contact {
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  /** Full profile URL; set to null to show the "not linked yet" state instead. */
  github: string | null;
  /** Full profile URL; null shows the "not linked yet" state. */
  linkedin: string | null;
  cvFile: string;
  cvFileName: string;
}

export interface CV {
  identity: Identity;
  profile: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillGroup[];
  certifications: Certification[];
  leadership: string[];
  references: string;
  contact: Contact;
}

export const sections: Section[] = [
  { id: "profile", label: "Profile", summary: "Who I am and what I am looking for" },
  { id: "education", label: "Education", summary: "Degree and schooling" },
  { id: "projects", label: "Projects", summary: "Technical and business projects" },
  { id: "experience", label: "Experience", summary: "Tutoring, internship and volunteer work" },
  { id: "skills", label: "Skills", summary: "Languages, frameworks and tools" },
  { id: "certifications", label: "Certifications", summary: "Certificates and courses" },
  { id: "contact", label: "Contact", summary: "Email, phone and CV download" },
];

export const cv: CV = {
  identity: {
    name: "Phathu Sigama",
    title: "Software Developer",
    degree: "BCom Information Systems",
    location: "Cape Town, South Africa",
    expected: "Expected completion: 2026",
  },

  profile: [
    "Final-year Bachelor of Commerce (Information Systems) student at the University of Cape Town with a strong interest in software development, cloud technologies and building scalable technology solutions. I enjoy turning ideas and business requirements into functional applications, working across the software development lifecycle from requirements and system design through to development, testing and deployment.",
    "My experience includes developing software and IoT applications, working with technologies such as Python, C#, FastAPI, ASP.NET, PostgreSQL and cloud platforms, as well as exposure to enterprise systems consulting and business process digitisation. I am seeking a software development internship where I can strengthen my engineering skills, contribute to real-world projects and gain experience working within a professional development team on larger production systems.",
  ],

  education: [
    {
      qualification: "Bachelor of Commerce in Information Systems",
      institution: "University of Cape Town",
      status: "Expected completion: 2026",
    },
    {
      qualification: "National Senior Certificate",
      institution: "Crawford International Ruimsig",
      status: "Completed: 2023",
      subjects: [
        "Accounting",
        "Computer Applications Technology",
        "Life Orientation",
        "Business Studies",
        "Information Technology",
        "Mathematics",
        "English Home Language",
        "Afrikaans First Additional Language",
      ],
    },
  ],

  experience: [
    {
      role: "Information Systems Tutor",
      organisation: "University of Cape Town",
      period: "Feb 2025 – Jun 2026",
      highlights: [
        "Facilitated weekly tutorials for INF1002F/S students, supporting a large first-year cohort.",
        "Assisted students with systems analysis, Excel, Python and core Information Systems concepts.",
        "Guided students through practical coursework and assignments, and ran consultation sessions to strengthen understanding.",
        "Fostered collaborative learning and critical thinking, developing strong communication, mentoring and leadership skills.",
      ],
    },
    {
      role: "Information Systems Intern",
      organisation: "DotBlack",
      period: "One-month vacation internship",
      highlights: [
        "Participated in client consultation and solution discovery meetings.",
        "Analysed API documentation to understand integrations with the Symbility platform.",
        "Assisted in translating business requirements into high-level implementation plans.",
        "Worked alongside implementation consultants on systems integration and deployment, gaining practical exposure to REST APIs, enterprise software projects and technical documentation.",
      ],
    },
    {
      role: "Volunteer Work",
      organisation: "She Is Power (Non-Profit Organisation)",
      period: "Volunteer",
      highlights: [
        "Led the digitisation of the organisation's payment collection process, introducing and implementing the Yoco payment platform.",
        "Redesigned payment collection and reconciliation workflows, replacing manual processes with digital systems.",
        "Developed structured systems for recording and managing payments, improving financial administration.",
        "Worked with stakeholders to identify operational challenges and recommend technology-driven solutions.",
      ],
    },
  ],

  projects: [
    {
      name: "HiveMind",
      tagline: "Smart Beehive Monitoring Platform",
      status: "Complete",
      context: "University team project · Software Developer",
      link: { label: "www.beehivemind.co.za", href: "https://www.beehivemind.co.za" },
      stack: [
        "Python",
        "FastAPI",
        "CouchDB",
        "MQTT",
        "ESP32/C++",
        "JavaScript",
        "HTML/CSS",
        "JWT",
        "bcrypt",
        "GitHub Actions",
        "Docker",
      ],
      highlights: [
        "Developed an end-to-end IoT platform that collects real-time beehive data from ESP32-connected sensors via MQTT and HTTP and presents it through a responsive monitoring dashboard.",
        "Built the Python/FastAPI backend with JWT and bcrypt authentication, sensor validation, duplicate detection and CouchDB persistence.",
        "Implemented alerts, device-health monitoring, reporting, browser-based device onboarding, Home Assistant and Telegram integrations, and automated deployment.",
      ],
    },
    {
      name: "Touchline",
      tagline: "Sports Data Platform",
      stack: [
        "Python",
        "FastAPI",
        "SQLAlchemy",
        "PostgreSQL/Supabase",
        "Sportmonks API",
        "APScheduler",
        "HTTPX",
        "Flyway",
        "Docker",
      ],
      highlights: [
        "Contributed to the backend design and development of a football data platform for collecting and processing sports statistics.",
        "Handled data modelling, API integration and database design for match and player statistics.",
        "Implemented automated scheduling and data synchronisation to keep datasets current.",
      ],
    },
    {
      name: "SANPC Credit Customer Onboarding",
      context: "Business Process Improvement Project · SANPC (SFF)",
      stack: ["IGOE process scoping", "Tableau"],
      highlights: [
        "Collaborated in a five-person team to analyse and redesign customer onboarding through credit establishment.",
        "Developed IGOE process scoping and Tableau reporting prototypes to identify delays, track document exceptions and monitor onboarding performance.",
        "Recommended improvements to turnaround times, accountability and credit controls.",
      ],
    },
  ],

  skills: [
    { category: "Languages", items: ["Python", "C#", "C++", "SQL", "JavaScript", "HTML", "CSS"] },
    { category: "Frameworks & APIs", items: ["FastAPI", "ASP.NET", "REST APIs", "HTTP"] },
    {
      category: "Data & IoT",
      items: ["PostgreSQL", "CouchDB", "MQTT", "ESP32", "Sensor validation", "Device health monitoring"],
    },
    { category: "DevOps & Tools", items: ["Git", "GitHub", "GitHub Actions", "Docker", "Excel", "Tableau", "Figma (basic)"] },
    { category: "Security & Integrations", items: ["JWT", "bcrypt", "Home Assistant", "Telegram"] },
    {
      category: "Business Analysis",
      items: ["IGOE process scoping", "Process redesign", "Requirements analysis", "Reporting prototypes"],
    },
  ],

  // The CV lists no certifications. Leave empty until real ones exist — the UI shows an honest empty state.
  certifications: [],

  leadership: [
    "Information Systems Tutor, University of Cape Town (2025–2026).",
    "Information Systems Volunteer, She Is Power.",
  ],

  references: "Available on request.",

  contact: {
    email: "phathu.sigama23@gmail.com",
    phone: "071-742-6112",
    phoneHref: "tel:+27717426112",
    location: "Cape Town, South Africa",
    github: "https://github.com/Phathu-Sigama",
    linkedin: "https://www.linkedin.com/in/phathu-sigama-805b82432/",
    cvFile: "/Phathu_Sigama_CV_2026.pdf",
    cvFileName: "Phathu_Sigama_CV_2026.pdf",
  },
};

export function isSectionId(value: string): value is SectionId {
  return sections.some((s) => s.id === value);
}

/** A run of text, optionally bold or linked. */
export type RichText = string | { text: string; href?: string; strong?: boolean };

/** "About Phathu OS" copy, shown in the desktop About window and the mobile Settings app. */
export const about: RichText[][] = [
  [
    { text: "Phathu OS", strong: true },
    " is a responsive CV portfolio inspired by classic Mac OS interfaces, early iPhone home screens and experimental websites such as ",
    { text: "NRTHVIEW", href: "https://nrthview.com/" },
    ", ",
    { text: "Henry Heffernan", href: "https://henryheffernan.com/" },
    " and ",
    { text: "AWGE", href: "https://www.awge.com/" },
    ". ",
    { text: "asiagawron.com", href: "https://asiagawron.com/" },
    " is a huge style inspiration.",
  ],
  [
    "The retro direction reflects my love for old-school technology and physical media. I’m passionate about ",
    { text: "film photography", href: "https://www.instagram.com/by.phathu" },
    " and enjoy collecting vinyl records, so I wanted the website to carry the same sense of character, nostalgia and tactility.",
  ],
  [
    "The interface was shaped using the ",
    {
      text: "Mac OS 9 Figma UI Kit",
      href: "https://www.figma.com/design/iYbV41iKFzK2ApTA8LxAr4/Mac-OS-9--UI-Kit--Community-",
    },
    " as a visual reference, then reimagined through ",
    { text: "my own Figma mockups", href: "https://www.figma.com/design/4vrjRerrCB0YNkmhGDgQkv" },
    " with custom Phathu OS branding and components. Each icon opens a section of my CV, transforming a traditional portfolio into an interactive desktop and mobile experience. AI was used throughout the design and development process to explore concepts, generate visual directions and assist in building the final website.",
  ],
];

export interface SocialLink {
  id: "linkedin" | "github";
  label: string;
  href: string | null;
}

/** Shown in the "Social Media" window (desktop) and app (mobile). */
export const socials: SocialLink[] = [
  { id: "linkedin", label: "LinkedIn", href: cv.contact.linkedin },
  { id: "github", label: "GitHub", href: cv.contact.github },
];
