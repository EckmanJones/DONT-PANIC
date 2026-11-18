import { useCallback, useEffect, useMemo, useState } from "react";
import { AsteroidYardScreen } from "./components/AsteroidYardScreen";
import { EconomyPanel } from "./components/EconomyPanel";
import { GuideEntry } from "./components/GuideEntry";
import { UpgradeBayScreen } from "./components/UpgradeBayScreen";
import {
  buildYard,
  type AsteroidChoice,
} from "./content/asteroidYard";
import {
  mergeOrderEconomies,
  type OrderVerdict,
} from "./content/customOrders";
import {
  INITIAL_ECONOMY,
  applyDelta,
  seedCycleEconomy,
  type EconomyDelta,
  type EconomyState,
} from "./content/economy";
import {
  INITIAL_PROGRESS,
  advanceCycle,
  buyUpgrade,
  clearProgress,
  loadProgress,
  progressMods,
  saveProgress,
  type FactoryProgress,
} from "./content/factoryProgress";
import { GUIDE_DISCLAIMER } from "./content/guide";
import {
  SCENARIOS,
  formatElapsed,
  type AnswerRecord,
} from "./content/scenarios";
import type { UpgradeDef } from "./content/upgrades";

type Screen =
  | "home"
  | "briefing"
  | "asteroid"
  | "scenario"
  | "upgrades"
  | "results";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [progress, setProgress] = useState<FactoryProgress>(() =>
    typeof window !== "undefined" ? loadProgress() : INITIAL_PROGRESS,
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [economy, setEconomy] = useState<EconomyState>(INITIAL_ECONOMY);
  const [lastDelta, setLastDelta] = useState<EconomyDelta | null>(null);
  const [orderVerdicts, setOrderVerdicts] = useState<OrderVerdict[]>([]);
  const [yardVisit, setYardVisit] = useState(0);

  const mods = useMemo(() => progressMods(progress), [progress]);
  const yard = useMemo(() => buildYard(mods), [mods]);
  const [yardChoices, setYardChoices] = useState<AsteroidChoice[]>(
    () => yard.choices,
  );

  const onYardChoicesReady = useCallback((choices: AsteroidChoice[]) => {
    setYardChoices(choices);
  }, []);

  const onOrderVerdictsReady = useCallback((verdicts: OrderVerdict[]) => {
    setOrderVerdicts(verdicts);
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!timerOn) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerOn]);

  const current = SCENARIOS[index];
  const warn = elapsed >= 12 * 60;
  const showEconomy =
    screen === "asteroid" ||
    screen === "scenario" ||
    screen === "upgrades" ||
    screen === "results";

  function openFactory(fresh: boolean) {
    if (fresh) clearProgress();
    const nextProgress = fresh
      ? { ...INITIAL_PROGRESS, levels: { ...INITIAL_PROGRESS.levels } }
      : loadProgress();
    const nextMods = progressMods(nextProgress);
    setProgress(nextProgress);
    setAnswers([]);
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setElapsed(0);
    setOrderVerdicts([]);
    setEconomy(
      seedCycleEconomy(
        { ...INITIAL_ECONOMY, credits: nextProgress.credits },
        nextMods.capacityMax,
        nextMods.coresPerCycle,
      ),
    );
    setLastDelta(null);
    setTimerOn(true);
    const returning =
      !fresh &&
      (nextProgress.cycle > 1 ||
        Object.values(nextProgress.levels).some((n) => n > 0));
    setScreen(returning ? "asteroid" : "briefing");
    setYardVisit((n) => n + 1);
    setYardChoices(buildYard(nextMods).choices);
  }

  function beginAsteroid() {
    setPicked(null);
    setRevealed(false);
    setLastDelta(null);
    setYardChoices(yard.choices);
    setOrderVerdicts([]);
    setEconomy((prev) =>
      seedCycleEconomy(prev, mods.capacityMax, mods.coresPerCycle),
    );
    setYardVisit((n) => n + 1);
    setScreen("asteroid");
  }

  function lockChoice(id: string) {
    if (revealed) return;
    if (!id) {
      setPicked(null);
      return;
    }
    setPicked(id);
  }

  function revealAsteroid() {
    if (!picked) return;
    const choice = yardChoices.find((c) => c.id === picked);
    if (!choice) return;
    const fromOrders = mergeOrderEconomies(orderVerdicts);
    const rawCredits =
      (fromOrders.credits ?? 0) + (choice.economy.credits ?? 0);
    const scaledCredits =
      rawCredits > 0 ? Math.round(rawCredits * mods.creditMult * 10) / 10 : rawCredits;
    const planets =
      (fromOrders.planetsShipped ?? 0) + (choice.economy.planetsShipped ?? 0);
    const delta: EconomyDelta = {
      credits: scaledCredits,
      dockLoad: (fromOrders.dockLoad ?? 0) + (choice.economy.dockLoad ?? 0),
      renown: (fromOrders.renown ?? 0) + (choice.economy.renown ?? 0),
      planetsShipped: planets,
      asteroids: -choice.coresConsumed,
      capacityLeft: (fromOrders.capacityLeft ?? 0) - choice.capacityUsed,
      ticker: [fromOrders.ticker, choice.economy.ticker]
        .filter(Boolean)
        .join(" · "),
    };
    setEconomy((prev) => {
      const next = applyDelta(prev, delta);
      setProgress((p) => ({
        ...p,
        credits: next.credits,
        lifetimePlanets: p.lifetimePlanets + planets,
        lifetimeCreditsEarned:
          p.lifetimeCreditsEarned + Math.max(0, scaledCredits),
      }));
      return next;
    });
    setLastDelta(delta);
    const ordersCorrect =
      orderVerdicts.length === 0 || orderVerdicts.every((v) => v.correct);
    setAnswers((prev) => {
      const without = prev.filter(
        (a) =>
          a.scenarioId !== "asteroid-yard" && a.scenarioId !== "custom-orders",
      );
      const orderAnswer =
        orderVerdicts.length > 0
          ? [
              {
                scenarioId: "custom-orders",
                choiceId: `${orderVerdicts.filter((v) => v.correct).length}/${orderVerdicts.length}`,
                correct: ordersCorrect,
                economyTicker: fromOrders.ticker ?? "",
              },
            ]
          : [];
      return [
        ...without,
        ...orderAnswer,
        {
          scenarioId: "asteroid-yard",
          choiceId: picked,
          correct: choice.correct,
          economyTicker: choice.economy.ticker ?? "",
        },
      ];
    });
    setRevealed(true);
  }

  function afterAsteroid() {
    setPicked(null);
    setRevealed(false);
    setLastDelta(null);
    if (mods.crisesUnlocked) {
      const crisisIndex = (progress.cycle - 1) % SCENARIOS.length;
      setIndex(crisisIndex);
      setScreen("scenario");
      return;
    }
    setScreen("upgrades");
  }

  function revealScenario() {
    if (!picked || !current) return;
    const choice = current.choices.find((c) => c.id === picked);
    if (!choice) return;
    const delta = choice.economy;
    setEconomy((prev) => applyDelta(prev, delta));
    setLastDelta(delta);
    setAnswers((prev) => {
      const without = prev.filter((a) => a.scenarioId !== current.id);
      return [
        ...without,
        {
          scenarioId: current.id,
          choiceId: picked,
          correct: choice.correct,
          economyTicker: delta.ticker,
        },
      ];
    });
    setRevealed(true);
  }

  function afterScenario() {
    setPicked(null);
    setRevealed(false);
    setLastDelta(null);
    setScreen("upgrades");
  }

  function handleBuy(def: UpgradeDef) {
    const result = buyUpgrade(progress, def, economy.credits);
    if (!result) return;
    const prevMods = mods;
    const nextMods = progressMods(result.progress);
    setEconomy((prev) => {
      const next = clampBuy(
        prev,
        result.creditsSpent,
        nextMods.capacityMax - prevMods.capacityMax,
      );
      setProgress({ ...result.progress, credits: next.credits });
      return next;
    });
    setLastDelta({
      credits: -result.creditsSpent,
      capacityMax: nextMods.capacityMax - prevMods.capacityMax,
      ticker: `Installed ${def.name}. −${result.creditsSpent}B relevant outlay.`,
    });
  }

  function nextCycle() {
    const advanced = advanceCycle(progress);
    const nextMods = progressMods(advanced);
    setProgress(advanced);
    setAnswers([]);
    setPicked(null);
    setRevealed(false);
    setOrderVerdicts([]);
    setEconomy((prev) =>
      seedCycleEconomy(prev, nextMods.capacityMax, nextMods.coresPerCycle),
    );
    setLastDelta({
      ticker: `Cycle ${advanced.cycle} online. Bays ${nextMods.capacityMax} · finish VC ${nextMods.finishVc}B.`,
    });
    setYardVisit((n) => n + 1);
    setYardChoices(buildYard(nextMods).choices);
    setScreen("asteroid");
  }

  function standby() {
    saveProgress({ ...progress, credits: economy.credits });
    setProgress((p) => ({ ...p, credits: economy.credits }));
    setTimerOn(false);
    setScreen("home");
  }

  function resetFactory() {
    clearProgress();
    setProgress({ ...INITIAL_PROGRESS, levels: { ...INITIAL_PROGRESS.levels } });
    setEconomy(INITIAL_ECONOMY);
    setLastDelta({ ticker: "Factory progress wiped. Back to bay 1." });
    setAnswers([]);
    setTimerOn(false);
    setScreen("home");
  }

  const phase =
    screen === "home"
      ? "STANDBY"
      : screen === "briefing"
        ? "CH.11 BRIEF"
        : screen === "asteroid"
          ? `CYCLE ${progress.cycle} · LO4`
          : screen === "scenario"
            ? `CRISIS · ${current?.lo ?? "LO"}`
            : screen === "upgrades"
              ? "UPGRADE BAY"
              : "CH.11 REPORT";

  return (
    <div className="app-shell">
      <header className="chrome">
        <div className="chrome-left">
          <span className="mission-tag">BLOCHER CH.11 · DONT PANIC!!!</span>
          <span className="film-tag">
            {screen === "asteroid"
              ? `Cycle ${progress.cycle} · ${yard.concept}`
              : screen === "upgrades"
                ? "Spend credits · grow capacity · Ch.11 relevant outlays"
                : screen === "scenario" && current
                  ? `${current.lo} · ${current.concept}`
                  : "Incremental planet factory · Ch.11"}
          </span>
        </div>
        <div className="chrome-right">
          <span>{phase}</span>
          <span className={warn ? "timer warn" : "timer"}>
            {formatElapsed(elapsed)}
          </span>
        </div>
      </header>

      {showEconomy && (
        <EconomyPanel economy={economy} lastDelta={lastDelta} />
      )}

      {screen === "home" && (
        <section className="screen home">
          <div className="orbit" aria-hidden="true" />
          <div className="planet" aria-hidden="true" />
          <p className="kicker">
            Blocher Ch.11 · incremental planet factory
          </p>
          <h1 className="brand">DONT PANIC!!!</h1>
          <p className="lead">
            Run cycles of custom offers and forge sell-or-process decisions.
            Bank credits, then upgrade finishing bays, cut finishing VC, and
            widen the offer desk — each upgrade is a relevant costing call.
          </p>
          <p className="guide-blurb">{GUIDE_DISCLAIMER}</p>
          <div className="home-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => openFactory(false)}
            >
              {progress.cycle > 1 ||
              Object.values(progress.levels).some((n) => n > 0)
                ? `Continue · cycle ${progress.cycle}`
                : "Open the factory"}
            </button>
            {(progress.cycle > 1 ||
              Object.values(progress.levels).some((n) => n > 0)) && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => openFactory(true)}
              >
                New factory
              </button>
            )}
          </div>
          <p className="meta">
            Lifetime shipped {progress.lifetimePlanets} · bays {mods.capacityMax}{" "}
            · finish VC {mods.finishVc}B
          </p>
        </section>
      )}

      {screen === "briefing" && (
        <section className="screen briefing">
          <p className="kicker">Inside Ch.11 · incremental loop</p>
          <h2>Offer bank → forge core → upgrade bay → next cycle</h2>
          <ol className="steps">
            <li>
              <strong>Accept / Reject</strong> random custom planet offers (CM +
              capacity).
            </li>
            <li>
              <strong>Sell or process</strong> forge WIP with capacity left
              (LO4).
            </li>
            <li>
              <strong>Upgrade Bay</strong> — spend credits on bays, VC cuts,
              offer desk, and unlock board crises (LO2–LO5).
            </li>
          </ol>
          <button type="button" className="btn primary" onClick={beginAsteroid}>
            Start cycle {progress.cycle}
          </button>
        </section>
      )}

      {screen === "asteroid" && (
        <AsteroidYardScreen
          key={`yard-${yardVisit}`}
          yard={yard}
          cycle={progress.cycle}
          offersBonus={mods.offersBonus}
          picked={picked}
          revealed={revealed}
          onPick={lockChoice}
          onReveal={revealAsteroid}
          onNext={afterAsteroid}
          onChoicesReady={onYardChoicesReady}
          onOrderVerdicts={onOrderVerdictsReady}
        />
      )}

      {screen === "scenario" && current && (
        <section className="screen scenario">
          <p className="concept-pill">
            Board crisis · {current.lo} · {current.concept}
          </p>
          <h2>{current.headline}</h2>
          <p className="story">{current.story}</p>
          <GuideEntry title={current.guideTitle} body={current.guideEntry} />
          <p className="question">{current.question}</p>

          <div className="choices" role="group" aria-label="Class vote">
            {current.choices.map((c) => {
              const selected = picked === c.id;
              let state = "";
              if (revealed && selected && c.correct) state = "ok";
              if (revealed && selected && !c.correct) state = "miss";
              if (revealed && !selected && c.correct) state = "answer";
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`choice ${selected ? "selected" : ""} ${state}`}
                  onClick={() => lockChoice(c.id)}
                  disabled={revealed}
                >
                  <span className="choice-id">{c.id.toUpperCase()}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {!revealed ? (
            <button
              type="button"
              className="btn primary"
              disabled={!picked}
              onClick={revealScenario}
            >
              Lock vote · apply Ch.11 result
            </button>
          ) : (
            <div className="reveal">
              <p className="punch">{current.punchline}</p>
              <p className="feedback">
                {current.choices.find((c) => c.id === picked)?.feedback}
              </p>
              <p className="concept-note">{current.conceptNote}</p>
              <p className="strategic-note">{current.strategicNote}</p>
              <button
                type="button"
                className="btn primary"
                onClick={afterScenario}
              >
                To Upgrade Bay
              </button>
            </div>
          )}
        </section>
      )}

      {screen === "upgrades" && (
        <UpgradeBayScreen
          progress={progress}
          credits={economy.credits}
          cycleAnswers={answers}
          onBuy={handleBuy}
          onNextCycle={nextCycle}
          onStandby={standby}
          onReset={resetFactory}
        />
      )}
    </div>
  );
}

function clampBuy(
  prev: EconomyState,
  spent: number,
  capacityGain: number,
): EconomyState {
  return applyDelta(prev, {
    credits: -spent,
    capacityMax: capacityGain,
    capacityLeft: capacityGain,
    ticker: "",
  });
}

export default App;
