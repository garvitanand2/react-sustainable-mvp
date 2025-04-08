import React, { useEffect, useRef } from "react";
import { Graph } from "@antv/x6";
import "../../src/styles/dashboard.css";

const FlowchartView = () => {
  const graphRef = useRef(null);

  useEffect(() => {
    // Initialize the graph
    const graph = new Graph({
      container: graphRef.current,
      width: 800,
      height: 600,
      background: {
        color: "#1e3c72", // Match the gradient background
      },
      grid: true,
    });

    // Define nodes
    const nodes = [
      {
        id: "1",
        shape: "rect",
        x: 250,
        y: 0,
        width: 120,
        height: 40,
        label: "Start",
        attrs: {
          body: {
            fill: "#28a745",
            stroke: "#ffffff",
            strokeWidth: 2,
          },
          label: {
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          },
        },
      },
      {
        id: "2",
        shape: "rect",
        x: 250,
        y: 100,
        width: 120,
        height: 40,
        label: "Reduce",
        attrs: {
          body: {
            fill: "#ffffff",
            stroke: "#1e3c72",
            strokeWidth: 2,
          },
          label: {
            fill: "#1e3c72",
            fontSize: 14,
            fontWeight: "bold",
          },
        },
      },
      {
        id: "3",
        shape: "rect",
        x: 250,
        y: 200,
        width: 120,
        height: 40,
        label: "End",
        attrs: {
          body: {
            fill: "#dc3545",
            stroke: "#ffffff",
            strokeWidth: 2,
          },
          label: {
            fill: "#ffffff",
            fontSize: 14,
            fontWeight: "bold",
          },
        },
      },
    ];

    // Define edges
    const edges = [
      {
        source: "1",
        target: "2",
        connector: "normal",
        attrs: {
          line: {
            stroke: "#ffffff",
            strokeWidth: 2,
            targetMarker: "classic",
          },
        },
      },
      {
        source: "2",
        target: "3",
        connector: "normal",
        attrs: {
          line: {
            stroke: "#ffffff",
            strokeWidth: 2,
            targetMarker: "classic",
          },
        },
      },
    ];

    // Add nodes and edges to the graph
    graph.addNodes(nodes);
    graph.addEdges(edges);

    // Add click event
    graph.on("node:click", ({ e, node }) => {
      console.log("Clicked node:", node.data.label || node.getData().label);
      alert(`Clicked ${node.data.label || node.getData().label}`);
    });

    // Cleanup on unmount
    return () => {
      graph.dispose();
    };
  }, []);

  return (
    <div className="flowchart-container" style={{ border: "2px solid red" }}>
      <h2 style={{ color: "white" }}>Flowchart with X6</h2>
      <div ref={graphRef} />
      <div style={{ color: "white" }}>
        Debug: Flowchart should be above this. Check console for errors.
      </div>
    </div>
  );
};

export default FlowchartView;
