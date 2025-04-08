import React, { useEffect, useRef, useState } from "react";
import { Graph } from "@antv/x6";
import "../../src/styles/dashboard.css";

const FlowchartView = ({ result, checklist, updateChecklist }) => {
  const graphRef = useRef(null);
  const [localChecklist, setLocalChecklist] = useState(checklist);
  const { emission, percentage, category, industry, sources } = result || {
    emission: 0,
    percentage: 0,
    category: "Eco-friendly",
    industry: "",
    sources: [],
  };

  useEffect(() => {
    if (!graphRef.current) return;

    const graph = new Graph({
      container: graphRef.current,
      width: 1000,
      height: 800,
      background: { color: "#1e3c72" },
      grid: true,
      panning: true, // Enable panning for manual scrolling
      mousewheel: { enabled: true }, // Enable zoom with mouse wheel
    });

    // Dynamic nodes based on industry and category
    const nodes = [];
    const baseX = 100;
    const baseY = 50;
    const stepY = 100;
    const stepX = 300;

    // Initial Assessment Node
    nodes.push({
      id: "1",
      shape: "rect",
      x: baseX,
      y: baseY,
      width: 150,
      height: 50,
      label: "Assess Footprint",
      attrs: {
        body: { fill: "#28a745", stroke: "#ffffff", strokeWidth: 2 },
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: {
        description: `Emission: ${emission} kg CO2e, %: ${percentage.toFixed(
          1
        )}%`,
      },
    });

    // Industry-Specific Strategy Node
    const industryStrategies = {
      healthcare: "Optimize medical equipment energy use",
      tech: "Reduce server power consumption",
      manufacturing: "Switch to sustainable materials",
      oilGas: "Transition to renewable energy sources",
    };
    nodes.push({
      id: "2",
      shape: "rect",
      x: baseX + stepX,
      y: baseY,
      width: 150,
      height: 50,
      label: `Strategy: ${industryStrategies[industry] || "General Reduction"}`,
      attrs: {
        body: {
          fill:
            category === "High"
              ? "#dc3545"
              : category === "Medium"
              ? "#fd7e14"
              : "#28a745",
          stroke: "#ffffff",
          strokeWidth: 2,
        },
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: { description: `Industry: ${industry}` },
    });

    // Source-Specific Reduction Nodes
    let yOffset = baseY + stepY;
    sources.forEach((source, index) => {
      const reductionActions = {
        electricity: "Upgrade to energy-efficient appliances",
        diesel: "Replace with electric alternatives",
        naturalGas: "Install carbon capture systems",
        solar: "Expand solar panel coverage",
      };
      nodes.push({
        id: `3-${index}`,
        shape: "rect",
        x: baseX + 2 * stepX,
        y: yOffset,
        width: 150,
        height: 50,
        label: `${source.charAt(0).toUpperCase() + source.slice(1)} Reduction`,
        attrs: {
          body: { fill: "#ffffff", stroke: "#1e3c72", strokeWidth: 2 },
          label: { fill: "#1e3c72", fontSize: 12, fontWeight: "bold" },
        },
        data: {
          description: reductionActions[source],
          checked: localChecklist[`${source}-reduction`] || false,
        },
      });
      yOffset += stepY;
    });

    // Sustainability and KPI Node
    nodes.push({
      id: "4",
      shape: "rect",
      x: baseX + 3 * stepX,
      y: baseY + stepY,
      width: 150,
      height: 50,
      label: "Sustainability & KPIs",
      attrs: {
        body: { fill: "#ffc107", stroke: "#ffffff", strokeWidth: 2 },
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: {
        description: `KPIs: Reduce by ${
          percentage > 50 ? "50%" : "20%"
        }, Renewable Adoption: ${sources.includes("solar") ? "High" : "Low"}`,
      },
    });

    // Monitoring Node
    nodes.push({
      id: "5",
      shape: "rect",
      x: baseX + 4 * stepX,
      y: baseY + stepY,
      width: 150,
      height: 50,
      label: "Monitor Progress",
      attrs: {
        body: { fill: "#28a745", stroke: "#ffffff", strokeWidth: 2 },
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: { description: "Review monthly, adjust strategy" },
    });

    // Edges
    const edges = [
      {
        source: "1",
        target: "2",
        attrs: {
          line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
        },
      },
    ];
    sources.forEach((_, index) => {
      edges.push({
        source: "2",
        target: `3-${index}`,
        attrs: {
          line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
        },
      });
    });
    edges.push({
      source: `3-${sources.length - 1}`,
      target: "4",
      attrs: {
        line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
      },
    });
    edges.push({
      source: "4",
      target: "5",
      attrs: {
        line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
      },
    });

    // Add nodes and edges
    graph.addNodes(nodes);
    graph.addEdges(edges);

    // Auto-scroll to Monitor Progress node on load
    const monitorNode = graph.getCellById("5");
    if (monitorNode) {
      graph.centerCell(monitorNode, { animate: true, duration: 500 }); // Smooth scroll to "Monitor Progress"
    }

    // Add click event for checklist and scroll to clicked node
    graph.on("node:click", ({ e, node }) => {
      const data = node.data;
      if (data.checked !== undefined) {
        const newChecklist = {
          ...localChecklist,
          [`${node.id}-reduction`]: !data.checked,
        };
        setLocalChecklist(newChecklist);
        updateChecklist(newChecklist);
        node.updateData({ ...data, checked: !data.checked });
        graph.refresh();
      }
      const description = data.description || "No additional info";
      console.log("Clicked node:", node.data.label, description, data.checked);
      alert(
        `${node.data.label}\nDetails: ${description}\n${
          data.checked ? "Completed" : "Pending"
        }`
      );
      graph.centerCell(node, { animate: true, duration: 500 }); // Scroll to clicked node
    });

    // Cleanup
    return () => {
      graph.dispose();
    };
  }, [result, localChecklist, updateChecklist]);

  return (
    <div
      className="flowchart-container"
      style={{ border: "2px solid red", overflow: "auto" }}
    >
      <h2 style={{ color: "white" }}>Carbon Reduction Roadmap</h2>
      <div ref={graphRef} />
      <div style={{ color: "white" }}>
        Debug: Flowchart for {industry}, Category: {category}. Checklist:{" "}
        {JSON.stringify(localChecklist)}.
      </div>
    </div>
  );
};

export default FlowchartView;
