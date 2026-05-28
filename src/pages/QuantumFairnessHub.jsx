import { Link } from 'react-router-dom';

function QuantumFairnessHub() {
    return (
        <div className="w-full min-h-screen flex flex-col bg-black text-white">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-900/50 px-6 py-4 flex items-center justify-between">
                <Link 
                    to="/" 
                    className="text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
                >
                    ← Back to SolViedo Quantum
                </Link>
                <span className="text-lg font-semibold text-cyan-300">Quantum Fairness Hub</span>
                <a 
                    href="https://solviedoquantum.com/quantum-fairness-hub" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/20"
                >
                    Open standalone
                </a>
            </div>

            {/* Full iframe */}
            <div className="flex-1 pt-16">
                <iframe
                    src="/quantum-fairness-hub/index.html"
                    className="w-full h-[calc(100vh-64px)] border-0"
                    title="Quantum Fairness Hub - Provably Fair Randomness Tools"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default QuantumFairnessHub;
