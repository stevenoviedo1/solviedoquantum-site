import { useState } from 'react';
import SubPageLayout from '../components/SubPageLayout';

function QuantumFairnessHub() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <SubPageLayout
            title="Quantum Fairness Hub"
            titleClass="text-cyan-300"
            action={
                <a
                    href="/quantum-fairness-hub/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                    Open standalone →
                </a>
            }
        >
            <div className="relative flex-1 min-h-[calc(100vh-56px)]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
        </SubPageLayout>
    );
}

export default QuantumFairnessHub;