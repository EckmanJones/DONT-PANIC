import type { EconomyDelta } from "./economy";
import type { FactoryMods } from "./upgrades";

/**
 * Opening Ch.11 LO4 beat for a planet factory:
 * Forge output is a raw planetary core (asteroid-grade). Sell at going rate
 * or process further into a finished planet — VC/FC listed; finishing capacity binds.
 * A bank of custom offers is decided first (accept/reject); remaining capacity binds LO4.
 * Incremental upgrades scale capacity, finishing VC, and WIP cores via buildYard().
 */

export type CostLine = {
  id: string;
  label: string;
  amount: number;
  kind: "market" | "variable" | "fixed" | "sunk";
  relevant: boolean;
  note: string;
};

export type AsteroidChoice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
  economy: EconomyDelta;
  capacityUsed: number;
  coresConsumed: number;
  worldsFinished: number;
};

export type AsteroidYard = {
  lo: "LO4";
  concept: string;
  guideTitle: string;
  guideEntry: string;
  headline: string;
  story: string;
  question: string;
  coresInWip: number;
  capacityAvailable: number;
  capacityPerFinish: number;
  goingRateLabel: string;
  goingRate: number;
  finishedPrice: number;
  /** Incremental advantage of finishing WIP vs sell-now (before capacity OC) */
  finishAdvantage: number;
  costSchedule: CostLine[];
  conceptNote: string;
  strategicNote: string;
  punchline: string;
  choices: AsteroidChoice[];
};

const GOING_RATE = 8;
const FINISHED_PRICE = 12;
const FORGE_SUNK = 6;
const LEASE = 5;

function baseChoices(finishVc: number, capacityMax: number): AsteroidChoice[] {
  const incrRev = FINISHED_PRICE - GOING_RATE;
  const advantage = incrRev - finishVc;
  const finishNet = FINISHED_PRICE - finishVc;
  const shouldFinish = advantage > 0;
  return [
    {
      id: "a",
      label: `Sell the raw core now at ${GOING_RATE} — stop spending after the forge trauma`,
      correct: !shouldFinish,
      feedback: shouldFinish
        ? `Forge cost is sunk. Incremental test: +${incrRev} revenue vs +${finishVc} finishing VC → process further is better by +${advantage} (bay free).`
        : `With finishing VC ${finishVc}, incremental math no longer favors process further. Selling at ${GOING_RATE} is fine.`,
      capacityUsed: 0,
      coresConsumed: 1,
      worldsFinished: 0,
      economy: {
        credits: GOING_RATE,
        dockLoad: -4,
        renown: shouldFinish ? -3 : 1,
        planetsShipped: 0,
        ticker: `Sold forge output raw at ${GOING_RATE}B.`,
      },
    },
    {
      id: "b",
      label:
        "Process further — but only if the core covers its share of the 5B lease",
      correct: false,
      feedback:
        "Fixed lease allocation is not LO4. Compare separable VC to incremental revenue; capacity is available.",
      capacityUsed: 0,
      coresConsumed: 0,
      worldsFinished: 0,
      economy: {
        credits: -1,
        dockLoad: 2,
        renown: -5,
        ticker:
          "Finish delayed for lease “coverage.” Holding −1B. Capacity sits unused.",
      },
    },
    {
      id: "c",
      label: `Process further into a planet — +${incrRev} vs sell-now vs +${finishVc} VC; use 1 bay`,
      correct: shouldFinish,
      feedback: shouldFinish
        ? `LO4 key: incremental revenue ${incrRev} > separable VC ${finishVc} → finish. Capacity ${capacityMax} free. Forge sunk and fixed lease irrelevant.`
        : `VC ${finishVc} is too high vs +${incrRev} incremental revenue. Do not process further.`,
      capacityUsed: 1,
      coresConsumed: 1,
      worldsFinished: 1,
      economy: {
        credits: finishNet,
        dockLoad: 12,
        renown: shouldFinish ? 4 : -2,
        planetsShipped: 1,
        ticker: `Finished forge planet. Net ${finishNet}B (${FINISHED_PRICE}−${finishVc}).`,
      },
    },
  ];
}

/** Default yard (no upgrades). */
export const ASTEROID_YARD: AsteroidYard = buildYard({
  capacityMax: 1,
  finishVc: 3,
  coresPerCycle: 1,
  offersBonus: 0,
  creditMult: 1,
  crisesUnlocked: false,
});

