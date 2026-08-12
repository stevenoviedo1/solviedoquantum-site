import {
  attackTargets,
  cloneState,
  getUnit,
  manhattan,
  nextId,
  observeTargets,
  pushEvent,
  pushLog,
  reachableTiles,
  unitAt,
  worstGhostForOwner,
} from './helpers.js';
import { applyDamage, forceCollapseWorst, checkVictory } from './rules.js';

/**
 * One greedy AI step: pick an enemy unit with AP and do the best single action.
 * Deterministic priorities (chess-like, legible).
 * @param {import('./types.js').MissionState} state
 */
export function enemyAiStep(state) {
  const s = cloneState(state);
  if (s.phase !== 'play' || s.turn !== 'enemy') return s;

  const enemies = s.units
    .filter((u) => u.team === 'enemy' && u.hp > 0 && u.ap > 0)
    .sort((a, b) => a.id.localeCompare(b.id));

  if (!enemies.length) return s;

  for (const e of enemies) {
    // 1) Win-ish: attack lowest HP player in range
    const attacks = attackTargets(s, e).sort(
      (a, b) => a.hp - b.hp || a.id.localeCompare(b.id),
    );
    if (attacks.length && e.ap > 0) {
      const t = attacks[0];
      e.ap -= 1;
      applyDamage(s, t, e.attackDamage, e);
      pushLog(s, `${e.name} strikes ${t.name}.`);
      pushEvent(s, 'attack', { from: e.id, to: t.id });
      return checkVictory(s);
    }

    // 2) Observe player with most ghosts
    if (e.observeRange > 0 && e.archetype !== 'brute') {
      const obs = observeTargets(s, e)
        .filter((p) => p.ghosts.length > 0)
        .sort((a, b) => b.ghosts.length - a.ghosts.length || a.id.localeCompare(b.id));
      if (obs.length && e.ap > 0) {
        const t = obs[0];
        e.ap -= 1;
        pushLog(s, `${e.name} Observes ${t.name}.`);
        pushEvent(s, 'observe', { from: e.id, to: t.id });
        forceCollapseWorst(s, t);
        return checkVictory(s);
      }
    }

    // 3) Scatter: place decoherence pressure — place attack ghost near players or age via observe already done
    if (e.archetype === 'scatter' && e.wave > 0 && e.ghosts.length < e.maxGhosts) {
      const players = s.units.filter((u) => u.team === 'player' && u.hp > 0);
      players.sort((a, b) => manhattan(e.x, e.y, a.x, a.y) - manhattan(e.x, e.y, b.x, b.y));
      if (players[0]) {
        const p = players[0];
        e.wave -= 1;
        e.ghosts.push({
          id: nextId('gh'),
          kind: 'attack',
          x: p.x,
          y: p.y,
          age: 0,
          maxAge: 3,
        });
        pushLog(s, `${e.name} prepares attack ghost.`);
        pushEvent(s, 'place_ghost', { unitId: e.id });
        return s;
      }
    }

    // 4) Watcher / general: move closer to nearest player
    const players = s.units
      .filter((u) => u.team === 'player' && u.hp > 0)
      .sort(
        (a, b) =>
          manhattan(e.x, e.y, a.x, a.y) - manhattan(e.x, e.y, b.x, b.y) ||
          a.id.localeCompare(b.id),
      );
    if (players[0] && e.ap > 0) {
      const target = players[0];
      const reach = reachableTiles(s, e, e.moveRange);
      if (reach.length) {
        reach.sort((a, b) => {
          const da = manhattan(a.x, a.y, target.x, target.y);
          const db = manhattan(b.x, b.y, target.x, target.y);
          if (da !== db) return da - db;
          if (a.y !== b.y) return a.y - b.y;
          return a.x - b.x;
        });
        // Prefer tiles that enter attack range
        const inRange = reach.filter(
          (t) => manhattan(t.x, t.y, target.x, target.y) <= e.attackRange,
        );
        const pick = (inRange[0] || reach[0]);
        if (pick && (pick.x !== e.x || pick.y !== e.y)) {
          const from = { x: e.x, y: e.y };
          e.x = pick.x;
          e.y = pick.y;
          e.ap -= 1;
          pushEvent(s, 'unit_move', { id: e.id, from, to: { x: e.x, y: e.y } });
          pushLog(s, `${e.name} advances.`);
          return s;
        }
      }
    }

    // 5) Mimic: copy a player ghost tile as attack ghost
    if (e.archetype === 'mimic' && e.wave > 0 && e.ghosts.length < e.maxGhosts) {
      /** @type {{x:number,y:number}[]} */
      const playerGhostTiles = [];
      for (const p of s.units.filter((u) => u.team === 'player' && u.hp > 0)) {
        for (const g of p.ghosts) playerGhostTiles.push({ x: g.x, y: g.y });
      }
      playerGhostTiles.sort((a, b) => a.y - b.y || a.x - b.x);
      if (playerGhostTiles[0]) {
        const t = playerGhostTiles[0];
        e.wave -= 1;
        e.ghosts.push({
          id: nextId('gh'),
          kind: 'move',
          x: t.x,
          y: t.y,
          age: 0,
          maxAge: 3,
        });
        pushLog(s, `${e.name} mimics a ghost line.`);
        return s;
      }
    }

    // Spend remaining AP futilely — mark spent to avoid infinite loop
    e.ap = 0;
  }

  return s;
}

/**
 * Run full enemy turn (all steps).
 * @param {import('./types.js').MissionState} state
 */
export function runFullEnemyTurn(state) {
  let s = cloneState(state);
  if (s.phase !== 'play') return s;

  // Ensure enemy turn
  if (s.turn === 'player') {
    // Should be called after end_turn already flipped
  }

  for (let i = 0; i < 48; i++) {
    const enemies = s.units.filter((u) => u.team === 'enemy' && u.hp > 0 && u.ap > 0);
    if (!enemies.length) break;
    const before = snapshot(s);
    s = enemyAiStep(s);
    if (snapshot(s) === before) {
      // force drain
      for (const e of s.units) {
        if (e.team === 'enemy') e.ap = 0;
      }
      break;
    }
    if (s.phase !== 'play') return s;
  }

  // Age enemy ghosts
  for (const u of s.units) {
    if (u.team !== 'enemy' || u.hp <= 0) continue;
    u.ghosts = u.ghosts.filter((g) => {
      g.age += 1;
      if (g.age > g.maxAge) {
        pushLog(s, `${u.name} ghost decohered.`);
        return false;
      }
      return true;
    });
  }

  s.turn = 'player';
  s.turnNumber += 1;
  for (const u of s.units) {
    if (u.team === 'player' && u.hp > 0) {
      u.ap = u.maxAp;
      u.wave = u.maxWave;
      u.acted = false;
    }
  }
  pushLog(s, `— Player turn ${s.turnNumber} —`);
  pushEvent(s, 'turn', { team: 'player', n: s.turnNumber });
  return checkVictory(s);
}

function snapshot(s) {
  return JSON.stringify(
    s.units.map((u) => [u.id, u.ap, u.wave, u.x, u.y, u.hp, u.ghosts.map((g) => g.id)]),
  );
}

// silence unused import warnings in some tooling
void getUnit;
void unitAt;
void worstGhostForOwner;
