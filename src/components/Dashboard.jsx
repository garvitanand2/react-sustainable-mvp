import React, { useState } from "react";
import CalculatorForm from "./CalculatorForm";
import ResultSummary from "./ResultSummary";
import FlowchartView from "./FlowchartView";
import "../../src/styles/dashboard.css";

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [showResultAndFlowchart, setShowResultAndFlowchart] = useState(false);
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("carbonChecklist");
    return saved ? JSON.parse(saved) : {};
  });

  const handleCalculate = () => {
    console.log("Showing result and flowchart");
    setShowResultAndFlowchart(true);
  };

  const updateChecklist = (newChecklist) => {
    setChecklist(newChecklist);
    localStorage.setItem("carbonChecklist", JSON.stringify(newChecklist));
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
          <FlowchartView
            result={result}
            checklist={checklist}
            updateChecklist={updateChecklist}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
