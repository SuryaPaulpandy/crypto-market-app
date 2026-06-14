import React from "react";

const SignalTable = ({
  strategy,
  handleRunStrategy,
  runningStrategy,
  selectedSymbol,
  setSelectedSymbol,
  formatUSD,
  formatVolume,
}) => {
  return (
    <div className="glass-card strategy-card">
      <div className="section-header" style={{ marginBottom: "16px" }}>
        <h2>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span>Algorithmic Rule-Based Strategy Module</span>
        </h2>
      </div>

      <div className="strategy-engine-run">
        <div className="strategy-engine-info">
          <h3>Technical Momentum Engine</h3>
          <p>Computes buy, sell, and hold recommendations using historical prices and technical price brackets.</p>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleRunStrategy}
          disabled={runningStrategy}
        >
          {runningStrategy ? (
            <>
              <span className="spinner"></span>
              <span>Running strategy engine...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Execute Strategy Engine</span>
            </>
          )}
        </button>
      </div>

      {strategy.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🤖</span>
          <h3>Strategy Engine Not Run</h3>
          <p>Click "Execute Strategy Engine" to compile rule checks and compute trade suggestions.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Last Price</th>
                <th>Volume</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {strategy.map((item, idx) => (
                <tr 
                  key={idx} 
                  className={selectedSymbol === item.symbol ? "selected" : ""}
                  onClick={() => setSelectedSymbol(item.symbol)}
                >
                  <td className="coin-symbol">{item.symbol}</td>
                  <td>{formatUSD(item.price)}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{formatVolume(item.volume)}</td>
                  <td>
                    <span className={`badge-signal ${item.signal.toLowerCase()}`}>
                      {item.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SignalTable;
