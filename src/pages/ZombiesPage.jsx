import { Link } from 'react-router-dom';

function ZombiesPage() {
    return (
        <div className="w-full min-h-screen flex flex-col bg-black text-white">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-900/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/" 
                        className="text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                        ← Back to SolViedo Quantum
                    </Link>
                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Zombie Rounds
                    </span>
                </div>
                <a 
                    href="https://soviedo1.itch.io/zombie-survival" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 transition"
                >
                    Play on itch.io →
                </a>
            </div>

            {/* Game Embed */}
            <div className="flex-1 w-full flex items-center justify-center bg-black pt-16 pb-8 px-2">
                <div className="relative w-full max-w-[1600px] mx-auto">
                    <div className="relative pb-[56.25%] md:pb-[62.5%] lg:pb-[75%] xl:pb-[85%]">
                        <iframe
                            src="/games/zombies/index.html"
                            className="absolute inset-0 w-full h-full border-0 rounded-xl shadow-2xl"
                            title="Zombie Rounds – Unity WebGL Survival"
                            allow="autoplay; fullscreen; accelerometer; gyroscope"
                            scrolling="no"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            <div className="text-center pb-8 text-gray-400 text-sm">
                Best experienced in fullscreen (press the fullscreen button inside the game)
            </div>
        </div>
    );
}

export default ZombiesPage;
