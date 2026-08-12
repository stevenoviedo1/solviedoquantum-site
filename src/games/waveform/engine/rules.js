import {
  attackTargets,
  canStand,
  clearEvents,
  cloneState,
  entanglePartner,
  getTile,
  getUnit,
  interferenceAt,
  manhattan,
  nextId,
  observeTargets,
  pushEvent,
  pushLog,
  reachableTiles,
  unitAt,
  worstGhostForOwner,
} from './helpers.js';

const GLOBAL_GHOST_CAP = 6;

/** @param {import('./types.js').MissionState} state */
function living(state, team) {
  return state.units.filter((u) => u.hp > 0 && (!team || u.team === team));
}

/** @param {import('./types.js').MissionState} state */
function countGhosts(state) {
  return state.units.reduce((n, u) => n + u.ghosts.length, 0);
}

/** @param {import('./types.js').MissionState} state */
export function checkVictory(state) {
  if (state.phase !== 'play') return state;

  const enemies = living(state, 'enemy');
  const players = living(state, 'player');

  if (players.length === 0) {
    state.phase = 'lost';
    pushLog(state, 'All units down. Field lost.');
    pushEvent(state, 'mission_lost');
    return state;
  }

  const od = state.objectiveData || {};

  if (state.objective === 'eliminate' && enemies.length === 0) {
    state.phase = 'won';
    pushLog(state, 'All hostiles collapsed. Victory.');
    pushEvent(state, 'mission_won');
    return state;
  }

  if (state.objective === 'extract') {
    const onExtract = players.some((u) => {
      const t = getTile(state, u.x, u.y);
      return t && t.type === 'extract';
    });
    if (onExtract) {
      state.phase = 'won';
      pushLog(state, 'Extract secured. Victory.');
      pushEvent(state, 'mission_won');
      return state;
    }
  }

  if (state.objective === 'stabilize') {
    const target = od.stabilityTarget ?? 6;
    if (state.stability >= target) {
      state.phase = 'won';
      pushLog(state, 'Field stabilized. Victory.');
      pushEvent(state, 'mission_won');
      return state;
    }
  }

  if (state.objective === 'protect') {
    const node = state.units.find((u) => u.name === 'Node');
    if (!node || node.hp <= 0) {
      state.phase = 'lost';
      pushLog(state, 'Node destroyed. Mission failed.');
      pushEvent(state, 'mission_lost');
      return state;
    }
    const need = od.protectTurns ?? 6;
    if (state.turnNumber > need && state.turn === 'player') {
      state.phase = 'won';
      pushLog(state, 'Node held. Victory.');
      pushEvent(state, 'mission_won');
      return state;
    }
  }

  if (od.turnLimit && state.turnNumber > od.turnLimit) {
    if (state.objective === 'eliminate' && enemies.length > 0) {
      state.phase = 'lost';
      pushLog(state, 'Turn limit. Super-wave hardened against you.');
      pushEvent(state, 'mission_lost');
    }
  }

  return state;
}

