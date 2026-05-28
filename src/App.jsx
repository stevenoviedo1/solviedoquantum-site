import { useEffect, useState } from 'react';
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import ContactForm from './components/ContactForm';
import WebDevBenefits from './components/WebDevBenefits';
import PerfOptBenefits from './components/PerfOptBenefits';
import logo from './assets/logo.jpg';
import { projects } from './data/projects';

import ZombiesPage from './pages/ZombiesPage';
import QuantumFairnessHub from './pages/QuantumFairnessHub';
import WW3Simulator from './pages/WW3Simulator';

function App() {
    const [init, setInit] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showBenefits, setShowBenefits] = useState(false);
    const [showPerfBenefits, setShowPerfBenefits] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Reusable Home content (the original beautiful marketing site)
    const HomeContent = () => (
        <div className="relative min-h-screen text-white overflow-hidden">
            {/* Cosmic Particle Background */}
            {init && (
                <Particles
                    id="tsparticles"
                    options={{
                        background: { color: { value: "#000" } },
                        fpsLimit: 60,
                        particles: {
                            color: { value: ["#8b5cf6", "#06b6d4"] },
                            links: { 
                                color: "#8b5cf6", 
                                distance: 150, 
                                enable: true, 
                                opacity: 0.25, 
                                width: 1 
                            },
                            move: { enable: true, speed: 1 },
                            number: { density: { enable: true, area: 800 }, value: 40 },
                            opacity: { value: { min: 0.3, max: 0.6 } },
                            shape: { type: "circle" },
                            size: { value: { min: 1, max: 4 } },
                        },
                        detectRetina: true,
                    }}
                    className="absolute inset-0 -z-10"
                />
            )}

            {/* Navigation - only on home */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-purple-900/30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        SolViedo Quantum
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-12 text-2xl font-medium">
                        <a href="#home" className="hover:text-cyan-400 transition">Home</a>
                        <a href="#services" className="hover:text-cyan-400 transition">Services</a>
                        <a href="#portfolio" className="hover:text-cyan-400 transition">Portfolio</a>
                        <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
                    </div>

                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="md:hidden text-4xl"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

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
                <div className="mb-16 flex items-center justify-center">
                    <img
                        src={logo}
                        alt="SolViedo Quantum Logo"
                        className="w-full max-w-[650px] h-auto object-contain"
                        style={{ 
                            filter: 'drop-shadow(0 0 32px rgba(103,232,249,0.9)) drop-shadow(0 0 64px rgba(139,92,246,0.8))' 
                        }}
                    />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    SolViedo Quantum
                </h1>
                <p className="text-xl md:text-3xl mt-6 text-cyan-300">Building the future of the web.</p>

                <p className="mt-12 text-lg md:text-xl max-w-4xl mx-auto text-gray-300 leading-relaxed">
                    Drive more customers with a <span className="text-cyan-400 font-bold">high-performance website</span>.<br />
                    Custom-coded for <span className="text-purple-400 font-bold">blazing speed</span> &amp; <span className="text-purple-400 font-bold">higher Google ranking</span>.<br />
                    Unlimited design, real-time features, seamless scaling.<br />
                    <span className="text-red-400 font-bold">No Templates. No monthly fees. No Lock-in.</span>
                </p>

                <a 
                    href="#contact" 
                    className="mt-12 px-10 py-5 text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-2xl"
                >
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
                        <div
                            onClick={() => setShowBenefits(!showBenefits)}
                            className="bg-gradient-to-br from-purple-900/20 to-black p-10 rounded-2xl border border-purple-800/50 hover:border-cyan-400 cursor-pointer transition-all duration-500 hover:scale-105"
                        >
                            <h3 className="text-3xl font-bold mb-4">Custom Web Development</h3>
                            <p className="text-gray-300">Blazing-fast, SEO-optimized sites built from scratch.</p>
                            <p className="mt-6 text-cyan-400 font-semibold">Click for comparison →</p>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-900/20 to-black p-10 rounded-2xl border border-cyan-800/50">
                            <h3 className="text-3xl font-bold mb-4">Game Development</h3>
                            <p className="text-gray-300">Interactive experiences with Phaser, Godot, Unity, WebGL.</p>
                        </div>

                        <div
                            onClick={() => setShowPerfBenefits(!showPerfBenefits)}
                            className="bg-gradient-to-br from-purple-900/20 to-black p-10 rounded-2xl border border-purple-800/50 hover:border-cyan-400 cursor-pointer transition-all duration-500 hover:scale-105"
                        >
                            <h3 className="text-3xl font-bold mb-4">Performance Optimization</h3>
                            <p className="text-gray-300">100/100 Lighthouse scores – Core Web Vitals mastery.</p>
                            <p className="mt-6 text-cyan-400 font-semibold">Click for details →</p>
                        </div>
                    </div>

                    {showBenefits && <div className="mt-20"><WebDevBenefits /></div>}
                    {showPerfBenefits && <div className="mt-20"><PerfOptBenefits /></div>}
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="py-32 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Portfolio
                    </h2>
                    <p className="text-2xl text-gray-400 mb-16">Quantum-powered projects &amp; interactive experiences</p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => {
                                    if (project.link.startsWith("http")) {
                                        window.open(project.link, "_blank");
                                    } else {
                                        navigate(project.link);
                                    }
                                }}
                                className="group cursor-pointer bg-gradient-to-br from-purple-900/30 to-black p-6 rounded-3xl border border-purple-800/50 hover:border-cyan-400 transition-all duration-500 hover:scale-105 overflow-hidden"
                            >
                                <div className="relative overflow-hidden rounded-2xl mb-6 h-64 bg-gray-900 flex items-center justify-center">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition">
                                    {project.title}
                                </h3>
                                
                                <p className="text-gray-300 mb-6 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="text-xs px-3 py-1 bg-purple-900/50 text-cyan-300 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 px-6 bg-black/70">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        Contact
                    </h2>
                    <p className="text-4xl text-yellow-400 mb-8">Steven Oviedo • Web &amp; Game Developer</p>
                    <p className="text-3xl text-yellow-400 mb-4">(956) 798-1222</p>
                    <p className="text-4xl mb-12">
                        <a href="mailto:Steven.oviedo1@gmail.com" className="text-cyan-400 hover:underline">
                            Steven.oviedo1@gmail.com
                        </a>
                    </p>
                    <ContactForm />
                </div>
            </section>
        </div>
    );

    return (
        <>
            <Routes>
                <Route path="/" element={<HomeContent />} />
                <Route path="/zombies" element={<ZombiesPage />} />
                <Route path="/quantum-fairness-hub" element={<QuantumFairnessHub />} />
                <Route path="/ww3" element={<WW3Simulator />} />
            </Routes>

            {/* Vercel Analytics — gives you clear "Visitors" count in your Vercel dashboard */}
            <Analytics />
        </>
    );
}

export default App;