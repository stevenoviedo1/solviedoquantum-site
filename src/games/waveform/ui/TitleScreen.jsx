/**
 * @param {{ hasSave: boolean, onNew: ()=>void, onContinue: ()=>void, onHow: ()=>void, gpuLabel: string }} props
 */
export default function TitleScreen({ hasSave, onNew, onContinue, onHow, gpuLabel }) {
  return (
    <div className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden bg-black">
      {/* Decorative field */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(100,120,180,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(100,120,180,0.35) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full mx-4 text-center">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-cyan-400/80 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Waveform Strategy · Original Genre
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-3">
          Wave
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">
            form
          </span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-2">
          Chess-depth quantum tactics. Prepare ghost futures, force collapses, outthink the field.
        </p>
        <p className="text-zinc-500 text-xs mb-8">
          2D strategy · GPU-powered 3D presence · No hit-roll casino
        </p>

        <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
          {hasSave && (
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-medium shadow-lg shadow-violet-900/40 hover:brightness-110 transition"
            >
              Continue Campaign
            </button>
          )}
          <button
            type="button"
            onClick={onNew}
            className={`w-full py-3 rounded-xl font-medium transition ${
              hasSave
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                : 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-violet-900/40 hover:brightness-110'
            }`}
          >
            New Campaign
          </button>
          <button
            type="button"
            onClick={onHow}
            className="w-full py-2.5 rounded-xl text-sm text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10"
          >
            How to Play
          </button>
        </div>

        <p className="mt-8 text-[11px] text-zinc-600">{gpuLabel}</p>
      </div>
    </div>
  );
}
