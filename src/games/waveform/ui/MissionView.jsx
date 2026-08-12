import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyAction,
  getLegalAttacks,
  getLegalMoves,
  getLegalObserves,
  runFullEnemyTurn,
  getUnit,
  interferenceAt,
} from '../engine/index.js';
import { BoardScene } from '../render/BoardScene.js';

const MODES = [
  { id: 'select', label: 'Select', key: 'Q' },
  { id: 'move', label: 'Move', key: 'M' },
  { id: 'attack', label: 'Strike', key: 'A' },
  { id: 'ghost', label: 'Ghost', key: 'G' },
  { id: 'collapse', label: 'Collapse', key: 'C' },
  { id: 'observe', label: 'Observe', key: 'O' },
  { id: 'entangle', label: 'Entangle', key: 'E' },
];

const TUTORIAL = {
  move: 'Select a unit and Move (M). Classical reposition costs 1 AP.',
  ghost: 'Place a Ghost (G) — a prepared future line. Costs Wave, not luck.',
  collapse: 'Collapse (C) a ghost to commit it. You choose which line becomes real.',
  observe: 'Observe (O) an enemy to strip their best ghost (worst for them). Tempo weapon.',
  done: 'Board is yours. Eliminate hostiles or complete the objective.',
};

/**
 * @param {{ state: any, onState: (s:any)=>void, onExit: ()=>void, quality: string }} props
 */
