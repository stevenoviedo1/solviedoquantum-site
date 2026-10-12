import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContactForm from '../components/ContactForm';
import WebDevBenefits from '../components/WebDevBenefits';
import PerfOptBenefits from '../components/PerfOptBenefits';
import CosmicBackground from '../components/CosmicBackground';
import HeroLogo from '../components/HeroLogo';
import RotatingWords from '../components/RotatingWords';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { projectSections } from '../data/projects';
import { usePrefersReducedMotion } from '../lib/hooks';

const HERO_WORDS = [
  'high-performance websites.',
  'custom web apps.',
  'online ordering systems.',
  'browser games.',
  'the future of the web.',
];

const SERVICE_ICONS = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m14 4-4 16" />
    </svg>
  ),
  game: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 12h4M8 10v4" />
      <path d="M15 11h.01M18 13h.01" />
      <path d="M7.5 6h9a5.5 5.5 0 0 1 5.4 6.6l-.6 3.2a2.5 2.5 0 0 1-4.4 1.1L15.5 15h-7l-1.4 1.9a2.5 2.5 0 0 1-4.4-1.1l-.6-3.2A5.5 5.5 0 0 1 7.5 6Z" />
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.9 17.6A9 9 0 1 1 19.1 17.6" />
      <path d="m12 13 3.5-4.5" />
      <circle cx="12" cy="13.5" r="1.5" />
    </svg>
  ),
};

function ServiceIcon({ kind }) {
  return (
    <span className="inline-flex w-12 h-12 mb-5 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 [&>svg]:w-6 [&>svg]:h-6 group-hover:bg-cyan-400/20 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] transition">
      {SERVICE_ICONS[kind]}
    </span>
  );
}

