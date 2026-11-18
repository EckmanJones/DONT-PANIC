/**
 * Yard economy + factory capacity — scoreboard for Ch.11 calls.
 */

export type EconomyState = {
  credits: number;
  dockLoad: number;
  renown: number;
  planetsShipped: number;
  /** Raw planetary cores in WIP (forge output, not purchased inventory) */
  asteroids: number;
  /** Finishing capacity remaining this cycle */
  capacityLeft: number;
  /** Finishing capacity at cycle start */
  capacityMax: number;
};

export type EconomyDelta = {
  credits?: number;
  dockLoad?: number;
  renown?: number;
  planetsShipped?: number;
  asteroids?: number;
  capacityLeft?: number;
  capacityMax?: number;
  ticker: string;
};

export const INITIAL_ECONOMY: EconomyState = {
  credits: 40,
  dockLoad: 20,
  renown: 55,
  planetsShipped: 0,
  asteroids: 1,
  capacityLeft: 1,
  capacityMax: 1,
};

export function clampEconomy(next: EconomyState): EconomyState {
  return {
    credits: Math.round(next.credits * 10) / 10,
    dockLoad: Math.max(0, Math.min(100, Math.round(next.dockLoad))),
    renown: Math.max(0, Math.min(100, Math.round(next.renown))),
    planetsShipped: Math.max(0, Math.round(next.planetsShipped)),
    asteroids: Math.max(0, Math.round(next.asteroids)),
    capacityLeft: Math.max(0, Math.round(next.capacityLeft)),
    capacityMax: Math.max(0, Math.round(next.capacityMax)),
  };
}

export function applyDelta(
  state: EconomyState,
  delta: EconomyDelta,
): EconomyState {
  return clampEconomy({
    credits: state.credits + (delta.credits ?? 0),
    dockLoad: state.dockLoad + (delta.dockLoad ?? 0),
    renown: state.renown + (delta.renown ?? 0),
    planetsShipped: state.planetsShipped + (delta.planetsShipped ?? 0),
    asteroids: state.asteroids + (delta.asteroids ?? 0),
    capacityLeft: state.capacityLeft + (delta.capacityLeft ?? 0),
    capacityMax: state.capacityMax + (delta.capacityMax ?? 0),
  });
}

/** Start / refresh a cycle from factory mods. */
export function seedCycleEconomy(
  prev: EconomyState,
  capacityMax: number,
  cores: number,
): EconomyState {
  return clampEconomy({
    ...prev,
    asteroids: cores,
    capacityMax,
    capacityLeft: capacityMax,
  });
}

export function formatCredits(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(n % 1 === 0 ? 0 : 1)}B`;
}

export function economyHealth(state: EconomyState): "hot" | "ok" | "cold" {
  const score =
    state.credits * 0.35 +
    state.renown * 0.3 +
    (100 - state.dockLoad) * 0.15 +
    state.planetsShipped * 5 +
    state.asteroids * 2;
  if (score >= 70) return "hot";
  if (score >= 45) return "ok";
  return "cold";
}

export function economyVerdict(state: EconomyState): string {
  const h = economyHealth(state);
  if (h === "hot") {
    return "Ch.11 report: sell-or-process and later LO calls kept contribution healthy. Capacity was treated as a scarce resource only when it actually constrained you.";
  }
  if (h === "ok") {
    return "Ch.11 report: mixed. Some traps stung; enough incremental calls to keep the yard flying.";
  }
  return "Ch.11 report: sunk-cost and allocation habits drained the planet factory. Revisit LO4 (sell/process forge output) and LO2–LO5 keys.";
}
