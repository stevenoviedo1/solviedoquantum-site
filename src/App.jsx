import { useEffect, useState } from 'react';
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import ContactForm from './components/ContactForm';
import WebDevBenefits from './components/WebDevBenefits';
import PerfOptBenefits from './components/PerfOptBenefits';

function App() {
    const [init, setInit] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showBenefits, setShowBenefits] = useState(false);
    const [showPerfBenefits, setShowPerfBenefits] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    return (
        <div className="relative min-h-screen text-white overflow-hidden">
            {/* Cosmic Particle Background */}
            {init && (
                <Particles
                    id="tsparticles"
                    options={{
                        background: { color: { value: "#000" } },
                        fpsLimit: 120,
                        particles: {
                            color: { value: ["#8b5cf6", "#06b6d4"] },
                            links: { color: "#8b5cf6", distance: 150, enable: true, opacity: 0.3, width: 1 },
                            move: { enable: true, speed: 1.5 },
                            number: { density: { enable: true, area: 800 }, value: 80 },
                            opacity: { value: { min: 0.3, max: 0.7 } },
                            shape: { type: "circle" },
                            size: { value: { min: 1, max: 5 } },
                        },
                        detectRetina: true,
                    }}
                    className="absolute inset-0 -z-10"
                />
            )}

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-purple-900/30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        SolViedo Quantum
                    </h1>
                    {/* Nav Links – Larger, More Spaced, Centered-Right Feel */}
                    <div className="hidden md:flex items-center space-x-12 text-2xl font-medium">
                        <a href="#home" className="hover:text-cyan-400 transition">Home</a>
                        <a href="#services" className="hover:text-cyan-400 transition">Services</a>
                        <a href="#portfolio" className="hover:text-cyan-400 transition">Portfolio</a>
                        <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-4xl">
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu – Updated Font Size */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-black/90 backdrop-blur-lg px-6 py-12 text-3xl space-y-8 text-center">
                        <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block hover:text-cyan-400 transition">Home</a>
                        <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block hover:text-cyan-400 transition">Services</a>
                        <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="block hover:text-cyan-400 transition">Portfolio</a>
                        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-cyan-400 transition">Contact</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
                <img
                    src="/src/assets/logo.svg"
                    alt="SolViedo Quantum Logo"
                    className="w-96 md:w-[550px] lg:w-[800px] mb-16
                               drop-shadow-2xl
                               brightness-110
                               glow-transition
                               hover:brightness-130
                               hover:scale-105
                               transition-all duration-700 ease-out"
                    onError={(e) => { e.target.src = "/src/assets/logo.png"; }}
                />
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    SolViedo Quantum
                </h1>
                <p className="text-xl md:text-3xl mt-6 text-cyan-300">Building the future of the web.</p>
                <p className="mt-12 text-lg md:text-xl max-w-4xl mx-auto text-gray-300 leading-relaxed">
                    Drive more customers with a <span className="text-cyan-400 font-bold">high-performance website</span>.<br />
                    Custom-coded for <span className="text-purple-400 font-bold">blazing speed</span> & <span className="text-purple-400 font-bold">higher Google ranking</span>.<br />
                    Unlimited design, real-time features, seamless scaling.<br />
                    <span className="text-red-400 font-bold">No Templates. No monthly fees. No Lock-in.</span>
                </p>
                <a href="#contact" className="mt-12 px-10 py-5 text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-2xl">
                    Get Started →
                </a>
            </section>

            {/* Services Section */}
            <section id="services" className="py-32 px-6 bg-black/50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold mb-20 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Services
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Custom Web Development – Clickable with Expand */}
                        <div
                            onClick={() => setShowBenefits(!showBenefits)}
                            className="bg-gradient-to-br from-purple-900/20 to-black p-10 rounded-2xl border border-purple-800/50 hover:border-cyan-400 cursor-pointer transition-all duration-500 hover:scale-105"
                        >
                            <h3 className="text-3xl font-bold mb-4">Custom Web Development</h3>
                            <p className="text-gray-300">Blazing-fast, SEO-optimized sites built from scratch.</p>
                            <p className="mt-6 text-cyan-400 font-semibold">Click for comparison →</p>
                        </div>

                        {/* Game Development */}
                        <div className="bg-gradient-to-br from-cyan-900/20 to-black p-10 rounded-2xl border border-cyan-800/50">
                            <h3 className="text-3xl font-bold mb-4">Game Development</h3>
                            <p className="text-gray-300">Interactive experiences with Phaser, Godot, Unity, WebGL.</p>
                        </div>

                        {/* Performance Optimization – Clickable with Expand */}
                        <div
                            onClick={() => setShowPerfBenefits(!showPerfBenefits)}
                            className="bg-gradient-to-br from-purple-900/20 to-black p-10 rounded-2xl border border-purple-800/50 hover:border-cyan-400 cursor-pointer transition-all duration-500 hover:scale-105"
                        >
                            <h3 className="text-3xl font-bold mb-4">Performance Optimization</h3>
                            <p className="text-gray-300">100/100 Lighthouse scores – Core Web Vitals mastery.</p>
                            <p className="mt-6 text-cyan-400 font-semibold">Click for details →</p>
                        </div>
                    </div>

                    {/* Expandable Benefits */}
                    {showBenefits && (
                        <div className="mt-20 animate-fade-in">
                            <WebDevBenefits />
                        </div>
                    )}
                    {showPerfBenefits && (
                        <div className="mt-20 animate-fade-in">
                            <PerfOptBenefits />
                        </div>
                    )}
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="py-32 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold mb-20 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Portfolio
                    </h2>
                    <p className="text-2xl text-gray-400 mb-16">Quantum-powered projects & interactive game demos</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* Zombies Game Card */}
                        <div
                            onClick={() => {
                                window.location.href = '/zombies';
                                window.location.reload();
                            }}
                            className="cursor-pointer group"
                        >
                            <div className="bg-gradient-to-br from-purple-900/30 to-black p-8 rounded-2xl border border-purple-800/50 hover:border-cyan-400 transition-all duration-500 hover:scale-105 shadow-2xl">
                                <img
                                    src="/src/assets/zombiesgamescreenshot.png"
                                    alt="Zombies Game Screenshot"
                                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
                                />
                                <h3 className="text-3xl font-bold mb-4 group-hover:text-cyan-400 transition">Zombies</h3>
                                <p className="text-gray-300">Top-down survival Unity WebGL demo – survive the horde</p>
                                <p className="mt-6 text-cyan-400 font-semibold">Play Full Demo →</p>
                            </div>
                        </div>

                        {/* Placeholder */}
                        <div className="bg-gradient-to-br from-purple-900/30 to-black p-8 rounded-2xl border border-purple-800/50">
                            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl w-full h-64 mb-6" />
                            <h3 className="text-3xl font-bold mb-4">Coming Soon</h3>
                            <p className="text-gray-300">More web projects & game demos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 px-6 bg-black/70">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Contact
                    </h2>
                    <p className="text-4xl text-yellow-400 mb-8">Steven Oviedo • Web & Game Developer</p>
                    <p className="text-3xl text-yellow-400 mb-4">(956) 798-1222</p>
                    <p className="text-4xl mb-12">
                        <a href="mailto:Steven.oviedo1@gmail.com" className="text-cyan-400 hover:underline">
                            solviedoquantum.com
                        </a>
                    </p>
                    <ContactForm />
                </div>
            </section>
        </div>
    );
}

export default App;