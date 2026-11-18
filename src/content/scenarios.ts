import type { EconomyDelta } from "./economy";

export const PACK_VERSION = "0.1.0-mice" as const;

/** Blocher Ch.11 learning-objective map (design lock). */
export type Ch11Lo = "LO2" | "LO3" | "LO4" | "LO5";

export type Choice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
  /** How the yard economy moves if the room locks this choice */
  economy: EconomyDelta;
};

export type Scenario = {
  id: string;
  lo: Ch11Lo;
  /** Ch.11 core concept this bit drills */
  concept: string;
  beat: "special-order" | "make-buy" | "process-further" | "keep-drop";
  /** Short Guide sidebar — must end on the Ch.11 rule */
  guideTitle: string;
  guideEntry: string;
  headline: string;
  story: string;
  question: string;
  choices: Choice[];
  punchline: string;
  /** Quantitative relevant-cost key */
  conceptNote: string;
  /** Blocher strategic lens (short) */
  strategicNote: string;
};

/**
 * Ch.11 syllabus first. Mice / planet fiction is wrapper only.
 * Original prose — no quoted book/radio text.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "mice-special-order",
    lo: "LO2",
    concept: "Special order · idle capacity · relevant cost",
    beat: "special-order",
    guideTitle: "Special orders (idle bay)",
    guideEntry:
      "When Dock 7 is empty, only costs that change with the order matter. List price and unavoidable lease do not.",
    headline:
      "Rush order: bargain “mostly spherical” world while Dock 7 is idle",
    story:
      "Custom Worldworks (you: the mice) has idle Dock 7. A client offers 12B for one planet (list 20B). Variable build = 9B. Dry-dock lease = 4B either way. Marketing wants “list dignity.” Ops wants the bay warm.",
    question: "Accept or reject? (Ch.11 special order)",
    choices: [
      {
        id: "a",
        label: "Reject — never sell below list; dignity is strategy",
        correct: false,
        feedback:
          "List price is not a relevant cost. With idle capacity, dignity doesn’t change cash.",
        economy: {
          credits: -2,
          dockLoad: -5,
          renown: 4,
          ticker:
            "Reject on list dignity. Lease still due (−2B). Dock stays idle. Renown +4, cash worse.",
        },
      },
      {
        id: "b",
        label: "Reject — “full cost” is 13 once you smear the lease onto the job",
        correct: false,
        feedback:
          "Trap: allocating unavoidable fixed lease onto a one-off. The lease does not change with Accept/Reject.",
        economy: {
          credits: -3,
          dockLoad: -8,
          renown: -2,
          ticker:
            "Full-cost smear kills the order. Idle bay + unavoidable lease → −3B. Classic allocation trap.",
        },
      },
      {
        id: "c",
        label: "Accept — 12 beats the 9 that changes; the lease was doomed anyway",
        correct: true,
        feedback:
          "Relevant-cost key: incremental revenue 12 − incremental cost 9 = +3. Unavoidable lease is irrelevant here.",
        economy: {
          credits: 3,
          dockLoad: 18,
          renown: 2,
          planetsShipped: 1,
          ticker:
            "Accept at idle capacity. Contribution +3B; one world ships. Lease unchanged either way.",
        },
      },
    ],
    punchline: "Idle capacity: price > variable cost → accept. Fixed that won’t leave stays out of the vote.",
    conceptNote:
      "Ch.11 LO2: with idle capacity and no opportunity cost, accept if price > variable (incremental) cost. Ignore unavoidable fixed.",
    strategicNote:
      "Strategy check: will a cheap rush job damage long-run pricing power or quality reputation? Numbers say accept; strategy still gets one sentence in class.",
  },
  {
    id: "mice-make-buy",
    lo: "LO3",
    concept: "Make or buy · avoidable cost vs allocation",
    beat: "make-buy",
    guideTitle: "Make or buy",
    guideEntry:
      "Outsourcing: compare the supplier quote only to costs that disappear if you stop making. Allocated habitat OH usually survives.",
    headline: "Continent plates: stamp in-house or buy from the Ring Foundry?",
    story:
      "In-house plate: DM 2.0 + DL 1.5 + variable OH 0.8 + allocated habitat OH 1.2 (book 5.5). Foundry quote 4.6 delivered. If you buy, habitat OH continues; presses have no better use this quarter.",
    question: "Make or buy? (Ch.11 outsourcing)",
    choices: [
      {
        id: "a",
        label: "Buy — 4.6 beats the sacred book cost of 5.5",
        correct: false,
        feedback:
          "Wrong test. Full absorption (5.5) is not the Ch.11 benchmark — avoidable make cost is.",
        economy: {
          credits: -1.5,
          dockLoad: -6,
          renown: -3,
          ticker:
            "Buy on full-cost comparison. Avoidable make was 4.3 < 4.6 — overpay vs keep making (−1.5B).",
        },
      },
      {
        id: "b",
        label: "Make forever — never outsource below 5.5 absorption",
        correct: false,
        feedback:
          "Right-ish action, wrong rule. Avoidable make 4.3 already beats 4.6 — but “never below absorption” is not Ch.11.",
        economy: {
          credits: 0.5,
          dockLoad: 8,
          renown: -4,
          ticker:
            "Make (good vs quote) but for absorption religion. Cash slightly better than buy; concept mark misses.",
        },
      },
      {
        id: "c",
        label:
          "Make — avoidable cost 4.3 vs quote 4.6; allocated 1.2 stays either way",
        correct: true,
        feedback:
          "Key: avoidable make = 2+1.5+0.8 = 4.3 < quote 4.6 → Make. Allocated 1.2 is irrelevant.",
        economy: {
          credits: 2,
          dockLoad: 10,
          renown: 3,
          ticker:
            "Make on avoidable cost. Save vs Foundry → +2B campaign. Habitat OH unchanged (correctly ignored).",
        },
      },
    ],
    punchline: "Relevant make cost = what goes away if you buy. Allocations that stay are spectators.",
    conceptNote:
      "Ch.11 LO3: make vs buy using avoidable costs only. Common allocated OH usually continues.",
    strategicNote:
      "Strategy check: quality, reliability, and dependency on the Foundry — even when the incremental math favors make.",
  },
  // LO4 (sell / process further) lives in asteroidYard.ts — forge WIP core, not owned rock.
  {
    id: "mice-keep-drop",
    lo: "LO5",
    concept: "Keep or drop · segment margin vs allocated common",
    beat: "keep-drop",
    guideTitle: "Keep or drop a segment",
    guideEntry:
      "A line that looks red after allocated station OH may still throw positive contribution. Drop only if avoidable costs exceed what you lose.",
    headline: "Board wants cuts; Cube-World looks “red” after HQ allocation",
    story:
      "Cube-World: sales 80, variable 50, product-only ads 12 (avoidable). Shared station OH 10 allocated for “fairness.” Drop the line and station OH continues.",
    question: "Keep or drop Cube-World? (Ch.11)",
    choices: [
      {
        id: "a",
        label: "Drop — equal pain for every line; fairness is strategy",
        correct: false,
        feedback:
          "Fairness theater. You burn segment contribution (18 after avoidable ads) without removing common OH.",
        economy: {
          credits: -18,
          dockLoad: -12,
          renown: -8,
          ticker:
            "Drop for “fairness.” Lost contribution −18B; shared OH remains. Allocation politics ≠ relevant cost.",
        },
      },
      {
        id: "b",
        label:
          "Drop — books show a loss once station OH is charged to Cube-World",
        correct: false,
        feedback:
          "Allocated OH trap. The 10 stays; the 18 after avoidable ads leaves with the line.",
        economy: {
          credits: -18,
          dockLoad: -10,
          renown: -5,
          ticker:
            "Drop because the slide is red after allocation. −18B contribution gone; OH migrates to other lines.",
        },
      },
      {
        id: "c",
        label:
          "Keep — still throws 18 after avoidable ads; common OH won’t leave",
        correct: true,
        feedback:
          "Keep: 80 − 50 − 12 = 18 contribution after avoidable costs. Common OH continues either way.",
        economy: {
          credits: 18,
          dockLoad: 4,
          renown: 6,
          ticker:
            "Keep Cube-World. +18B after avoidable ads. Shared station OH correctly treated as irrelevant to the drop.",
        },
      },
    ],
    punchline: "If the cost survives the funeral, it wasn’t the segment’s problem.",
    conceptNote:
      "Ch.11 LO5: keep/drop on avoidable costs and lost contribution. Allocated common costs are usually irrelevant.",
    strategicNote:
      "Strategy check: customer spillover, product-line completeness, and morale — after the contribution test passes.",
  },
];

export type AnswerRecord = {
  scenarioId: string;
  choiceId: string;
  correct: boolean;
  economyTicker: string;
};

export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
