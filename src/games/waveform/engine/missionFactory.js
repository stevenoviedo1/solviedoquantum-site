import { ARCHETYPE_STATS } from './types.js';
import { nextId, resetIdCounter } from './helpers.js';

/**
 * @param {import('./types.js').Archetype} archetype
 * @param {import('./types.js').Team} team
 * @param {number} x
 * @param {number} y
 * @param {string} [name]
 * @param {Partial<import('./types.js').Unit>} [overrides]
 */
export function makeUnit(archetype, team, x, y, name, overrides = {}) {
  const base = ARCHETYPE_STATS[archetype];
  return {
    id: nextId('u'),
    team,
    archetype,
    name: name || base.name,
    x,
    y,
    hp: base.maxHp,
    maxHp: base.maxHp,
    ap: base.maxAp,
    maxAp: base.maxAp,
    wave: base.maxWave,
    maxWave: base.maxWave,
    moveRange: base.moveRange,
    attackRange: base.attackRange,
    attackDamage: base.attackDamage,
    observeRange: base.observeRange,
    maxGhosts: base.maxGhosts,
    ghosts: [],
    acted: false,
    entangleReady: !!base.entangleReady,
    ...overrides,
  };
}

/**
 * @param {number} w
 * @param {number} h
 * @param {{x:number,y:number,type?:string}[]} [special]
 */
export function makeGrid(w, h, special = []) {
  /** @type {import('./types.js').Tile[]} */
  const tiles = [];
  const specialMap = new Map(special.map((s) => [`${s.x},${s.y}`, s]));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = specialMap.get(`${x},${y}`);
      tiles.push({
        x,
        y,
        type: /** @type {any} */ (s?.type || 'floor'),
        elevation: s?.type === 'cover' ? 1 : 0,
      });
    }
  }
  return tiles;
}

/**
 * @param {object} def
 * @returns {import('./types.js').MissionState}
 */
export function buildMission(def) {
  resetIdCounter(0);
  const tiles = makeGrid(def.width, def.height, def.specialTiles || []);
  const units = (def.units || []).map((u) =>
    makeUnit(u.archetype, u.team, u.x, u.y, u.name, u.overrides || {}),
  );

  /** @type {import('./types.js').EntangleLink[]} */
  const entanglements = [];
  if (def.entanglePairs) {
    for (const [ia, ib] of def.entanglePairs) {
      if (units[ia] && units[ib]) {
        entanglements.push({ a: units[ia].id, b: units[ib].id });
      }
    }
  }

  return {
    missionId: def.id,
    title: def.title,
    briefing: def.briefing,
    tip: def.tip,
    width: def.width,
    height: def.height,
    tiles,
    units,
    entanglements,
    turn: 'player',
    turnNumber: 1,
    phase: 'play',
    objective: def.objective,
    objectiveData: def.objectiveData || {},
    selectedUnitId: units.find((u) => u.team === 'player')?.id ?? null,
    mode: 'select',
    log: [`Mission start: ${def.title}`],
    events: [{ type: 'mission_start', payload: { id: def.id } }],
    stability: def.objectiveData?.stabilityStart ?? 0,
    collapsesForced: 0,
    tutorialStep: def.tutorialStep ?? null,
  };
}
