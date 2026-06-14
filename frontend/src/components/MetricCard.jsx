import React from "react";

const MetricCard = ({ title, value, subtext, icon, iconClass }) => {
  return (
    <div className="glass-card metric-card">
      <div className={`metric-icon-wrapper ${iconClass}`}>
        {icon}
      </div>
      <div className="metric-content">
        <span className="metric-label">{title}</span>
        <span className="metric-value">{value}</span>
        <span className="metric-subtext">{subtext}</span>
      </div>
    </div>
  );
};

export default MetricCard;
