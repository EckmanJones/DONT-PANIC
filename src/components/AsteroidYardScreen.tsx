import { useEffect, useMemo, useState } from "react";
import {
  yardDecisionForOrder,
  type AsteroidChoice,
  type AsteroidYard,
} from "../content/asteroidYard";
import {
  drawOrderQueue,
  orderFixedTotal,
  orderVariableTotal,
  resolveOrderDecision,
  type CustomPlanetOrder,
  type OrderDecision,
  type OrderVerdict,
} from "../content/customOrders";
import { CustomOrderPopup } from "./CustomOrderPopup";
import { GuideEntry } from "./GuideEntry";

type AsteroidYardScreenProps = {
  yard: AsteroidYard;
  cycle: number;
  offersBonus: number;
  picked: string | null;
  revealed: boolean;
  onPick: (id: string) => void;
  onReveal: () => void;
  onNext: () => void;
  onChoicesReady: (choices: AsteroidChoice[]) => void;
  onOrderVerdicts: (verdicts: OrderVerdict[]) => void;
};

export function AsteroidYardScreen({
  yard,
  cycle,
  offersBonus,
  picked,
  revealed,
  onPick,
  onReveal,
  onNext,
  onChoicesReady,
  onOrderVerdicts,
}: AsteroidYardScreenProps) {
  const [queue, setQueue] = useState<CustomPlanetOrder[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [verdicts, setVerdicts] = useState<OrderVerdict[]>([]);
  const [liveVerdict, setLiveVerdict] = useState<OrderVerdict | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [ordersDone, setOrdersDone] = useState(false);
  const [capacityLeft, setCapacityLeft] = useState(yard.capacityAvailable);

  // Draw a random bank subset once on mount; open first offer after a short beat.
  // Do not put a "started" flag in deps — that would clear the timeout before it fires.
  useEffect(() => {
    const drawn = drawOrderQueue(yard.capacityAvailable, offersBonus);
    setQueue(drawn);
    let cancelled = false;
    const delay = 1200 + Math.floor(Math.random() * 1000);
    const id = window.setTimeout(() => {
      if (cancelled) return;
      if (drawn.length > 0) setPopupOpen(true);
      else setOrdersDone(true);
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only draw for this visit
  }, []);

  useEffect(() => {
    onOrderVerdicts(verdicts);
  }, [verdicts, onOrderVerdicts]);

  const decision = useMemo(
    () => yardDecisionForOrder(yard, capacityLeft, ordersDone),
    [yard, capacityLeft, ordersDone],
  );

  useEffect(() => {
    onChoicesReady(decision.choices);
  }, [decision.choices, onChoicesReady]);

  useEffect(() => {
    if (!picked || revealed) return;
    if (!decision.choices.some((c) => c.id === picked)) onPick("");
  }, [decision.choices, picked, revealed, onPick]);

  const currentOrder = queue[queueIndex] ?? null;

  function handleDecide(action: OrderDecision) {
    if (!currentOrder || liveVerdict) return;
    const v = resolveOrderDecision(currentOrder, action, capacityLeft);
    setLiveVerdict(v);
  }

  function handleContinueAfterVerdict() {
    if (!liveVerdict) return;
    const nextCapacity = Math.max(0, capacityLeft - liveVerdict.capacityUsed);
    const nextVerdicts = [...verdicts, liveVerdict];
    setCapacityLeft(nextCapacity);
    setVerdicts(nextVerdicts);
    setLiveVerdict(null);

    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex);
      setPopupOpen(true);
      return;
    }
    setPopupOpen(false);
    setOrdersDone(true);
  }

  const choice = decision.choices.find((c) => c.id === picked);
  const forgeLocked = !ordersDone || popupOpen;

  return (
    <section className="screen scenario asteroid-screen">
      {popupOpen && currentOrder && (
        <CustomOrderPopup
          order={currentOrder}
          capacityAvailable={capacityLeft}
          queueIndex={queueIndex}
          queueTotal={queue.length}
          verdict={liveVerdict}
          onDecide={handleDecide}
          onContinue={handleContinueAfterVerdict}
        />
      )}

      <p className="concept-pill">
        Cycle {cycle} · {yard.lo} · {yard.concept}
      </p>
      <h2>{yard.headline}</h2>
      <p className="story">{yard.story}</p>

      <div className="yard-status" aria-label="Factory WIP and capacity">
        <div className="yard-chip">
          <span className="yard-chip-label">Factory WIP</span>
          <span className="yard-chip-value">
            {yard.coresInWip} raw core (forge output)
          </span>
        </div>
        <div className="yard-chip">
          <span className="yard-chip-label">Finishing capacity left</span>
          <span className="yard-chip-value">
            {capacityLeft} / {yard.capacityAvailable} bay
            {yard.capacityAvailable === 1 ? "" : "s"}
          </span>
        </div>
        <div className="yard-chip highlight">
          <span className="yard-chip-label">{yard.goingRateLabel}</span>
          <span className="yard-chip-value">{yard.goingRate}B</span>
        </div>
      </div>

      {verdicts.length > 0 && (
        <div className="order-log" aria-label="Custom offers decided">
          <div className="order-sticky-head">
            <span className="order-ping inline">Offer bank · decided</span>
            {!ordersDone && !popupOpen && queue[queueIndex] && (
              <button
                type="button"
                className="btn ghost tiny"
                onClick={() => setPopupOpen(true)}
              >
                Resume offers
              </button>
            )}
          </div>
          <ul className="order-log-list">
            {verdicts.map((v) => (
              <li key={v.order.id} className={v.correct ? "ok" : "miss"}>
                <span className="order-log-mark">
                  {v.correct ? "✓" : "·"} {v.decision}
                </span>
                <div>
                  <strong>{v.order.title}</strong>
                  <div className="order-sticky-grid">
                    <span>Price {v.order.price}B</span>
                    <span>VC {orderVariableTotal(v.order)}B</span>
                    <span>FC {orderFixedTotal(v.order)}B</span>
                    <span>
                      Cap {v.order.capacityNeeded}/{yard.capacityAvailable}
                    </span>
                    <span>CM {v.order.contribution}B</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="cost-ledger" aria-label="Cost and rate schedule">
        <div className="cost-ledger-head">
          <span>Forge WIP schedule</span>
          <span>B credits</span>
          <span>Ch.11</span>
        </div>
        {yard.costSchedule.map((line) => (
          <div
            key={line.id}
            className={`cost-row kind-${line.kind} ${line.relevant ? "relevant" : "irrelevant"}`}
          >
            <div>
              <strong>{line.label}</strong>
              <div className="cost-note">{line.note}</div>
            </div>
            <div className="cost-amt">{line.amount}</div>
            <div className="cost-flag">
              {line.relevant ? "relevant" : "ignore"}
            </div>
          </div>
        ))}
      </div>

      <GuideEntry title={yard.guideTitle} body={yard.guideEntry} />

      {!ordersDone ? (
        <p className="question muted-wait">
          Incoming custom offers from the bank — Accept or Reject each before
          locking the forge-core vote.
        </p>
      ) : (
        <p className="question">{decision.question}</p>
      )}

      <div className="choices" role="group" aria-label="Sell or process further">
        {decision.choices.map((c) => {
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
              onClick={() => onPick(c.id)}
              disabled={revealed || forgeLocked}
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
          disabled={!picked || forgeLocked}
          onClick={onReveal}
        >
          Lock vote · update WIP & capacity
        </button>
      ) : (
        <div className="reveal">
          <p className="punch">{decision.punchline}</p>
          <p className="feedback">{choice?.feedback}</p>
          <p className="concept-note">{decision.conceptNote}</p>
          <p className="strategic-note">{decision.strategicNote}</p>
          <button type="button" className="btn primary" onClick={onNext}>
            Continue · more Ch.11 beats
          </button>
        </div>
      )}
    </section>
  );
}
