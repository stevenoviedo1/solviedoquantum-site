import { useState } from 'react';
import { Link } from 'react-router-dom';

function QuantumFairnessHub() {
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
                    <span className="text-base sm:text-lg font-semibold text-cyan-300">
                        Quantum Fairness Hub
                    </span>
                </div>
                
                <a 
                    href="/quantum-fairness-hub/index.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                    Open standalone →
                </a>
            </div>

            {/* Iframe with Loading State */}
            <div className="flex-1 pt-14 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10 pt-14">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading tools...</p>
                        </div>
                    </div>
                )}

                <iframe
                    src="/quantum-fairness-hub/index.html"
                    className="w-full h-[calc(100vh-56px)] border-0"
                    title="Quantum Fairness Hub - Provably Fair Randomness Tools"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}

export default QuantumFairnessHub;