/** Scale LO4 yard to current factory upgrades. */
export function buildYard(mods: FactoryMods): AsteroidYard {
  const finishVc = mods.finishVc;
  const incrRev = FINISHED_PRICE - GOING_RATE;
  const advantage = incrRev - finishVc;
  const finishNet = FINISHED_PRICE - finishVc;
  return {
    lo: "LO4",
    concept: "Sell or process further · factory capacity · relevant cost",
    guideTitle: "Sell or process further",
    guideEntry:
      "Your job is making planets. At split-off the forge has produced a raw core. Going rate = sell that intermediate now. Process further only if extra revenue beats separable finishing VC — and only if a finishing bay is free. Forge cost already spent and fixed lease that continues either way are irrelevant. Custom offers from the bank make capacity’s opportunity cost real.",
    headline: "Forge spit out a raw planetary core",
    story: `Custom Worldworks cycle feed: ${mods.coresPerCycle} asteroid-grade core${mods.coresPerCycle === 1 ? "" : "s"} in WIP (forge spend sunk). ${mods.capacityMax} finishing bay${mods.capacityMax === 1 ? "" : "s"} online. Decide custom offers first, then sell or process the forge core with capacity left.`,
    question:
      "Sell the raw core at the going rate, or process it further into a planet?",
    coresInWip: mods.coresPerCycle,
    capacityAvailable: mods.capacityMax,
    capacityPerFinish: 1,
    goingRateLabel: "Going rate · raw core (sell now)",
    goingRate: GOING_RATE,
    finishedPrice: FINISHED_PRICE,
    finishAdvantage: advantage,
    costSchedule: [
      {
        id: "sunk-forge",
        label: "Forge / joint cost already incurred (sunk)",
        amount: FORGE_SUNK,
        kind: "sunk",
        relevant: false,
        note: "Spent making the core — ignore for sell vs process",
      },
      {
        id: "market",
        label: "Going rate if sold as raw core now",
        amount: GOING_RATE,
        kind: "market",
        relevant: true,
        note: "Sell-now alternative for forge output",
      },
      {
        id: "vc-finish",
        label: "Variable finishing (atmosphere / oceans)",
        amount: finishVc,
        kind: "variable",
        relevant: true,
        note: "Separable — only if you process further",
      },
      {
        id: "finished",
        label: "Price if sold as finished planet",
        amount: FINISHED_PRICE,
        kind: "market",
        relevant: true,
        note: "Incremental revenue path",
      },
      {
        id: "fc-lease",
        label: "Fixed factory lease this cycle",
        amount: LEASE,
        kind: "fixed",
        relevant: false,
        note: "Unavoidable either way — ignore",
      },
    ],
    conceptNote: `Ch.11 LO4: process further if incremental revenue (${FINISHED_PRICE}−${GOING_RATE}=${incrRev}) > separable VC (${finishVc}). Sunk forge and unavoidable lease stay out. Capacity: ${mods.capacityMax} bay(s).`,
    strategicNote:
      "Upgrades change the numbers; they do not change the rule — only incremental revenue and separable VC (plus capacity) matter.",
    punchline: `Sell raw = ${GOING_RATE}. Finish = ${FINISHED_PRICE} − ${finishVc} VC = ${finishNet} (${advantage >= 0 ? "+" : ""}${advantage} vs sell).`,
    choices: baseChoices(finishVc, mods.capacityMax),
  };
}

export type YardDecisionBundle = {
  choices: AsteroidChoice[];
  question: string;
  conceptNote: string;
  strategicNote: string;
  punchline: string;
};

/**
 * LO4 forge choices after the custom-order bank round.
 * capacityLeft already reflects accepted offers.
 */
