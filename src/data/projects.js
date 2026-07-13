/**
 * Portfolio projects, grouped for the homepage.
 * category: "customer" | "fun" | "school"
 */
export const projectSections = [
  {
    id: "customer",
    title: "Client & Product Work",
    subtitle: "Shipped for customers and real-world use",
    projects: [
      {
        id: "la88",
        title: "La 88 Pizza",
        description:
          "Full restaurant website with online ordering, kitchen display board, owner dashboard, thermal receipt printing, and order confirmation emails.",
        image: "/la88.jpg",
        link: "https://www.la88pizza.com",
        tags: ["Next.js", "Supabase", "Restaurant", "Online Ordering"],
      },
      {
        id: "quantumstock",
        title: "Quantum Stock Game",
        description:
          "Live multiplayer paper-trading product: shared realtime market, Research Dex, Companion AI, portfolio & banking tools, plus paper casino (Hold'em & horse racing). Live at quantumstockgame.com.",
        image: "/quantumstockgame-v2.jpg",
        imageFit: "cover",
        link: "https://quantumstockgame.com",
        tags: ["Next.js", "Supabase", "Trading Sim", "AI", "Multiplayer"],
      },
    ],
  },
  {
    id: "school",
    title: "School Projects",
    subtitle: "Course finals and academic builds",
    projects: [
      {
        id: "zombies",
        title: "Zombie Rounds",
        description:
          "Built for Introduction to Computer Science final. Fast-paced top-down zombie survival shooter — survive endless waves in an arena-style Unity WebGL game.",
        image: "/zombiesgamescreenshot.png",
        link: "/zombies",
        tags: ["Unity", "WebGL", "Shooter", "Survival"],
      },
      {
        id: "ww3",
        title: "WW3 Simulator",
        description:
          "Built for Introduction to Python final. Turn-based strategy game — play as USA against 8 AI countries in a last-nation-standing battle using OOP.",
        image: "/ww3.jpg",
        link: "/ww3",
        tags: ["Python", "OOP", "Game Logic", "AI"],
      },
    ],
  },
  {
    id: "fun",
    title: "Fun & Personal Projects",
    subtitle: "Experiments, games, and side builds",
    projects: [
      {
        id: "phishguard",
        title: "PhishGuard — Phishing Detector",
        description:
          "Multi-signal phishing shield: brand spoofing, URL forensics, header intel, on-device ML ensemble, Chrome MV3 extension, and desktop Threat Console with PDF reports.",
        image: "/phishguard-v2.jpg",
        imageFit: "cover",
        link: "/phishguard",
        tags: ["Chrome Extension", "Python", "ML", "Security", "Streamlit"],
      },
      {
        id: "resonance",
        title: "Connect Resonance",
        description:
          "A calm journaling platform where users can write privately and selectively share reflections to a collective feed. 'Where truths connect.'",
        image: "/resonance-v2.jpg",
        imageFit: "cover",
        link: "https://connectresonance.com/",
        tags: ["Full Stack", "Journaling", "Social", "Web App"],
      },
      {
        id: "qfh",
        title: "Quantum Fairness Hub",
        description:
          "Provably fair randomness tools using cryptographically secure hardware entropy. Winner picker, coin flip, lottery, team splitter & more.",
        image: "/qfh-v2.jpg",
        imageFit: "cover",
        link: "/quantum-fairness-hub",
        tags: ["JavaScript", "Crypto", "Fairness Tools"],
      },
    ],
  },
];

/** Flat list (for anything that still expects a single array) */
export const projects = projectSections.flatMap((s) => s.projects);
