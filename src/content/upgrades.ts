/**
 * Incremental Upgrade Bay — spend credits to grow the planet factory.
 * Each upgrade is framed with Ch.11 relevant-cost language (avoidable outlay vs capacity/CM).
 */

export type UpgradeId =
  | "finishingBay"
  | "atmosKit"
  | "forgeFeed"
  | "offerDesk"
  | "guidePub"
  | "crisisBoard";

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  blurb: string;
  /** Base credit cost at level 0→1 */
  baseCost: number;
  maxLevel: number;
  /** What level N grants (N = 1..max) */
  effectLabel: (level: number) => string;
  ch11Note: string;
};

export const UPGRADE_CATALOG: UpgradeDef[] = [
  {
    id: "finishingBay",
    name: "Extra finishing bay",
    blurb: "Add scarce capacity so more customs (and forge finishes) fit in one cycle.",
    baseCost: 25,
    maxLevel: 3,
    effectLabel: (level) => `+${level} finishing bay${level === 1 ? "" : "s"}`,
    ch11Note:
      "Capacity is an opportunity-cost machine. Buying a bay is a relevant outlay only if expected incremental CM covers it.",
  },
  {
    id: "atmosKit",
    name: "Atmosphere kit efficiency",
    blurb: "Cut separable variable finishing cost on forge WIP planets.",
    baseCost: 18,
    maxLevel: 2,
    effectLabel: (level) => `−${level}B forge finishing VC`,
    ch11Note:
      "Only separable VC that changes with the decision is relevant. Lower VC widens the process-further advantage.",
  },
  {
    id: "forgeFeed",
    name: "Forge feed booster",
    blurb: "More raw planetary cores hit WIP each cycle.",
    baseCost: 22,
    maxLevel: 2,
    effectLabel: (level) => `+${level} forge core${level === 1 ? "" : "s"} / cycle`,
    ch11Note:
      "More WIP raises the sell-or-process stakes — still ignore sunk forge spend on each core.",
  },
  {
    id: "offerDesk",
    name: "Sub-Etha offer desk",
    blurb: "Pull more custom planet offers from the bank each cycle.",
    baseCost: 15,
    maxLevel: 2,
    effectLabel: (level) => `+${level} custom offer${level === 1 ? "" : "s"} / cycle`,
    ch11Note:
      "More offers = more accept/reject drills on relevant CM and capacity constraints.",
  },
  {
    id: "guidePub",
    name: "Guide publishing rights",
    blurb: "Credit multiplier on cycle payouts when you keep contribution clean.",
    baseCost: 30,
    maxLevel: 4,
    effectLabel: (level) => `+${level * 8}% cycle credit multiplier`,
    ch11Note:
      "Multiplier rewards good relevant-cost calls — it does not make sunk costs relevant.",
  },
  {
    id: "crisisBoard",
    name: "Board crisis channel",
    blurb: "Unlock LO2 / LO3 / LO5 board crises between cycles.",
    baseCost: 20,
    maxLevel: 1,
    effectLabel: () => "Board crises unlocked",
    ch11Note:
      "Special order, make/buy, and keep/drop join the incremental loop once the channel is live.",
  },
];

export type UpgradeLevels = Record<UpgradeId, number>;

export const ZERO_LEVELS: UpgradeLevels = {
  finishingBay: 0,
  atmosKit: 0,
  forgeFeed: 0,
  offerDesk: 0,
  guidePub: 0,
  crisisBoard: 0,
};

export type FactoryMods = {
  capacityMax: number;
  finishVc: number;
  coresPerCycle: number;
  offersBonus: number;
  creditMult: number;
  crisesUnlocked: boolean;
};

export function modsFromLevels(levels: UpgradeLevels): FactoryMods {
  return {
    capacityMax: 1 + levels.finishingBay,
    finishVc: Math.max(1, 3 - levels.atmosKit),
    coresPerCycle: 1 + levels.forgeFeed,
    offersBonus: levels.offerDesk,
    creditMult: 1 + levels.guidePub * 0.08,
    crisesUnlocked: levels.crisisBoard >= 1,
  };
}

export function upgradeCost(def: UpgradeDef, currentLevel: number): number {
  if (currentLevel >= def.maxLevel) return Infinity;
  return Math.round(def.baseCost * Math.pow(1.55, currentLevel));
}

export function canBuy(
  def: UpgradeDef,
  levels: UpgradeLevels,
  credits: number,
): boolean {
  const lvl = levels[def.id];
  if (lvl >= def.maxLevel) return false;
  return credits >= upgradeCost(def, lvl);
}
