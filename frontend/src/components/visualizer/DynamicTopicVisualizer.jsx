import React, { useMemo } from "react";
import BSTVisualizer from "./BSTVisualizer.jsx";
import NormalizationVisualizer from "./NormalizationVisualizer.jsx";
import ArchitectureVisualizer from "./ArchitectureVisualizer.jsx";
import FunctionalDependencyVisualizer from "./FunctionalDependencyVisualizer.jsx";
import SQLJoinVisualizer from "./SQLJoinVisualizer.jsx";
import PagingVisualizer from "./PagingVisualizer.jsx";
import ProcessSchedulingVisualizer from "./ProcessSchedulingVisualizer.jsx";
import BinarySearchInteractiveVisualizer from "./BinarySearchInteractiveVisualizer.jsx";
import StackQueueVisualizer from "./StackQueueVisualizer.jsx";
import GraphVisualizer from "./GraphVisualizer.jsx";
import GenericConceptVisualizer from "./GenericConceptVisualizer.jsx";

/**
 * Dynamic Topic-Aware Visualizer Dispatcher
 * Resolves appropriate interactive component based on topicId, title, and subjectId.
 * NEVER defaults to an unrelated hardcoded component like BST.
 */
const DynamicTopicVisualizer = ({ topicId = "", topicTitle = "", subjectId = "", subjectName = "" }) => {
  const normTopic = (topicId + " " + topicTitle).toLowerCase();
  const normSub = (subjectId + " " + subjectName).toLowerCase();

  const visualizerType = useMemo(() => {
    // 1. DBMS 3-Schema Architecture & Data Independence
    if (
      normTopic.includes("3-schema") ||
      normTopic.includes("three-schema") ||
      normTopic.includes("architecture") ||
      normTopic.includes("independence")
    ) {
      return "architecture";
    }

    // 2. Normalization (1NF, 2NF, 3NF, BCNF)
    if (
      normTopic.includes("normalization") ||
      normTopic.includes("normal form") ||
      normTopic.includes("1nf") ||
      normTopic.includes("2nf") ||
      normTopic.includes("3nf") ||
      normTopic.includes("bcnf")
    ) {
      return "normalization";
    }

    // 3. Functional Dependency & Attribute Closure
    if (
      normTopic.includes("functional dependency") ||
      normTopic.includes("fd") ||
      normTopic.includes("attribute closure") ||
      normTopic.includes("armstrong")
    ) {
      return "functional_dependency";
    }

    // 4. SQL JOIN (Inner, Left, Right, Full)
    if (
      normTopic.includes("join") ||
      normTopic.includes("sql join") ||
      normTopic.includes("relational algebra")
    ) {
      return "sql_join";
    }

    // 5. OS Paging & Virtual Memory
    if (
      normTopic.includes("paging") ||
      normTopic.includes("page table") ||
      normTopic.includes("virtual memory") ||
      normTopic.includes("tlb") ||
      normTopic.includes("frame")
    ) {
      return "os_paging";
    }

    // 6. CPU Scheduling & Gantt Chart
    if (
      normTopic.includes("schedul") ||
      normTopic.includes("round robin") ||
      normTopic.includes("fcfs") ||
      normTopic.includes("sjf") ||
      normTopic.includes("priority") ||
      normTopic.includes("gantt")
    ) {
      return "cpu_scheduling";
    }

    // 7. Binary Search
    if (
      normTopic.includes("binary search") &&
      !normTopic.includes("tree")
    ) {
      return "binary_search";
    }

    // 8. Binary Search Tree (BST)
    if (
      normTopic.includes("bst") ||
      normTopic.includes("binary search tree") ||
      normTopic.includes("binary tree")
    ) {
      return "bst";
    }

    // 9. Stacks & Queues
    if (
      normTopic.includes("stack") ||
      normTopic.includes("queue") ||
      normTopic.includes("deque")
    ) {
      return "stack_queue";
    }

    // 10. Graphs & Traversals (Dijkstra, BFS, DFS)
    if (
      normTopic.includes("graph") ||
      normTopic.includes("dijkstra") ||
      normTopic.includes("bfs") ||
      normTopic.includes("dfs") ||
      normTopic.includes("mst")
    ) {
      return "graph";
    }

    // Topic-aware fallback: NEVER hard-coded BST!
    return "generic_concept";
  }, [normTopic]);

  switch (visualizerType) {
    case "architecture":
      return <ArchitectureVisualizer />;
    case "normalization":
      return <NormalizationVisualizer />;
    case "functional_dependency":
      return <FunctionalDependencyVisualizer />;
    case "sql_join":
      return <SQLJoinVisualizer />;
    case "os_paging":
      return <PagingVisualizer />;
    case "cpu_scheduling":
      return <ProcessSchedulingVisualizer />;
    case "binary_search":
      return <BinarySearchInteractiveVisualizer />;
    case "bst":
      return <BSTVisualizer />;
    case "stack_queue":
      return <StackQueueVisualizer />;
    case "graph":
      return (
        <GraphVisualizer
          stepData={{
            distances: { A: 0, B: 4, C: 2, D: 7, E: 5 },
            visited: ["A", "C", "B"],
            currentNode: "B",
            activeEdge: { source: "B", target: "E", weight: 1 },
            relaxation: {
              u: "B",
              v: "E",
              weight: 1,
              formula: "dist[E] = min(dist[E], dist[B] + weight(B, E)) => min(∞, 4 + 1) = 5",
              updated: true,
              oldDist: Infinity,
              newDist: 5,
            },
          }}
          algorithmId="dijkstra"
        />
      );
    case "generic_concept":
    default:
      return (
        <GenericConceptVisualizer
          topicTitle={topicTitle || "Concept Flow & Invariants"}
          subjectName={subjectName || "Computer Science"}
        />
      );
  }
};

export default DynamicTopicVisualizer;
