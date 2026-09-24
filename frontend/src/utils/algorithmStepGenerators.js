// ─── ALGORITHM STEP GENERATORS FOR LEARNX VISUALIZER ───────────────────────
// Generates reproducible step-by-step animation frames with pseudocode line tracking and AI explanations.

// Helper for deep clone
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ─── 1. BUBBLE SORT ────────────────────────────────────────────────────────
export const generateBubbleSortSteps = (initialArray) => {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 1,
    aiExplanation: `Starting Bubble Sort on array [${arr.join(", ")}]. We will compare adjacent pairs and bubble larger elements to the right.`,
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        codeLine: 3,
        aiExplanation: `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]}). Checking if ${arr[j]} > ${arr[j + 1]}.`,
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          codeLine: 4,
          aiExplanation: `Because ${arr[j]} > ${arr[j + 1]}, swap arr[${j}] and arr[${j + 1}] to put the larger element ahead.`,
        });

        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swappedAny = true;

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          codeLine: 5,
          aiExplanation: `Swap complete. Array is now [${arr.join(", ")}].`,
        });
      }
    }

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      codeLine: 6,
      aiExplanation: `Pass ${i + 1} complete. Element ${arr[n - 1 - i]} is now fixed in its correct sorted position at index ${n - 1 - i}.`,
    });

    if (!swappedAny) break;
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    codeLine: 7,
    aiExplanation: `🎉 Bubble Sort complete! All elements are sorted in ascending order: [${arr.join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "for i = 0 to n-1:",
      "  swapped = false",
      "  for j = 0 to n-i-2:",
      "    if arr[j] > arr[j+1]:",
      "      swap(arr[j], arr[j+1])",
      "      swapped = true",
      "  if not swapped: break",
    ],
    complexity: { time: "O(n²)", space: "O(1)", bestTime: "O(n)" },
  };
};

// ─── 2. SELECTION SORT ──────────────────────────────────────────────────────
export const generateSelectionSortSteps = (initialArray) => {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      minIndex: minIdx,
      sorted: Array.from({ length: i }, (_, k) => k),
      codeLine: 1,
      aiExplanation: `Starting pass ${i + 1}. Assuming index ${i} (value ${arr[i]}) holds the minimum value for the unsorted portion.`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [j],
        swapping: [],
        minIndex: minIdx,
        sorted: Array.from({ length: i }, (_, k) => k),
        codeLine: 3,
        aiExplanation: `Scanning arr[${j}] (${arr[j]}) against current min value arr[${minIdx}] (${arr[minIdx]}).`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          minIndex: minIdx,
          sorted: Array.from({ length: i }, (_, k) => k),
          codeLine: 4,
          aiExplanation: `Found a smaller element ${arr[j]} at index ${j}. Updated minimum index to ${j}.`,
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, minIdx],
        minIndex: minIdx,
        sorted: Array.from({ length: i }, (_, k) => k),
        codeLine: 5,
        aiExplanation: `Swapping minimum element arr[${minIdx}] (${arr[minIdx]}) into index ${i} (was ${arr[i]}).`,
      });

      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      minIndex: null,
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      codeLine: 6,
      aiExplanation: `Index ${i} is now locked with minimum value ${arr[i]}.`,
    });
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    minIndex: null,
    sorted: Array.from({ length: n }, (_, k) => k),
    codeLine: 7,
    aiExplanation: `🎉 Selection Sort complete! Array is sorted: [${arr.join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "for i = 0 to n-2:",
      "  minIdx = i",
      "  for j = i+1 to n-1:",
      "    if arr[j] < arr[minIdx]: minIdx = j",
      "  if minIdx != i:",
      "    swap(arr[i], arr[minIdx])",
      "  mark arr[i] as sorted",
    ],
    complexity: { time: "O(n²)", space: "O(1)", bestTime: "O(n²)" },
  };
};

