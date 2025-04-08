import React, { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app-container">
      <Dashboard result={result} setResult={setResult} />
    </div>
  );
}

export default App;
