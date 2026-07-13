function PerfOptBenefits() {
  return (
    <div className="mt-12 md:mt-20 bg-gradient-to-br from-purple-900/20 to-black p-4 sm:p-8 md:p-10 rounded-2xl border border-purple-800/50">
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
        Why performance optimization matters
      </h3>
      <p className="text-center text-gray-400 text-sm sm:text-base mb-10 max-w-2xl mx-auto">
        Speed is a ranking factor, a conversion lever, and a trust signal — especially for local
        businesses and mobile users.
      </p>
      <div className="space-y-8 sm:space-y-10 text-base sm:text-lg leading-relaxed">
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3">
            Core Web Vitals &amp; Lighthouse
          </h4>
          <p className="text-gray-200">
            Google cares about real user experience: loading (LCP), interactivity (INP), and
            visual stability (CLS). Many template sites land mid-range on Lighthouse. Custom
            builds are structured from day one for high scores — lean assets, sensible fonts, no
            plugin pile-up.
          </p>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3">
            Real-world speed
          </h4>
          <p className="text-gray-200">
            Modern stacks (e.g. Next.js / React) with code-splitting, image optimization, and
            only the JavaScript you need. No drag-and-drop bloat. Faster first paint, snappier
            clicks, less waiting on phones and spotty connections.
          </p>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3">
            Lower bounce, higher conversions
          </h4>
          <p className="text-gray-200">
            Slow pages lose people. Every extra second of load hurts engagement — especially for
            e-commerce, ordering, and lead-gen. A fast site keeps visitors long enough to order,
            book, or message you.
          </p>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3">
            Mobile-first by default
          </h4>
          <p className="text-gray-200">
            Most traffic is mobile. Images are optimized, layouts stay readable, and heavy
            features load only when needed — so local customers on phones get the same smooth
            experience as desktop.
          </p>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3">
            Built to stay fast
          </h4>
          <p className="text-gray-200">
            Clean, modular code means new features don&apos;t automatically tank performance. No
            years of stacked plugins. The site can grow without turning into a slow mess.
          </p>
        </div>
        <div className="text-center mt-10 pt-6 border-t border-purple-800/40">
          <p className="text-lg sm:text-xl font-semibold text-yellow-400">
            Result: better SEO, happier users, more conversions — delivered by SolViedo Quantum.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PerfOptBenefits;