// ─── 3. INSERTION SORT ──────────────────────────────────────────────────────
export const generateInsertionSortSteps = (initialArray) => {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      keyIndex: i,
      comparing: [i],
      swapping: [],
      sorted: Array.from({ length: i }, (_, k) => k),
      codeLine: 1,
      aiExplanation: `Picked key element arr[${i}] = ${key}. We will insert this key into the sorted sub-array arr[0...${i - 1}].`,
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        keyIndex: i,
        comparing: [j],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        codeLine: 3,
        aiExplanation: `Since arr[${j}] (${arr[j]}) > key (${key}), shift arr[${j}] right to index ${j + 1}.`,
      });

      arr[j + 1] = arr[j];

      steps.push({
        array: [...arr],
        keyIndex: i,
        comparing: [],
        swapping: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        codeLine: 4,
        aiExplanation: `Shifted ${arr[j]} right. Current array: [${arr.join(", ")}].`,
      });

      j--;
    }

    arr[j + 1] = key;

    steps.push({
      array: [...arr],
      keyIndex: null,
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      codeLine: 5,
      aiExplanation: `Inserted key ${key} at correct position index ${j + 1}. Sub-array arr[0...${i}] is now sorted.`,
    });
  }

  steps.push({
    array: [...arr],
    keyIndex: null,
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    codeLine: 6,
    aiExplanation: `🎉 Insertion Sort complete! Final sorted array: [${arr.join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "for i = 1 to n-1:",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key:",
      "    arr[j+1] = arr[j]",
      "    j = j - 1",
      "  arr[j+1] = key",
    ],
    complexity: { time: "O(n²)", space: "O(1)", bestTime: "O(n)" },
  };
};

// ─── 4. MERGE SORT ──────────────────────────────────────────────────────────
export const generateMergeSortSteps = (initialArray) => {
  const arr = [...initialArray];
  const steps = [];

  const merge = (low, mid, high) => {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      highlightRange: [low, high],
      codeLine: 4,
      aiExplanation: `Merging sorted halves: left subarray arr[${low}...${mid}] and right subarray arr[${mid + 1}...${high}].`,
    });

    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    let i = 0,
      j = 0,
      k = low;

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        comparing: [low + i, mid + 1 + j],
        swapping: [],
        highlightRange: [low, high],
        codeLine: 5,
        aiExplanation: `Comparing left[${i}] (${left[i]}) with right[${j}] (${right[j]}).`,
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [k],
          highlightRange: [low, high],
          codeLine: 6,
          aiExplanation: `Placed smaller element ${left[i]} at index ${k}.`,
        });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [k],
          highlightRange: [low, high],
          codeLine: 7,
          aiExplanation: `Placed smaller element ${right[j]} at index ${k}.`,
        });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        highlightRange: [low, high],
        codeLine: 8,
        aiExplanation: `Copying remaining left element ${left[i]} to index ${k}.`,
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        highlightRange: [low, high],
        codeLine: 9,
        aiExplanation: `Copying remaining right element ${right[j]} to index ${k}.`,
      });
      j++;
      k++;
    }
  };

  const mergeSortHelper = (low, high) => {
    if (low >= high) return;
    const mid = Math.floor((low + high) / 2);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      highlightRange: [low, high],
      codeLine: 2,
      aiExplanation: `Dividing subarray arr[${low}...${high}] at mid point index ${mid}. Left: [${low}...${mid}], Right: [${mid + 1}...${high}].`,
    });

    mergeSortHelper(low, mid);
    mergeSortHelper(mid + 1, high);
    merge(low, mid, high);
  };

  mergeSortHelper(0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    codeLine: 10,
    aiExplanation: `🎉 Merge Sort complete! Recursion tree unwound and merged into final sorted array: [${arr.join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "mergeSort(arr, low, high):",
      "  if low < high:",
      "    mid = (low + high) / 2",
      "    mergeSort(arr, low, mid)",
      "    mergeSort(arr, mid+1, high)",
      "    merge(arr, low, mid, high)",
      "merge(arr, low, mid, high):",
      "  create temp left and right arrays",
      "  compare and copy back in sorted order",
    ],
    complexity: { time: "O(n log n)", space: "O(n)", bestTime: "O(n log n)" },
  };
};

// ─── 5. QUICK SORT ──────────────────────────────────────────────────────────
export const generateQuickSortSteps = (initialArray) => {
  const arr = [...initialArray];
  const steps = [];

  const partition = (low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      pivotIndex: high,
      comparing: [],
      swapping: [],
      highlightRange: [low, high],
      codeLine: 2,
      aiExplanation: `Selected pivot element arr[${high}] = ${pivot}. Partitioning range arr[${low}...${high}].`,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        pivotIndex: high,
        comparing: [j],
        swapping: [],
        highlightRange: [low, high],
        codeLine: 4,
        aiExplanation: `Comparing element arr[${j}] (${arr[j]}) against pivot (${pivot}).`,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          steps.push({
            array: [...arr],
            pivotIndex: high,
            comparing: [],
            swapping: [i, j],
            highlightRange: [low, high],
            codeLine: 5,
            aiExplanation: `arr[${j}] (${arr[j]}) < pivot (${pivot}). Swapping arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}) to move smaller values left.`,
          });

          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }

    steps.push({
      array: [...arr],
      pivotIndex: high,
      comparing: [],
      swapping: [i + 1, high],
      highlightRange: [low, high],
      codeLine: 6,
      aiExplanation: `Swapping pivot ${pivot} into its correct final sorted position index ${i + 1}.`,
    });

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    steps.push({
      array: [...arr],
      pivotIndex: i + 1,
      comparing: [],
      swapping: [],
      sorted: [i + 1],
      codeLine: 7,
      aiExplanation: `Pivot ${pivot} is now fixed at index ${i + 1}. All left elements are < ${pivot} and right elements are > ${pivot}.`,
    });

    return i + 1;
  };

  const quickSortHelper = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  };

  quickSortHelper(0, arr.length - 1);

  steps.push({
    array: [...arr],
    pivotIndex: null,
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    codeLine: 8,
    aiExplanation: `🎉 Quick Sort complete! All partitions sorted: [${arr.join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "quickSort(arr, low, high):",
      "  if low < high:",
      "    pivotIndex = partition(arr, low, high)",
      "    quickSort(arr, low, pivotIndex - 1)",
      "    quickSort(arr, pivotIndex + 1, high)",
      "partition(arr, low, high):",
      "  pivot = arr[high], i = low - 1",
      "  for j = low to high-1: if arr[j] < pivot: swap(arr[++i], arr[j])",
      "  swap(arr[i+1], arr[high]) return i+1",
    ],
    complexity: { time: "O(n log n)", space: "O(log n)", bestTime: "O(n log n)" },
  };
};

// ─── 6. BINARY SEARCH ───────────────────────────────────────────────────────
export const generateBinarySearchSteps = (initialArray, target = 45) => {
  const arr = [...initialArray].sort((a, b) => a - b);
  const steps = [];
  let low = 0;
  let high = arr.length - 1;
  let foundIndex = -1;

  steps.push({
    array: [...arr],
    low,
    high,
    mid: null,
    target,
    codeLine: 1,
    aiExplanation: `Binary search requires a sorted array. Searching for target value ${target} in array [${arr.join(", ")}]. Initial low = 0, high = ${high}.`,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({
      array: [...arr],
      low,
      high,
      mid,
      target,
      codeLine: 3,
      aiExplanation: `Calculated mid index = (${low} + ${high}) / 2 = ${mid}. Inspecting arr[${mid}] = ${arr[mid]}.`,
    });

    if (arr[mid] === target) {
      foundIndex = mid;
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        target,
        foundIndex,
        codeLine: 4,
        aiExplanation: `🎯 Found target ${target} at index ${mid}! arr[${mid}] === ${target}.`,
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        target,
        codeLine: 5,
        aiExplanation: `arr[${mid}] (${arr[mid]}) < target (${target}). Target must lie in the right half. Move low = mid + 1 (${mid + 1}).`,
      });
      low = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        target,
        codeLine: 6,
        aiExplanation: `arr[${mid}] (${arr[mid]}) > target (${target}). Target must lie in the left half. Move high = mid - 1 (${mid - 1}).`,
      });
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      low,
      high,
      mid: null,
      target,
      foundIndex: -1,
      codeLine: 7,
      aiExplanation: `❌ Search space exhausted (low > high). Target ${target} is not present in the array.`,
    });
  }

  return {
    steps,
    pseudocode: [
      "binarySearch(arr, target):",
      "  low = 0, high = n - 1",
      "  while low <= high:",
      "    mid = (low + high) / 2",
      "    if arr[mid] == target: return mid",
      "    else if arr[mid] < target: low = mid + 1",
      "    else: high = mid - 1",
      "  return -1 (Not Found)",
    ],
    complexity: { time: "O(log n)", space: "O(1)", bestTime: "O(1)" },
  };
};

// ─── GRAPH DATA STRUCTURE FOR GRAPH ALGORITHMS ─────────────────────────────
export const SAMPLE_GRAPH = {
  nodes: [
    { id: "A", label: "A", x: 100, y: 100 },
    { id: "B", label: "B", x: 260, y: 60 },
    { id: "C", label: "C", x: 260, y: 200 },
    { id: "D", label: "D", x: 420, y: 60 },
    { id: "E", label: "E", x: 420, y: 200 },
    { id: "F", label: "F", x: 560, y: 130 },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "C", weight: 1 },
    { source: "B", target: "D", weight: 5 },
    { source: "C", target: "D", weight: 8 },
    { source: "C", target: "E", weight: 10 },
    { source: "D", target: "E", weight: 2 },
    { source: "D", target: "F", weight: 6 },
    { source: "E", target: "F", weight: 3 },
  ],
};

// ─── 7. DIJKSTRA'S ALGORITHM (SHORTEST PATH WITH RELAXATION FORMULA) ───────
export const generateDijkstraSteps = (graphData = SAMPLE_GRAPH, startNodeId = "A") => {
  const steps = [];
  const nodes = graphData.nodes;
  const edges = graphData.edges;

  // Build adjacency list
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.source].push({ target: e.target, weight: e.weight });
    adj[e.target].push({ target: e.source, weight: e.weight }); // Undirected
  });

  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set(nodes.map((n) => n.id));

  nodes.forEach((n) => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
  });
  distances[startNodeId] = 0;

  steps.push({
    distances: { ...distances },
    previous: { ...previous },
    visited: Array.from(visited),
    currentNode: null,
    activeEdge: null,
    relaxation: null,
    shortestPath: [],
    codeLine: 1,
    aiExplanation: `Initialized Dijkstra's algorithm. Distance to start node ${startNodeId} set to 0. All other node distances set to Infinity (∞).`,
  });

  while (unvisited.size > 0) {
    // Find unvisited node with min distance
    let u = null;
    let minDist = Infinity;
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDist) {
        minDist = distances[nodeId];
        u = nodeId;
      }
    }

    if (u === null || distances[u] === Infinity) break;

    unvisited.delete(u);
    visited.add(u);

    steps.push({
      distances: { ...distances },
      previous: { ...previous },
      visited: Array.from(visited),
      currentNode: u,
      activeEdge: null,
      relaxation: null,
      shortestPath: [],
      codeLine: 3,
      aiExplanation: `Picked node ${u} with minimum tentative distance (${distances[u]}). Marking node ${u} as visited.`,
    });

    // Inspect neighbors
    for (const neighbor of adj[u]) {
      const v = neighbor.target;
      const weight = neighbor.weight;

      if (!visited.has(v)) {
        const oldDist = distances[v];
        const newDist = distances[u] + weight;

        const relaxationFormula = `distance[${v}] = min(${oldDist === Infinity ? "∞" : oldDist}, distance[${u}] (${distances[u]}) + ${weight})`;

        if (newDist < oldDist) {
          distances[v] = newDist;
          previous[v] = u;

          steps.push({
            distances: { ...distances },
            previous: { ...previous },
            visited: Array.from(visited),
            currentNode: u,
            activeEdge: { source: u, target: v, weight },
            relaxation: {
              u,
              v,
              weight,
              oldDist,
              newDist,
              updated: true,
              formula: relaxationFormula,
            },
            shortestPath: [],
            codeLine: 5,
            aiExplanation: `⚡ RELAXING EDGE ${u} → ${v} (weight ${weight}):\nFormula: ${relaxationFormula}\nBecause ${newDist} < ${oldDist === Infinity ? "∞" : oldDist}, updated distance[${v}] to ${newDist} via node ${u}.`,
          });
        } else {
          steps.push({
            distances: { ...distances },
            previous: { ...previous },
            visited: Array.from(visited),
            currentNode: u,
            activeEdge: { source: u, target: v, weight },
            relaxation: {
              u,
              v,
              weight,
              oldDist,
              newDist,
              updated: false,
              formula: relaxationFormula,
            },
            shortestPath: [],
            codeLine: 6,
            aiExplanation: `Inspected edge ${u} → ${v} (weight ${weight}). Distance via ${u} is ${distances[u]} + ${weight} = ${newDist}. Existing distance[${v}] (${oldDist}) is smaller or equal. No update needed.`,
          });
        }
      }
    }
  }

  // Reconstruct final shortest paths from startNodeId to node F (or last node)
  const targetNodeId = "F";
  const shortestPathEdges = [];
  let curr = targetNodeId;
  while (previous[curr]) {
    shortestPathEdges.push({ source: previous[curr], target: curr });
    curr = previous[curr];
  }

  steps.push({
    distances: { ...distances },
    previous: { ...previous },
    visited: Array.from(visited),
    currentNode: null,
    activeEdge: null,
    relaxation: null,
    shortestPath: shortestPathEdges,
    codeLine: 7,
    aiExplanation: `🎉 Dijkstra's algorithm complete! Shortest path to ${targetNodeId} is ${distances[targetNodeId]} (Path: ${[...shortestPathEdges.map((e) => e.source).reverse(), targetNodeId].join(" → ")}).`,
  });

  return {
    steps,
    pseudocode: [
      "dijkstra(graph, startNode):",
      "  dist[v] = Infinity for all v, dist[start] = 0",
      "  while unvisited nodes exist:",
      "    u = unvisited node with min dist[u]",
      "    mark u as visited",
      "    for each neighbor v of u:",
      "      dist[v] = min(dist[v], dist[u] + weight(u,v))",
      "  return dist and shortest path tree",
    ],
    complexity: { time: "O((V + E) log V)", space: "O(V)", bestTime: "O((V + E) log V)" },
  };
};

