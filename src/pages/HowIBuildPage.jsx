import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import CosmicBackground from '../components/CosmicBackground';
import { usePrefersReducedMotion } from '../lib/hooks';

const qualityRules = [
  {
    title: 'Every face is unique',
    description: 'No repeated portraits across 78,375 players — each character has a distinct AI-generated face.',
  },
  {
    title: 'Scenes are AI art only',
    description: 'Code draws only the UI. All backgrounds, stadiums, and scenes are AI-generated artwork.',
  },
  {
    title: 'One locked logo',
    description: 'Consistent brand identity across all projects with a single, unchanging logo design.',
  },
  {
    title: 'Real-club name blocklist tests',
    description: 'Automated testing ensures no trademarked club names slip through into the generated content.',
  },
  {
    title: 'Broadcast-style match graphics',
    description: 'Match presentations mirror real TV broadcasts with professional overlays and transitions.',
  },
];

const workflowSteps = [
  {
    title: 'Boards and Queues',
    description: 'Multiple AI agents work in parallel, each with its own task queue. Projects are tracked across Cursor cloud agents, Claude for content generation, and Grok for system design.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Review and QA Passes',
    description: 'Every agent output goes through manual review. Code changes are tested, AI art is validated for uniqueness, and game logic is verified against quality rules before merging.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: 'Quality Gates',
    description: 'Automated tests enforce the five quality rules. Builds fail if duplicate faces are detected, if code generates scenes instead of using AI art, or if blocked club names appear.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

function HowIBuildPage() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <CosmicBackground disabled={reduceMotion} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main" className="relative pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="rise" style={{ '--d': '0ms' }}>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/90 mb-3">
                Case Study
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 bg-clip-text text-transparent">
                How I Build
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                How one founder runs several AI agents across three games at once — managing boards and queues,
                review and QA passes, and enforcing strict quality rules.
              </p>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="rise mb-12 md:mb-20" style={{ '--d': '150ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              Workflow Overview
            </h2>
            <div className="bg-gradient-to-br from-purple-900/30 to-black p-6 sm:p-8 rounded-3xl border border-purple-800/50">
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {workflowSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 [&>svg]:w-8 [&>svg]:h-8">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {idx < workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quality Rules */}
          <div className="rise mb-12 md:mb-20" style={{ '--d': '250ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              Quality Rules
            </h2>
            <p className="text-gray-300 text-center mb-10 max-w-2xl mx-auto text-base sm:text-lg">
              Five non-negotiable standards enforced across all three games through automated tests and manual QA.
            </p>
            <div className="space-y-4 md:space-y-5">
              {qualityRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-900/20 to-black p-5 sm:p-6 rounded-2xl border border-purple-800/40 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                        {rule.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Team Composition */}
          <div className="rise mb-12 md:mb-20" style={{ '--d': '350ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              The Agent Team
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-black p-6 rounded-2xl border border-purple-800/50 text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-purple-500/20 border border-purple-400/30">
                  <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Cursor Cloud Agents</h3>
                <p className="text-sm text-gray-300">Code generation, refactoring, and test writing</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/30 to-black p-6 rounded-2xl border border-cyan-800/50 text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/30">
                  <svg className="w-6 h-6 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Claude</h3>
                <p className="text-sm text-gray-300">Content generation, dialogue, and player data</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-black p-6 rounded-2xl border border-purple-800/50 text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-purple-500/20 border border-purple-400/30">
                  <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Grok</h3>
                <p className="text-sm text-gray-300">System architecture and game logic design</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rise text-center" style={{ '--d': '450ms' }}>
            <div className="inline-block bg-gradient-to-br from-purple-900/30 to-black p-8 sm:p-10 rounded-3xl border border-purple-800/50">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                Want to work with me?
              </h2>
              <p className="text-gray-300 mb-6 text-base sm:text-lg max-w-xl mx-auto">
                Looking for a producer, creative director, or AI-workflow specialist for your studio or project.
              </p>
              <a
                href="/#contact"
                className="inline-block px-8 py-3.5 text-base font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-[0_10px_40px_rgba(34,211,238,0.2)]"
              >
                Get in Touch →
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default HowIBuildPage;
