import React, { useState } from "react";

// Binary Search Tree Node Class
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

const buildInitialBST = () => {
  const root = new TreeNode(50);
  root.left = new TreeNode(30);
  root.right = new TreeNode(70);
  root.left.left = new TreeNode(20);
  root.left.right = new TreeNode(40);
  root.right.left = new TreeNode(60);
  root.right.right = new TreeNode(80);
  return root;
};

const BSTVisualizer = () => {
  const [tree, setTree] = useState(buildInitialBST);
  const [inputVal, setInputVal] = useState("");
  const [activeSearchVal, setActiveSearchVal] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Tree initialized. Try inserting or searching for a value.");
  const [traversalResult, setTraversalResult] = useState([]);
  const [showMeStep, setShowMeStep] = useState(0);
  const [isShowMeActive, setIsShowMeActive] = useState(false);

  // Show Me insertion sequence: 50 -> 30 -> 70 -> 20 -> 40 -> 60 -> 80
  const showMeSequence = [
    { val: 50, desc: "Step 1: Start with root node 50" },
    { val: 30, desc: "Step 2: Insert 30 (30 < 50, so attach to Left)" },
    { val: 70, desc: "Step 3: Insert 70 (70 > 50, so attach to Right)" },
    { val: 20, desc: "Step 4: Insert 20 (20 < 50 -> goes Left to 30 -> 20 < 30 -> attach to Left of 30)" },
    { val: 40, desc: "Step 5: Insert 40 (40 < 50 -> goes Left to 30 -> 40 > 30 -> attach to Right of 30)" },
  ];

  // Insert a value into BST
  const insertNode = (root, val) => {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = insertNode(root.left, val);
    else if (val > root.val) root.right = insertNode(root.right, val);
    return root;
  };

  const handleInsert = (e) => {
    if (e) e.preventDefault();
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;

    const newRoot = insertNode(tree, val);
    setTree({ ...newRoot });
    setInputVal("");
    setStatusMessage(`Node ${val} inserted into BST!`);
    setHighlightedNodes([val]);
  };

  // Search node with path animation
  const handleSearch = (target) => {
    const val = parseInt(target || inputVal, 10);
    if (isNaN(val)) return;

    const path = [];
    let curr = tree;
    let found = false;

    while (curr) {
      path.push(curr.val);
      if (curr.val === val) {
        found = true;
        break;
      }
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }

    setHighlightedNodes(path);
    setActiveSearchVal(val);
    setStatusMessage(
      found
        ? `Found ${val}! Search path: ${path.join(" → ")} (Took ${path.length} comparisons, O(log N) time).`
        : `Value ${val} not found in BST. Visited path: ${path.join(" → ")}.`
    );
  };

  // Traversals
  const runTraversal = (type) => {
    const result = [];
    const inOrder = (n) => {
      if (!n) return;
      inOrder(n.left);
      result.push(n.val);
      inOrder(n.right);
    };
    const preOrder = (n) => {
      if (!n) return;
      result.push(n.val);
      preOrder(n.left);
      preOrder(n.right);
    };
    const postOrder = (n) => {
      if (!n) return;
      postOrder(n.left);
      postOrder(n.right);
      result.push(n.val);
    };

    if (type === "inorder") {
      inOrder(tree);
      setStatusMessage("In-Order Traversal (Left → Root → Right) always yields SORTED numbers!");
    } else if (type === "preorder") {
      preOrder(tree);
      setStatusMessage("Pre-Order Traversal: Root → Left → Right");
    } else {
      postOrder(tree);
      setStatusMessage("Post-Order Traversal: Left → Right → Root");
    }
    setTraversalResult(result);
  };

  // Reset
  const handleReset = () => {
    setTree(buildInitialBST());
    setHighlightedNodes([]);
    setActiveSearchVal(null);
    setTraversalResult([]);
    setIsShowMeActive(false);
    setShowMeStep(0);
    setStatusMessage("BST reset to default balanced state.");
  };

  // Show Me Step Handler
  const handleShowMeNext = () => {
    if (showMeStep >= showMeSequence.length - 1) {
      setIsShowMeActive(false);
      setShowMeStep(0);
      setStatusMessage("Show Me demonstration completed! Now try inserting values yourself.");
      return;
    }
    const nextStep = showMeStep + 1;
    setShowMeStep(nextStep);
    setStatusMessage(showMeSequence[nextStep].desc);
    setHighlightedNodes([showMeSequence[nextStep].val]);
  };

  // Render SVG nodes coordinates
  const renderTreeSvg = () => {
    const nodes = [];
    const links = [];

    const traverse = (node, x, y, dx) => {
      if (!node) return;

      if (node.left) {
        const nextX = x - dx;
        const nextY = y + 70;
        links.push({ x1: x, y1: y, x2: nextX, y2: nextY });
        traverse(node.left, nextX, nextY, dx / 1.9);
      }

      if (node.right) {
        const nextX = x + dx;
        const nextY = y + 70;
        links.push({ x1: x, y1: y, x2: nextX, y2: nextY });
        traverse(node.right, nextX, nextY, dx / 1.9);
      }

      nodes.push({ val: node.val, x, y });
    };

    traverse(tree, 250, 45, 110);

    return (
      <svg className="w-full h-72 sm:h-80 select-none" viewBox="0 0 500 280">
        {/* Branch Lines */}
        {links.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {/* Nodes */}
        {nodes.map((n) => {
          const isHighlighted = highlightedNodes.includes(n.val);
          const isTarget = activeSearchVal === n.val;

          return (
            <g key={n.val} className="cursor-pointer" onClick={() => handleSearch(n.val)}>
              <circle
                cx={n.x}
                cy={n.y}
                r="20"
                fill={isTarget ? "#10b981" : isHighlighted ? "#3b82f6" : "#ffffff"}
                stroke={isTarget ? "#059669" : isHighlighted ? "#1d4ed8" : "#94a3b8"}
                strokeWidth="2.5"
                className="transition-all duration-300 drop-shadow-xs"
              />
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fill={isHighlighted || isTarget ? "#ffffff" : "#0f172a"}
                fontSize="12"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
              >
                {n.val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Interactive Data Structure Lab
            </span>
            <span className="text-xs font-semibold text-slate-400">DSA · Trees</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Binary Search Tree (BST) Visualizer
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Test node insertion, search paths, and sorted traversals with live animations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsShowMeActive(true);
              setShowMeStep(0);
              setStatusMessage(showMeSequence[0].desc);
              setHighlightedNodes([showMeSequence[0].val]);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>"Show Me" Insertion</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            Reset Tree
          </button>
        </div>
      </div>

      {/* Show Me Bar */}
      {isShowMeActive && (
        <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 flex items-center justify-between gap-4">
          <div className="text-xs text-indigo-900 font-bold">
            💡 {showMeSequence[showMeStep].desc}
          </div>
          <button
            onClick={handleShowMeNext}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shrink-0"
          >
            {showMeStep === showMeSequence.length - 1 ? "Finish ✓" : "Next Step →"}
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80">
        <form onSubmit={handleInsert} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter a number (e.g. 25)..."
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs shrink-0"
          >
            + Insert
          </button>
          <button
            type="button"
            onClick={() => handleSearch(inputVal)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs shrink-0"
          >
            🔍 Search
          </button>
        </form>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => runTraversal("inorder")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            In-Order (Sorted)
          </button>
          <button
            onClick={() => runTraversal("preorder")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            Pre-Order
          </button>
          <button
            onClick={() => runTraversal("postorder")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            Post-Order
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center relative overflow-hidden">
        {renderTreeSvg()}
      </div>

      {/* Status & Traversal output */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/60">
          💬 <strong>Status:</strong> {statusMessage}
        </div>

        {traversalResult.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-1">
            <span className="text-slate-400 font-bold">Traversal Output Sequence:</span>
            <div className="text-emerald-400 font-extrabold tracking-wider">
              [ {traversalResult.join("  →  ")} ]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BSTVisualizer;
