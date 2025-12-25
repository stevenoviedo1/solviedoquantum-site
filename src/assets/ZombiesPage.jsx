function ZombiesPage() {
    return (
        <div className="w-full min-h-screen flex flex-col bg-black">
            {/* Title Bar */}
            <div className="p-8 text-center bg-gradient-to-b from-black/80 to-transparent">
                <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    Zombies – Unity WebGL Survival Demo
                </h2>
                <p className="text-xl md:text-2xl text-gray-400 mt-4">
                    Best played in fullscreen • Survive the zombie apocalypse
                </p>
            </div>

            {/* Game Embed */}
            <div className="flex-1 w-full flex items-center justify-center bg-black px-4 py-8">
                <div className="relative w-full max-w-none lg:max-w-screen-2xl">
                    <div className="relative pb-[100%]">
                        <iframe
                            src="/games/zombies/index.html"
                            className="absolute inset-0 w-full h-full border-0 rounded-lg shadow-2xl"
                            title="Zombies – Unity WebGL Survival Demo"
                            allow="autoplay; fullscreen; accelerometer; gyroscope"
                            scrolling="no"
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="p-8 text-center bg-black/80">
                <a
                    href="/"
                    className="px-10 py-5 text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-2xl"
                >
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}

export default ZombiesPage;