import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import CosmicBackground from '../components/CosmicBackground';
import GameCard from '../components/GameCard';
import { usePrefersReducedMotion } from '../lib/hooks';
import { games } from '../data/games';

function GamesPage() {
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
                Shipped with AI agent teams
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 bg-clip-text text-transparent">
                Games
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Three football and city games built by one founder directing teams of AI agents.
                Every face is unique, scenes are AI art, and code draws only the UI.
              </p>
            </div>
          </div>

          {/* Games Grid */}
          <div className="space-y-8 md:space-y-12">
            {games.map((game, idx) => (
              <div
                key={game.id}
                className="rise"
                style={{ '--d': `${150 + idx * 100}ms` }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 md:mt-20 text-center">
            <div className="rise inline-block bg-gradient-to-br from-purple-900/30 to-black p-8 sm:p-10 rounded-3xl border border-purple-800/50" style={{ '--d': '500ms' }}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                Interested in how these get built?
              </h2>
              <p className="text-gray-300 mb-6 text-base sm:text-lg max-w-xl mx-auto">
                Learn how one founder runs several AI agents across three games at once.
              </p>
              <a
                href="/how-i-build"
                className="inline-block px-8 py-3.5 text-base font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-[0_10px_40px_rgba(34,211,238,0.2)]"
              >
                How I Build →
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default GamesPage;