/** @param {import('./types.js').MissionState} state @param {import('./types.js').Unit} unit @param {import('./types.js').Ghost} ghost */
function applyGhostCommit(state, unit, ghost) {
  if (ghost.kind === 'move') {
    if (canStand(state, unit, ghost.x, ghost.y)) {
      const from = { x: unit.x, y: unit.y };
      unit.x = ghost.x;
      unit.y = ghost.y;
      pushEvent(state, 'unit_move', { id: unit.id, from, to: { x: unit.x, y: unit.y } });
      pushLog(state, `${unit.name} collapses into move (${unit.x},${unit.y}).`);
    } else {
      pushLog(state, `${unit.name} move-ghost blocked — dissipates.`);
    }
  } else if (ghost.kind === 'attack') {
    const target = unitAt(state, ghost.x, ghost.y);
    if (target && target.team !== unit.team && target.hp > 0) {
      const inter = interferenceAt(state, ghost.x, ghost.y);
      let dmg = unit.attackDamage;
      if (inter.kind === 'constructive' && inter.hits.some((h) => h.team === unit.team)) {
        dmg += inter.bonus;
      }
      // Blade bonus on collapse-attack
      if (unit.archetype === 'blade') dmg += 1;
      applyDamage(state, target, dmg, unit);
      pushLog(state, `${unit.name} collapse-strike hits ${target.name} for ${dmg}.`);
    } else {
      pushLog(state, `${unit.name} attack-ghost finds no target.`);
    }
  } else if (ghost.kind === 'overwatch') {
    // Instant free attack on any enemy in range of ghost cell as if unit were there
    const enemies = state.units.filter(
      (u) =>
        u.hp > 0 &&
        u.team !== unit.team &&
        manhattan(ghost.x, ghost.y, u.x, u.y) <= unit.attackRange,
    );
    if (enemies.length) {
      enemies.sort((a, b) => a.hp - b.hp || a.id.localeCompare(b.id));
      const t = enemies[0];
      applyDamage(state, t, unit.attackDamage, unit);
      pushLog(state, `${unit.name} overwatch collapses onto ${t.name}.`);
    } else {
      pushLog(state, `${unit.name} overwatch ghost finds nothing.`);
    }
  }
  unit.ghosts = unit.ghosts.filter((g) => g.id !== ghost.id);
}

/**
 * @param {import('./types.js').MissionState} state
 * @param {import('./types.js').Unit} target
 * @param {number} amount
 * @param {import('./types.js').Unit | null} source
 */
export function applyDamage(state, target, amount, source) {
  const cover = getTile(state, target.x, target.y);
  let dmg = amount;
  if (cover?.type === 'cover') dmg = Math.max(1, dmg - 1);
  target.hp = Math.max(0, target.hp - dmg);
  pushEvent(state, 'damage', { id: target.id, amount: dmg, hp: target.hp });

  if (target.hp <= 0) {
    pushLog(state, `${target.name} is down.`);
    pushEvent(state, 'unit_down', { id: target.id });
    // clear ghosts
    target.ghosts = [];
    // remove entangles
    state.entanglements = state.entanglements.filter(
      (e) => e.a !== target.id && e.b !== target.id,
    );
    // Twin link: linked partner takes 2 damage when one falls
    // (already removed link; check partner before filter — handled above)
  }

  // Entanglement pressure: partner takes 1 echo damage (deterministic)
  if (source && target.hp > 0) {
    const partner = entanglePartner(state, target.id);
    if (partner && partner.hp > 0 && partner.id !== source.id) {
      partner.hp = Math.max(0, partner.hp - 1);
      pushLog(state, `Entangle echo: ${partner.name} takes 1.`);
      pushEvent(state, 'damage', { id: partner.id, amount: 1, hp: partner.hp, echo: true });
      if (partner.hp <= 0) {
        pushLog(state, `${partner.name} collapses from echo.`);
        partner.ghosts = [];
        state.entanglements = state.entanglements.filter(
          (e) => e.a !== partner.id && e.b !== partner.id,
        );
      }
    }
  }

  // Twin death: if twin dies, partner takes 2
  if (target.hp <= 0 && target.archetype === 'twin') {
    // find if was linked — already stripped; use name pair? re-scan before death handled:
  }
}

/**
 * Force-collapse worst ghost on a unit (Observe punishment) — deterministic.
 * @param {import('./types.js').MissionState} state
 * @param {import('./types.js').Unit} unit
 */
export function forceCollapseWorst(state, unit) {
  const g = worstGhostForOwner(unit);
  if (!g) {
    // freeze classical: lose 1 AP next — mark acted-ish
    unit.ap = Math.max(0, unit.ap - 1);
    pushLog(state, `${unit.name} has no ghosts — Observe freezes 1 AP.`);
    return;
  }
  pushEvent(state, 'force_collapse', { id: unit.id, ghostId: g.id });
  applyGhostCommit(state, unit, g);
  state.collapsesForced += 1;
}