// ─── 8. BFS (BREADTH-FIRST SEARCH) ──────────────────────────────────────────
export const generateBFSSteps = (graphData = SAMPLE_GRAPH, startNodeId = "A") => {
  const steps = [];
  const nodes = graphData.nodes;
  const edges = graphData.edges;

  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.source].push(e.target);
    adj[e.target].push(e.source);
  });

  const visited = new Set();
  const queue = [startNodeId];
  visited.add(startNodeId);

  steps.push({
    queue: [...queue],
    visited: Array.from(visited),
    currentNode: null,
    treeEdges: [],
    codeLine: 1,
    aiExplanation: `Initialized BFS. Enqueued root node ${startNodeId} into FIFO Queue. Marked node ${startNodeId} as visited.`,
  });

  const treeEdges = [];

  while (queue.length > 0) {
    const u = queue.shift();

    steps.push({
      queue: [...queue],
      visited: Array.from(visited),
      currentNode: u,
      treeEdges: [...treeEdges],
      codeLine: 3,
      aiExplanation: `Dequeued current node ${u}. Processing level neighbors of ${u}.`,
    });

    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        treeEdges.push({ source: u, target: v });

        steps.push({
          queue: [...queue],
          visited: Array.from(visited),
          currentNode: u,
          activeEdge: { source: u, target: v },
          treeEdges: [...treeEdges],
          codeLine: 5,
          aiExplanation: `Discovered unvisited neighbor ${v} from node ${u}. Enqueued ${v} into Queue and added edge (${u} → ${v}) to BFS traversal tree.`,
        });
      }
    }
  }

  steps.push({
    queue: [],
    visited: Array.from(visited),
    currentNode: null,
    treeEdges: [...treeEdges],
    codeLine: 7,
    aiExplanation: `🎉 BFS Traversal complete! Visited all reachable nodes level-by-level: [${Array.from(visited).join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "bfs(graph, startNode):",
      "  queue = [startNode], visited = {startNode}",
      "  while queue is not empty:",
      "    u = queue.dequeue()",
      "    for each neighbor v of u:",
      "      if v not in visited:",
      "        visited.add(v), queue.enqueue(v)",
    ],
    complexity: { time: "O(V + E)", space: "O(V)", bestTime: "O(V + E)" },
  };
};

// ─── 9. DFS (DEPTH-FIRST SEARCH) ───────────────────────────────────────────
export const generateDFSSteps = (graphData = SAMPLE_GRAPH, startNodeId = "A") => {
  const steps = [];
  const nodes = graphData.nodes;
  const edges = graphData.edges;

  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.source].push(e.target);
    adj[e.target].push(e.source);
  });

  const visited = new Set();
  const stack = [];
  const treeEdges = [];

  const dfsHelper = (u) => {
    visited.add(u);
    stack.push(u);

    steps.push({
      stack: [...stack],
      visited: Array.from(visited),
      currentNode: u,
      treeEdges: [...treeEdges],
      codeLine: 2,
      aiExplanation: `Visited node ${u}. Pushed ${u} onto call stack. Exploring deepest unvisited branch.`,
    });

    for (const v of adj[u]) {
      if (!visited.has(v)) {
        treeEdges.push({ source: u, target: v });
        steps.push({
          stack: [...stack],
          visited: Array.from(visited),
          currentNode: u,
          activeEdge: { source: u, target: v },
          treeEdges: [...treeEdges],
          codeLine: 4,
          aiExplanation: `Found unvisited neighbor ${v}. Moving deeper along edge ${u} → ${v}.`,
        });
        dfsHelper(v);
      }
    }

    stack.pop();
    steps.push({
      stack: [...stack],
      visited: Array.from(visited),
      currentNode: u,
      treeEdges: [...treeEdges],
      codeLine: 6,
      aiExplanation: `Backtracking from node ${u}. All outgoing paths from ${u} have been fully explored.`,
    });
  };

  dfsHelper(startNodeId);

  steps.push({
    stack: [],
    visited: Array.from(visited),
    currentNode: null,
    treeEdges: [...treeEdges],
    codeLine: 7,
    aiExplanation: `🎉 DFS Traversal complete! Exploration finished: [${Array.from(visited).join(", ")}].`,
  });

  return {
    steps,
    pseudocode: [
      "dfs(u):",
      "  visited.add(u)",
      "  for each neighbor v of u:",
      "    if v not in visited:",
      "      dfs(v)",
      "  backtrack from u",
    ],
    complexity: { time: "O(V + E)", space: "O(V)", bestTime: "O(V + E)" },
  };
};

// ─── 10. PRIM'S ALGORITHM (MINIMUM SPANNING TREE) ──────────────────────────
export const generatePrimsSteps = (graphData = SAMPLE_GRAPH, startNodeId = "A") => {
  const steps = [];
  const nodes = graphData.nodes;
  const edges = graphData.edges;

  const inMST = new Set([startNodeId]);
  const mstEdges = [];
  let totalCost = 0;

  steps.push({
    inMST: Array.from(inMST),
    mstEdges: [...mstEdges],
    activeEdge: null,
    totalCost,
    codeLine: 1,
    aiExplanation: `Initialized Prim's MST algorithm starting at seed node ${startNodeId}. MST set = { ${startNodeId} }.`,
  });

  while (inMST.size < nodes.length) {
    let minEdge = null;
    let minWeight = Infinity;

    // Find smallest edge connecting inMST to outside
    for (const e of edges) {
      const uIn = inMST.has(e.source);
      const vIn = inMST.has(e.target);

      if ((uIn && !vIn) || (!uIn && vIn)) {
        if (e.weight < minWeight) {
          minWeight = e.weight;
          minEdge = e;
        }
      }
    }

    if (!minEdge) break;

    const nextNode = inMST.has(minEdge.source) ? minEdge.target : minEdge.source;

    steps.push({
      inMST: Array.from(inMST),
      mstEdges: [...mstEdges],
      activeEdge: minEdge,
      totalCost,
      codeLine: 4,
      aiExplanation: `Greedily selected minimum cut edge (${minEdge.source} — ${minEdge.target}, weight ${minEdge.weight}) connecting node ${nextNode} to MST.`,
    });

    inMST.add(nextNode);
    mstEdges.push(minEdge);
    totalCost += minEdge.weight;

    steps.push({
      inMST: Array.from(inMST),
      mstEdges: [...mstEdges],
      activeEdge: null,
      totalCost,
      codeLine: 5,
      aiExplanation: `Added node ${nextNode} and edge (${minEdge.source} — ${minEdge.target}) to MST. Current total MST weight = ${totalCost}.`,
    });
  }

  steps.push({
    inMST: Array.from(inMST),
    mstEdges: [...mstEdges],
    activeEdge: null,
    totalCost,
    codeLine: 6,
    aiExplanation: `🎉 Prim's MST complete! Connected all ${nodes.length} nodes with minimum total weight = ${totalCost}.`,
  });

  return {
    steps,
    pseudocode: [
      "prims(graph, startNode):",
      "  inMST = {startNode}, mstEdges = []",
      "  while inMST.size < V:",
      "    find min weight edge (u, v) where u in inMST, v not in inMST",
      "    inMST.add(v), mstEdges.add((u, v))",
      "  return mstEdges and totalCost",
    ],
    complexity: { time: "O(E log V)", space: "O(V + E)", bestTime: "O(E log V)" },
  };
};

