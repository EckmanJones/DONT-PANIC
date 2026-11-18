/**
 * Bank of Sub-Etha custom planet orders.
 * Player must Accept or Reject each offer using Ch.11 relevant costing + capacity.
 */

import type { EconomyDelta } from "./economy";

export type OrderCostLine = {
  id: string;
  label: string;
  amount: number;
  kind: "variable" | "fixed";
  relevant: boolean;
  note: string;
};

export type CustomPlanetOrder = {
  id: string;
  client: string;
  title: string;
  blurb: string;
  price: number;
  capacityNeeded: number;
  costLines: OrderCostLine[];
  /** price − relevant VC − relevant avoidable FC */
  contribution: number;
  guideHint: string;
};

export type OrderDecision = "accept" | "reject";

export type OrderVerdict = {
  order: CustomPlanetOrder;
  decision: OrderDecision;
  correct: boolean;
  feedback: string;
  economy: EconomyDelta;
  capacityUsed: number;
};

/** Full bank — draw a random subset each play. */
export const CUSTOM_PLANET_ORDERS: CustomPlanetOrder[] = [
  {
    id: "towels-world",
    client: "Magrathean Memorial Trust",
    title: "Bespoke towel-reef archipelago world",
    blurb:
      "Rush custom planet. Needs your finishing bay this cycle. Lease already on the books either way.",
    price: 18,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-atmo",
        label: "Variable · atmosphere & reef kit",
        amount: 7,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-labor",
        label: "Variable · rush finishing labor",
        amount: 4,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-lease",
        label: "Fixed · factory lease allocation",
        amount: 5,
        kind: "fixed",
        relevant: false,
        note: "Unavoidable — ignore",
      },
    ],
    contribution: 7,
    guideHint:
      "CM 7 > 0 and fits 1 bay → accept. Ignore the lease allocation.",
  },
  {
    id: "vogon-spa",
    client: "Sub-Etha Spa Consortium",
    title: "Quiet spa planet (soundproof crust)",
    blurb:
      "Custom quiet-world. High list price, but finishing VC is heavy. Fixed “setup fee” is really unavoidable OH.",
    price: 14,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-dampen",
        label: "Variable · crust dampening foam",
        amount: 9,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-crew",
        label: "Variable · finishing crew",
        amount: 3,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-oh",
        label: "Fixed · shared yard overhead tagged to job",
        amount: 4,
        kind: "fixed",
        relevant: false,
        note: "Common OH — ignore for accept/reject",
      },
    ],
    contribution: 2,
    guideHint: "CM 2 > 0 and capacity fits → accept. Tagged OH is irrelevant.",
  },
  {
    id: "tiny-moon",
    client: "Backup Earth Committee",
    title: "Budget starter moonlet",
    blurb:
      "Low-bid custom. Looks busy for the dock, but contribution is thin — and it still eats a full bay.",
    price: 9,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-kit",
        label: "Variable · mini-atmo kit",
        amount: 5,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-paint",
        label: "Variable · surface paint",
        amount: 3,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-ad",
        label: "Fixed · one-off Sub-Etha ad buy (avoidable)",
        amount: 2,
        kind: "fixed",
        relevant: true,
        note: "Avoidable if you reject",
      },
    ],
    contribution: -1,
    guideHint: "Relevant costs exceed price (CM −1). Reject offer.",
  },
  {
    id: "double-bay",
    client: "Deep Thought Estate",
    title: "Twin-axis contemplation planet",
    blurb:
      "Gorgeous CM — but it needs two finishing bays and you only have one free this cycle.",
    price: 30,
    capacityNeeded: 2,
    costLines: [
      {
        id: "vc-axis",
        label: "Variable · dual-axis core sync",
        amount: 8,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-lib",
        label: "Variable · library biomes",
        amount: 6,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-lease",
        label: "Fixed · lease (continues either way)",
        amount: 5,
        kind: "fixed",
        relevant: false,
        note: "Unavoidable — ignore",
      },
    ],
    contribution: 16,
    guideHint:
      "Capacity shortfall (needs 2, have 1). Reject — high CM is irrelevant if you cannot finish.",
  },
  {
    id: "fjord-resort",
    client: "Slartibartfast Coastal Guild",
    title: "Premium fjord resort planet",
    blurb:
      "Coastline specialty. Solid price, modest VC, and a fixed “design royalty” that is avoidable if you walk away.",
    price: 16,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-coast",
        label: "Variable · coastline machining",
        amount: 5,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-weather",
        label: "Variable · weather scripting",
        amount: 3,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-royalty",
        label: "Fixed · avoidable design royalty",
        amount: 2,
        kind: "fixed",
        relevant: true,
        note: "Avoidable if you reject",
      },
    ],
    contribution: 6, // 16 − 5 − 3 − 2
    guideHint: "CM 6 after avoidable royalty → accept if a bay is free.",
  },
  {
    id: "panic-button",
    client: "Dont Panic Merchandising",
    title: "Emergency escape-pod moon",
    blurb:
      "Flashy list price. Most of the “fixed” setup fee is unavoidable plant OH already in the lease.",
    price: 11,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-pod",
        label: "Variable · escape-pod hardware",
        amount: 6,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-paint",
        label: "Variable · hazard striping",
        amount: 2,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-oh",
        label: "Fixed · plant OH allocated to job",
        amount: 5,
        kind: "fixed",
        relevant: false,
        note: "Unavoidable — ignore",
      },
    ],
    contribution: 3, // 11 − 6 − 2
    guideHint: "Ignore allocated OH. CM 3 > 0 → accept if capacity free.",
  },
  {
    id: "tea-world",
    client: "Nutri-Matic Board",
    title: "Almost-but-not-quite tea plantation world",
    blurb:
      "Charming pitch, ugly economics. Variable costs alone wipe the quote.",
    price: 10,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-soil",
        label: "Variable · soil chemistry",
        amount: 8,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-steam",
        label: "Variable · steam vents",
        amount: 4,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-brand",
        label: "Fixed · brand license (avoidable)",
        amount: 1,
        kind: "fixed",
        relevant: true,
        note: "Avoidable if you reject",
      },
    ],
    contribution: -3, // 10 − 8 − 4 − 1
    guideHint: "Negative CM. Reject offer.",
  },
  {
    id: "guide-hq",
    client: "Field Research Desk",
    title: "Mobile guidebook field office planetoid",
    blurb:
      "Tight schedule, one bay, clean contribution. Fixed “coordination surcharge” is unavoidable HQ cost.",
    price: 13,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-antenna",
        label: "Variable · Sub-Etha antenna farm",
        amount: 4,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-crew",
        label: "Variable · install crew",
        amount: 3,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-hq",
        label: "Fixed · HQ coordination surcharge",
        amount: 3,
        kind: "fixed",
        relevant: false,
        note: "Unavoidable — ignore",
      },
    ],
    contribution: 6, // 13 − 4 − 3
    guideHint: "CM 6; ignore HQ surcharge. Accept if capacity remains.",
  },
  {
    id: "triple-ring",
    client: "Ringworld Speculators Ltd.",
    title: "Three-ring ceremonial planet",
    blurb:
      "Spectacle job. Needs more finishing capacity than you have left this cycle.",
    price: 40,
    capacityNeeded: 3,
    costLines: [
      {
        id: "vc-rings",
        label: "Variable · orbital ring extrusion",
        amount: 12,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-glitter",
        label: "Variable · ceremonial glitter seas",
        amount: 8,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-lease",
        label: "Fixed · lease share",
        amount: 5,
        kind: "fixed",
        relevant: false,
        note: "Unavoidable — ignore",
      },
    ],
    contribution: 20,
    guideHint: "Needs 3 bays. Reject on capacity — CM never overrides a hard constraint.",
  },
  {
    id: "zero-g-farm",
    client: "Infinite Improbability Farms",
    title: "Zero-g kale orchard habitat",
    blurb:
      "Odd request, honest numbers. Small positive CM if you ignore unavoidable fixed tags.",
    price: 8,
    capacityNeeded: 1,
    costLines: [
      {
        id: "vc-trellis",
        label: "Variable · zero-g trellis kit",
        amount: 4,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "vc-seed",
        label: "Variable · improbability seed stock",
        amount: 2,
        kind: "variable",
        relevant: true,
        note: "Only if you accept",
      },
      {
        id: "fc-yard",
        label: "Fixed · yard depreciation tag",
        amount: 4,
        kind: "fixed",
        relevant: false,
        note: "Sunk/unavoidable — ignore",
      },
    ],
    contribution: 2, // 8 − 4 − 2
    guideHint: "CM 2 > 0 after ignoring depreciation tag → accept if a bay is free.",
  },
];

