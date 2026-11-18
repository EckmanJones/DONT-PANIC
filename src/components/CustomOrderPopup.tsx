import {
  orderFixedTotal,
  orderVariableTotal,
  type CustomPlanetOrder,
  type OrderDecision,
  type OrderVerdict,
} from "../content/customOrders";

type CustomOrderPopupProps = {
  order: CustomPlanetOrder;
  capacityAvailable: number;
  queueIndex: number;
  queueTotal: number;
  /** Set after Accept / Reject while feedback shows */
  verdict: OrderVerdict | null;
  onDecide: (decision: OrderDecision) => void;
  onContinue: () => void;
};

export function CustomOrderPopup({
  order,
  capacityAvailable,
  queueIndex,
  queueTotal,
  verdict,
  onDecide,
  onContinue,
}: CustomOrderPopupProps) {
  const vc = orderVariableTotal(order);
  const fc = orderFixedTotal(order);
  const fits = order.capacityNeeded <= capacityAvailable;
  const decided = verdict !== null;

  return (
    <div
      className="order-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-pop-title"
    >
      <div className="order-popup">
        <p className="order-ping">
          Sub-Etha · custom offer {queueIndex + 1} of {queueTotal}
        </p>
        <h3 id="order-pop-title">{order.title}</h3>
        <p className="order-client">{order.client}</p>
        <p className="order-blurb">{order.blurb}</p>

        <div className="order-metrics" aria-label="Order economics">
          <div className="order-metric">
            <span className="yard-chip-label">Price</span>
            <span className="yard-chip-value">{order.price}B</span>
          </div>
          <div className="order-metric">
            <span className="yard-chip-label">Variable costs</span>
            <span className="yard-chip-value">{vc}B</span>
          </div>
          <div className="order-metric">
            <span className="yard-chip-label">Fixed costs</span>
            <span className="yard-chip-value">{fc}B</span>
          </div>
          <div className={`order-metric ${fits ? "" : "tight"}`}>
            <span className="yard-chip-label">Capacity needed</span>
            <span className="yard-chip-value">
              {order.capacityNeeded} / {capacityAvailable} bay
              {capacityAvailable === 1 ? "" : "s"} free
            </span>
          </div>
        </div>

        <div
          className="cost-ledger order-ledger"
          aria-label="Order cost schedule"
        >
          <div className="cost-ledger-head">
            <span>Order schedule</span>
            <span>B</span>
            <span>Ch.11</span>
          </div>
          {order.costLines.map((line) => (
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

        <p className="order-cm">
          Relevant contribution if accepted:{" "}
          <strong>{order.contribution}B</strong>
          {!fits && (
            <>
              {" "}
              · <span className="order-warn">capacity shortfall</span>
            </>
          )}
        </p>

        {!decided ? (
          <div className="order-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => onDecide("accept")}
            >
              Accept offer
            </button>
            <button
              type="button"
              className="btn reject"
              onClick={() => onDecide("reject")}
            >
              Reject offer
            </button>
          </div>
        ) : (
          <div className={`order-verdict ${verdict.correct ? "ok" : "miss"}`}>
            <p className="order-verdict-mark">
              {verdict.correct ? "Correct call" : "Miss"} ·{" "}
              {verdict.decision === "accept" ? "accepted" : "rejected"}
            </p>
            <p className="order-verdict-body">{verdict.feedback}</p>
            <button type="button" className="btn primary" onClick={onContinue}>
              {queueIndex + 1 < queueTotal
                ? "Next offer"
                : "Back to forge core"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
