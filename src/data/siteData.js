export const profile = {
  name: "Murali Manohar Vatlapati",
  firstName: "Murali",
  role: "Computer Science & Engineering student",
  university: "PES University",
  location: "Bengaluru, India",
  email: "vatlapatim@gmail.com",
  github: "https://github.com/vatlapatim-art",
  githubRepo: "https://github.com/vatlapatim-art/murali-portfolio",
  linkedin: "https://www.linkedin.com/in/murali-manohar-vatlapati-3923b4417/",
  resume: "",
  intro:
    "I like turning complicated problems into software people can actually use. I build across systems, geospatial data, AI-assisted products, and interactive web experiences — learning something new with every project.",
  availability: "Open to internships, collaborations & interesting problems",
  funFact:
    "Outside the editor, I enjoy finding scenic roads, going on motorcycle rides, and turning travel moments into short videos. A good project and a good road trip both start with curiosity.",
  motto: "Stay curious. Build things that matter. Take the scenic route.",
};

export const skills = [
  { group: "Languages", items: ["C", "Python", "JavaScript", "SQL"] },
  { group: "Frontend", items: ["React", "Vite", "HTML & CSS", "Three.js", "Responsive UI"] },
  { group: "Backend & data", items: ["FastAPI", "REST APIs", "Supabase", "Firebase", "PostgreSQL"] },
  { group: "Data & systems", items: ["Pandas", "NumPy", "SciPy", "Scikit-learn", "GeoPandas", "Rasterio", "Linux"] },
  { group: "Tools & cloud", items: ["Git & GitHub", "VS Code", "WSL", "Google Earth Engine", "AWS Amplify"] },
];