/** Base how many offers to draw; upgrade desk adds more. */
export const ORDERS_PER_ROUND_MIN = 2;
export const ORDERS_PER_ROUND_MAX = 3;

export function drawOrderQueue(
  capacityAvailable: number,
  offersBonus = 0,
  rng: () => number = Math.random,
): CustomPlanetOrder[] {
  const span = ORDERS_PER_ROUND_MAX - ORDERS_PER_ROUND_MIN + 1;
  const n = Math.min(
    CUSTOM_PLANET_ORDERS.length,
    ORDERS_PER_ROUND_MIN +
      Math.floor(rng() * span) +
      Math.max(0, offersBonus),
  );
  const pool = [...CUSTOM_PLANET_ORDERS];
  // Fisher–Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  const drawn = pool.slice(0, n);
  // Prefer a mix: if every drawn order is capacity-blocked, swap one fit-capable in.
  const anyFits = drawn.some((o) => o.capacityNeeded <= capacityAvailable);
  if (!anyFits) {
    const fit = pool.find(
      (o) =>
        o.capacityNeeded <= capacityAvailable &&
        !drawn.some((d) => d.id === o.id),
    );
    if (fit && drawn.length > 0) drawn[drawn.length - 1] = fit;
  }
  return drawn;
}

/** Accept only if it fits capacity and relevant contribution is positive. */
export function shouldAcceptOrder(
  order: CustomPlanetOrder,
  capacityAvailable: number,
): boolean {
  return (
    order.capacityNeeded <= capacityAvailable && order.contribution > 0
  );
}

