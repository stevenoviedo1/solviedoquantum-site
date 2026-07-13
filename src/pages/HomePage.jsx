import { useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useNavigate, Link } from 'react-router-dom';

import ContactForm from '../components/ContactForm';
import WebDevBenefits from '../components/WebDevBenefits';
import PerfOptBenefits from '../components/PerfOptBenefits';
import logo from '../assets/logo.jpg';
import { projectSections } from '../data/projects';

function HomePage() {
  const [init, setInit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showPerfBenefits, setShowPerfBenefits] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Honor hash links when landing on home (e.g. /#portfolio, /#contact)
  useEffect(() => {
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => window.clearTimeout(t);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const openProject = (project) => {
    if (project.link.startsWith('http')) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(project.link);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Cosmic Particle Background */}
      {init && !reduceMotion && (
        <Particles
          id="tsparticles"
          options={{
            background: { color: { value: '#000' } },
            fpsLimit: isMobile ? 30 : 60,
            particles: {
              color: { value: ['#8b5cf6', '#06b6d4'] },
              links: {
                color: '#8b5cf6',
                distance: 150,
                enable: true,
                opacity: 0.25,
                width: 1,
              },
              move: { enable: true, speed: 1 },
              number: { density: { enable: true, area: 800 }, value: isMobile ? 14 : 36 },
              opacity: { value: { min: 0.3, max: 0.6 } },
              shape: { type: 'circle' },
              size: { value: { min: 1, max: 4 } },
            },
            detectRetina: true,
            pauseOnBlur: true,
            pauseOnOutsideViewport: true,
          }}
          className="absolute inset-0 -z-10"
          aria-hidden="true"
        />
      )}

      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-purple-900/30"
        aria-label="Primary"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
          >
            SolViedo Quantum
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-base lg:text-lg font-medium">
            <a href="#home" className="hover:text-cyan-400 transition">
              Home
            </a>
            <a href="#services" className="hover:text-cyan-400 transition">
              Services
            </a>
            <a href="#about" className="hover:text-cyan-400 transition">
              About
            </a>
            <a href="#portfolio" className="hover:text-cyan-400 transition">
              Portfolio
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition">
              Contact
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-3xl leading-none p-2 -mr-2"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-black/95 backdrop-blur-lg px-6 py-8 text-xl space-y-6 text-center border-t border-purple-900/30"
          >
            <a href="#home" onClick={closeMenu} className="block hover:text-cyan-400 transition">
              Home
            </a>
            <a href="#services" onClick={closeMenu} className="block hover:text-cyan-400 transition">
              Services
            </a>
            <a href="#about" onClick={closeMenu} className="block hover:text-cyan-400 transition">
              About
            </a>
            <a href="#portfolio" onClick={closeMenu} className="block hover:text-cyan-400 transition">
              Portfolio
            </a>
            <a href="#contact" onClick={closeMenu} className="block hover:text-cyan-400 transition">
              Contact
            </a>
          </div>
        )}
      </nav>

      <main id="main">
        {/* Hero Section — logo + headline + CTA all above the fold */}
        <section
          id="home"
          className="min-h-[100svh] flex flex-col items-center justify-center px-5 sm:px-6 pt-16 sm:pt-20 pb-10 text-center"
        >
          <div className="mb-6 sm:mb-10 flex items-center justify-center">
            <img
              src={logo}
              alt="SolViedo Quantum Logo"
              width={650}
              height={650}
              fetchPriority="high"
              className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[650px] h-auto object-contain"
              style={{
                filter:
                  'drop-shadow(0 0 32px rgba(103,232,249,0.9)) drop-shadow(0 0 64px rgba(139,92,246,0.8))',
              }}
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            SolViedo Quantum
          </h1>
          <p className="text-base sm:text-xl md:text-2xl mt-3 text-cyan-300">
            Building the future of the web.
          </p>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-gray-300 leading-relaxed">
            Drive more customers with a{' '}
            <span className="text-cyan-400 font-bold">high-performance website</span>.
            Custom-coded for{' '}
            <span className="text-purple-400 font-bold">blazing speed</span> &amp;{' '}
            <span className="text-purple-400 font-bold">higher Google ranking</span>.
            Unlimited design, real-time features, seamless scaling.{' '}
            <span className="text-rose-400 font-bold">No templates. No monthly fees. No lock-in.</span>
          </p>

          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <a
              href="#contact"
              className="px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-2xl"
            >
              Get Started →
            </a>
            <a
              href="#portfolio"
              className="px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold border border-purple-700/70 rounded-full hover:bg-purple-900/30 transition"
            >
              View Portfolio
            </a>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-28 px-4 sm:px-6 bg-black/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 md:mb-16 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <button
                type="button"
                onClick={() => {
                  setShowBenefits((v) => !v);
                  setShowPerfBenefits(false);
                }}
                aria-expanded={showBenefits}
                className="text-left bg-gradient-to-br from-purple-900/20 to-black p-8 md:p-10 rounded-2xl border border-purple-800/50 hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Custom Web Development</h3>
                <p className="text-gray-300">
                  Sites and full web apps from scratch — marketing pages, online ordering,
                  dashboards, and realtime features. Next.js, React, and modern backends.
                </p>
                <p className="mt-5 text-cyan-400 font-semibold">
                  {showBenefits ? 'Hide comparison ↑' : 'Click for comparison →'}
                </p>
              </button>

              <a
                href="#portfolio"
                className="bg-gradient-to-br from-cyan-900/20 to-black p-8 md:p-10 rounded-2xl border border-cyan-800/50 hover:border-cyan-400 transition-all duration-300 hover:scale-[1.02] block"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Game Development</h3>
                <p className="text-gray-300">
                  Browser and Unity WebGL games, multiplayer products, and interactive
                  experiences — built to play, not just look cool.
                </p>
                <p className="mt-5 text-cyan-400 font-semibold">See game projects →</p>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowPerfBenefits((v) => !v);
                  setShowBenefits(false);
                }}
                aria-expanded={showPerfBenefits}
                className="text-left bg-gradient-to-br from-purple-900/20 to-black p-8 md:p-10 rounded-2xl border border-purple-800/50 hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Performance Optimization</h3>
                <p className="text-gray-300">
                  Core Web Vitals, lean code, and mobile-first speed — built for SEO,
                  conversions, and real users on real phones.
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
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2.5 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        Now: Software Developer
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
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2.5 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-purple-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
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
                    Founder of SolViedo Quantum
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
                      and the founder of SolViedo Quantum — partnering with local businesses
                      and ambitious projects, from restaurant ordering systems to multiplayer
                      games and security tools.
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
                        role="button"
                        tabIndex={0}
                        onClick={() => openProject(project)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openProject(project);
                          }
                        }}
                        className="group cursor-pointer bg-gradient-to-br from-purple-900/30 to-black p-5 sm:p-6 rounded-3xl border border-purple-800/50 hover:border-cyan-400 transition-all duration-300 md:hover:scale-[1.02] overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <div
                          className={`relative overflow-hidden rounded-2xl mb-5 h-52 sm:h-56 flex items-center justify-center ${
                            project.logoScale || project.imageFit === 'contain'
                              ? 'bg-[#070b14] ring-1 ring-inset ring-cyan-500/15'
                              : 'bg-gray-900'
                          }`}
                        >
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
              Steven Oviedo · Web &amp; Game Developer
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
    </div>
  );
}

export default HomePage;