export const projects = [
  {
    number: "01",
    name: "CycloneShield",
    category: "Climate intelligence · Geospatial",
    description:
      "A geospatial disaster-intelligence platform that brings cyclone observations, satellite-derived flood evidence, rainfall, terrain, wind fields, storm-surge scenarios, and infrastructure exposure into one interactive workflow.",
    details: ["React", "FastAPI", "Google Earth Engine", "Sentinel-1", "OpenStreetMap", "Gemini API"],
    status: "Prototype · In development",
    accent: "mint",
    icon: "◉",
    highlights: [
      "Combines cyclone, weather, satellite, terrain, and infrastructure information for impact exploration.",
      "Uses Google Earth Engine with Sentinel-1 flood evidence, CHIRPS rainfall, and NASADEM terrain data.",
      "Includes risk, exposure, scenario, and AI-assisted impact-brief workflows.",
    ],
    github: "https://github.com/vatlapatim-art/CycloneShield",
    demo: "",
  },
  {
    number: "02",
    name: "AEGIS",
    category: "Voice-first agent · DevOps / SRE",
    description:
      "A voice-first technical operations agent focused on a hard real-time interaction problem: keeping tool results and spoken responses consistent when a user interrupts and changes the request.",
    details: ["TypeScript", "Voice interaction", "Generation fencing", "Tool orchestration"],
    status: "Project prototype",
    accent: "blue",
    icon: "◈",
    highlights: [
      "Uses generation IDs so only the latest user request can update active conversation state.",
      "Prevents stale tool results or obsolete audio from re-entering the active response after an interruption.",
      "Explores reliable interruption and recovery for DevOps / SRE workflows.",
    ],
    github: "https://github.com/vatlapatim-art/AEGIS",
    demo: "",
  },
  {
    number: "03",
    name: "CampusCompute",
    category: "Operating systems · C programming",
    description:
      "A command-line distributed job-queue prototype that models worker management, scheduling decisions, resource constraints, and failure handling through OS concepts.",
    details: ["C", "Linux / WSL", "FCFS · SJF · Priority", "Banker's algorithm"],
    status: "Academic project",
    accent: "orange",
    icon: "⌘",
    highlights: [
      "Submit, queue, and dispatch jobs to simulated workers.",
      "Compare FCFS, SJF, and priority scheduling approaches.",
      "Check safe resource allocation and demonstrate worker-failure recovery.",
    ],
    github: "",
    demo: "",
  },
  {
    number: "04",
    name: "Social Network Clustering",
    category: "Graph algorithms · Linear algebra · 3D",
    description:
      "An analytical engine and immersive 3D visualization that explores how spectral graph theory can reveal hidden communities in a social network.",
    details: ["Python", "FastAPI", "React", "Three.js", "NetworkX", "NumPy · SciPy"],
    status: "University mini-project",
    accent: "purple",
    icon: "⌘",
    highlights: [
      "Builds adjacency, degree, and graph Laplacian matrices from network connections.",
      "Extracts eigenvalues and the Fiedler vector, then applies spectral k-means for configurable community detection.",
      "Explores node relationships in a React Three Fiber WebGL scene, with rotation, pan, zoom, and neighbor highlighting.",
      "Includes matrix inspection, eigenvalue analysis, graph statistics, centrality rankings, and shortest-path exploration.",
    ],
    architecture: [
      { title: "Frontend", stack: "React · Vite · React Three Fiber · Three.js", note: "Interactive 3D network canvas" },
      { title: "API layer", stack: "REST requests · FastAPI · Python", note: "Connects the interface to graph computation" },
      { title: "Graph engine", stack: "NetworkX · NumPy · SciPy · scikit-learn", note: "Matrices · eigenvectors · spectral k-means · centrality" },
    ],
    github: "https://github.com/vatlapatim-art/Social_Network_Clustering",
    demo: "",
  },
  {
    number: "05",
    name: "SmartStudy",
    category: "EdTech · AI-assisted learning",
    description:
      "An adaptive study workspace that connects planning, focused sessions, active recall, notes, learning analytics, and an AI study coach in one learning loop.",
    details: ["React", "Vite", "Supabase", "PostgreSQL", "Edge Functions", "Gemini API"],
    status: "Project build · Demo available",
    accent: "pink",
    icon: "✳",
    highlights: [
      "Includes an adaptive planner, knowledge map, focus mode, and active-recall workflows.",
      "Uses Supabase Auth and PostgreSQL for authenticated, persistent study workspaces.",
      "Routes AI requests through a Supabase Edge Function rather than exposing the Gemini key in the browser.",
    ],
    github: "https://github.com/vatlapatim-art/SmartStudy",
    demo: "https://smartstudy-iwc3.onrender.com",
  },
  {
    number: "06",
    name: "Arthiq",
    category: "FinTech · Financial confidence",
    description:
      "A financial-confidence workspace that turns budgets, goals, quiz answers, and portfolio information into explainable insights and practical next steps — not a trading app.",
    details: ["React", "Vite", "Firebase Auth", "Firestore", "Supabase Edge Functions"],
    status: "Project build · Live demo",
    accent: "blue",
    icon: "↗",
    highlights: [
      "Includes budgeting, emergency-fund planning, goal tracking, and portfolio-workspace features.",
      "Uses a deterministic calculation engine so scores and recommendations can be explained.",
      "Combines Firebase Auth / Firestore with a server-side AI chat function.",
    ],
    github: "https://github.com/vatlapatim-art/Arthiq",
    demo: "https://arthiq-tau.vercel.app/",
  },
];

export const milestones = [
  {
    date: "AUG 2026",
    title: "CodeFury 9.0 — Consolation Prize",
    detail: "Received a consolation prize at the IEEE UVCE Computer Society national-level hackathon.",
    type: "Hackathon award",
  },
  {
    date: "2026",
    title: "DataForge 2026 — IIT Kharagpur",
    detail: "Participated in the DataForge hackathon organised by the Kharagpur Data Analytics Group.",
    type: "Hackathon participation",
  },
  {
    date: "2026",
    title: "Building across the stack",
    detail: "Exploring cloud, data, systems programming, AI-assisted products, and full-stack development through hands-on projects.",
    type: "Learning",
  },
  {
    date: "NOW",
    title: "Computer Science & Engineering",
    detail: "Learning, experimenting, and building at PES University, Bengaluru.",
    type: "Education",
  },
];