export function resolveOrderDecision(
  order: CustomPlanetOrder,
  decision: OrderDecision,
  capacityAvailable: number,
): OrderVerdict {
  const should = shouldAcceptOrder(order, capacityAvailable);
  const fits = order.capacityNeeded <= capacityAvailable;

  if (decision === "accept") {
    if (!fits) {
      return {
        order,
        decision,
        correct: false,
        feedback: `Capacity shortfall: needs ${order.capacityNeeded}, have ${capacityAvailable}. Reject offers you cannot finish.`,
        capacityUsed: 0,
        economy: {
          credits: -2,
          dockLoad: 4,
          renown: -5,
          ticker: `Accepted ${order.title} without capacity. Chaos −2B.`,
        },
      };
    }
    if (order.contribution <= 0) {
      return {
        order,
        decision,
        correct: false,
        feedback: `Relevant CM is ${order.contribution}B. Reject negative (or zero) contribution offers.`,
        capacityUsed: order.capacityNeeded,
        economy: {
          credits: order.contribution,
          dockLoad: 6,
          renown: -4,
          planetsShipped: 1,
          ticker: `Accepted thin custom ${order.title}. CM ${order.contribution}B. Bay used poorly.`,
        },
      };
    }
    return {
      order,
      decision,
      correct: true,
      feedback: `Accept: relevant CM ${order.contribution}B > 0 and capacity fits. Ignore unavoidable fixed tags.`,
      capacityUsed: order.capacityNeeded,
      economy: {
        credits: order.contribution,
        dockLoad: 10,
        renown: 4,
        planetsShipped: 1,
        ticker: `Accepted ${order.title}. CM +${order.contribution}B. Cap −${order.capacityNeeded}.`,
      },
    };
  }

  // reject
  if (should) {
    return {
      order,
      decision,
      correct: false,
      feedback: `Should have accepted: CM ${order.contribution}B and ${order.capacityNeeded} bay available. ${order.guideHint}`,
      capacityUsed: 0,
      economy: {
        credits: 0,
        dockLoad: -2,
        renown: -3,
        ticker: `Rejected good offer ${order.title}. Missed CM ${order.contribution}B.`,
      },
    };
  }
  return {
    order,
    decision,
    correct: true,
    feedback: fits
      ? `Reject: relevant CM ${order.contribution}B is not positive.`
      : `Reject: capacity shortfall (${order.capacityNeeded} > ${capacityAvailable}).`,
    capacityUsed: 0,
    economy: {
      credits: 0,
      dockLoad: -1,
      renown: 2,
      ticker: `Rejected ${order.title}. Correct call — capacity/CM filter held.`,
    },
  };
}

export function orderVariableTotal(order: CustomPlanetOrder): number {
  return order.costLines
    .filter((l) => l.kind === "variable")
    .reduce((s, l) => s + l.amount, 0);
}

export function orderFixedTotal(order: CustomPlanetOrder): number {
  return order.costLines
    .filter((l) => l.kind === "fixed")
    .reduce((s, l) => s + l.amount, 0);
}

export function mergeOrderEconomies(verdicts: OrderVerdict[]): EconomyDelta {
  return verdicts.reduce<EconomyDelta>(
    (acc, v) => ({
      credits: (acc.credits ?? 0) + (v.economy.credits ?? 0),
      dockLoad: (acc.dockLoad ?? 0) + (v.economy.dockLoad ?? 0),
      renown: (acc.renown ?? 0) + (v.economy.renown ?? 0),
      planetsShipped:
        (acc.planetsShipped ?? 0) + (v.economy.planetsShipped ?? 0),
      capacityLeft: (acc.capacityLeft ?? 0) - v.capacityUsed,
      ticker: [acc.ticker, v.economy.ticker].filter(Boolean).join(" · "),
    }),
    { ticker: "" },
  );
}