/** @param {import('./types.js').MissionState} state */
function ageGhosts(state, team) {
  for (const u of state.units) {
    if (u.hp <= 0) continue;
    if (team && u.team !== team) continue;
    const kept = [];
    for (const g of u.ghosts) {
      g.age += 1;
      if (g.age > g.maxAge) {
        pushLog(state, `${u.name} ghost decohered.`);
        pushEvent(state, 'decohere', { id: u.id, ghostId: g.id });
      } else {
        kept.push(g);
      }
    }
    u.ghosts = kept;
  }
}

/** @param {import('./types.js').MissionState} state */
function refreshTeam(state, team) {
  for (const u of state.units) {
    if (u.team !== team || u.hp <= 0) continue;
    u.ap = u.maxAp;
    u.wave = u.maxWave;
    u.acted = false;
  }
}

/** @param {import('./types.js').MissionState} state */
function tickStabilize(state) {
  if (state.objective !== 'stabilize') return;
  const beacons = state.tiles.filter((t) => t.type === 'beacon');
  let held = 0;
  for (const b of beacons) {
    const u = unitAt(state, b.x, b.y);
    if (u && u.team === 'player') held += 1;
  }
  if (held > 0) {
    state.stability += held;
    pushLog(state, `Stability +${held} (now ${state.stability}).`);
  }
}

// —— Public actions ——

/**
 * @param {import('./types.js').MissionState} state
 * @param {{type: string, [k: string]: any}} action
 * @returns {import('./types.js').MissionState}
 */
export function applyAction(state, action) {
  const s = cloneState(state);
  clearEvents(s);

  if (s.phase !== 'play' && action.type !== 'noop') {
    return s;
  }

  switch (action.type) {
    case 'select':
      return actSelect(s, action.unitId);
    case 'set_mode':
      return actSetMode(s, action.mode);
    case 'move':
      return actMove(s, action.x, action.y);
    case 'attack':
      return actAttack(s, action.targetId);
    case 'place_ghost':
      return actPlaceGhost(s, action.kind, action.x, action.y);
    case 'collapse':
      return actCollapse(s, action.ghostId);
    case 'observe':
      return actObserve(s, action.targetId);
    case 'entangle':
      return actEntangle(s, action.targetId);
    case 'sever':
      return actSever(s, action.targetId);
    case 'end_turn':
      return actEndTurn(s);
    case 'cancel':
      s.mode = 'select';
      return s;
    default:
      return s;
  }
}

/** @param {import('./types.js').MissionState} s @param {string} unitId */
function actSelect(s, unitId) {
  const u = getUnit(s, unitId);
  if (!u || u.hp <= 0) return s;
  if (s.turn === 'player' && u.team !== 'player') return s;
  s.selectedUnitId = unitId;
  s.mode = 'select';
  return s;
}

/** @param {import('./types.js').MissionState} s @param {import('./types.js').InputMode} mode */
function actSetMode(s, mode) {
  s.mode = mode;
  return s;
}

/** @param {import('./types.js').MissionState} s */
function requireSelectedPlayer(s) {
  if (s.turn !== 'player') return null;
  const u = getUnit(s, s.selectedUnitId);
  if (!u || u.team !== 'player' || u.hp <= 0) return null;
  return u;
}

/** @param {import('./types.js').MissionState} s @param {number} x @param {number} y */
function actMove(s, x, y) {
  const u = requireSelectedPlayer(s);
  if (!u || u.ap < 1) return s;
  const reach = reachableTiles(s, u, u.moveRange);
  if (!reach.some((t) => t.x === x && t.y === y)) return s;
  const from = { x: u.x, y: u.y };
  u.x = x;
  u.y = y;
  u.ap -= 1;
  pushEvent(s, 'unit_move', { id: u.id, from, to: { x, y } });
  pushLog(s, `${u.name} moves to (${x},${y}).`);
  s.mode = 'select';
  if (s.tutorialStep === 'move') s.tutorialStep = 'ghost';
  return checkVictory(s);
}

/** @param {import('./types.js').MissionState} s @param {string} targetId */
function actAttack(s, targetId) {
  const u = requireSelectedPlayer(s);
  if (!u || u.ap < 1) return s;
  const t = getUnit(s, targetId);
  if (!t || t.hp <= 0 || t.team === u.team) return s;
  if (manhattan(u.x, u.y, t.x, t.y) > u.attackRange) return s;
  u.ap -= 1;
  applyDamage(s, t, u.attackDamage, u);
  pushLog(s, `${u.name} strikes ${t.name} for ${u.attackDamage}.`);
  pushEvent(s, 'attack', { from: u.id, to: t.id });
  s.mode = 'select';
  return checkVictory(s);
}