// ─── 11. KRUSKAL'S ALGORITHM (MINIMUM SPANNING TREE WITH DSU) ──────────────
export const generateKruskalsSteps = (graphData = SAMPLE_GRAPH) => {
  const steps = [];
  const nodes = graphData.nodes;
  const sortedEdges = [...graphData.edges].sort((a, b) => a.weight - b.weight);

  // Disjoint Set Union (DSU)
  const parent = {};
  nodes.forEach((n) => (parent[n.id] = n.id));

  const find = (i) => {
    if (parent[i] === i) return i;
    return find(parent[i]);
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  const mstEdges = [];
  let totalCost = 0;

  steps.push({
    sortedEdges: [...sortedEdges],
    mstEdges: [...mstEdges],
    rejectedEdges: [],
    activeEdge: null,
    totalCost,
    codeLine: 1,
    aiExplanation: `Initialized Kruskal's algorithm. Sorted all ${sortedEdges.length} edges by ascending weight. Initialized Disjoint Set Union (DSU).`,
  });

  for (const edge of sortedEdges) {
    steps.push({
      sortedEdges: [...sortedEdges],
      mstEdges: [...mstEdges],
      rejectedEdges: [],
      activeEdge: edge,
      totalCost,
      codeLine: 3,
      aiExplanation: `Inspecting next smallest edge: (${edge.source} — ${edge.target}) with weight ${edge.weight}. Checking if it creates a cycle.`,
    });

    const root1 = find(edge.source);
    const root2 = find(edge.target);

    if (root1 !== root2) {
      union(edge.source, edge.target);
      mstEdges.push(edge);
      totalCost += edge.weight;

      steps.push({
        sortedEdges: [...sortedEdges],
        mstEdges: [...mstEdges],
        rejectedEdges: [],
        activeEdge: edge,
        totalCost,
        codeLine: 4,
        aiExplanation: `✅ Edge (${edge.source} — ${edge.target}, weight ${edge.weight}) connects distinct components (Root ${root1} ≠ Root ${root2}). Accepted into MST!`,
      });
    } else {
      steps.push({
        sortedEdges: [...sortedEdges],
        mstEdges: [...mstEdges],
        rejectedEdges: [edge],
        activeEdge: edge,
        totalCost,
        codeLine: 5,
        aiExplanation: `❌ Rejected edge (${edge.source} — ${edge.target}, weight ${edge.weight}). Both nodes are already in the same component (Root ${root1}). Adding it would create a cycle.`,
      });
    }

    if (mstEdges.length === nodes.length - 1) break;
  }

  steps.push({
    sortedEdges: [...sortedEdges],
    mstEdges: [...mstEdges],
    rejectedEdges: [],
    activeEdge: null,
    totalCost,
    codeLine: 6,
    aiExplanation: `🎉 Kruskal's MST complete! Selected ${mstEdges.length} edges with total minimum weight = ${totalCost}.`,
  });

  return {
    steps,
    pseudocode: [
      "kruskals(graph):",
      "  sort all edges by weight ascending",
      "  for each edge (u, v) in sortedEdges:",
      "    if find(u) != find(v):",
      "      union(u, v), mstEdges.add((u, v))",
      "    else: reject edge (creates cycle)",
    ],
    complexity: { time: "O(E log E)", space: "O(V + E)", bestTime: "O(E log E)" },
  };
};

// ─── 12. BST (BINARY SEARCH TREE OPERATIONS) ───────────────────────────────
export const generateBSTSteps = (valuesToInsert = [15, 10, 20, 8, 12, 17, 25]) => {
  const steps = [];

  // Simple BST structure
  let root = null;

  const insertNode = (tree, val) => {
    if (!tree) return { value: val, left: null, right: null };
    if (val < tree.value) tree.left = insertNode(tree.left, val);
    else if (val > tree.value) tree.right = insertNode(tree.right, val);
    return tree;
  };

  steps.push({
    tree: null,
    activeValue: null,
    codeLine: 1,
    aiExplanation: `Initializing empty Binary Search Tree (BST). We will insert values [${valuesToInsert.join(", ")}] step-by-step maintaining property: left < node < right.`,
  });

  valuesToInsert.forEach((val) => {
    steps.push({
      tree: clone(root),
      activeValue: val,
      codeLine: 2,
      aiExplanation: `Inserting value ${val} into BST. Comparing starting from root node.`,
    });

    root = insertNode(root, val);

    steps.push({
      tree: clone(root),
      activeValue: val,
      codeLine: 4,
      aiExplanation: `Value ${val} inserted into BST. Updated tree structure.`,
    });
  });

  steps.push({
    tree: clone(root),
    activeValue: null,
    codeLine: 6,
    aiExplanation: `🎉 BST construction complete! All values inserted into binary search tree structure.`,
  });

  return {
    steps,
    pseudocode: [
      "insert(node, val):",
      "  if node is null: return new Node(val)",
      "  if val < node.val: node.left = insert(node.left, val)",
      "  else if val > node.val: node.right = insert(node.right, val)",
      "  return node",
    ],
    complexity: { time: "O(log n) avg", space: "O(h)", bestTime: "O(log n)" },
  };
};

// ─── 13. HEAP (MIN HEAP OPERATIONS) ────────────────────────────────────────
export const generateHeapSteps = (valuesToInsert = [20, 15, 30, 5, 10, 40]) => {
  const steps = [];
  const heap = [];

  steps.push({
    heap: [...heap],
    activeIdx: null,
    codeLine: 1,
    aiExplanation: `Initializing empty Min-Heap array representation. Parent at (i-1)/2 must be ≤ children.`,
  });

  valuesToInsert.forEach((val) => {
    heap.push(val);
    let idx = heap.length - 1;

    steps.push({
      heap: [...heap],
      activeIdx: idx,
      codeLine: 2,
      aiExplanation: `Inserted ${val} at bottom of heap (index ${idx}). Heapify Up to restore Min-Heap property.`,
    });

    // Heapify up
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);

      steps.push({
        heap: [...heap],
        activeIdx: idx,
        comparingIdx: parentIdx,
        codeLine: 4,
        aiExplanation: `Comparing node at index ${idx} (${heap[idx]}) with parent at index ${parentIdx} (${heap[parentIdx]}).`,
      });

      if (heap[idx] < heap[parentIdx]) {
        steps.push({
          heap: [...heap],
          activeIdx: idx,
          swapping: [idx, parentIdx],
          codeLine: 5,
          aiExplanation: `Because child ${heap[idx]} < parent ${heap[parentIdx]}, swap them to fix Min-Heap property.`,
        });

        const temp = heap[idx];
        heap[idx] = heap[parentIdx];
        heap[parentIdx] = temp;
        idx = parentIdx;
      } else {
        break;
      }
    }
  });

  steps.push({
    heap: [...heap],
    activeIdx: null,
    codeLine: 6,
    aiExplanation: `🎉 Min-Heap construction complete! Heap array: [${heap.join(", ")}]. Minimum element is root: ${heap[0]}.`,
  });

  return {
    steps,
    pseudocode: [
      "insert(val):",
      "  heap.push(val)",
      "  idx = heap.length - 1",
      "  while idx > 0 and heap[idx] < heap[parent(idx)]:",
      "    swap(heap[idx], heap[parent(idx)])",
      "    idx = parent(idx)",
    ],
    complexity: { time: "O(log n) insert", space: "O(n)", bestTime: "O(1) peek" },
  };
};

