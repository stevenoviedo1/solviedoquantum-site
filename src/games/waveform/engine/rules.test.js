import { describe, it, expect } from 'vitest';
import { buildMission } from './missionFactory.js';
import { applyAction, getLegalMoves } from './rules.js';
import { MISSIONS } from '../content/missions.js';
import { runFullEnemyTurn } from './ai.js';

describe('Waveform engine', () => {
  it('builds tutorial mission with living units', () => {
    const s = buildMission(MISSIONS.m0);
    expect(s.width).toBe(8);
    expect(s.units.filter((u) => u.team === 'player').length).toBe(2);
    expect(s.phase).toBe('play');
  });

  it('moves deterministically and spends AP', () => {
    const s0 = buildMission(MISSIONS.m0);
    const unit = s0.units.find((u) => u.team === 'player');
    let s = applyAction(s0, { type: 'select', unitId: unit.id });
    s = applyAction(s, { type: 'set_mode', mode: 'move' });
    const moves = getLegalMoves(s);
    expect(moves.length).toBeGreaterThan(0);
    const dest = moves[0];
    s = applyAction(s, { type: 'move', x: dest.x, y: dest.y });
    const u = s.units.find((x) => x.id === unit.id);
    expect(u.x).toBe(dest.x);
    expect(u.y).toBe(dest.y);
    expect(u.ap).toBe(unit.maxAp - 1);
  });

  it('place ghost and collapse move is player-chosen', () => {
    const s0 = buildMission(MISSIONS.m0);
    const unit = s0.units.find((u) => u.archetype === 'scout');
    let s = applyAction(s0, { type: 'select', unitId: unit.id });
    s = applyAction(s, { type: 'set_mode', mode: 'ghost' });
    const moves = getLegalMoves({ ...s, mode: 'move' });
    // legal ghost move tiles use same reach when mode ghost — use reachable via move mode select
    s = applyAction(s, { type: 'set_mode', mode: 'move' });
    const reach = getLegalMoves(s);
    const dest = reach[reach.length - 1];
    s = applyAction(s, { type: 'place_ghost', kind: 'move', x: dest.x, y: dest.y });
    const u1 = s.units.find((x) => x.id === unit.id);
    expect(u1.ghosts.length).toBe(1);
    expect(u1.wave).toBe(unit.maxWave - 1);
    const gid = u1.ghosts[0].id;
    s = applyAction(s, { type: 'collapse', ghostId: gid });
    const u2 = s.units.find((x) => x.id === unit.id);
    expect(u2.ghosts.length).toBe(0);
    expect(u2.x).toBe(dest.x);
    expect(u2.y).toBe(dest.y);
  });

  it('enemy turn returns to player without throwing', () => {
    let s = buildMission(MISSIONS.m0);
    s = applyAction(s, { type: 'end_turn' });
    expect(s.turn).toBe('enemy');
    s = runFullEnemyTurn(s);
    expect(s.turn).toBe('player');
    expect(s.turnNumber).toBe(2);
  });
});
