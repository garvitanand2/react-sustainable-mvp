import React from "react";
import "../../src/styles/dashboard.css";

const ResultSummary = ({ result }) => {
  const { emission, percentage, category } = result;
  const colorClass = {
    High: "result-high",
    Medium: "result-medium",
    Low: "result-low",
    "Eco-friendly": "result-eco",
  }[category];

  return (
    <div className="result-container">
      <div className={`result-indicator ${colorClass}`}>
        <p className="result-title">{category}</p>
        <p>
          {emission} kg CO2e ({percentage.toFixed(1)}%)
        </p>
      </div>
      <p className="result-text">
        Recommendations: Optimize energy usage, switch to renewables.
      </p>
    </div>
  );
};

export default ResultSummary;