export const certificates = [
  {
    title: "CodeFury 9.0 — Consolation Prize",
    issuer: "IEEE UVCE Computer Society · Bengaluru",
    date: "August 21–23, 2026",
    description: "Certificate of appreciation recognising the consolation prize at the national-level CodeFury 9.0 hackathon.",
    image: "/certificates/codefury-9-preview.webp",
    file: "/certificates/codefury-9-consolation-prize.pdf",
    label: "Award",
  },
  {
    title: "DataForge 2026 — Participation",
    issuer: "Kharagpur Data Analytics Group · IIT Kharagpur",
    date: "2026",
    description: "Certificate of participation in DataForge Hackathon 2026.",
    image: "/certificates/dataforge-2026-preview.webp",
    file: "/certificates/dataforge-2026.pdf",
    label: "Participation",
  },
];

export const terminalCommands = {
  help: {
    title: "Available commands",
    lines: [
      "about          — a quick introduction",
      "skills         — technologies in my toolkit",
      "projects       — list the things I've built",
      "open <name>    — inspect a project (try: open cycloneshield)",
      "achievements   — milestones and highlights",
      "contact        — ways to get in touch",
      "secret         — one fact beyond the keyboard",
      "clear          — clear this terminal",
    ],
  },
  about: {
    title: "whoami",
    lines: [
      "Murali Manohar Vatlapati",
      "Computer Science & Engineering student @ PES University, Bengaluru",
      "Interested in systems, geospatial data, AI-assisted products, and useful web apps.",
      "Current approach: stay curious, build small, iterate often.",
    ],
  },
  skills: {
    title: "toolkit --list",
    lines: [
      "Languages: C · Python · JavaScript · SQL",
      "Frontend: React · Vite · Three.js · HTML · CSS",
      "Backend: FastAPI · REST APIs · Supabase · Firebase",
      "Data: Pandas · NumPy · SciPy · Scikit-learn · GeoPandas",
      "Tools: Git · GitHub · Linux / WSL · Google Earth Engine · AWS Amplify",
      "Always learning — the list is a work in progress.",
    ],
  },
  projects: {
    title: "ls ./projects",
    lines: [
      "01  CycloneShield             cyclone & flood intelligence",
      "02  AEGIS                     voice-first DevOps / SRE agent",
      "03  CampusCompute             job queues & OS concepts in C",
      "04  Social Network Clustering spectral graph communities",
      "05  SmartStudy                adaptive AI-assisted study workspace",
      "06  Arthiq                    financial confidence workspace",
      "Tip: type open <name> to inspect one.",
    ],
  },
  achievements: {
    title: "cat ./milestones.txt",
    lines: [
      "AUG 2026  CodeFury 9.0 — Consolation Prize",
      "2026      DataForge 2026 — IIT Kharagpur participation",
      "NOW       CSE student at PES University, Bengaluru",
    ],
  },
  contact: {
    title: "./connect.sh",
    lines: [
      "Email: vatlapatim@gmail.com",
      "GitHub: github.com/vatlapatim-art",
      "LinkedIn: linkedin.com/in/murali-manohar-vatlapati-3923b4417",
      "The best conversations start with a good problem.",
    ],
  },
  secret: {
    title: "✨ easter-egg unlocked",
    lines: [
      "Not every adventure happens in a terminal.",
      "I enjoy motorcycle rides, scenic roads, and making travel videos.",
      "Curiosity fuels both the code I write and the routes I take.",
      "You found the little detail most portfolios leave out. 🏍",
    ],
  },
};
