import { getUpgrades } from '../engine/index.js';

/**
 * @param {{ missionTitle: string, collapsesForced: number, upgrades: string[], onPick: (id:string)=>void, onSkip: ()=>void }} props
 */
export default function Debrief({ missionTitle, collapsesForced, upgrades, onPick, onSkip }) {
  const all = getUpgrades();
  const available = all.filter((u) => !upgrades.includes(u.id));

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="text-xs uppercase tracking-wider text-emerald-400/80 mb-1">Mission complete</div>
        <h2 className="text-xl font-bold text-white mb-1">{missionTitle}</h2>
        <p className="text-xs text-zinc-400 mb-6">
          Forced collapses this run: {collapsesForced}. Choose one upgrade (or skip).
        </p>
        {available.length === 0 ? (
          <p className="text-sm text-zinc-400 mb-4">All upgrades owned.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {available.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => onPick(u.id)}
                className="w-full text-left rounded-xl border border-violet-400/25 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-2.5"
              >
                <div className="text-sm font-medium text-violet-100">{u.label}</div>
                <div className="text-[11px] text-zinc-400">{u.desc}</div>
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-2 text-sm text-zinc-400 hover:text-white"
        >
          Skip upgrade →
        </button>
      </div>
    </div>
  );
}
