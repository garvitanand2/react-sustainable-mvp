import React, { useEffect, useRef, useState } from "react";
import { Graph } from "@antv/x6";
import "../../src/styles/dashboard.css";

const FlowchartView = ({ result, checklist, updateChecklist }) => {
  const graphRef = useRef(null);
  const [localChecklist, setLocalChecklist] = useState(checklist);

  const {
    emission,
    percentage,
    category,
    industry,
    employees,
    area,
    energy,
    sources,
  } = result || {
    emission: 0,
    percentage: 0,
    category: "Eco-friendly",
    industry: "",
    employees: 0,
    area: 0,
    energy: 0,
    sources: [],
  };

  useEffect(() => {
    if (!graphRef.current) return;

    const graph = new Graph({
      container: graphRef.current,
      width: 1200,
      height: 1000,
      background: { color: "#1A1A2E" }, // Updated to Midnight Black
      grid: true,
      panning: true,
      mousewheel: { enabled: true },
    });

    // Dynamic nodes based on industry, usage, and category
    const nodes = [];
    const baseX = 100;
    const baseY = 50;
    const stepY = 120;
    const stepX = 300;
    let maxSubActions = 0; // Track max sub-actions for layout

    // 1. Initial Assessment Node
    nodes.push({
      id: "1",
      shape: "rect",
      x: baseX,
      y: baseY,
      width: 180,
      height: 60,
      label: "Footprint Assessment",
      attrs: {
        body: { fill: "#7B9E89", stroke: "#ffffff", strokeWidth: 2 }, // Forest Mist
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: {
        description: `Emission: ${emission} kg CO2e, %: ${percentage.toFixed(
          1
        )}%, Employees: ${employees}, Area: ${area} sq.ft, Energy: ${energy} kWh`,
      },
    });

    // 2. Industry-Specific Strategy Node
    const industryStrategies = {
      healthcare: {
        strategy: "Optimize medical waste management",
        subActions: ["Upgrade HVAC systems", "Reduce single-use plastics"],
      },
      tech: {
        strategy: "Enhance data center efficiency",
        subActions: ["Virtualize servers", "Use energy-efficient hardware"],
      },
      manufacturing: {
        strategy: "Adopt sustainable production",
        subActions: ["Recycle materials", "Use low-emission machinery"],
      },
      oilGas: {
        strategy: "Transition to cleaner energy",
        subActions: ["Install carbon capture", "Phase out fossil fuels"],
      },
    };
    const strategyData = industryStrategies[industry] || {
      strategy: "General Sustainability",
      subActions: ["Reduce energy use", "Improve efficiency"],
    };
    nodes.push({
      id: "2",
      shape: "rect",
      x: baseX + stepX,
      y: baseY,
      width: 300,
      height: 60,
      label: `${strategyData.strategy}`,
      attrs: {
        body: {
          fill:
            category === "High"
              ? "#FF6F61" // Sunset Orange
              : category === "Medium"
              ? "#FFA726" // Orange
              : "#7B9E89", // Forest Mist
          stroke: "#ffffff",
          strokeWidth: 2,
        },
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: { description: `Industry: ${industry}` },
    });

    // 3. Source-Specific Reduction Nodes with Sub-Actions
    let yOffset = baseY + stepY;
    const sourceNodes = {};
    sources.forEach((source, index) => {
      const reductionActions = {
        electricity: {
          action: "Optimize electrical usage",
          subActions: [
            "Install smart meters",
            `Reduce by ${Math.min(energy * 0.1, 500)} kWh with LED lighting`,
            "Schedule high-use equipment off-peak",
          ],
        },
        diesel: {
          action: "Phase out diesel",
          subActions: [
            "Switch to electric generators",
            `Replace ${Math.min(employees / 10, 5)} diesel units`,
            "Use biofuels as interim",
          ],
        },
        naturalGas: {
          action: "Reduce gas dependency",
          subActions: [
            "Install heat pumps",
            `Convert ${Math.min(area / 1000, 2)} boilers to electric`,
            "Adopt hybrid heating",
          ],
        },
        solar: {
          action: "Expand solar capacity",
          subActions: [
            `Add ${Math.min(energy / 1000, 10)} kW solar panels`,
            "Integrate battery storage",
            "Incentivize employee solar use",
          ],
        },
      };
      const actionData = reductionActions[source];
      maxSubActions = Math.max(maxSubActions, actionData.subActions.length);
      nodes.push({
        id: `3-${index}`,
        shape: "rect",
        x: baseX + 2 * stepX,
        y: yOffset,
        width: 300,
        height: 60,
        label: `${source.charAt(0).toUpperCase() + source.slice(1)} Reduction`,
        attrs: {
          body: { fill: "#4A4E69", stroke: "#ffffff", strokeWidth: 2 }, // Slate Gray
          label: { fill: "#ffffff", fontSize: 12, fontWeight: "bold" },
        },
        data: {
          description: actionData.action,
          subActions: actionData.subActions,
          checked: localChecklist[`${source}-reduction`] || false,
        },
      });
      sourceNodes[`3-${index}`] = {
        y: yOffset,
        subActions: actionData.subActions.map((_, subIndex) => ({
          id: `3-${index}-sub${subIndex}`,
          y: yOffset + subIndex * 60,
        })),
      };
      actionData.subActions.forEach((subAction, subIndex) => {
        nodes.push({
          id: `3-${index}-sub${subIndex}`,
          shape: "rect",
          x: baseX + 2 * stepX + 200,
          y: yOffset + subIndex * 60,
          width: 300,
          height: 50,
          label: subAction,
          attrs: {
            body: { fill: "#ffffff", stroke: "#4A4E69", strokeWidth: 1 },
            label: { fill: "#4A4E69", fontSize: 10, fontWeight: "normal" },
          },
          data: {
            checked: localChecklist[`${source}-sub${subIndex}`] || false,
          },
        });
      });
      yOffset += stepY + (actionData.subActions.length - 1) * 60;
    });

    // 4. Sustainability Assessment and KPIs
    const kpiY = baseY + 2 * stepY + Math.max(0, (maxSubActions - 3) * 30); // Adjust for sub-node height
    nodes.push({
      id: "4",
      shape: "rect",
      x: baseX + 3 * stepX,
      y: kpiY,
      width: 300,
      height: 80,
      label: "Sustainability & KPIs",
      attrs: {
        body: { fill: "#FFC107", stroke: "#ffffff", strokeWidth: 2 }, // Golden Glow
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: {
        description: `KPIs: Reduce by ${
          percentage > 50 ? "50%" : "20%"
        }, Renewable Adoption: ${
          sources.includes("solar")
            ? `${(energy / 1000).toFixed(1)} kW Target`
            : "0 kW"
        }, Employee Impact: ${employees > 100 ? "High" : "Low"}`,
      },
    });

    // 5. Monitoring and Review
    nodes.push({
      id: "5",
      shape: "rect",
      x: baseX + 4 * stepX,
      y: kpiY,
      width: 300,
      height: 60,
      label: "Monitor & Review",
      attrs: {
        body: { fill: "#7B9E89", stroke: "#ffffff", strokeWidth: 2 }, // Forest Mist
        label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
      },
      data: {
        description: `Monthly review, adjust for ${
          energy > 10000 ? "high energy" : "standard"
        } usage`,
      },
    });

    // 6. Long-Term Goals (for High/Medium categories)
    if (category === "High" || category === "Medium") {
      nodes.push({
        id: "6",
        shape: "rect",
        x: baseX + 4 * stepX,
        y: kpiY + stepY,
        width: 300,
        height: 60,
        label: "Long-Term Net Zero",
        attrs: {
          body: { fill: "#FF6F61", stroke: "#ffffff", strokeWidth: 2 }, // Sunset Orange
          label: { fill: "#ffffff", fontSize: 14, fontWeight: "bold" },
        },
        data: {
          description: "Achieve net zero by 2035 with full renewable shift",
        },
      });
    }

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

    // Connect strategy to source reduction nodes
    let lastSourceId = null;
    sources.forEach((_, index) => {
      const sourceId = `3-${index}`;
      edges.push({
        source: "2",
        target: sourceId,
        attrs: {
          line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
        },
      });
      lastSourceId = sourceId;
      const subActions = industryStrategies[industry]?.subActions || [];
      subActions.forEach((_, subIndex) => {
        edges.push({
          source: sourceId,
          target: `${sourceId}-sub${subIndex}`,
          attrs: {
            line: {
              stroke: "#4A4E69",
              strokeWidth: 1,
              targetMarker: "classic",
            },
          },
        });
      });
    });

    // Connect last source reduction to KPIs
    if (lastSourceId) {
      edges.push({
        source: lastSourceId,
        target: "4",
        attrs: {
          line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
        },
      });
    }

    // Connect KPIs to Monitor & Review
    edges.push({
      source: "4",
      target: "5",
      attrs: {
        line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
      },
    });

    // Connect Monitor & Review to Long-Term Goals (if applicable)
    if (category === "High" || category === "Medium") {
      edges.push({
        source: "5",
        target: "6",
        attrs: {
          line: { stroke: "#ffffff", strokeWidth: 2, targetMarker: "classic" },
        },
      });
    }

    // Add nodes and edges
    graph.addNodes(nodes);
    graph.addEdges(edges);

    // Auto-scroll to Monitor Progress or Long-Term node
    const targetNodeId =
      category === "High" || category === "Medium" ? "6" : "5";
    const targetNode = graph.getCellById(targetNodeId);
    if (targetNode) {
      graph.centerCell(targetNode, { animate: true, duration: 500 });
    }

    // Add click event for checklist and scroll
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
      graph.centerCell(node, { animate: true, duration: 500 });
    });

    // Cleanup
    return () => {
      graph.dispose();
    };
  }, [result, localChecklist, updateChecklist]);

  return (
    <div className="flowchart-container" style={{ overflow: "auto" }}>
      <h2 style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>
        Carbon Reduction Roadmap
      </h2>
      <div ref={graphRef} />
      <div style={{ color: "#ffffff", textAlign: "center" }}>
        Debug: Flowchart for {industry}, Category: {category}. Checklist:{" "}
        {JSON.stringify(localChecklist)}.
      </div>
    </div>
  );
};

export default FlowchartView;
