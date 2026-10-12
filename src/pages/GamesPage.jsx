import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import CosmicBackground from '../components/CosmicBackground';
import { usePrefersReducedMotion } from '../lib/hooks';

const games = [
  {
    id: 'grid-city',
    title: 'Grid City',
    status: 'Close to beta',
    description: 'A Godot life-sim and city game.',
    bullets: [
      'Life simulation meets city building',
      'Built with Godot engine',
      'Active development, approaching beta release',
    ],
    video: '/games/grid-city-trailer.mp4',
    poster: '/games/grid-city-poster.webp',
    tags: ['Godot', 'Life Sim', 'City Building', 'Beta'],
  },
  {
    id: 'football-universe',
    title: 'Football Universe',
    status: 'Beta coming soon',
    description: 'An American college football game.',
    bullets: [
      'Recruiting and depth chart management',
      'College football rankings and competition',
      'Beta launch planned',
    ],
    image: '/games/football-universe-screenshot.webp',
    tags: ['American Football', 'College Sports', 'Recruiting', 'Beta Soon'],
  },
  {
    id: 'pitch-nations',
    title: 'Pitch Nations',
    status: 'In development',
    description: 'A men\'s football management game with a world of 78,375 players across 3,135 clubs and 130 nations.',
    bullets: [
      'Every portrait, scene and crest is unique AI art',
      '78,375 players across 3,135 clubs',
      '130 nations represented',
    ],
    image: '/games/pitch-nations-screenshot.webp',
    imageSecondary: '/games/pitch-nations-table.webp',
    tags: ['Football', 'Management', 'AI Art', '78K+ Players'],
  },
];

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
                className="rise group bg-gradient-to-br from-purple-900/30 to-black p-6 sm:p-8 rounded-3xl border border-purple-800/50 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] transition-all duration-300"
                style={{ '--d': `${150 + idx * 100}ms` }}
              >
                <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-center">
                  {/* Video, screenshot, or placeholder */}
                  <div className="relative overflow-hidden rounded-2xl bg-[#070b14] ring-1 ring-inset ring-cyan-500/15 h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                    {game.video ? (
                      <video
                        controls
                        muted
                        playsInline
                        preload="none"
                        poster={game.poster}
                        className="w-full h-full object-cover"
                      >
                        <source src={game.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : game.image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={game.image}
                          alt={`${game.title} screenshot`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        {game.imageSecondary && (
                          <div className="absolute bottom-3 right-3 w-24 sm:w-32 h-16 sm:h-20 rounded-lg overflow-hidden border-2 border-cyan-400/40 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                            <img
                              src={game.imageSecondary}
                              alt={`${game.title} additional view`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 px-4">
                        <svg
                          className="w-16 h-16 mx-auto mb-3 opacity-40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                        <p className="text-sm font-medium">TODO: {game.title} screenshot</p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-3xl sm:text-4xl font-bold text-white group-hover:text-cyan-400 transition">
                        {game.title}
                      </h2>
                      <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border text-purple-200 border-purple-400/40 bg-purple-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
                        {game.status}
                      </span>
                    </div>

                    <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                      {game.description}
                    </p>

                    <ul className="space-y-2.5 mb-6">
                      {game.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm sm:text-base">
                          <svg
                            className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-purple-900/50 text-cyan-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
