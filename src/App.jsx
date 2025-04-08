import React, { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [result, setResult] = useState(null);

  return <Dashboard result={result} setResult={setResult} />;
}

export default App;