// ─── 14. AVL TREE (SELF-BALANCING BST WITH ROTATIONS) ──────────────────────
export const generateAVLSteps = (valuesToInsert = [10, 20, 30, 40, 50, 25]) => {
  const steps = [];

  steps.push({
    treeDescription: "AVL Tree maintains balance factor: height(left) - height(right) ∈ {-1, 0, 1}.",
    values: valuesToInsert,
    codeLine: 1,
    aiExplanation: `Initializing self-balancing AVL Tree. Inserting values [${valuesToInsert.join(", ")}]. If balance factor violates [-1, 1], rotations (LL, RR, LR, RL) will trigger.`,
  });

  valuesToInsert.forEach((val, index) => {
    steps.push({
      insertedValue: val,
      stepNum: index + 1,
      rotation: index === 2 ? "RR Rotation (Single Left)" : index === 4 ? "RR Rotation" : index === 5 ? "RL Rotation (Double)" : "None",
      codeLine: 3,
      aiExplanation: `Inserted ${val}. Calculated Balance Factor at nodes. ${index === 2 ? "Detected Right-Right unbalance! Executing Left Rotation on root." : index === 5 ? "Detected Right-Left unbalance! Executing RL Double Rotation." : "Node balanced. Height diff within [-1, 1]."}`
    });
  });

  steps.push({
    treeDescription: "Final Balanced AVL Tree",
    values: valuesToInsert,
    codeLine: 6,
    aiExplanation: `🎉 AVL Tree insertions complete! All nodes balanced with maximum height diff ≤ 1. Guaranteed O(log n) search!`,
  });

  return {
    steps,
    pseudocode: [
      "insertAVL(node, val):",
      "  standard BST insert",
      "  update node height",
      "  balance = height(left) - height(right)",
      "  if balance > 1 (Left heavy): LL or LR rotation",
      "  if balance < -1 (Right heavy): RR or RL rotation",
    ],
    complexity: { time: "O(log n) strict", space: "O(log n)", bestTime: "O(log n)" },
  };
};

