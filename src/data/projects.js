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
        id: "quantumstock",
        title: "Quantum Stock Game",
        description:
          "Live multiplayer paper-trading product: shared realtime market, Research Dex, Companion AI, portfolio & banking tools, plus paper casino (Hold'em & horse racing). Live at quantumstockgame.com.",
        image: "/quantumstockgame-v2.jpg",
        imageFit: "cover",
        link: "https://quantumstockgame.com",
        tags: ["Next.js", "Supabase", "Trading Sim", "AI", "Multiplayer"],
      },
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
        id: "hostedinvite",
        title: "HostedInvite",
        description:
          "Done-for-you event hubs: custom guest pages, RSVPs, QR codes, host dashboard, Design Studio themes, and package booking. Live at hostedinvite.com.",
        image: "/hostedinvite-v3.jpg",
        imageFit: "cover",
        link: "https://hostedinvite.com",
        tags: ["Next.js", "Neon", "Stripe", "RSVP", "Events"],
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
        id: "waveform",
        title: "Waveform",
        description:
          "Original genre: Waveform Strategy. Chess-depth quantum tactics — prepare ghost futures, force collapses, outthink the field. Full campaign, GPU-powered 3D board, deterministic skill (no hit-roll casino).",
        image: "/og-image.jpg",
        imageFit: "cover",
        link: "/waveform",
        tags: ["Waveform Strategy", "Tactics", "WebGPU/WebGL", "Campaign"],
      },
      {
        id: "planetary",
        title: "Walkable Worlds",
        description:
          "Stand on other worlds in the browser. Mars-first WebGPU explorer — orbit, descend, walk Jezero; Earth, Moon, Venus, exoplanet systems; Cosmic Radio. Hosted on this site.",
        image: "/planetary/og-default.png",
        imageFit: "cover",
        link: "/planetary/",
        fullPage: true,
        tags: ["WebGPU", "Three.js", "Planets", "Mars", "Education"],
      },
      {
        id: "nanoverse",
        title: "Nanoverse",
        description:
          "Public WebGPU lab for regenerative nanotech education — body nano-shell demos, how nanos communicate, hex Studio. Science vs speculation labeled. Hosted on this site.",
        image: "/og-image.jpg",
        imageFit: "cover",
        link: "/nanoverse/",
        fullPage: true,
        tags: ["WebGPU", "Three.js", "Nanotech", "Education", "Studio"],
      },
      {
        id: "spi-bridge",
        title: "SPI Bridge Runner",
        description:
          "Godot endless runner on the Queen Isabella Causeway — dodge hazards, collect power-ups, outrun the Evil Vaquero. Desktop Windows build (download from this site or itch.io); too graphics-heavy for browser play.",
        image: "/spi-bridge-runner.png",
        imageFit: "contain",
        link: "/spi-bridge-runner",
        tags: ["Godot", "Endless Runner", "Windows", "itch.io"],
      },
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
