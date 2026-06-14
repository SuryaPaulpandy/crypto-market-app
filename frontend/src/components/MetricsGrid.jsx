import React from "react";
import MetricCard from "./MetricCard";

const SkeletonCard = () => (
  <div className="glass-card metric-card" style={{ display: "flex", gap: "16px", padding: "20px" }}>
    <div style={{
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.06)",
      animation: "skeletonPulse 1.5s infinite ease-in-out"
    }}></div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ width: "50%", height: "12px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.04)", animation: "skeletonPulse 1.5s infinite ease-in-out" }}></div>
      <div style={{ width: "80%", height: "20px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.07)", animation: "skeletonPulse 1.5s infinite ease-in-out" }}></div>
      <div style={{ width: "35%", height: "10px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.04)", animation: "skeletonPulse 1.5s infinite ease-in-out" }}></div>
    </div>
  </div>
);

const MetricsGrid = ({
  selectedSymbol,
  selectedCoinData,
  selectedAnalytics,
  topGainer,
  volumeLeader,
  stratSummary,
  formatUSD,
  formatVolume,
  loading,
}) => {
  if (loading) {
    return (
      <section className="metrics-grid">
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.3; }
          }
        `}</style>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </section>
    );
  }

  return (
    <section className="metrics-grid">
      <MetricCard
        title="Selected Asset Price"
        value={selectedCoinData ? formatUSD(selectedCoinData.price) : "—"}
        subtext={
          selectedAnalytics ? (
            <span
              className={`price-trend ${selectedAnalytics.price_change_percentage >= 0 ? "up" : "down"}`}
              style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              {selectedAnalytics.price_change_percentage >= 0 ? "▲ +" : "▼ "}
              {selectedAnalytics.price_change_percentage}% (24h)
            </span>
          ) : (
            "No 24h data"
          )
        }
        icon={<span style={{ fontWeight: 800 }}>{selectedSymbol}</span>}
        iconClass="icon-blue"
      />

      <MetricCard
        title="Top 24h Gainer"
        value={topGainer ? `${topGainer.symbol}` : "No data"}
        subtext={
          topGainer ? (
            <span
              className="price-trend up"
              style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}
            >
              ▲ +{topGainer.price_change_percentage}%
            </span>
          ) : "—"
        }
        icon={
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        iconClass="icon-green"
      />

      <MetricCard
        title="Liquidity Leader"
        value={volumeLeader ? `${volumeLeader.symbol}` : "No data"}
        subtext={volumeLeader ? `Vol: ${formatVolume(volumeLeader.volume)}` : "—"}
        icon={
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        }
        iconClass="icon-yellow"
      />

      <MetricCard
        title="Algo Strategy Signals"
        value={
          stratSummary.total > 0 ? `${stratSummary.buyCount} BUY / ${stratSummary.sellCount} SELL` : "Engine idle"
        }
        subtext={stratSummary.total > 0 ? `Evaluated for ${stratSummary.total} assets` : "Run the engine below"}
        icon={
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        }
        iconClass="icon-red"
      />
    </section>
  );
};

export default MetricsGrid;