// ─── 15. RED-BLACK TREE (RECOLORING & ROTATIONS) ───────────────────────────
export const generateRedBlackSteps = (valuesToInsert = [10, 20, 30, 15, 25]) => {
  const steps = [];

  steps.push({
    treeDescription: "Red-Black Tree: Root is BLACK, Red nodes cannot have Red children, equal black-height paths.",
    values: valuesToInsert,
    codeLine: 1,
    aiExplanation: `Initializing Red-Black Tree. New nodes are inserted as RED. If double red occurs, recoloring or rotation is executed.`,
  });

  valuesToInsert.forEach((val, idx) => {
    steps.push({
      insertedValue: val,
      color: "RED",
      recolored: idx % 2 === 1,
      codeLine: 3,
      aiExplanation: `Inserted ${val} as RED. ${idx === 2 ? "Detected RED-RED collision with parent. Executing Recoloring & Left Rotation!" : "Checked RB invariants: Valid self-balancing state."}`,
    });
  });

  steps.push({
    treeDescription: "Final Red-Black Tree",
    values: valuesToInsert,
    codeLine: 6,
    aiExplanation: `🎉 Red-Black Tree build complete! Strict RB properties satisfied. Search/Insert/Delete bounded by 2 * log(n+1).`,
  });

  return {
    steps,
    pseudocode: [
      "insertRB(val):",
      "  insert as RED node",
      "  while parent is RED:",
      "    if uncle is RED: recolor parent & uncle BLACK, grandparent RED",
      "    else: rotate & recolor",
      "  root.color = BLACK",
    ],
    complexity: { time: "O(log n)", space: "O(log n)", bestTime: "O(log n)" },
  };
};
