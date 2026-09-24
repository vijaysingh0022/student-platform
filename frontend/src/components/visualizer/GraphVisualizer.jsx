import React from "react";
import { SAMPLE_GRAPH } from "../../utils/algorithmStepGenerators.js";

const GraphVisualizer = ({ stepData, algorithmId }) => {
  const nodes = SAMPLE_GRAPH.nodes;
  const edges = SAMPLE_GRAPH.edges;

  if (!stepData) return null;

  const distances = stepData.distances || {};
  const visited = new Set(stepData.visited || stepData.inMST || []);
  const currentNode = stepData.currentNode;
  const activeEdge = stepData.activeEdge;
  const relaxation = stepData.relaxation;
  const shortestPathEdges = stepData.shortestPath || [];
  const mstEdges = stepData.mstEdges || [];
  const treeEdges = stepData.treeEdges || [];

  // Helper to check if edge is part of a list
  const isEdgeInList = (edge, list) => {
    return list.some(
      (e) =>
        (e.source === edge.source && e.target === edge.target) ||
        (e.source === edge.target && e.target === edge.source)
    );
  };

  const isShortestPathEdge = (edge) => isEdgeInList(edge, shortestPathEdges);
  const isMSTEdge = (edge) => isEdgeInList(edge, mstEdges);
  const isTreeEdge = (edge) => isEdgeInList(edge, treeEdges);
  const isActiveEdge = (edge) =>
    activeEdge &&
    ((activeEdge.source === edge.source && activeEdge.target === edge.target) ||
      (activeEdge.source === edge.target && activeEdge.target === edge.source));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 🌟 SPECIAL DIJKSTRA RELAXATION FORMULA CALLOUT */}
      {relaxation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-300 shadow-md animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚡</span>
            <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
              Edge Relaxation Operation: Node {relaxation.u} → Node {relaxation.v} (Weight: {relaxation.weight})
            </span>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-3 font-mono text-xs sm:text-sm font-bold shadow-inner my-2">
            {relaxation.formula}
          </div>

          <p className="text-xs font-bold text-slate-800 leading-relaxed">
            {relaxation.updated ? (
              <span className="text-emerald-700">
                ✅ Updated! Distance to Node {relaxation.v} reduced from {relaxation.oldDist === Infinity ? "∞" : relaxation.oldDist} to{" "}
                <span className="text-emerald-900 font-extrabold text-sm underline">{relaxation.newDist}</span>.
              </span>
            ) : (
              <span className="text-amber-800">
                ℹ️ No Change. Existing distance ({relaxation.oldDist}) is already ≤ new path distance ({relaxation.newDist}).
              </span>
            )}
          </p>
        </div>
      )}

      {/* SVG GRAPH CANVAS */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col items-center">
        <svg viewBox="0 0 660 300" className="w-full max-w-2xl h-auto overflow-visible">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((e, idx) => {
            const sourceNode = nodes.find((n) => n.id === e.source);
            const targetNode = nodes.find((n) => n.id === e.target);

            const isShortest = isShortestPathEdge(e);
            const isMst = isMSTEdge(e);
            const isTree = isTreeEdge(e);
            const isActive = isActiveEdge(e);

            let strokeColor = "#334155"; // slate-700
            let strokeWidth = 3;
            let strokeDasharray = "none";

            if (isShortest) {
              strokeColor = "#10b981"; // emerald-500
              strokeWidth = 6;
            } else if (isMst || isTree) {
              strokeColor = "#8b5cf6"; // violet-500
              strokeWidth = 5;
            } else if (isActive) {
              strokeColor = "#f59e0b"; // amber-500
              strokeWidth = 5;
              strokeDasharray = "6,6";
            }

            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            return (
              <g key={idx} className="transition-all duration-300">
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.targetNode}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  className="transition-all duration-300"
                />
                {/* Edge Weight Label */}
                <rect
                  x={midX - 12}
                  y={midY - 12}
                  width="24"
                  height="24"
                  rx="6"
                  fill="#0f172a"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((n) => {
            const isCurrent = currentNode === n.id;
            const isVisitedNode = visited.has(n.id);
            const nodeDist = distances[n.id];

            let fill = "#1e293b"; // slate-800
            let stroke = "#475569";
            let textColor = "#ffffff";

            if (isCurrent) {
              fill = "#f59e0b"; // amber-500
              stroke = "#fbbf24";
              textColor = "#000000";
            } else if (isVisitedNode) {
              fill = "#7c3aed"; // violet-600
              stroke = "#a78bfa";
              textColor = "#ffffff";
            }

            return (
              <g key={n.id} className="cursor-pointer transition-all duration-300">
                {/* Outer halo if current */}
                {isCurrent && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="28"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="22"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="3"
                  className="transition-all duration-300 shadow-lg"
                />

                {/* Node Label */}
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="14"
                  fontWeight="900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {n.label}
                </text>

                {/* Distance Badge for Dijkstra */}
                {algorithmId === "dijkstra" && nodeDist !== undefined && (
                  <g>
                    <rect
                      x={n.x - 22}
                      y={n.y - 38}
                      width="44"
                      height="18"
                      rx="5"
                      fill="#0284c7"
                      stroke="#38bdf8"
                      strokeWidth="1"
                    />
                    <text
                      x={n.x}
                      y={n.y - 25}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {nodeDist === Infinity ? "dist: ∞" : `d: ${nodeDist}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* DISTANCES TABLE FOR DIJKSTRA */}
      {algorithmId === "dijkstra" && Object.keys(distances).length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">
            Tentative Distance Table:
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(distances).map(([nodeId, distVal]) => (
              <div
                key={nodeId}
                className={`p-2 rounded-xl border text-center ${
                  currentNode === nodeId
                    ? "bg-amber-100 border-amber-300 text-amber-900 font-extrabold"
                    : visited.has(nodeId)
                    ? "bg-violet-50 border-violet-200 text-violet-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="text-xs font-black">Node {nodeId}</div>
                <div className="text-sm font-extrabold mt-0.5">
                  {distVal === Infinity ? "∞" : distVal}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;
