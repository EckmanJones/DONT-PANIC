import {
  ZERO_LEVELS,
  modsFromLevels,
  upgradeCost,
  type FactoryMods,
  type UpgradeDef,
  type UpgradeId,
  type UpgradeLevels,
} from "./upgrades";

const STORAGE_KEY = "dont-panic-factory-v1";

export type FactoryProgress = {
  cycle: number;
  levels: UpgradeLevels;
  /** Persisted cash between sessions */
  credits: number;
  lifetimePlanets: number;
  lifetimeCreditsEarned: number;
};

export const INITIAL_PROGRESS: FactoryProgress = {
  cycle: 1,
  levels: { ...ZERO_LEVELS },
  credits: 40,
  lifetimePlanets: 0,
  lifetimeCreditsEarned: 0,
};

export function loadProgress(): FactoryProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_PROGRESS, levels: { ...ZERO_LEVELS } };
    const parsed = JSON.parse(raw) as Partial<FactoryProgress>;
    return {
      cycle: Math.max(1, Math.round(parsed.cycle ?? 1)),
      levels: { ...ZERO_LEVELS, ...(parsed.levels ?? {}) },
      credits: Math.max(0, Math.round((parsed.credits ?? 40) * 10) / 10),
      lifetimePlanets: Math.max(0, Math.round(parsed.lifetimePlanets ?? 0)),
      lifetimeCreditsEarned: Math.max(
        0,
        Math.round(parsed.lifetimeCreditsEarned ?? 0),
      ),
    };
  } catch {
    return { ...INITIAL_PROGRESS, levels: { ...ZERO_LEVELS } };
  }
}

export function saveProgress(progress: FactoryProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* offline / private mode — ignore */
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function progressMods(progress: FactoryProgress): FactoryMods {
  return modsFromLevels(progress.levels);
}

export function buyUpgrade(
  progress: FactoryProgress,
  def: UpgradeDef,
  credits: number,
): { progress: FactoryProgress; creditsSpent: number } | null {
  const lvl = progress.levels[def.id];
  const cost = upgradeCost(def, lvl);
  if (lvl >= def.maxLevel || credits < cost) return null;
  return {
    creditsSpent: cost,
    progress: {
      ...progress,
      levels: {
        ...progress.levels,
        [def.id]: (lvl + 1) as UpgradeLevels[UpgradeId],
      },
    },
  };
}

export function advanceCycle(progress: FactoryProgress): FactoryProgress {
  return { ...progress, cycle: progress.cycle + 1 };
}
