/** @typedef {'player' | 'enemy'} Team */
/** @typedef {'anchor' | 'scout' | 'weaver' | 'blade' | 'meter' | 'watcher' | 'scatter' | 'twin' | 'brute' | 'mimic'} Archetype */
/** @typedef {'select' | 'move' | 'attack' | 'ghost' | 'observe' | 'entangle' | 'collapse'} InputMode */
/** @typedef {'eliminate' | 'extract' | 'stabilize' | 'protect' | 'observe_race'} ObjectiveType */
/** @typedef {'play' | 'won' | 'lost'} MissionPhase */

/**
 * @typedef {Object} Ghost
 * @property {string} id
 * @property {'move' | 'attack' | 'overwatch'} kind
 * @property {number} x
 * @property {number} y
 * @property {number} [tx]
 * @property {number} [ty]
 * @property {number} age
 * @property {number} maxAge
 */

/**
 * @typedef {Object} Unit
 * @property {string} id
 * @property {Team} team
 * @property {Archetype} archetype
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} ap
 * @property {number} maxAp
 * @property {number} wave
 * @property {number} maxWave
 * @property {number} moveRange
 * @property {number} attackRange
 * @property {number} attackDamage
 * @property {number} observeRange
 * @property {number} maxGhosts
 * @property {Ghost[]} ghosts
 * @property {boolean} acted
 * @property {boolean} [entangleReady]
 */

/**
 * @typedef {Object} Tile
 * @property {number} x
 * @property {number} y
 * @property {'floor' | 'cover' | 'blocked' | 'extract' | 'beacon' | 'spawn'} type
 * @property {number} elevation
 */

/**
 * @typedef {Object} EntangleLink
 * @property {string} a
 * @property {string} b
 */

/**
 * @typedef {Object} MissionEvent
 * @property {string} type
 * @property {object} [payload]
 */

/**
 * @typedef {Object} MissionState
 * @property {string} missionId
 * @property {string} title
 * @property {string} briefing
 * @property {string} tip
 * @property {number} width
 * @property {number} height
 * @property {Tile[]} tiles
 * @property {Unit[]} units
 * @property {EntangleLink[]} entanglements
 * @property {Team} turn
 * @property {number} turnNumber
 * @property {MissionPhase} phase
 * @property {ObjectiveType} objective
 * @property {object} objectiveData
 * @property {string | null} selectedUnitId
 * @property {InputMode} mode
 * @property {string[]} log
 * @property {MissionEvent[]} events
 * @property {number} stability
 * @property {number} collapsesForced
 * @property {string | null} tutorialStep
 */

export const ARCHETYPE_STATS = {
  anchor: {
    name: 'Anchor',
    maxHp: 12,
    maxAp: 2,
    maxWave: 1,
    moveRange: 3,
    attackRange: 1,
    attackDamage: 3,
    observeRange: 2,
    maxGhosts: 1,
    entangleReady: true,
  },
  scout: {
    name: 'Scout',
    maxHp: 7,
    maxAp: 3,
    maxWave: 2,
    moveRange: 4,
    attackRange: 3,
    attackDamage: 2,
    observeRange: 4,
    maxGhosts: 2,
    entangleReady: false,
  },
  weaver: {
    name: 'Weaver',
    maxHp: 8,
    maxAp: 2,
    maxWave: 3,
    moveRange: 3,
    attackRange: 2,
    attackDamage: 2,
    observeRange: 3,
    maxGhosts: 3,
    entangleReady: false,
  },
  blade: {
    name: 'Blade',
    maxHp: 8,
    maxAp: 3,
    maxWave: 2,
    moveRange: 4,
    attackRange: 1,
    attackDamage: 4,
    observeRange: 2,
    maxGhosts: 2,
    entangleReady: false,
  },
  meter: {
    name: 'Meter',
    maxHp: 9,
    maxAp: 2,
    maxWave: 2,
    moveRange: 3,
    attackRange: 2,
    attackDamage: 2,
    observeRange: 3,
    maxGhosts: 2,
    entangleReady: true,
  },
  watcher: {
    name: 'Watcher',
    maxHp: 8,
    maxAp: 2,
    maxWave: 1,
    moveRange: 3,
    attackRange: 3,
    attackDamage: 2,
    observeRange: 4,
    maxGhosts: 1,
    entangleReady: false,
  },
  scatter: {
    name: 'Scatter',
    maxHp: 7,
    maxAp: 2,
    maxWave: 2,
    moveRange: 3,
    attackRange: 2,
    attackDamage: 2,
    observeRange: 2,
    maxGhosts: 2,
    entangleReady: false,
  },
  twin: {
    name: 'Twin',
    maxHp: 6,
    maxAp: 2,
    maxWave: 1,
    moveRange: 3,
    attackRange: 1,
    attackDamage: 3,
    observeRange: 2,
    maxGhosts: 1,
    entangleReady: true,
  },
  brute: {
    name: 'Brute',
    maxHp: 14,
    maxAp: 2,
    maxWave: 0,
    moveRange: 2,
    attackRange: 1,
    attackDamage: 4,
    observeRange: 1,
    maxGhosts: 0,
    entangleReady: false,
  },
  mimic: {
    name: 'Mimic',
    maxHp: 8,
    maxAp: 2,
    maxWave: 2,
    moveRange: 3,
    attackRange: 2,
    attackDamage: 2,
    observeRange: 3,
    maxGhosts: 2,
    entangleReady: false,
  },
};

export const SAVE_KEY = 'svq-waveform-v1';
