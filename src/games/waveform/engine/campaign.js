import { CAMPAIGN_NODES, STARTER_ROSTER, ALL_UPGRADES, MISSIONS } from '../content/missions.js';
import { SAVE_KEY } from './types.js';
import { buildMission } from './missionFactory.js';

/**
 * @typedef {Object} CampaignSave
 * @property {number} version
 * @property {Record<string, 'locked' | 'unlocked' | 'won'>} nodes
 * @property {string[]} roster
 * @property {string[]} upgrades
 * @property {number} sideOpsWon
 * @property {number} missionsWon
 * @property {number} collapsesForced
 * @property {boolean} campaignComplete
 * @property {boolean} alternateEnding
 */

/** @returns {CampaignSave} */
export function newCampaign() {
  /** @type {Record<string, 'locked' | 'unlocked' | 'won'>} */
  const nodes = {};
  for (const n of CAMPAIGN_NODES) {
    nodes[n.id] = n.requires.length === 0 ? 'unlocked' : 'locked';
  }
  return {
    version: 1,
    nodes,
    roster: [...STARTER_ROSTER],
    upgrades: [],
    sideOpsWon: 0,
    missionsWon: 0,
    collapsesForced: 0,
    campaignComplete: false,
    alternateEnding: false,
  };
}

/** @returns {CampaignSave | null} */
export function loadCampaign() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

/** @param {CampaignSave} save */
export function saveCampaign(save) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function clearCampaign() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * @param {CampaignSave} save
 * @param {string} missionId
 * @param {{collapsesForced?: number}} [stats]
 */
export function completeMission(save, missionId, stats = {}) {
  const node = CAMPAIGN_NODES.find((n) => n.id === missionId);
  if (!node) return save;
  const next = structuredClone(save);
  if (next.nodes[missionId] !== 'won') {
    next.missionsWon += 1;
    if (node.side) next.sideOpsWon += 1;
  }
  next.nodes[missionId] = 'won';
  next.collapsesForced += stats.collapsesForced || 0;

  if (node.unlockUnit && !next.roster.includes(node.unlockUnit)) {
    next.roster.push(node.unlockUnit);
  }

  for (const uid of node.unlocks) {
    if (next.nodes[uid] === 'locked') next.nodes[uid] = 'unlocked';
  }

  // Also unlock nodes whose requires are all won
  for (const n of CAMPAIGN_NODES) {
    if (next.nodes[n.id] !== 'locked') continue;
    if (n.requires.every((r) => next.nodes[r] === 'won')) {
      next.nodes[n.id] = 'unlocked';
    }
  }

  if (next.nodes.m10 === 'won') {
    next.campaignComplete = true;
    next.alternateEnding = next.sideOpsWon >= 2;
  }

  saveCampaign(next);
  return next;
}

/** @param {CampaignSave} save @param {string} upgradeId */
export function applyUpgrade(save, upgradeId) {
  if (!ALL_UPGRADES.some((u) => u.id === upgradeId)) return save;
  if (save.upgrades.includes(upgradeId)) return save;
  const next = structuredClone(save);
  next.upgrades.push(upgradeId);
  saveCampaign(next);
  return next;
}

/**
 * Build mission state and apply campaign upgrades to player units.
 * @param {string} missionId
 * @param {CampaignSave} save
 */
export function startMission(missionId, save) {
  const def = MISSIONS[missionId];
  if (!def) throw new Error(`Unknown mission ${missionId}`);
  const state = buildMission(def);

  // Filter player units to roster where possible (missions define fixed units — apply upgrades)
  for (const u of state.units) {
    if (u.team !== 'player') continue;
    for (const up of save.upgrades) {
      if (up === 'wave+1') {
        u.maxWave += 1;
        u.wave += 1;
      }
      if (up === 'ghost+1') u.maxGhosts += 1;
      if (up === 'observe+1') u.observeRange += 1;
      if (up === 'move+1') u.moveRange += 1;
      if (up === 'hp+2') {
        u.maxHp += 2;
        u.hp += 2;
      }
      if (up === 'damage+1') u.attackDamage += 1;
    }
  }

  return state;
}

export function getCampaignNodes() {
  return CAMPAIGN_NODES;
}

export function getUpgrades() {
  return ALL_UPGRADES;
}

export function getMissionDef(id) {
  return MISSIONS[id] || null;
}
