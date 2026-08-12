/** @param {number} ax @param {number} ay @param {number} bx @param {number} by */
export function manhattan(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/** @param {import('./types.js').MissionState} state */
export function cloneState(state) {
  return structuredClone(state);
}

/** @param {import('./types.js').MissionState} state @param {string} id */
export function getUnit(state, id) {
  return state.units.find((u) => u.id === id) ?? null;
}

/** @param {import('./types.js').MissionState} state @param {number} x @param {number} y */
export function unitAt(state, x, y) {
  return state.units.find((u) => u.hp > 0 && u.x === x && u.y === y) ?? null;
}

/** @param {import('./types.js').MissionState} state @param {number} x @param {number} y */
export function getTile(state, x, y) {
  return state.tiles.find((t) => t.x === x && t.y === y) ?? null;
}

/** @param {import('./types.js').MissionState} state @param {number} x @param {number} y */
export function inBounds(state, x, y) {
  return x >= 0 && y >= 0 && x < state.width && y < state.height;
}

/** @param {import('./types.js').MissionState} state @param {number} x @param {number} y */
export function isWalkable(state, x, y) {
  if (!inBounds(state, x, y)) return false;
  const tile = getTile(state, x, y);
  if (!tile || tile.type === 'blocked') return false;
  return !unitAt(state, x, y);
}

/** @param {import('./types.js').MissionState} state @param {import('./types.js').Unit} unit @param {number} x @param {number} y */
export function canStand(state, unit, x, y) {
  if (!inBounds(state, x, y)) return false;
  const tile = getTile(state, x, y);
  if (!tile || tile.type === 'blocked') return false;
  const other = unitAt(state, x, y);
  return !other || other.id === unit.id;
}

/**
 * BFS reachable tiles within range (orthogonal).
 * @param {import('./types.js').MissionState} state
 * @param {import('./types.js').Unit} unit
 * @param {number} range
 */
export function reachableTiles(state, unit, range) {
  /** @type {Map<string, number>} */
  const dist = new Map();
  const key = (x, y) => `${x},${y}`;
  const q = [{ x: unit.x, y: unit.y, d: 0 }];
  dist.set(key(unit.x, unit.y), 0);
  /** @type {{x:number,y:number}[]} */
  const out = [];

  while (q.length) {
    const cur = q.shift();
    if (!cur) break;
    if (cur.d > 0) out.push({ x: cur.x, y: cur.y });
    if (cur.d >= range) continue;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      const k = key(nx, ny);
      if (dist.has(k)) continue;
      if (!canStand(state, unit, nx, ny) && !(nx === unit.x && ny === unit.y)) continue;
      // allow stepping onto empty or self
      const blocked = unitAt(state, nx, ny) && !(nx === unit.x && ny === unit.y);
      if (blocked) continue;
      const tile = getTile(state, nx, ny);
      if (!tile || tile.type === 'blocked') continue;
      dist.set(k, cur.d + 1);
      q.push({ x: nx, y: ny, d: cur.d + 1 });
    }
  }
  return out;
}

/** @param {import('./types.js').MissionState} state @param {import('./types.js').Unit} unit */
export function attackTargets(state, unit) {
  return state.units.filter(
    (u) =>
      u.hp > 0 &&
      u.team !== unit.team &&
      manhattan(unit.x, unit.y, u.x, u.y) <= unit.attackRange,
  );
}

/** @param {import('./types.js').MissionState} state @param {import('./types.js').Unit} unit */
export function observeTargets(state, unit) {
  return state.units.filter(
    (u) =>
      u.hp > 0 &&
      u.team !== unit.team &&
      manhattan(unit.x, unit.y, u.x, u.y) <= unit.observeRange,
  );
}

/** @param {import('./types.js').MissionState} state @param {string} unitId */
export function entanglePartner(state, unitId) {
  const link = state.entanglements.find((e) => e.a === unitId || e.b === unitId);
  if (!link) return null;
  const otherId = link.a === unitId ? link.b : link.a;
  return getUnit(state, otherId);
}

let _gid = 0;
export function nextId(prefix = 'g') {
  _gid += 1;
  return `${prefix}${_gid}`;
}

export function resetIdCounter(n = 0) {
  _gid = n;
}

/** @param {import('./types.js').MissionState} state @param {string} msg */
export function pushLog(state, msg) {
  state.log = [msg, ...state.log].slice(0, 40);
}

/** @param {import('./types.js').MissionState} state @param {string} type @param {object} [payload] */
export function pushEvent(state, type, payload = {}) {
  state.events = [...state.events, { type, payload }];
}

/** @param {import('./types.js').MissionState} state */
export function clearEvents(state) {
  state.events = [];
}

/**
 * Interference at a cell: same team ghosts reinforce; mixed teams cancel.
 * @param {import('./types.js').MissionState} state
 * @param {number} x
 * @param {number} y
 */
export function interferenceAt(state, x, y) {
  /** @type {{unitId:string, ghost:import('./types.js').Ghost, team:string}[]} */
  const hits = [];
  for (const u of state.units) {
    if (u.hp <= 0) continue;
    for (const g of u.ghosts) {
      if (g.x === x && g.y === y) hits.push({ unitId: u.id, ghost: g, team: u.team });
    }
  }
  if (hits.length < 2) {
    return { kind: 'none', hits, bonus: 0 };
  }
  const teams = new Set(hits.map((h) => h.team));
  if (teams.size === 1) {
    return { kind: 'constructive', hits, bonus: hits.length - 1 };
  }
  return { kind: 'destructive', hits, bonus: 0 };
}

/** @param {import('./types.js').Unit} unit */
export function worstGhostForOwner(unit) {
  if (!unit.ghosts.length) return null;
  // Prefer attack ghosts far from allies? For forced collapse: pick ghost that moves farthest from objective-ish.
  // Deterministic: highest age, then move kind last, then lowest y, x.
  const sorted = [...unit.ghosts].sort((a, b) => {
    if (b.age !== a.age) return b.age - a.age;
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
  return sorted[0];
}
