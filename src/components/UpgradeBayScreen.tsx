import {
  UPGRADE_CATALOG,
  canBuy,
  upgradeCost,
  type UpgradeDef,
} from "../content/upgrades";
import type { FactoryProgress } from "../content/factoryProgress";
import { progressMods } from "../content/factoryProgress";
import type { AnswerRecord } from "../content/scenarios";

type UpgradeBayScreenProps = {
  progress: FactoryProgress;
  credits: number;
  cycleAnswers: AnswerRecord[];
  onBuy: (def: UpgradeDef) => void;
  onNextCycle: () => void;
  onStandby: () => void;
  onReset: () => void;
};

export function UpgradeBayScreen({
  progress,
  credits,
  cycleAnswers,
  onBuy,
  onNextCycle,
  onStandby,
  onReset,
}: UpgradeBayScreenProps) {
  const mods = progressMods(progress);
  const hits = cycleAnswers.filter((a) => a.correct).length;

  return (
    <section className="screen upgrade-bay">
      <p className="concept-pill">Incremental · Upgrade Bay</p>
      <h2>Upgrade the planet factory</h2>
      <p className="story">
        Cycle {progress.cycle} closed
        {cycleAnswers.length > 0
          ? ` · ${hits}/${cycleAnswers.length} Ch.11 calls on target`
          : ""}
        . Spend credits on capacity, lower finishing VC, more forge feed, and a
        wider offer desk — each buy is a relevant outlay only if future
        contribution covers it (Ch.11).
      </p>

      <div className="yard-status" aria-label="Factory mods">
        <div className="yard-chip">
          <span className="yard-chip-label">Credits on hand</span>
          <span className="yard-chip-value">{credits}B</span>
        </div>
        <div className="yard-chip">
          <span className="yard-chip-label">Finishing bays</span>
          <span className="yard-chip-value">{mods.capacityMax}</span>
        </div>
        <div className="yard-chip">
          <span className="yard-chip-label">Forge finish VC</span>
          <span className="yard-chip-value">{mods.finishVc}B</span>
        </div>
        <div className="yard-chip">
          <span className="yard-chip-label">Credit mult</span>
          <span className="yard-chip-value">
            ×{mods.creditMult.toFixed(2)}
          </span>
        </div>
        <div className="yard-chip highlight">
          <span className="yard-chip-label">Lifetime shipped</span>
          <span className="yard-chip-value">{progress.lifetimePlanets}</span>
        </div>
      </div>

      <div className="upgrade-grid" role="list">
        {UPGRADE_CATALOG.map((def) => {
          const lvl = progress.levels[def.id];
          const maxed = lvl >= def.maxLevel;
          const cost = upgradeCost(def, lvl);
          const affordable = canBuy(def, progress.levels, credits);
          return (
            <article key={def.id} className="upgrade-card" role="listitem">
              <header className="upgrade-card-head">
                <h3>{def.name}</h3>
                <span className="upgrade-lvl">
                  Lv {lvl}/{def.maxLevel}
                </span>
              </header>
              <p className="upgrade-blurb">{def.blurb}</p>
              <p className="upgrade-effect">
                {lvl > 0 ? def.effectLabel(lvl) : "Not installed"}
              </p>
              <p className="upgrade-ch11">{def.ch11Note}</p>
              <button
                type="button"
                className="btn primary"
                disabled={!affordable}
                onClick={() => onBuy(def)}
              >
                {maxed
                  ? "Maxed"
                  : affordable
                    ? `Buy · ${cost}B`
                    : `Need ${cost}B`}
              </button>
            </article>
          );
        })}
      </div>

      <div className="upgrade-actions">
        <button type="button" className="btn primary" onClick={onNextCycle}>
          Start cycle {progress.cycle + 1}
        </button>
        <button type="button" className="btn ghost" onClick={onStandby}>
          Save & standby
        </button>
        <button type="button" className="btn reject" onClick={onReset}>
          Reset factory progress
        </button>
      </div>
    </section>
  );
}