export default function MissionView({ state, onState, onExit, quality }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const stateRef = useRef(state);
  const [ghostKind, setGhostKind] = useState('move');
  const [hoverInfo, setHoverInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  stateRef.current = state;

  const selected = useMemo(
    () => (state.selectedUnitId ? getUnit(state, state.selectedUnitId) : null),
    [state],
  );

  const highlights = useMemo(() => {
    if (state.turn !== 'player' || state.phase !== 'play') return [];
    if (state.mode === 'move' || state.mode === 'ghost') return getLegalMoves(state);
    if (state.mode === 'attack')
      return getLegalAttacks(state).map((u) => ({ x: u.x, y: u.y }));
    if (state.mode === 'observe')
      return getLegalObserves(state).map((u) => ({ x: u.x, y: u.y }));
    if (state.mode === 'entangle' && selected) {
      return state.units
        .filter(
          (u) =>
            u.team === 'player' &&
            u.hp > 0 &&
            u.id !== selected.id &&
            Math.abs(u.x - selected.x) + Math.abs(u.y - selected.y) <= 3,
        )
        .map((u) => ({ x: u.x, y: u.y }));
    }
    return [];
  }, [state, selected]);

  // Mount 3D scene
  useEffect(() => {
    if (!mountRef.current) return undefined;
    const scene = new BoardScene(mountRef.current, { quality });
    sceneRef.current = scene;

    scene.onTileClick = (x, y) => {
      handleTile(x, y);
    };
    scene.onTileHover = (tile) => {
      if (!tile) {
        setHoverInfo(null);
        return;
      }
      const s = stateRef.current;
      const unit = s.units.find((u) => u.hp > 0 && u.x === tile.x && u.y === tile.y);
      const inter = interferenceAt(s, tile.x, tile.y);
      setHoverInfo({
        x: tile.x,
        y: tile.y,
        unit: unit ? `${unit.name} (${unit.team}) HP ${unit.hp}/${unit.maxHp}` : null,
        interference: inter.kind !== 'none' ? inter.kind : null,
      });
    };

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  // Sync scene
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.sync(state, highlights, state.mode);
  }, [state, highlights]);

  const dispatch = useCallback(
    (action) => {
      const next = applyAction(stateRef.current, action);
      onState(next);
      return next;
    },
    [onState],
  );

  const handleTile = useCallback(
    (x, y) => {
      const s = stateRef.current;
      if (s.phase !== 'play' || s.turn !== 'player' || busy) return;

      const unitThere = s.units.find((u) => u.hp > 0 && u.x === x && u.y === y);

      if (s.mode === 'select' || s.mode === 'collapse') {
        if (unitThere && unitThere.team === 'player') {
          dispatch({ type: 'select', unitId: unitThere.id });
        }
        return;
      }
      if (s.mode === 'move') {
        dispatch({ type: 'move', x, y });
        return;
      }
      if (s.mode === 'attack') {
        if (unitThere && unitThere.team === 'enemy') {
          dispatch({ type: 'attack', targetId: unitThere.id });
        }
        return;
      }
      if (s.mode === 'observe') {
        if (unitThere && unitThere.team === 'enemy') {
          dispatch({ type: 'observe', targetId: unitThere.id });
          sceneRef.current?.burstAt(x, y, 0xa78bfa);
        }
        return;
      }
      if (s.mode === 'entangle') {
        if (unitThere && unitThere.team === 'player') {
          dispatch({ type: 'entangle', targetId: unitThere.id });
        }
        return;
      }
      if (s.mode === 'ghost') {
        const next = dispatch({ type: 'place_ghost', kind: ghostKind, x, y });
        sceneRef.current?.burstAt(x, y, 0x8b7cff);
        return next;
      }
    },
    [busy, dispatch, ghostKind],
  );

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (busy || state.phase !== 'play') return;
      const k = e.key.toLowerCase();
      if (k === 'm') dispatch({ type: 'set_mode', mode: 'move' });
      if (k === 'a') dispatch({ type: 'set_mode', mode: 'attack' });
      if (k === 'g') dispatch({ type: 'set_mode', mode: 'ghost' });
      if (k === 'c') dispatch({ type: 'set_mode', mode: 'collapse' });
      if (k === 'o') dispatch({ type: 'set_mode', mode: 'observe' });
      if (k === 'e') dispatch({ type: 'set_mode', mode: 'entangle' });
      if (k === 'q' || k === 'escape') dispatch({ type: 'set_mode', mode: 'select' });
      if (k === 'enter' || k === ' ') {
        e.preventDefault();
        endTurn();
      }
      // collapse first ghost with 1
      if (k === '1' && selected?.ghosts?.[0]) {
        dispatch({ type: 'collapse', ghostId: selected.ghosts[0].id });
        sceneRef.current?.burstAt(selected.ghosts[0].x, selected.ghosts[0].y);
      }
      if (k === '2' && selected?.ghosts?.[1]) {
        dispatch({ type: 'collapse', ghostId: selected.ghosts[1].id });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, state.phase, selected, dispatch]);

  const endTurn = async () => {
    if (busy || state.phase !== 'play' || state.turn !== 'player') return;
    setBusy(true);
    let s = applyAction(state, { type: 'end_turn' });
    onState(s);
    // small delay for feel
    await new Promise((r) => setTimeout(r, 280));
    s = runFullEnemyTurn(s);
    onState(s);
    setBusy(false);
  };

  const backend = sceneRef.current?.getBackendLabel?.() || 'GPU';

  return (
    <div className="relative flex flex-col h-[calc(100vh-56px)] bg-black text-white">
      {/* Top mission bar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-white/10 bg-zinc-950/90 z-20">
        <button
          type="button"
          onClick={onExit}
          className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          ← Map
        </button>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-cyan-300 truncate">{state.title}</div>
          <div className="text-[11px] text-zinc-400 truncate max-w-[40vw]">{state.briefing}</div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-zinc-400">
          <span>
            Turn <span className="text-white">{state.turnNumber}</span> ·{' '}
            <span className={state.turn === 'player' ? 'text-cyan-300' : 'text-rose-300'}>
              {state.turn}
            </span>
          </span>
          <span className="hidden sm:inline text-zinc-500">{backend}</span>
          {state.objective === 'stabilize' && (
            <span className="text-violet-300">Stability {state.stability}</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Canvas */}
        <div className="relative flex-1 min-w-0 min-h-[42vh] lg:min-h-0">
          <div ref={mountRef} className="absolute inset-0" />

          {/* Tutorial coach */}
          {state.tutorialStep && state.tutorialStep !== 'done' && (
            <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-md z-10 rounded-xl border border-cyan-500/30 bg-black/80 backdrop-blur px-3 py-2 text-sm text-cyan-100">
              <div className="text-[10px] uppercase tracking-wider text-cyan-400/80 mb-0.5">
                Tutorial
              </div>
              {TUTORIAL[state.tutorialStep] || state.tip}
            </div>
          )}

          {/* Hover */}
          {hoverInfo && (
            <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/75 border border-white/10 px-2 py-1 text-[11px] text-zinc-300">
              ({hoverInfo.x},{hoverInfo.y})
              {hoverInfo.unit ? ` · ${hoverInfo.unit}` : ''}
              {hoverInfo.interference ? ` · ${hoverInfo.interference} interference` : ''}
            </div>
          )}

          {/* Win / lose overlay */}
          {state.phase !== 'play' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="rounded-2xl border border-white/15 bg-zinc-950 px-8 py-6 text-center shadow-2xl max-w-sm mx-4">
                <div
                  className={`text-2xl font-bold mb-2 ${state.phase === 'won' ? 'text-cyan-300' : 'text-rose-300'}`}
                >
                  {state.phase === 'won' ? 'Field Secured' : 'Field Lost'}
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  {state.phase === 'won'
                    ? 'Deterministic victory — skill lines held.'
                    : 'Retry with a cleaner line of play.'}
                </p>
                <button
                  type="button"
                  onClick={onExit}
                  className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 text-sm"
                >
                  Return to Campaign
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side HUD */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-950/95 flex flex-col max-h-[48vh] lg:max-h-full overflow-hidden shrink-0">
          <div className="p-3 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Tip</div>
            <p className="text-xs text-zinc-300">{state.tip}</p>
          </div>

          {/* Units */}
          <div className="p-3 border-b border-white/10 overflow-y-auto max-h-40">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Squad</div>
            <div className="space-y-1">
              {state.units
                .filter((u) => u.team === 'player')
                .map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    disabled={u.hp <= 0}
                    onClick={() => dispatch({ type: 'select', unitId: u.id })}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs border transition ${
                      state.selectedUnitId === u.id
                        ? 'border-cyan-400/50 bg-cyan-500/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    } ${u.hp <= 0 ? 'opacity-40' : ''}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-cyan-100">{u.name}</span>
                      <span className="text-zinc-400">
                        {u.hp}/{u.maxHp}
                      </span>
                    </div>
                    <div className="text-zinc-500 mt-0.5">
                      AP {u.ap}/{u.maxAp} · Wave {u.wave}/{u.maxWave} · Ghosts {u.ghosts.length}/
                      {u.maxGhosts}
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Selected detail + ghosts */}
          {selected && selected.team === 'player' && (
            <div className="p-3 border-b border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                Selected · {selected.archetype}
              </div>
              {selected.ghosts.length === 0 ? (
                <p className="text-xs text-zinc-500">No prepared ghosts. Place with Ghost mode.</p>
              ) : (
                <div className="space-y-1">
                  {selected.ghosts.map((g, i) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        dispatch({ type: 'collapse', ghostId: g.id });
                        sceneRef.current?.burstAt(g.x, g.y);
                      }}
                      className="w-full text-left text-xs px-2 py-1.5 rounded bg-violet-500/15 border border-violet-400/30 hover:bg-violet-500/25"
                    >
                      [{i + 1}] Collapse {g.kind} @ ({g.x},{g.y}) · age {g.age}/{g.maxAge}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modes */}
          <div className="p-3 border-b border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => dispatch({ type: 'set_mode', mode: m.id })}
                  className={`text-[11px] px-2 py-1 rounded-full border ${
                    state.mode === m.id
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-100'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  {m.label}{' '}
                  <span className="text-zinc-500">{m.key}</span>
                </button>
              ))}
            </div>
            {state.mode === 'ghost' && (
              <div className="flex gap-1 mt-2">
                {['move', 'attack', 'overwatch'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setGhostKind(k)}
                    className={`text-[11px] px-2 py-1 rounded ${
                      ghostKind === k ? 'bg-violet-500/30 text-violet-100' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              disabled={busy || state.turn !== 'player' || state.phase !== 'play'}
              onClick={endTurn}
              className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600/40 to-violet-600/40 border border-cyan-400/30 text-sm font-medium hover:from-cyan-600/55 hover:to-violet-600/55 disabled:opacity-40"
            >
              {busy ? 'Enemy resolving…' : 'End Turn ↵'}
            </button>
          </div>

          {/* Log */}
          <div className="flex-1 overflow-y-auto p-3 min-h-0">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Log</div>
            <ul className="space-y-1">
              {state.log.slice(0, 24).map((line, i) => (
                <li key={`${i}-${line.slice(0, 12)}`} className="text-[11px] text-zinc-400 leading-snug">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
