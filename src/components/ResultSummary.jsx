import React from "react";
import "../../src/styles/dashboard.css";

const ResultSummary = ({ result }) => {
  const { emission, percentage, category } = result;

  // Determine color class based on percentage range
  let colorClass = "result-eco"; // Default to eco-friendly (green)
  if (percentage > 50) {
    colorClass = "result-high"; // Red for > 50%
  } else if (percentage >= 10 && percentage <= 50) {
    colorClass = "result-medium"; // Yellow for 10-50%
  } else if (percentage < 10) {
    colorClass = "result-eco"; // Green for < 10%
  }

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
