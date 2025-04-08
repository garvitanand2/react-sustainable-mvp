import React, { useState } from "react";
import benchmarks from "../data/carbonBenchmarks.json";
import "../../src/styles/dashboard.css";

const CalculatorForm = ({ setResult, onCalculate }) => {
  const [formData, setFormData] = useState({
    industry: "",
    employees: "",
    area: "",
    energy: "",
    sources: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    const { industry, employees, area, energy, sources } = formData;

    if (!industry || !employees || !area || !energy) {
      alert("Please fill in all required fields.");
      return;
    }

    const benchmark = benchmarks[industry] || benchmarks["default"];
    const emission = (
      parseFloat(employees) * benchmark.perEmployee +
      parseFloat(area) * benchmark.perSqFt +
      parseFloat(energy) *
        benchmark.perKWh *
        (sources.includes("diesel") ? 1.5 : 1)
    ).toFixed(2);

    const maxEmission = 10000;
    const percentage = (emission / maxEmission) * 100;
    let category;
    if (percentage > 80) category = "High";
    else if (percentage > 50) category = "Medium";
    else if (percentage > 10) category = "Low";
    else category = "Eco-friendly";

    console.log("Calculated Result:", { emission, percentage, category });
    setResult({ emission, percentage, category });
    onCalculate();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newSources = checked
        ? [...formData.sources, name]
        : formData.sources.filter((s) => s !== name);
      setFormData({ ...formData, sources: newSources });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log("Input changed:", { name, value, checked });
  };

  return (
    <form onSubmit={handleSubmit} className="calculator-form">
      <h2 className="form-title">Redwood AI Carbon Footprint Calculator</h2>
      <div className="form-group">
        <label className="form-label">Industry</label>
        <select
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
          className="form-input"
          required
        >
          <option value="">Select Industry</option>
          <option value="healthcare">Healthcare</option>
          <option value="tech">Tech</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="oilGas">Oil & Gas</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Number of Employees</label>
        <input
          type="number"
          name="employees"
          value={formData.employees}
          onChange={handleInputChange}
          className="form-input"
          required
          placeholder="e.g., 50"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Operational Area (sq. ft)</label>
        <input
          type="number"
          name="area"
          value={formData.area}
          onChange={handleInputChange}
          className="form-input"
          required
          placeholder="e.g., 1000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Monthly Energy (kWh)</label>
        <input
          type="number"
          name="energy"
          value={formData.energy}
          onChange={handleInputChange}
          className="form-input"
          required
          placeholder="e.g., 5000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Energy Sources</label>
        <div className="checkbox-group">
          {["electricity", "diesel", "naturalGas", "solar"].map((source) => (
            <label key={source} className="checkbox-label">
              <input
                type="checkbox"
                name={source}
                checked={formData.sources.includes(source)}
                onChange={handleInputChange}
              />
              {source.charAt(0).toUpperCase() + source.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-button">
        Calculate Now
      </button>
    </form>
  );
};

export default CalculatorForm;
