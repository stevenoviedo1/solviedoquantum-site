import { getCampaignNodes, getMissionDef } from '../engine/index.js';

/**
 * @param {{ save: any, onPlay: (id:string)=>void, onBack: ()=>void }} props
 */
export default function CampaignMap({ save, onPlay, onBack }) {
  const nodes = getCampaignNodes();
  const acts = [1, 2, 3];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-black via-zinc-950 to-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">
              Campaign Field
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Chess-depth quantum tactics · prepare lines · force collapses
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15"
          >
            ← Title
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 text-xs">
          <Stat label="Missions won" value={save.missionsWon} />
          <Stat label="Side ops" value={save.sideOpsWon} />
          <Stat label="Roster" value={save.roster.join(', ')} />
          <Stat label="Upgrades" value={save.upgrades.length ? save.upgrades.join(', ') : '—'} />
        </div>

        {save.campaignComplete && (
          <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
            Campaign complete
            {save.alternateEnding
              ? ' — alternate ending unlocked (side ops).'
              : '. Win 2 side ops for the alternate ending.'}
          </div>
        )}

        {acts.map((act) => (
          <section key={act} className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Act {act}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {nodes
                .filter((n) => n.act === act)
                .map((n) => {
                  const status = save.nodes[n.id] || 'locked';
                  const def = getMissionDef(n.id);
                  const locked = status === 'locked';
                  const won = status === 'won';
                  return (
                    <button
                      key={n.id}
                      type="button"
                      disabled={locked}
                      onClick={() => onPlay(n.id)}
                      className={`text-left rounded-xl border p-4 transition ${
                        locked
                          ? 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed'
                          : won
                            ? 'border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10'
                            : 'border-cyan-500/25 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-white">
                          {n.title}
                          {n.side ? (
                            <span className="ml-2 text-[10px] text-violet-300 font-normal">SIDE</span>
                          ) : null}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{def?.briefing}</p>
                      {n.unlockUnit && (
                        <p className="text-[11px] text-cyan-400/80 mt-2">Unlocks unit: {n.unlockUnit}</p>
                      )}
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="text-xs text-zinc-200 mt-0.5 truncate">{value}</div>
    </div>
  );
}
