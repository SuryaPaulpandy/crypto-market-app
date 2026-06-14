import React from "react";

const Header = ({ apiStatus, handleSyncMarkets, syncing, lastUpdated }) => {
  return (
    <header className="dashboard-header">
      <div className="header-title-section">
        <h1>Surya</h1>
        <p className="header-subtitle">Real-time cryptocurrency market insights, technical analysis, and rule-based strategy execution.</p>
      </div>

      <div className="header-actions">
        {/* Real-Time Last Updated Display */}
        {lastUpdated && (
          <div className="last-updated-badge" style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            fontFamily: "var(--font-mono)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>🕒 Last updated:</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{lastUpdated}</span>
          </div>
        )}

        {/* API Health Monitor */}
        <div className="api-status">
          <span className={`status-dot ${apiStatus === "connected" ? "connected" : "disconnected"}`}></span>
          <span>API Server: {apiStatus.toUpperCase()}</span>
        </div>

        {/* Sync Trigger */}
        <button 
          className="btn-primary" 
          onClick={handleSyncMarkets} 
          disabled={syncing}
        >
          {syncing ? (
            <>
              <span className="spinner"></span>
              <span>Syncing market data...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
              </svg>
              <span>Sync Market Data</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