/**
 * @param {import('./types.js').MissionState} s
 * @param {'move'|'attack'|'overwatch'} kind
 * @param {number} x
 * @param {number} y
 */
function actPlaceGhost(s, kind, x, y) {
  const u = requireSelectedPlayer(s);
  if (!u || u.wave < 1) return s;
  if (u.ghosts.length >= u.maxGhosts) return s;
  if (countGhosts(s) >= GLOBAL_GHOST_CAP) {
    pushLog(s, 'Global ghost cap reached (6).');
    return s;
  }

  if (kind === 'move') {
    const reach = reachableTiles(s, u, u.moveRange);
    if (!reach.some((t) => t.x === x && t.y === y) && !(x === u.x && y === u.y)) return s;
  } else if (kind === 'attack') {
    // attack ghost marks a tile within attack range of current pos (or future — keep simple: from current)
    if (manhattan(u.x, u.y, x, y) > u.attackRange + u.moveRange) return s;
  } else if (kind === 'overwatch') {
    const reach = reachableTiles(s, u, u.moveRange);
    if (!reach.some((t) => t.x === x && t.y === y) && !(x === u.x && y === u.y)) return s;
  }

  u.wave -= 1;
  const ghost = {
    id: nextId('gh'),
    kind,
    x,
    y,
    age: 0,
    maxAge: 3,
  };
  u.ghosts.push(ghost);
  pushEvent(s, 'place_ghost', { unitId: u.id, ghost });
  pushLog(s, `${u.name} prepares ${kind} ghost @ (${x},${y}).`);
  s.mode = 'select';
  if (s.tutorialStep === 'ghost') s.tutorialStep = 'collapse';
  return s;
}

/** @param {import('./types.js').MissionState} s @param {string} ghostId */
function actCollapse(s, ghostId) {
  const u = requireSelectedPlayer(s);
  if (!u) return s;
  const ghost = u.ghosts.find((g) => g.id === ghostId);
  if (!ghost) return s;
  // Collapse is free commit (skill — you prepared it)
  pushEvent(s, 'collapse', { unitId: u.id, ghostId });
  applyGhostCommit(s, u, ghost);
  s.mode = 'select';
  if (s.tutorialStep === 'collapse') s.tutorialStep = 'observe';
  return checkVictory(s);
}

/** @param {import('./types.js').MissionState} s @param {string} targetId */
function actObserve(s, targetId) {
  const u = requireSelectedPlayer(s);
  if (!u || u.ap < 1) return s;
  const t = getUnit(s, targetId);
  if (!t || t.hp <= 0 || t.team === u.team) return s;
  if (manhattan(u.x, u.y, t.x, t.y) > u.observeRange) return s;
  u.ap -= 1;
  pushEvent(s, 'observe', { from: u.id, to: t.id });
  pushLog(s, `${u.name} Observes ${t.name}.`);
  forceCollapseWorst(s, t);
  // Meter: also age all enemy ghosts by +1 in range
  if (u.archetype === 'meter') {
    for (const e of living(s, 'enemy')) {
      if (manhattan(u.x, u.y, e.x, e.y) <= u.observeRange) {
        for (const g of e.ghosts) g.age += 1;
        e.ghosts = e.ghosts.filter((g) => {
          if (g.age > g.maxAge) {
            pushEvent(s, 'decohere', { id: e.id, ghostId: g.id });
            return false;
          }
          return true;
        });
      }
    }
    pushLog(s, `${u.name} meter-pulse ages nearby enemy ghosts.`);
  }
  s.mode = 'select';
  if (s.tutorialStep === 'observe') s.tutorialStep = 'done';
  return checkVictory(s);
}