export function yardDecisionForOrder(
  yard: AsteroidYard,
  capacityLeft: number,
  ordersResolved: boolean,
): YardDecisionBundle {
  if (!ordersResolved) {
    return {
      choices: yard.choices,
      question: yard.question,
      conceptNote: yard.conceptNote,
      strategicNote: yard.strategicNote,
      punchline: yard.punchline,
    };
  }

  const canFinish = capacityLeft >= yard.capacityPerFinish;

  if (!canFinish) {
    return {
      question:
        "Custom offers used your finishing capacity. Sell the raw forge core at the going rate?",
      conceptNote: `Capacity left: ${capacityLeft}. Cannot process the forge WIP further. Sell-now at ${yard.goingRate} is the relevant path; forge sunk cost stays out.`,
      strategicNote:
        "Strategy: accepted customs already booked the bay — finishing WIP would require capacity you no longer have.",
      punchline: `No bay left. Sell raw = ${yard.goingRate}. Process-further incremental math is moot without capacity.`,
      choices: [
        {
          id: "a",
          label: `Sell the raw core now at ${yard.goingRate} — capacity already booked by customs`,
          correct: true,
          feedback:
            "Correct: without finishing capacity, sell the intermediate at the going rate. Sunk forge cost irrelevant.",
          capacityUsed: 0,
          coresConsumed: 1,
          worldsFinished: 0,
          economy: {
            credits: yard.goingRate,
            dockLoad: -2,
            renown: 2,
            planetsShipped: 0,
            ticker: `Sold forge core raw at ${yard.goingRate}B after custom bay bookings.`,
          },
        },
        {
          id: "b",
          label: "Process further anyway — “we’ll overtime the bay”",
          correct: false,
          feedback: `Capacity left is ${capacityLeft}. Overtime fantasy is not on the schedule. Sell at going rate.`,
          capacityUsed: 0,
          coresConsumed: 0,
          worldsFinished: 0,
          economy: {
            credits: -3,
            dockLoad: 5,
            renown: -6,
            ticker: "Tried to finish WIP with no bay. Overtime chaos −3B.",
          },
        },
        {
          id: "c",
          label: "Hold the core until next cycle to recover the sunk forge cost",
          correct: false,
          feedback:
            "Sunk forge cost never justifies holding. Sell now or (if capacity existed) process further on incremental math only.",
          capacityUsed: 0,
          coresConsumed: 0,
          worldsFinished: 0,
          economy: {
            credits: -1,
            dockLoad: 1,
            renown: -4,
            ticker: "Held WIP for sunk-cost therapy. −1B carrying.",
          },
        },
      ],
    };
  }

  // Capacity remains — classic LO4 on forge WIP (numbers follow upgrades)
  const finishVc = separableVc(yard);
  const incrRev = yard.finishedPrice - yard.goingRate;
  const finishNet = yard.finishedPrice - finishVc;
  const shouldFinish = yard.finishAdvantage > 0;
  return {
    question:
      "Capacity remains. Sell the raw core at the going rate, or process it further into a planet?",
    conceptNote: yard.conceptNote,
    strategicNote:
      "Custom-order round is closed. With a free bay, LO4 is incremental revenue vs separable VC on the forge core.",
    punchline: yard.punchline,
    choices: [
      {
        id: "a",
        label: `Sell the raw core now at ${yard.goingRate} — stop spending after the forge trauma`,
        correct: !shouldFinish,
        feedback: shouldFinish
          ? `Forge cost is sunk. Incremental test: +${incrRev} revenue vs +${finishVc} finishing VC → process further by +${yard.finishAdvantage}.`
          : `Finishing VC ${finishVc} wipes the incremental edge. Selling at going rate is the call.`,
        capacityUsed: 0,
        coresConsumed: 1,
        worldsFinished: 0,
        economy: {
          credits: yard.goingRate,
          dockLoad: -4,
          renown: shouldFinish ? -3 : 1,
          planetsShipped: 0,
          ticker: `Sold forge output raw at ${yard.goingRate}B.`,
        },
      },
      {
        id: "b",
        label:
          "Process further — but only if the core covers its share of the 5B lease",
        correct: false,
        feedback:
          "Fixed lease allocation is not LO4. Compare separable VC to incremental revenue; capacity is available.",
        capacityUsed: 0,
        coresConsumed: 0,
        worldsFinished: 0,
        economy: {
          credits: -1,
          dockLoad: 2,
          renown: -5,
          ticker:
            "Finish delayed for lease “coverage.” Holding −1B. Capacity sits unused.",
        },
      },
      {
        id: "c",
        label: `Process further into a planet — +${incrRev} vs sell vs +${finishVc} VC; use ${yard.capacityPerFinish} bay`,
        correct: shouldFinish,
        feedback: shouldFinish
          ? `LO4 key: incremental revenue ${incrRev} > separable VC ${finishVc} → finish. Capacity ${capacityLeft} left.`
          : `Do not process further — VC ${finishVc} ≥ incremental revenue ${incrRev}.`,
        capacityUsed: yard.capacityPerFinish,
        coresConsumed: 1,
        worldsFinished: 1,
        economy: {
          credits: finishNet,
          dockLoad: 12,
          renown: shouldFinish ? 4 : -2,
          planetsShipped: 1,
          ticker: `Finished forge planet. Net ${finishNet}B. Cap used.`,
        },
      },
    ],
  };
}

export function incrementalProcessAdvantage(yard: AsteroidYard): number {
  return yard.finishedPrice - yard.goingRate - separableVc(yard);
}

function separableVc(yard: AsteroidYard): number {
  return yard.costSchedule
    .filter((c) => c.kind === "variable" && c.relevant)
    .reduce((s, c) => s + c.amount, 0);
}
