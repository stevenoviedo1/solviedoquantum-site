/**
 * GameCard - Reusable component for displaying game information
 * Used in both GamesPage and HomePage Portfolio section
 */
function GameCard({ game }) {
  return (
    <div className="group bg-gradient-to-br from-purple-900/30 to-black p-6 sm:p-8 rounded-3xl border border-purple-800/50 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] transition-all duration-300">
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
            <h3 className="text-3xl sm:text-4xl font-bold text-white group-hover:text-cyan-400 transition">
              {game.title}
            </h3>
            {game.status && (
              <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border text-purple-200 border-purple-400/40 bg-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
                {game.status}
              </span>
            )}
          </div>

          <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
            {game.description}
          </p>

          {game.bullets && game.bullets.length > 0 && (
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
          )}

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
  );
}

export default GameCard;