/** @param {import('./types.js').MissionState} s @param {string} targetId */
function actEntangle(s, targetId) {
  const u = requireSelectedPlayer(s);
  if (!u || u.ap < 1 || !u.entangleReady) return s;
  const t = getUnit(s, targetId);
  if (!t || t.hp <= 0 || t.team !== 'player' || t.id === u.id) return s;
  if (manhattan(u.x, u.y, t.x, t.y) > 3) return s;
  if (s.entanglements.some((e) => e.a === u.id || e.b === u.id || e.a === t.id || e.b === t.id)) {
    pushLog(s, 'Already entangled.');
    return s;
  }
  u.ap -= 1;
  s.entanglements.push({ a: u.id, b: t.id });
  pushEvent(s, 'entangle', { a: u.id, b: t.id });
  pushLog(s, `${u.name} entangles with ${t.name}.`);
  s.mode = 'select';
  return s;
}

/** @param {import('./types.js').MissionState} s @param {string} targetId */
function actSever(s, targetId) {
  const u = requireSelectedPlayer(s);
  if (!u || u.ap < 1) return s;
  if (u.archetype !== 'meter' && u.archetype !== 'anchor') return s;
  const t = getUnit(s, targetId);
  if (!t) return s;
  const before = s.entanglements.length;
  s.entanglements = s.entanglements.filter(
    (e) => e.a !== t.id && e.b !== t.id && e.a !== u.id && e.b !== u.id,
  );
  if (s.entanglements.length === before) return s;
  u.ap -= 1;
  pushLog(s, `${u.name} severs entanglement.`);
  pushEvent(s, 'sever', { id: t.id });
  s.mode = 'select';
  return s;
}

/** @param {import('./types.js').MissionState} s */
function actEndTurn(s) {
  if (s.turn !== 'player') return s;
  ageGhosts(s, 'player');
  tickStabilize(s);
  s.turn = 'enemy';
  refreshTeam(s, 'enemy');
  pushLog(s, `— Enemy turn ${s.turnNumber} —`);
  pushEvent(s, 'turn', { team: 'enemy', n: s.turnNumber });
  // AI runs externally via runEnemyTurn for animation hooks; also support inline
  return s;
}

/**
 * Complete enemy turn with provided AI function.
 * @param {import('./types.js').MissionState} state
 * @param {(s: import('./types.js').MissionState) => import('./types.js').MissionState} aiStep
 */
export function runEnemyTurn(state, aiStep) {
  let s = cloneState(state);
  clearEvents(s);
  if (s.phase !== 'play' || s.turn !== 'enemy') return s;

  // Multiple AI steps until all enemy AP spent or stuck
  for (let i = 0; i < 40; i++) {
    const before = JSON.stringify(s.units.map((u) => [u.id, u.ap, u.x, u.y, u.hp, u.ghosts.length]));
    s = aiStep(s);
    clearEvents(s); // keep accumulating? better merge — for simplicity re-clone carefully
    const after = JSON.stringify(s.units.map((u) => [u.id, u.ap, u.x, u.y, u.hp, u.ghosts.length]));
    if (before === after) break;
    if (s.phase !== 'play') return s;
  }

  ageGhosts(s, 'enemy');
  s.turn = 'player';
  s.turnNumber += 1;
  refreshTeam(s, 'player');
  pushLog(s, `— Player turn ${s.turnNumber} —`);
  pushEvent(s, 'turn', { team: 'player', n: s.turnNumber });
  return checkVictory(s);
}

/** Legal UI helpers */
export function getLegalMoves(state) {
  const u = getUnit(state, state.selectedUnitId);
  if (!u || u.team !== 'player' || state.turn !== 'player') return [];
  return reachableTiles(state, u, u.moveRange);
}

export function getLegalAttacks(state) {
  const u = getUnit(state, state.selectedUnitId);
  if (!u || u.team !== 'player' || state.turn !== 'player') return [];
  return attackTargets(state, u);
}

export function getLegalObserves(state) {
  const u = getUnit(state, state.selectedUnitId);
  if (!u || u.team !== 'player' || state.turn !== 'player') return [];
  return observeTargets(state, u);
}

export { living, countGhosts, GLOBAL_GHOST_CAP };
