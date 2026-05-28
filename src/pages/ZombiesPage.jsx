import { useState } from 'react';
import { Link } from 'react-router-dom';

function ZombiesPage() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full min-h-screen flex flex-col bg-black text-white">
            {/* Top Bar - Mobile Friendly */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-900/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link 
                        to="/" 
                        className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
                    >
                        ← <span className="hidden sm:inline">Back to</span> Home
                    </Link>
                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Zombie Rounds
                    </span>
                </div>
                
                <a 
                    href="https://soviedo1.itch.io/zombie-survival" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 transition font-medium"
                >
                    Play on itch.io →
                </a>
            </div>

            {/* Game Container */}
            <div className="flex-1 w-full flex flex-col pt-14">
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10 pt-14">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading Unity WebGL game...</p>
                        </div>
                    </div>
                )}

                <div className="flex-1 w-full flex items-center justify-center bg-black p-2 sm:p-4">
                    <div className="relative w-full max-w-[1600px] mx-auto aspect-[16/10] sm:aspect-video md:aspect-[16/9]">
                        <iframe
                            src="/games/zombies/index.html"
                            className="absolute inset-0 w-full h-full border-0 rounded-xl shadow-2xl"
                            title="Zombie Rounds – Unity WebGL Survival"
                            allow="autoplay; fullscreen; accelerometer; gyroscope"
                            scrolling="no"
                            onLoad={() => setIsLoading(false)}
                        />
                    </div>
                </div>

                <div className="text-center py-4 px-4 text-gray-400 text-xs sm:text-sm border-t border-white/10">
                    Tip: Tap the fullscreen icon inside the game for the best experience
                </div>
            </div>
        </div>
    );
}

export default ZombiesPage;
