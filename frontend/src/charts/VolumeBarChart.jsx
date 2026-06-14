import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VolumeBarChart = ({ history, formatUSD, formatVolume, formatDate }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="recharts-custom-tooltip" style={{
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)"
        }}>
          <div className="tooltip-time" style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            marginBottom: "8px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "6px"
          }}>
            🕒 {new Date(data.timestamp).toLocaleString()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Price:</span>
              <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "13px" }}>{formatUSD(data.price)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Volume:</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "13px" }}>{formatVolume(data.volume)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-wrapper" style={{ height: "100px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={history} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            stroke="var(--text-muted)" 
            tick={{ fontSize: 8, fontFamily: "var(--font-mono)" }}
            minTickGap={45} // Guarantees clean, non-compressed spacing on x-axis
          />
          <YAxis 
            tickFormatter={(v) => v >= 1.0e6 ? (v / 1.0e6).toFixed(0) + "M" : v.toLocaleString()}
            stroke="var(--text-muted)"
            tick={{ fontSize: 8, fontFamily: "var(--font-mono)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="volume" 
            fill="rgba(99, 102, 241, 0.55)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeBarChart;
