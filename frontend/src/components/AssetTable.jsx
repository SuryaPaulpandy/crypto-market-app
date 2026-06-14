import React from "react";

const AssetTable = ({
  prices,
  filteredPrices,
  analytics,
  selectedSymbol,
  setSelectedSymbol,
  searchQuery,
  setSearchQuery,
  formatUSD,
  apiStatus,
}) => {
  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="section-header">
        <h2>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Ingested Crypto Assets</span>
        </h2>
      </div>

      {/* Search bar */}
      <input
        type="text"
        className="search-input"
        placeholder="Search symbol (e.g. BTC, SOL, ETH)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={apiStatus === "disconnected"}
        style={{
          opacity: apiStatus === "disconnected" ? 0.5 : 1,
          cursor: apiStatus === "disconnected" ? "not-allowed" : "text"
        }}
      />

      {apiStatus === "disconnected" ? (
        <div className="empty-state" style={{ padding: "36px 16px" }}>
          <span className="empty-state-icon" style={{ fontSize: "32px" }}>⚠️</span>
          <h3 style={{ color: "rgba(239, 68, 68, 0.9)", fontSize: "14px", fontWeight: 700, marginTop: "12px" }}>Unable to fetch market data</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", lineHeight: "1.5" }}>
            The API server appears offline. Make sure the python backend is running locally.
          </p>
        </div>
      ) : prices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🪙</span>
          <h3>No assets found</h3>
          <p>No prices stored in database. Run "Sync Market Data" above to fetch top 10 assets from CoinGecko.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price</th>
                <th style={{ textAlign: "right" }}>24h change</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.map((coin, index) => {
                // Match analytics price change
                const coinAnalytics = analytics.find((a) => a.symbol === coin.symbol);
                const changePct = coinAnalytics ? coinAnalytics.price_change_percentage : 0;
                const isPositive = changePct >= 0;
                
                return (
                  <tr
                    key={index}
                    className={selectedSymbol === coin.symbol ? "selected" : ""}
                    onClick={() => setSelectedSymbol(coin.symbol)}
                  >
                    <td>
                      <div className="coin-identity">
                        <div className="coin-avatar">{coin.symbol.slice(0, 3)}</div>
                        <div>
                          <span className="coin-symbol">{coin.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatUSD(coin.price)}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`price-trend ${isPositive ? "up" : "down"}`} style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 600,
                        fontSize: "12px"
                      }}>
                        {isPositive ? "▲ +" : "▼ "}
                        {Math.abs(changePct)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPrices.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
              No match found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetTable;
