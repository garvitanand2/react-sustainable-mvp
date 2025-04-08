import React, { useState } from "react";
import CalculatorForm from "./CalculatorForm";
import ResultSummary from "./ResultSummary";
import FlowchartView from "./FlowchartView";
import "../../src/styles/dashboard.css";

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [showResultAndFlowchart, setShowResultAndFlowchart] = useState(false);

  const handleCalculate = () => {
    console.log("Showing result and flowchart");
    setShowResultAndFlowchart(true);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Redwood AI Carbon Footprint Calculator
      </h1>
      {!result && (
        <CalculatorForm setResult={setResult} onCalculate={handleCalculate} />
      )}
      {showResultAndFlowchart && result && (
        <div className="result-flowchart-container">
          <ResultSummary result={result} />
          <FlowchartView />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
