import React from "react";
import PriceAreaChart from "./PriceAreaChart";
import VolumeBarChart from "./VolumeBarChart";

const HistoryChartContainer = ({
  selectedSymbol,
  chartLimit,
  setChartLimit,
  loadingHistory,
  history,
  formatUSD,
  formatVolume,
  formatDate,
}) => {
  return (
    <div className="glass-card chart-card">
      <div className="section-header">
        <div>
          <h2>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{selectedSymbol} Price & Volume History</span>
          </h2>
          <p className="header-subtitle" style={{ marginTop: "4px" }}>
            Plotting historical analytical price movement and volume spikes.
          </p>
        </div>

        {/* Data limit filter controls */}
        <div className="chart-controls">
          {[10, 30, 50, 100].map((limit) => (
            <button
              key={limit}
              className={`btn-toggle ${chartLimit === limit ? "active" : ""}`}
              onClick={() => setChartLimit(limit)}
            >
              {limit} pts
            </button>
          ))}
        </div>
      </div>

      {/* Rendering charts */}
      {loadingHistory ? (
        <div className="empty-state" style={{ height: "320px" }}>
          <span className="spinner" style={{ width: "32px", height: "32px", borderTopColor: "var(--color-primary)" }}></span>
          <p style={{ marginTop: "12px" }}>Loading historical price points...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state" style={{ height: "320px" }}>
          <span className="empty-state-icon">📊</span>
          <h3>No historical data points</h3>
          <p>Click "Sync Market Data" above to fetch latest prices and construct historical entries.</p>
        </div>
      ) : (
        <>
          {/* 1. Price Area Chart */}
          <PriceAreaChart
            history={history}
            formatUSD={formatUSD}
            formatVolume={formatVolume}
            formatDate={formatDate}
          />

          {/* 2. Volume Bar Chart */}
          <div style={{ marginTop: "8px" }}>
            <div className="section-header" style={{ margin: "12px 0 8px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>
                Volume Breakdown
              </h3>
            </div>
            <VolumeBarChart
              history={history}
              formatUSD={formatUSD}
              formatVolume={formatVolume}
              formatDate={formatDate}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryChartContainer;
