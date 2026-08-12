const PILLARS = [
  {
    title: 'Superposition',
    plain: 'Prepare ghost futures — candidate moves you paid for with Wave.',
  },
  {
    title: 'Collapse',
    plain: 'You choose which prepared ghost becomes real. Skill commit, not a die roll.',
  },
  {
    title: 'Observe',
    plain: 'Strip an enemy line. Forces their worst prepared ghost (or freezes AP). Tempo weapon.',
  },
  {
    title: 'Interference',
    plain: 'Same-team ghosts on one tile reinforce. Mixed teams cancel. Fully deterministic.',
  },
  {
    title: 'Entangle',
    plain: 'Link two units. Damage echoes. Pins and forced choices — like chess pins.',
  },
  {
    title: 'Decoherence',
    plain: 'Unused ghosts age and die. Tempo matters; stalling loses lines.',
  },
];

export default function HowToPlay({ onBack }) {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 mb-6"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-cyan-300 mb-2">How to Play</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Waveform is strategy first. If you lose, you misread the board — not the dice.
        </p>
        <div className="space-y-3 mb-8">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="text-sm font-semibold text-violet-200">{p.title}</div>
              <div className="text-xs text-zinc-400 mt-1">{p.plain}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-zinc-300">
          <div className="font-semibold text-cyan-200 mb-1">Controls</div>
          M Move · A Strike · G Ghost · C Collapse · O Observe · E Entangle · Enter End Turn ·
          1/2 Collapse ghost slot
        </div>
      </div>
    </div>
  );
}
