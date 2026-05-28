import { useState } from 'react';
import { Link } from 'react-router-dom';

function WW3Simulator() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full min-h-screen flex flex-col bg-black text-white">
            {/* Top Bar - Consistent & Mobile Friendly */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-900/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link 
                        to="/" 
                        className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
                    >
                        ← <span className="hidden sm:inline">Back to</span> Home
                    </Link>
                    <span className="text-base sm:text-lg font-semibold text-emerald-300">
                        WW3 Simulator
                    </span>
                </div>
                <span className="hidden sm:block text-xs text-gray-500">Python / OOP Project</span>
            </div>

            {/* Iframe with Loading State */}
            <div className="flex-1 pt-14 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10 pt-14">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading game...</p>
                        </div>
                    </div>
                )}

                <iframe
                    src="/ww3/index.html"
                    className="w-full h-[calc(100vh-56px)] border-0"
                    title="WW3 Simulator - Turn-based Strategy Game"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}

export default WW3Simulator;
