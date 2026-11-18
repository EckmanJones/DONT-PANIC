import {
  economyHealth,
  formatCredits,
  type EconomyDelta,
  type EconomyState,
} from "../content/economy";

type EconomyPanelProps = {
  economy: EconomyState;
  lastDelta: EconomyDelta | null;
};

export function EconomyPanel({ economy, lastDelta }: EconomyPanelProps) {
  const health = economyHealth(economy);

  return (
    <aside
      className={`economy-panel health-${health}`}
      aria-label="Yard economy — Ch.11 scoreboard"
    >
      <div className="economy-head">
        <span className="economy-title">Yard economy · capacity scoreboard</span>
        <span className={`economy-pulse ${health}`}>
          {health === "hot"
            ? "strong contribution"
            : health === "ok"
              ? "mixed calls"
              : "trap damage"}
        </span>
      </div>
      <div className="economy-meters meters-6">
        <Metric
          label="Credits"
          value={`${economy.credits.toFixed(economy.credits % 1 ? 1 : 0)}B`}
          delta={lastDelta?.credits}
          formatDelta={formatCredits}
        />
        <Metric
          label="Raw cores"
          value={`${economy.asteroids}`}
          delta={lastDelta?.asteroids}
          formatDelta={(n) => `${n > 0 ? "+" : ""}${n}`}
        />
        <Metric
          label="Capacity"
          value={`${economy.capacityLeft}/${economy.capacityMax}`}
          delta={lastDelta?.capacityLeft}
          formatDelta={(n) => `${n > 0 ? "+" : ""}${n}`}
        />
        <Metric
          label="Dock load"
          value={`${economy.dockLoad}%`}
          delta={lastDelta?.dockLoad}
          formatDelta={(n) => `${n > 0 ? "+" : ""}${n}`}
        />
        <Metric
          label="Renown"
          value={`${economy.renown}`}
          delta={lastDelta?.renown}
          formatDelta={(n) => `${n > 0 ? "+" : ""}${n}`}
        />
        <Metric
          label="Shipped"
          value={`${economy.planetsShipped}`}
          delta={lastDelta?.planetsShipped}
          formatDelta={(n) => `${n > 0 ? "+" : ""}${n}`}
        />
      </div>
      {lastDelta && (
        <p className="economy-ticker" key={lastDelta.ticker}>
          {lastDelta.ticker}
        </p>
      )}
    </aside>
  );
}

function Metric({
  label,
  value,
  delta,
  formatDelta,
}: {
  label: string;
  value: string;
  delta?: number;
  formatDelta: (n: number) => string;
}) {
  const show = delta !== undefined && delta !== 0;
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      {show && (
        <span className={delta! > 0 ? "metric-delta up" : "metric-delta down"}>
          {formatDelta(delta!)}
        </span>
      )}
    </div>
  );
}