function ProjectBadge({ project }) {
  const external = project.link.startsWith('http');
  const label = external ? 'Live' : project.fullPage ? 'Open' : 'View';
  return (
    <span
      className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-sm ${
        external
          ? 'text-cyan-200 border-cyan-400/40 bg-black/60'
          : 'text-purple-100 border-purple-400/40 bg-black/60'
      }`}
    >
      {external && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" aria-hidden="true" />}
      {label}
      {external && <span aria-hidden="true">↗</span>}
    </span>
  );
}

function HomePage() {
  const [showBenefits, setShowBenefits] = useState(false);
  const [showPerfBenefits, setShowPerfBenefits] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const navigate = useNavigate();

  // Honor hash links when landing on home (e.g. /#portfolio, /#contact)
  useEffect(() => {
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return undefined;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => window.clearTimeout(t);
  }, []);

  const openProject = (project) => {
    if (project.link.startsWith('http')) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else if (project.fullPage) {
      // Embedded standalone SPAs (planetary, nanoverse) — full document load
      window.location.assign(project.link);
    } else {
      navigate(project.link);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <CosmicBackground disabled={reduceMotion} />

      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        {/* Hero — logo is the first thing you see; headline + CTA stay above the fold on desktop */}
        <section
          id="home"
          className="relative min-h-[100svh] flex items-center px-5 sm:px-8 pt-24 pb-16 lg:pt-20 lg:pb-20"
        >
          <div className="pointer-events-none absolute inset-0 -z-[5] bg-[radial-gradient(ellipse_at_30%_45%,rgba(139,92,246,0.14),transparent_55%),radial-gradient(ellipse_at_75%_35%,rgba(34,211,238,0.08),transparent_50%)]" />

          <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-10 lg:gap-16 xl:gap-20">
            <HeroLogo reduceMotion={reduceMotion} />

            <div className="text-center lg:text-left">
              <p
                className="rise text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/90"
                style={{ '--d': '150ms' }}
              >
                Veteran-Owned · Weslaco, Texas
              </p>

              <h1
                className="rise mt-3 text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 bg-clip-text text-transparent"
                style={{ '--d': '250ms' }}
              >
                SolViedo Quantum
              </h1>

              <p
                className="rise mt-4 text-xl sm:text-2xl xl:text-[1.75rem] font-medium text-white/90"
                style={{ '--d': '350ms' }}
              >
                Producer and creative director shipping games and products with teams of AI agents.
              </p>

              <p
                className="rise mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
                style={{ '--d': '450ms' }}
              >
                From <span className="text-cyan-300 font-semibold">life-sim city games</span> to{' '}
                <span className="text-purple-300 font-semibold">custom web apps</span>, I direct teams of AI agents
                to build real shipped products. <span className="text-rose-300 font-semibold">No templates. No monthly fees. No lock-in.</span>
              </p>

              <div
                className="rise mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4"
                style={{ '--d': '550ms' }}
              >
                <a
                  href="/games"
                  className="w-full sm:w-auto px-9 py-3.5 text-base sm:text-lg font-bold text-center bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition shadow-2xl"
                >
                  Games →
                </a>
                <a
                  href="/how-i-build"
                  className="w-full sm:w-auto px-9 py-3.5 text-base sm:text-lg font-semibold text-center border border-purple-500/50 rounded-full hover:bg-purple-900/30 hover:border-cyan-400/60 transition"
                >
                  How I Build
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-9 py-3.5 text-base sm:text-lg font-semibold text-center border border-cyan-500/50 rounded-full hover:bg-cyan-900/30 hover:border-cyan-400/60 transition"
                >
                  Contact
                </a>
              </div>

              <dl
                className="rise mt-9 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-left"
                style={{ '--d': '650ms' }}
              >
                {[
                  { value: '3', label: 'games in development' },
                  { value: '78K+', label: 'players in Pitch Nations' },
                  { value: '100%', label: 'veteran-owned' },
                ].map((s) => (
                  <div key={s.label} className="min-w-[120px]">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                      {s.value}
                    </dd>
                    <dd className="text-xs sm:text-sm text-gray-400 mt-0.5">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <a
            href="#services"
            className="scroll-cue hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-[11px] uppercase tracking-[0.25em] text-gray-500 hover:text-cyan-300 transition"
            aria-label="Scroll to services"
          >
            Scroll
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </a>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-28 px-4 sm:px-6 bg-black/50">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/90 mb-3">
              What I do
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Services
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-12 md:mb-16">
              One developer, end to end — from first design to launch and beyond.
            </p>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <button
                type="button"
                onClick={() => {
                  setShowBenefits((v) => !v);
                  setShowPerfBenefits(false);
                }}
                aria-expanded={showBenefits}
                className="group text-left bg-gradient-to-br from-purple-900/20 to-black p-6 sm:p-8 md:p-9 rounded-2xl border border-purple-800/50 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <ServiceIcon kind="code" />
                <h3 className="text-xl sm:text-2xl md:text-[1.6rem] font-bold mb-3">Custom Websites & Web Apps</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Custom websites and web apps from scratch — online ordering (like La 88 Pizza), dashboards,
                  and SEO-friendly builds. No templates, no monthly platform fees, no lock-in.
                </p>
                <p className="mt-5 text-cyan-400 font-semibold">
                  {showBenefits ? 'Hide comparison ↑' : 'Click for comparison →'}
                </p>
              </button>

              <a
                href="/games"
                className="group bg-gradient-to-br from-cyan-900/20 to-black p-6 sm:p-8 md:p-9 rounded-2xl border border-cyan-800/50 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] transition-all duration-300 hover:-translate-y-1 block text-left"
              >
                <ServiceIcon kind="game" />
                <h3 className="text-xl sm:text-2xl md:text-[1.6rem] font-bold mb-3">Games</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Life-sim city games and football management games built with AI agent teams.
                  Grid City, Football Universe, and Pitch Nations — all in active development.
                </p>
                <p className="mt-5 text-cyan-400 font-semibold">See the games →</p>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowPerfBenefits((v) => !v);
                  setShowBenefits(false);
                }}
                aria-expanded={showPerfBenefits}
                className="group text-left bg-gradient-to-br from-purple-900/20 to-black p-6 sm:p-8 md:p-9 rounded-2xl border border-purple-800/50 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <ServiceIcon kind="speed" />
                <h3 className="text-xl sm:text-2xl md:text-[1.6rem] font-bold mb-3">Performance & SEO</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  High-performance, SEO-friendly builds. Core Web Vitals, lean code, and mobile-first speed
                  — built for higher Google ranking and real users on real phones.
                </p>
                <p className="mt-5 text-cyan-400 font-semibold">
                  {showPerfBenefits ? 'Hide details ↑' : 'Click for details →'}
                </p>
              </button>
            </div>

            {showBenefits && (
              <div className="mt-12 md:mt-16">
                <WebDevBenefits />
              </div>
            )}
            {showPerfBenefits && (
              <div className="mt-12 md:mt-16">
                <PerfOptBenefits />
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-28 px-4 sm:px-6 relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(34,211,238,0.07),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(139,92,246,0.08),transparent_55%)]" />

          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                About
              </h2>
              <p className="mt-3 text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                The person behind SolViedo Quantum.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-800/40 bg-gradient-to-br from-purple-950/30 via-black/60 to-cyan-950/20 p-5 sm:p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] gap-8 lg:gap-12 items-center">
                {/* Photo composition — primary + secondary stack */}
                <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                  {/* Main portrait */}
                  <div className="relative z-10 w-[78%] sm:w-[80%] rounded-2xl overflow-hidden border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.18)] ring-1 ring-white/5">
                    <div className="aspect-[4/5] bg-[#0a0e18]">
                      <img
                        src="/about/portrait.webp"
                        alt="Steven Oviedo — Web & Game Developer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-[center_15%]"
                      />
                    </div>
                    {/* pr keeps label clear of the overlapping military photo on mobile */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent pl-2.5 pr-[42%] sm:pr-[40%] py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-200 leading-tight">
                        <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        <span>
                          Now:{' '}
                          <span className="sm:hidden">Developer</span>
                          <span className="hidden sm:inline">Software Developer</span>
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Military photo — overlapping accent */}
                  <div className="absolute z-20 right-0 bottom-0 w-[48%] sm:w-[46%] rounded-2xl overflow-hidden border-2 border-purple-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_40px_rgba(139,92,246,0.25)] ring-1 ring-white/10 -mb-1">
                    <div className="aspect-[3/4] bg-[#0a0e18]">
                      <img
                        src="/about/military.jpg"
                        alt="Steven Oviedo serving in the U.S. Army"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-[center_18%]"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2 py-2">
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-purple-100 leading-tight">
                        <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
                        Before: U.S. Army
                      </span>
                    </div>
                  </div>

                  {/* Spacer so absolute military photo has room */}
                  <div className="pt-[18%] sm:pt-[16%]" aria-hidden="true" />
                </div>

                {/* Bio */}
                <div className="text-left min-w-0">
                  <p className="text-cyan-300 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-2">
                    Who I am
                  </p>
                  <h3 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white leading-tight">
                    Steven Oviedo
                  </h3>
                  <p className="text-base sm:text-lg text-purple-300/95 mt-2 mb-5 sm:mb-6">
                    Founder · U.S. Army Veteran · Weslaco, TX
                  </p>

                  <div className="h-px w-16 bg-gradient-to-r from-cyan-400 to-purple-500 mb-5 sm:mb-6" />

                  <div className="space-y-3.5 sm:space-y-4 text-gray-300 leading-relaxed text-[15px] sm:text-base md:text-lg">
                    <p>
                      Before software, I served in the{' '}
                      <span className="text-cyan-300 font-medium">U.S. Army</span>, then spent{' '}
                      <span className="text-cyan-300 font-medium">
                        three years as a Class A CDL truck driver
                      </span>
                      . That road taught me discipline and self-reliance — and it’s also where I
                      realized my real passion was computing.
                    </p>
                    <p>
                      Today I’m a{' '}
                      <span className="text-cyan-300 font-medium">
                        Computer Science student at UTRGV
                      </span>{' '}
                      and the founder of{' '}
                      <span className="text-purple-300 font-medium">
                        SolViedo Quantum
                      </span>{' '}
                      — a veteran-owned studio based in Weslaco, Texas. I direct teams of AI agents
                      (Cursor cloud agents, Claude, Grok) to build real shipped products, from life-sim city games
                      to custom web apps and online ordering systems.
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
                    {[
                      'Custom Web Apps',
                      'Game Dev',
                      'Next.js / React',
                      'Supabase',
                      'Unity',
                      'Performance',
                      'UTRGV · CS',
                      'U.S. Army Veteran',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full border border-purple-600/40 bg-black/40 text-cyan-200/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex mt-7 sm:mt-8 px-8 py-3.5 text-base font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-[0_10px_40px_rgba(34,211,238,0.2)]"
                  >
                    Work with me →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-16 md:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Portfolio
            </h2>
            <p className="text-base sm:text-xl text-gray-400 mb-10 md:mb-14">
              Client work, personal builds, and school projects
            </p>

            <div className="space-y-14 md:space-y-20 text-left">
              {projectSections.map((section) => (
                <div key={section.id}>
                  <div className="mb-6 md:mb-8 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-full border ${
                          section.id === 'customer'
                            ? 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10'
                            : section.id === 'fun'
                              ? 'text-purple-300 border-purple-500/40 bg-purple-500/10'
                              : 'text-amber-200 border-amber-500/40 bg-amber-500/10'
                        }`}
                      >
                        {section.id === 'customer'
                          ? 'Clients'
                          : section.id === 'fun'
                            ? 'Fun'
                            : 'School'}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400 mt-1">{section.subtitle}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {section.projects.map((project) => (
                      <div
                        key={project.id}
                        role="link"
                        tabIndex={0}
                        onClick={() => openProject(project)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openProject(project);
                          }
                        }}
                        className="group cursor-pointer bg-gradient-to-br from-purple-900/30 to-black p-5 sm:p-6 rounded-3xl border border-purple-800/50 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] transition-all duration-300 md:hover:-translate-y-1 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <div
                          className={`relative overflow-hidden rounded-2xl mb-5 h-52 sm:h-56 flex items-center justify-center ${
                            project.logoScale || project.imageFit === 'contain'
                              ? 'bg-[#070b14] ring-1 ring-inset ring-cyan-500/15'
                              : 'bg-gray-900'
                          }`}
                        >
                          <ProjectBadge project={project} />
                          <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full transition-transform duration-500 ${
                              project.logoScale
                                ? 'object-cover object-center scale-110 group-hover:scale-125'
                                : project.imageFit === 'contain'
                                  ? 'object-contain p-4 sm:p-6 group-hover:scale-[1.03]'
                                  : 'object-cover group-hover:scale-110'
                            }`}
                          />
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-cyan-400 transition">
                          {project.title}
                        </h3>

                        <p className="text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1 bg-purple-900/50 text-cyan-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-28 px-4 sm:px-6 bg-black/70">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-2">
              Steven Oviedo · Founder of SolViedo Quantum
            </p>
            <p className="text-base sm:text-lg text-cyan-300/90 mb-1">
              <a href="tel:+19567981222" className="hover:underline">
                (956) 798-1222
              </a>
            </p>
            <p className="text-base sm:text-lg mb-8 md:mb-10 break-all">
              <a href="mailto:Steven.oviedo1@gmail.com" className="text-cyan-400 hover:underline">
                Steven.oviedo1@gmail.com
              </a>
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default HomePage;
