import { Link } from 'react-router-dom';

const ITCH_URL = 'https://soviedo1.itch.io/spi-bridge-runner';
const DOWNLOAD_URL = '/games/spi-bridge-runner/SPI_Bridge_Runner_Windows.zip';

/**
 * SPI Bridge Runner is too heavy for reliable browser play.
 * Ship Windows download on this site + itch.io as the main game page.
 */
function SpiBridgePage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-900/50 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5 shrink-0"
          >
            ← <span className="hidden sm:inline">Back to</span> Home
          </Link>
          <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent truncate">
            SPI Bridge Runner
          </span>
        </div>
        <span className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-200 font-medium shrink-0">
          Godot · Windows
        </span>
      </div>

      <main className="flex-1 w-full pt-20 pb-12 px-4 sm:px-6">
        {/* Wider card so 630×500 itch cover shows fully (was cropped by max-h + object-cover) */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-purple-800/40 bg-gradient-to-br from-purple-950/40 via-black to-cyan-950/20 shadow-2xl">
            <div className="w-full bg-[#0a0e18] flex items-center justify-center">
              <img
                src="/spi-bridge-runner.png"
                alt="SPI Bridge Runner cover art"
                width={630}
                height={500}
                className="w-full h-auto max-h-[min(70vh,560px)] object-contain"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  SPI Bridge Runner
                </h1>
                <p className="mt-3 text-gray-300 leading-relaxed text-sm sm:text-base">
                  Godot endless runner: push a paleta cart across the Queen Isabella Causeway,
                  dodge hazards, collect power-ups, and outrun the Evil Vaquero. Built for desktop —
                  graphics are too demanding for a smooth browser experience, so the full game is a{' '}
                  <span className="text-cyan-300 font-medium">Windows download</span>.
                </p>
              </div>

              <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
                <li>Bridge Run — endless runner on the causeway</li>
                <li>Watch 2SPACE Rocket Launch mode</li>
                <li>Customize Runner · Keyboard or Mobile controls</li>
                <li>Engine: Godot · ~64 MB Windows zip</li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={DOWNLOAD_URL}
                  download="SPI_Bridge_Runner_Windows.zip"
                  className="inline-flex justify-center items-center px-6 py-3.5 rounded-full font-bold text-base bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-[1.02] transition shadow-lg"
                >
                  Download for Windows
                </a>
                <a
                  href={ITCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-6 py-3.5 rounded-full font-semibold text-base border border-purple-600/60 hover:bg-purple-900/30 transition"
                >
                  View on itch.io →
                </a>
              </div>

              <p className="text-xs text-gray-500 pt-1">
                After download: unzip and run <code className="text-cyan-400/90">SPI_Bridge_Runner.exe</code>.
                Windows only.
              </p>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-gray-500">
            <Link to="/#portfolio" className="text-cyan-400 hover:underline">
              ← Back to portfolio
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SpiBridgePage;
