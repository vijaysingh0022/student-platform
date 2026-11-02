// DSA Question Bank (105 Questions)
export const DSA_QUESTIONS = [
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Prefix Sums",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the time complexity to answer range sum query [L, R] using a precomputed prefix sum array of size N?",
    "options": [
      "O(1)",
      "O(log N)",
      "O(R - L)",
      "O(N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Once prefix sums are precomputed in O(N) time, any range sum query sum(L, R) is computed as prefix[R] - prefix[L-1] in strictly O(1) time.",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Two Pointers",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a sorted array, what is the optimal time complexity to find if any two elements sum to a target value K?",
    "options": [
      "O(N^2)",
      "O(N log N)",
      "O(N)",
      "O(log N)"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Using two pointers starting at the beginning and end of the sorted array, moving inward takes O(N) time and O(1) auxiliary space.",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Kadane's Algorithm",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Kadane's algorithm finds the maximum subarray sum in O(N) time. What dynamic programming recurrence does it use for max ending at index i?",
    "options": [
      "max_ending_here = max(arr[i], max_ending_here + arr[i])",
      "max_ending_here = max_ending_here + arr[i]",
      "max_ending_here = max(0, arr[i])",
      "max_ending_here = arr[i] * max_ending_here"
    ],
    "correctAnswerIndex": 0,
    "explanation": "At each index i, we decide whether to add arr[i] to the existing running subarray or start a new subarray starting at arr[i].",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Sliding Window",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the maximum number of times any element is added and removed from the window in a standard variable-size sliding window on an array of length N?",
    "options": [
      "Each element enters once and leaves once (2N operations)",
      "O(N^2) operations",
      "O(N log N) operations",
      "Depends on window size K"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each array index is visited at most twice (once by right pointer expanding, once by left pointer contracting), giving amortized O(N) complexity.",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Dutch National Flag",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Dijkstra's Dutch National Flag algorithm partitions an array with 0s, 1s, and 2s using 3 pointers in:",
    "options": [
      "One single pass with O(1) space",
      "Two passes with O(N) space",
      "O(N log N) time",
      "O(N^2) worst case"
    ],
    "correctAnswerIndex": 0,
    "explanation": "It uses low, mid, and high pointers to partition the array in a single linear pass O(N) with O(1) auxiliary space.",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Boyer-Moore Voting",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Boyer-Moore Voting Algorithm finds a majority element (> N/2 occurrences) in an array with:",
    "options": [
      "O(N) time and O(1) auxiliary space",
      "O(N log N) time and O(1) space",
      "O(N) time and O(N) space",
      "O(log N) time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "It cancels out non-majority elements with equal candidate counts, requiring only one candidate variable and a counter in O(N) time and O(1) memory.",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Arrays",
    "subtopic": "Circular Arrays",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In an array of size N representing a circular buffer, how is index arithmetic computed when stepping forward by k positions from index i?",
    "options": [
      "(i + k) % N",
      "(i + k) / N",
      "(i * k) % N",
      "(i + N) % k"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Modular arithmetic (i + k) % N wraps indices around from N-1 back to 0 seamlessly.",
    "tags": [
      "DSA",
      "Arrays",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "Floyd's Cycle Finding",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When Floyd's Tortoise and Hare algorithm detects a cycle in a linked list, where do the pointers meet if one pointer resets to the head and both advance at speed 1?",
    "options": [
      "At the start node of the cycle",
      "At the last node of the list",
      "At the node with maximum value",
      "At the middle of the cycle"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mathematical proof shows the distance from the head to cycle start equals the distance from the meeting point to cycle start along the cycle.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "Reversal",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the minimum number of pointer variables needed to reverse a singly linked list iteratively in-place?",
    "options": [
      "3 (prev, curr, next)",
      "2",
      "1",
      "4"
    ],
    "correctAnswerIndex": 0,
    "explanation": "You need prev, curr, and next (or temp) pointers to adjust links without losing reference to the remainder of the list.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "Middle Node",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "To find the middle of a singly linked list in a single pass, fast pointer moves at 2x speed. When fast reaches NULL (or fast.next is NULL), where is slow?",
    "options": [
      "Exactly at the middle node",
      "At the head node",
      "At the 1/3rd position",
      "At the tail node"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Since fast moves twice as fast as slow, when fast reaches the end (distance D), slow has traversed exactly D/2, which is the middle.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "Merge Sorted Lists",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity to merge two sorted linked lists of sizes M and N into one sorted list in-place?",
    "options": [
      "O(M + N)",
      "O(M * N)",
      "O(max(M, N) log(M+N))",
      "O(1)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Comparing heads of both lists and rewiring next pointers takes linear time O(M + N) with O(1) auxiliary space.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "LRU Cache Node Removal",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why is a Doubly Linked List paired with a Hash Map to implement an O(1) LRU Cache?",
    "options": [
      "Allows O(1) node deletion and insertion at head/tail given node pointer",
      "Consumes less memory than singly linked list",
      "Guarantees sorted key order",
      "Prevents memory fragmentation"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A doubly linked list allows removing any node in O(1) given its direct reference, because both prev and next pointers are immediately accessible.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "Skip List",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the average search time complexity in a balanced Skip List with N nodes?",
    "options": [
      "O(log N)",
      "O(N)",
      "O(1)",
      "O(N log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Skip lists use probabilistic multi-level forward pointers, yielding O(log N) average search, insertion, and deletion times.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Linked Lists",
    "subtopic": "Memory Locality",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why do arrays generally outperform linked lists for sequential iteration despite identical O(N) theoretical complexity?",
    "options": [
      "Arrays have superior CPU cache locality due to contiguous memory allocation",
      "Linked lists use more CPU instructions per dereference",
      "Arrays avoid garbage collection",
      "Linked list nodes are always smaller"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Array elements occupy contiguous memory addresses, maximizing CPU L1/L2 cache prefetching line hits, whereas linked list nodes are scattered across the heap.",
    "tags": [
      "DSA",
      "Linked Lists",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Next Greater Element",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which data structure pattern solves the 'Next Greater Element' problem for all elements of an array in O(N) total time?",
    "options": [
      "Monotonic Decreasing Stack",
      "Min-Heap",
      "Queue",
      "Binary Search Tree"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A monotonic stack maintaining elements in decreasing order allows each element to be pushed and popped at most once, achieving O(N) time.",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Infix to Postfix",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Dijkstra's Shunting-yard algorithm for infix to postfix conversion, what determines whether an operator is popped from the stack?",
    "options": [
      "When the incoming operator has lower or equal precedence than top of stack",
      "When the stack is full",
      "Whenever an operand is encountered",
      "Only when a closing parenthesis is read"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Operators with greater or equal precedence already on the stack must be evaluated first according to operator associativity rules.",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Valid Parentheses",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When checking for balanced brackets like '{[()]}', when is an expression declared invalid immediately?",
    "options": [
      "When a closing bracket does not match the top opening bracket of the stack",
      "When an opening bracket is encountered",
      "When the stack is not empty after reading half the string",
      "When string length is even"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A closing bracket must match the most recently opened unmatched bracket (LIFO property).",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Largest Rectangle in Histogram",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In the histogram largest rectangle problem, when a bar at index i is popped from the monotonic stack, its width is calculated using:",
    "options": [
      "i - stack.peek() - 1",
      "i - stack.peek()",
      "i + 1",
      "N - i"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The bar's height can extend to the left until the previous smaller element (current stack.peek()) and to the right until index i.",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Min Stack",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How can a Stack support getMin() in O(1) time without extra memory per node in optimal implementations?",
    "options": [
      "Storing 2 * val - minVal when a new minimum is pushed",
      "Sorting the stack on every push",
      "Using a binary search tree",
      "Scanning the stack linearly"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Using encoded difference values (2*x - minVal) enables O(1) getMin retrieval and O(1) previous min restoration upon popping without auxiliary stack.",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Call Stack & Recursion",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "A Stack Overflow error during deep recursion occurs because:",
    "options": [
      "Call stack memory limit allocated by the OS/runtime is exceeded",
      "Heap memory runs out",
      "CPU registers are corrupted",
      "Pointers become circular"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every recursive function call pushes a new stack frame (return address, local variables) onto the execution call stack until the stack limit is reached.",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Stacks",
    "subtopic": "Queue using Stacks",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When implementing a FIFO Queue using two LIFO Stacks (inStack and outStack), what is the amortized time complexity of the dequeue operation?",
    "options": [
      "O(1)",
      "O(N)",
      "O(log N)",
      "O(N^2)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each element is transferred from inStack to outStack at most once in its lifetime, giving amortized O(1) per dequeue.",
    "tags": [
      "DSA",
      "Stacks",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "Circular Queue",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In a circular queue implemented using an array of size CAPACITY, what is the condition for Queue Full when leaving one slot empty?",
    "options": [
      "(rear + 1) % CAPACITY == front",
      "front == rear",
      "rear == CAPACITY - 1",
      "front == 0"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Leaving one slot intentionally unused cleanly distinguishes between Queue Full ((rear + 1) % C == front) and Queue Empty (front == rear).",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "Deque Sliding Window Max",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "To find maximums of all sliding windows of size K in O(N) time, a Double-Ended Queue (Deque) must maintain elements in:",
    "options": [
      "Monotonically decreasing order of values",
      "Strictly ascending order of indices",
      "Min-heap order",
      "Arbitrary FIFO sequence"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Maintaining indices of elements in monotonically decreasing order guarantees the window maximum is always at the front of the deque.",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "BFS Traversal",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is a FIFO Queue required for Breadth-First Search (BFS) in trees and graphs?",
    "options": [
      "To explore all nodes at current depth d before visiting nodes at depth d+1",
      "To backtrack to previous branches",
      "To sort vertex labels",
      "To compute minimum spanning tree"
    ],
    "correctAnswerIndex": 0,
    "explanation": "FIFO order ensures vertices discovered first are expanded first, preserving level-order traversal.",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "Priority Queue Implementation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity to insert an element into and delete the highest-priority element from a standard Binary Heap-based Priority Queue?",
    "options": [
      "O(log N) for both insert and delete",
      "O(1) insert, O(N) delete",
      "O(N) insert, O(1) delete",
      "O(1) for both"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Binary heap insertion requires bubbling up O(log N), and extraction requires bubbling down O(log N).",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "Blocking Queue",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In concurrent producer-consumer systems, what does a Blocking Queue do when a consumer calls take() on an empty queue?",
    "options": [
      "Blocks and waits until a producer enqueues an element",
      "Throws NullPointerException",
      "Returns null immediately",
      "Terminates the consumer thread"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A blocking queue suspends the calling thread using condition variables (e.g. wait/notify) until an item becomes available.",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "Stack using Queues",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When implementing a LIFO Stack using a single circular Queue, how is push(x) accomplished in O(N) time?",
    "options": [
      "Enqueue x, then dequeue and enqueue the previous (size - 1) elements",
      "Enqueue x at front directly",
      "Dequeue all elements to heap",
      "Reverse array on every push"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Rotating the earlier N-1 elements behind newly added x moves x to the front of the queue, making pop() O(1).",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Queues",
    "subtopic": "Monotonic Queue",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the primary invariant of a monotonic increasing queue during sequential insertions?",
    "options": [
      "All elements greater than incoming element are removed from the back before insertion",
      "Elements are sorted descending",
      "Queue size remains constant",
      "Elements are removed from front only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Popping larger elements from the back preserves the increasing property, guaranteeing the minimum element stays at the front.",
    "tags": [
      "DSA",
      "Queues",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Lower Bound",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In C++ std::lower_bound or equivalent binary search on a sorted array, what does lower_bound(target) return?",
    "options": [
      "Iterator to first element >= target",
      "Iterator to first element > target",
      "Iterator to exact match or null",
      "Iterator to last element <= target"
    ],
    "correctAnswerIndex": 0,
    "explanation": "lower_bound returns the first position where target can be inserted without violating ordering, i.e., first element >= target.",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Overflow Prevention",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is mid calculated as `low + (high - low) / 2` instead of `(low + high) / 2` in integer binary search?",
    "options": [
      "Prevents potential integer arithmetic overflow when low + high exceeds INT_MAX",
      "Executes faster in hardware",
      "Supports negative floating numbers",
      "Prevents off-by-one errors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If low + high exceeds 2^31 - 1, signed integer overflow results in a negative number, causing ArrayIndexOutOfBoundsException.",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Rotated Sorted Array",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How can you search for a target in a rotated sorted array in O(log N) time?",
    "options": [
      "Determine which half (left or right) is normally sorted, then check if target lies in that sorted range",
      "Find the pivot in O(N) time first",
      "Sort array first in O(N log N)",
      "Apply linear scan"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In any rotated sorted array, dividing at mid splits it such that at least one half is strictly sorted, allowing standard range containment check.",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Answer on Monotonic Predicate",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In problems like 'Capacity to Ship Packages within D Days' or 'Koko Eating Bananas', binary search is applied on:",
    "options": [
      "The answer domain using a monotonic feasibility check function",
      "The input array indices directly",
      "A hash table of package weights",
      "A prefix tree"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When f(x) is monotonic (if feasible for x, feasible for all y > x), binary search can find the minimal feasible x in O(log(range) * checkCost).",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Median of Two Sorted Arrays",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the optimal time complexity to find the median of two sorted arrays of sizes M and N?",
    "options": [
      "O(log(min(M, N)))",
      "O(M + N)",
      "O(log(M + N))",
      "O(M * N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Partitioning the smaller array with binary search guarantees half elements on left and half on right in O(log(min(M, N))) time.",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Search Insert Position",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In standard binary search, if target is not found in arr, what does the variable `low` represent at loop termination (when low > high)?",
    "options": [
      "The exact insertion index where target should be inserted to maintain sorted order",
      "Always index 0",
      "Always index N - 1",
      "Negative one (-1)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "At termination, `low` points precisely to the smallest element strictly greater than target, which is the correct insertion index.",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Binary Search",
    "subtopic": "Peak Element",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In an array where arr[i] != arr[i+1], why is a peak element (arr[i] > arr[i-1] and arr[i] > arr[i+1]) guaranteed to be found in O(log N)?",
    "options": [
      "If arr[mid] < arr[mid+1], a peak is guaranteed to exist in the right half",
      "Every array is unimodal",
      "A peak only exists at endpoints",
      "Binary search only works on sorted arrays"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Following the rising slope (arr[mid] < arr[mid+1]) guarantees encountering a peak since the array boundary is treated as negative infinity.",
    "tags": [
      "DSA",
      "Binary Search",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Quick Sort Worst Case",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Under which pivot selection strategy does QuickSort degrade to O(N^2) on an already sorted array?",
    "options": [
      "Always choosing the first or last element as pivot",
      "Random pivot selection",
      "Median-of-three pivot",
      "Dual pivot selection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Choosing first or last element on sorted input generates completely unbalanced partitions of size (N-1) and 0 at each level.",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Merge Sort Space Complexity",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the standard auxiliary space complexity of Merge Sort on an array of size N?",
    "options": [
      "O(N)",
      "O(1)",
      "O(log N)",
      "O(N^2)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Standard array Merge Sort requires an auxiliary buffer of size O(N) to merge two sorted halves.",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Stability",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following sorting algorithms is inherently STABLE by design?",
    "options": [
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Selection Sort"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Merge Sort preserves the relative order of duplicate elements during the merge phase when using `<=` condition.",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Heap Sort in Place",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Heap Sort achieves O(N log N) worst-case time complexity while utilizing auxiliary memory of:",
    "options": [
      "O(1)",
      "O(N)",
      "O(log N)",
      "O(N log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Heap Sort builds heap in-place within the input array and iteratively swaps root with end index, requiring O(1) extra space.",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Counting Sort Bounds",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Counting Sort sorts N integers in range [0, K] in O(N + K) time. When is Counting Sort inefficient compared to comparison sorts?",
    "options": [
      "When K is much larger than N (e.g. K = N^3)",
      "When N is very large",
      "When array contains duplicates",
      "When elements are already sorted"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If K = N^3, time complexity becomes O(N^3), which is far worse than O(N log N) comparison sorts.",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Radix Sort Complexity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Radix Sort with digit base b on d-digit numbers runs in time:",
    "options": [
      "O(d * (N + b))",
      "O(N log N)",
      "O(d * N^2)",
      "O(b * log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "For d digits, it performs d passes of a stable sub-sort (like Counting Sort with base b) in O(d * (N + b)) time.",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Sorting",
    "subtopic": "Comparison Lower Bound",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why can no comparison-based sorting algorithm have worst-case time complexity better than Omega(N log N)?",
    "options": [
      "Decision tree of comparisons for N! permutations requires height of at least log2(N!) = Omega(N log N)",
      "CPU cache misses prevent faster execution",
      "RAM memory bandwidth limits comparisons",
      "Arrays cannot be divided smaller than 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Any comparison sort can be modeled as a binary decision tree. To distinguish N! possible orderings, the tree must have at least N! leaves, requiring height >= log2(N!) = Omega(N log N).",
    "tags": [
      "DSA",
      "Sorting",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Tail Recursion",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Tail Call Optimization (TCO) in recursive function execution?",
    "options": [
      "The compiler replaces the final recursive call with a jump/loop, reusing the current stack frame",
      "The recursion is executed on a separate OS thread",
      "Variables are stored in global memory",
      "The base case is evaluated before arguments"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When the recursive call is the very last operation executed, the caller frame needs no preservation, so compilers transform it into an iterative loop with O(1) stack space.",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Master Theorem Form",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "For recurrence T(N) = 2T(N/2) + O(N), what is the asymptotic solution by Master Theorem?",
    "options": [
      "Theta(N log N)",
      "Theta(N)",
      "Theta(N^2)",
      "Theta(log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Here a=2, b=2, log_b(a) = 1. Since f(N) = O(N^1), it falls under Case 2 of Master Theorem: T(N) = Theta(N log N).",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Towers of Hanoi",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the minimum number of moves required to solve the Towers of Hanoi puzzle with N disks?",
    "options": [
      "2^N - 1",
      "N^2",
      "2*N - 1",
      "N!"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The recurrence M(N) = 2*M(N-1) + 1 with base case M(1) = 1 solves to M(N) = 2^N - 1.",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Stack Depth Limit",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Python, what built-in function inspects and modifies the maximum recursion depth?",
    "options": [
      "sys.getrecursionlimit() and sys.setrecursionlimit()",
      "os.setstackdepth()",
      "math.recursions()",
      "gc.limit()"
    ],
    "correctAnswerIndex": 0,
    "explanation": "sys.getrecursionlimit() returns the current depth (default 1000) and sys.setrecursionlimit() adjusts it.",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Tree Recursion vs Linear",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why does unmemoized Fibonacci fib(N) = fib(N-1) + fib(N-2) exhibit exponential O(2^N) time complexity?",
    "options": [
      "The recursion tree branches into 2 calls at every level, creating ~2^N repeated overlapping subproblems",
      "Memory allocation fails",
      "Big-O cannot model addition",
      "Call stack overflows at N=10"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each call generates two independent recursive subtrees without sharing state, leading to a decision tree of size roughly O(golden_ratio^N) = O(1.618^N) ~ O(2^N).",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Subsets Generation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "To generate all 2^N subsets of an array of length N, recursion uses which classic pattern?",
    "options": [
      "Pick / Don't Pick (Include or Exclude element at index i)",
      "Divide array in half and sort",
      "Linear scan with queue",
      "Floyd Warshall iteration"
    ],
    "correctAnswerIndex": 0,
    "explanation": "At each index, branching into two states (include arr[i] vs exclude arr[i]) systematically enumerates all 2^N power set combinations.",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Recursion",
    "subtopic": "Ackermann Function",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why is the Ackermann function famous in computational complexity theory?",
    "options": [
      "It is a computable function that is not primitive recursive and grows astronomically fast",
      "It solves the Traveling Salesman in polynomial time",
      "It proves P = NP",
      "It models linear cache coherence"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Wilhelm Ackermann proved in 1928 that A(m, n) is total and computable but grows faster than any primitive recursive function.",
    "tags": [
      "DSA",
      "Recursion",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "BST Inorder Traversal",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which traversal of a Binary Search Tree (BST) produces node values in strictly sorted ascending order?",
    "options": [
      "Inorder (Left, Root, Right)",
      "Preorder (Root, Left, Right)",
      "Postorder (Left, Right, Root)",
      "Level Order"
    ],
    "correctAnswerIndex": 0,
    "explanation": "By BST definition, Left < Root < Right. Traversing Left subtree, then Root, then Right subtree visits elements in non-decreasing order.",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "AVL Balance Factor",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In an AVL tree, what is the valid balance factor range for every node?",
    "options": [
      "{-1, 0, +1}",
      "{-2, 0, +2}",
      "{0, 1}",
      "Any integer <= height"
    ],
    "correctAnswerIndex": 0,
    "explanation": "AVL trees enforce that height(left) - height(right) is strictly in {-1, 0, +1}; otherwise, tree rotations (LL, RR, LR, RL) rebalance it.",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "LCA in BST",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "To find the Lowest Common Ancestor (LCA) of nodes p and q in a BST, when is current node root identified as the LCA?",
    "options": [
      "When root.val lies between p.val and q.val (min(p, q) <= root.val <= max(p, q))",
      "When root is a leaf node",
      "When root equals p only",
      "When depth of root is maximum"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If p and q lie on opposite sides of root (or one equals root), root is the split point and therefore the Lowest Common Ancestor.",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "Diameter of Binary Tree",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "The diameter of a binary tree is the length of the longest path between any two nodes. For any node, the longest path passing through it is:",
    "options": [
      "left_height + right_height",
      "max(left_height, right_height)",
      "2 * max(left_height, right_height)",
      "height + 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The longest path passing through node N extends down its deepest left branch and deepest right branch, spanning left_height + right_height edges.",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "Red-Black Tree Properties",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In a Red-Black Tree, what is the maximum possible height of a tree with N internal nodes?",
    "options": [
      "2 * log2(N + 1)",
      "log2(N)",
      "N / 2",
      "1.44 * log2(N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because no red node can have a red child (no consecutive reds) and every path from root to leaf has identical black-height, height <= 2 * log2(N + 1).",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "Trie Prefix Search",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity to search for a prefix string of length L in a Trie containing N words?",
    "options": [
      "O(L)",
      "O(N * L)",
      "O(log N)",
      "O(L * log(alphabet))"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each character in the prefix corresponds to one edge traversal in the Trie, which takes O(1) per character with array-based child pointers, totaling O(L).",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Trees",
    "subtopic": "Segment Tree Query",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of range sum query and single-element point update in a Segment Tree of size N?",
    "options": [
      "O(log N) query, O(log N) update",
      "O(1) query, O(N) update",
      "O(N) query, O(1) update",
      "O(log N) query, O(1) update"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Segment trees split range queries across at most 4 nodes per level in a tree of height log2(N), giving O(log N) for both operations.",
    "tags": [
      "DSA",
      "Trees",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Dijkstra Negative Edges",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why does Dijkstra's greedy algorithm fail on graphs with negative edge weights?",
    "options": [
      "Once a vertex is marked visited/settled, Dijkstra assumes its shortest path is final and never re-relaxes it",
      "It creates an infinite loop immediately",
      "Priority queues cannot store negative numbers",
      "It only works on trees"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Dijkstra relies on non-decreasing path lengths. A negative edge discovered later could shorten an already settled node's distance, violating its greedy invariant.",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Bellman-Ford Complexity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of Bellman-Ford single-source shortest path algorithm on graph G(V, E)?",
    "options": [
      "O(V * E)",
      "O((V + E) log V)",
      "O(V^3)",
      "O(E log V)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bellman-Ford relaxes all E edges (V - 1) times, resulting in O(V * E) time, and detects negative weight cycles on the V-th relaxation.",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Topological Sort Cycle Detection",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Topological sorting is strictly valid only on which class of graphs?",
    "options": [
      "Directed Acyclic Graphs (DAGs)",
      "Any connected graph",
      "Undirected graphs with weights",
      "Bipartite graphs only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A valid topological sort requires that for every directed edge u -> v, u comes before v. Any directed cycle makes this ordering mathematically impossible.",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Kruskal vs Prim",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Kruskal's algorithm finds Minimum Spanning Tree (MST) using which core algorithmic paradigm and helper structure?",
    "options": [
      "Greedy edge selection with Disjoint Set Union (DSU / Union-Find)",
      "Dynamic programming with adjacency matrix",
      "Breadth First Search with Queue",
      "Divide and conquer with recursion"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Kruskal sorts all edges by weight and greedily adds the lightest edge that does not form a cycle using Disjoint Set Union (DSU).",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Tarjan's Bridges",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In Tarjan's bridge-finding algorithm using DFS discovery times `tin` and low-link values `low`, an edge u-v is a bridge if:",
    "options": [
      "low[v] > tin[u]",
      "low[v] == tin[u]",
      "low[v] < tin[u]",
      "tin[v] == tin[u] + 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "low[v] > tin[u] means that from node v and its subtree, there is no back-edge to node u or any of u's ancestors, meaning removing edge u-v disconnects the graph.",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Bipartite Graph Check",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "A graph is bipartite if and only if it contains:",
    "options": [
      "No odd-length cycles (can be 2-colored)",
      "No cycles at all",
      "An even number of vertices",
      "Only self loops"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A graph can be partitioned into two independent sets (2-colored) if and only if it contains no cycles of odd length.",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Graphs",
    "subtopic": "Floyd-Warshall",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What dynamic programming algorithm computes All-Pairs Shortest Paths in O(V^3) time using an adjacency matrix?",
    "options": [
      "Floyd-Warshall Algorithm",
      "Dijkstra's Algorithm",
      "Kahn's Algorithm",
      "Kosaraju's Algorithm"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Floyd-Warshall iterates over all intermediate vertices k: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) in three nested loops of size V.",
    "tags": [
      "DSA",
      "Graphs",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "0/1 Knapsack Complexity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is the O(N * W) DP solution to 0/1 Knapsack classified as Pseudo-Polynomial time?",
    "options": [
      "W is an integer numeric value represented in log2(W) input bits, making complexity exponential in input size",
      "It requires polynomial memory",
      "It only works for fractional items",
      "It solves NP-hard problems in linear time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In computational complexity, input size is measured in bits. Since numeric value W requires B = log2(W) bits, O(N * 2^B) is exponential relative to bit size.",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "Longest Common Subsequence",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "For two strings of lengths M and N, what is the space-optimized DP space complexity for finding LCS length?",
    "options": [
      "O(min(M, N))",
      "O(M * N)",
      "O(M + N)",
      "O(1)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Since computing row i only depends on row i-1, we only need two rows of size min(M, N) or a single row with temporary previous-diagonal variable.",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "Coin Change Unbounded",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In the Coin Change problem (minimum coins to make amount A with infinite supply of coins), what is the 1D state transition?",
    "options": [
      "dp[i] = min(dp[i], dp[i - coin] + 1)",
      "dp[i] = dp[i] + dp[i - coin]",
      "dp[i] = max(dp[i], dp[i - coin])",
      "dp[i] = dp[i - 1] + 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "For each coin, if i >= coin, using that coin transitions from state dp[i - coin], adding 1 to the coin count.",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "Matrix Chain Multiplication",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the time complexity of standard Matrix Chain Multiplication DP for multiplying N matrices?",
    "options": [
      "O(N^3)",
      "O(N^2)",
      "O(2^N)",
      "O(N log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The state dp[i][j] represents min scalar multiplications for matrices i through j. There are O(N^2) subproblems, and finding optimal split k takes O(N) loop, totaling O(N^3).",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "Longest Increasing Subsequence",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the optimal time complexity to compute the Longest Increasing Subsequence (LIS) of an array of size N?",
    "options": [
      "O(N log N) using patience sorting / binary search",
      "O(N^2) only",
      "O(N)",
      "O(2^N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Maintaining an array of tail elements of increasing subsequences and updating it via binary search takes O(N log N) time.",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "Edit Distance",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Levenshtein Distance between strings s1 and s2, if s1[i] != s2[j], what operations are evaluated for dp[i][j]?",
    "options": [
      "1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) (Delete, Insert, Replace)",
      "dp[i-1][j-1]",
      "max(dp[i-1][j], dp[i][j-1])",
      "dp[i][j-1] + 1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The three transitions represent: deletion in s1 (dp[i-1][j]), insertion into s1 (dp[i][j-1]), and replacement of character (dp[i-1][j-1]).",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Dynamic Programming",
    "subtopic": "Digit DP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the primary purpose of the boolean parameter `tight` in Digit DP?",
    "options": [
      "Restricts the current digit choice to not exceed the prefix of the upper bound number",
      "Ensures all digits are distinct",
      "Checks if number is prime",
      "Enforces memory bounds on cache table"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When tight is true, the current digit is bounded by the corresponding digit of the upper bound; once a smaller digit is placed, tight becomes false for all subsequent digits.",
    "tags": [
      "DSA",
      "Dynamic Programming",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Activity Selection",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In the Interval Scheduling / Activity Selection problem, which greedy sorting criterion maximizes the number of non-overlapping activities?",
    "options": [
      "Sort by earliest finish time",
      "Sort by earliest start time",
      "Sort by shortest duration",
      "Sort by latest start time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Selecting the activity that finishes earliest frees up the resource as soon as possible for subsequent activities, an optimal greedy choice.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Huffman Coding",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Huffman coding builds an optimal prefix-free binary tree for data compression using which data structure?",
    "options": [
      "Min-Priority Queue (Min-Heap)",
      "Max-Heap",
      "Stack",
      "Hash Map"
    ],
    "correctAnswerIndex": 0,
    "explanation": "It iteratively extracts the two lowest-frequency nodes from a min-heap, merges them into a new parent node with sum frequency, and re-inserts into heap.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Fractional Knapsack",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why can Fractional Knapsack be solved greedily in O(N log N) time while 0/1 Knapsack cannot?",
    "options": [
      "Fractional items allow taking fractions, so sorting by value-to-weight ratio (value/weight) guarantees maximum value density",
      "0/1 Knapsack has no weights",
      "Fractional Knapsack uses binary search",
      "0/1 knapsack items have equal value"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Taking items in decreasing order of value/weight density fills capacity optimally; in 0/1, discrete item sizes can leave empty capacity.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Jump Game",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Jump Game (can you reach index N-1 where arr[i] is max jump length), what single variable tracks feasibility in O(N) time?",
    "options": [
      "maxReach = max(maxReach, i + arr[i])",
      "minSteps",
      "dp[N]",
      "jumpCount"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Iterating through the array, if i > maxReach return false; otherwise update maxReach = max(maxReach, i + arr[i]). If maxReach >= N-1, return true.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Gas Station Circuit",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In the Gas Station circular tour problem, if total gas >= total cost, how is the starting station identified in O(N) time?",
    "options": [
      "Whenever tank < 0 during the pass, reset start = i + 1 and tank = 0",
      "Sort stations by gas amount",
      "Binary search all possible stations",
      "Try all starting stations O(N^2)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If tank drops below 0 when moving from start to i, no station between start and i can be a valid start; start must be at least i + 1.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Dijkstra Greedy Choice",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the greedy choice in Dijkstra's algorithm at each step?",
    "options": [
      "Extract the unvisited vertex with the minimum known distance from source",
      "Extract vertex with maximum edges",
      "Pick random unvisited neighbor",
      "Visit deepest vertex first"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Greedily picking the vertex with smallest tentative distance ensures its shortest path is settled since all edge weights are non-negative.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Greedy",
    "subtopic": "Job Sequencing with Deadlines",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Job Sequencing with Deadlines, to maximize profit where each job takes 1 unit of time, each sorted job should be scheduled:",
    "options": [
      "At the latest available time slot before or on its deadline",
      "At the earliest possible time slot",
      "Immediately at time 0",
      "At time equal to profit"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Scheduling a high-profit job as late as possible before its deadline reserves earlier time slots for jobs with tighter deadlines.",
    "tags": [
      "DSA",
      "Greedy",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Separate Chaining vs Open Addressing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the key difference in collision resolution between Separate Chaining and Open Addressing?",
    "options": [
      "Chaining stores collided elements in linked lists outside the table; Open Addressing finds another slot within the table",
      "Open addressing uses more memory",
      "Chaining cannot resize",
      "Open addressing requires tree data structures"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Separate Chaining maintains a linked list (or tree) per bucket, while Open Addressing probes subsequent indices in the primary array.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Linear Probing Primary Clustering",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary clustering phenomenon in Open Addressing with linear probing?",
    "options": [
      "Long contiguous occupied blocks form, increasing the average search and insertion probe length",
      "Hash values all collide at index 0",
      "Load factor exceeds 1.0",
      "Hash functions produce negative numbers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Any key hashing to any cell in a cluster extends the cluster, accelerating cluster growth exponentially.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Consistent Hashing",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In distributed caching systems, what problem does Consistent Hashing solve when adding or removing cache nodes?",
    "options": [
      "Only K/N keys need to be remapped on average instead of virtually all keys under standard modular hashing",
      "Eliminates network latency",
      "Guarantees zero collisions",
      "Encrypts cache values"
    ],
    "correctAnswerIndex": 0,
    "explanation": "With traditional `hash(key) % N`, changing N remaps almost 100% of keys. Consistent Hashing places nodes and keys on a circular ring, remeasuring only adjacent keys.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Robin Hood Hashing",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does Robin Hood Hashing optimize probe length variance in open addressing?",
    "options": [
      "During collision, a key further from its ideal home position steals the slot from an element closer to its home",
      "It uses cryptographic hashing",
      "It doubles table size every insertion",
      "It uses two hash tables in parallel"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'Takes from the rich (short probe distance) and gives to the poor (long probe distance)', minimizing maximum search time.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Cuckoo Hashing",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the defining performance characteristic of Cuckoo Hashing?",
    "options": [
      "Worst-case O(1) lookup time using two independent hash functions",
      "O(log N) worst case lookup",
      "O(N) memory overhead",
      "Uses linked lists in memory"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A key can only ever reside in one of two specific locations (hash1(key) or hash2(key)), guaranteeing O(1) worst-case lookup.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Load Factor Rehashing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Java's HashMap, what default load factor triggers doubling of the internal bucket array capacity?",
    "options": [
      "0.75",
      "0.50",
      "1.00",
      "0.90"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A load factor of 0.75 provides an optimal trade-off between memory consumption and lookup probe collisions.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Hashing",
    "subtopic": "Two Sum Optimal",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Using a Hash Map, what is the time and space complexity to find two indices in an unsorted array that sum to target S?",
    "options": [
      "O(N) time and O(N) auxiliary space",
      "O(N^2) time and O(1) space",
      "O(N log N) time and O(1) space",
      "O(1) time and O(N) space"
    ],
    "correctAnswerIndex": 0,
    "explanation": "For each element x, checking if (S - x) exists in the map takes O(1) average time, resulting in single-pass O(N) time and O(N) memory.",
    "tags": [
      "DSA",
      "Hashing",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Build Heap Complexity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the time complexity to build a binary heap from an arbitrary unsorted array of size N using bottom-up heapify?",
    "options": [
      "O(N)",
      "O(N log N)",
      "O(log N)",
      "O(N^2)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Summing h * (N / 2^(h+1)) across all tree levels evaluates to a convergent Taylor series bounded strictly by O(N), not O(N log N).",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Array Representation Indexing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In a 0-indexed binary heap array, what are the left child, right child, and parent indices of node at index i?",
    "options": [
      "Left: 2i + 1, Right: 2i + 2, Parent: floor((i - 1) / 2)",
      "Left: 2i, Right: 2i + 1, Parent: i / 2",
      "Left: i + 1, Right: i + 2, Parent: i - 1",
      "Left: 2i - 1, Right: 2i, Parent: i / 2"
    ],
    "correctAnswerIndex": 0,
    "explanation": "For 0-based indexing: left child is at 2i + 1, right child is at 2i + 2, and parent is at (i - 1) // 2.",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Kth Largest Element",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the most space-efficient data structure to find the K-th largest element in an incoming stream of N numbers?",
    "options": [
      "Min-Heap of size K",
      "Max-Heap of size N",
      "Sorted Array of size N",
      "Queue of size K"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A min-heap of size K keeps the K largest elements seen so far; its root is always the K-th largest, requiring only O(K) space.",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Fibonacci Heap Advantage",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What operation does a Fibonacci Heap perform in amortized O(1) time that takes O(log N) in a standard Binary Heap?",
    "options": [
      "decrease-key and insert",
      "extract-min",
      "delete",
      "heap-sort"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Fibonacci Heaps defer tree consolidation until extract-min, enabling decrease-key and insert to execute in amortized O(1) time.",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Merge K Sorted Lists",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Using a Min-Heap, what is the time complexity to merge K sorted linked lists having a total of N nodes across all lists?",
    "options": [
      "O(N log K)",
      "O(N * K)",
      "O(K log N)",
      "O(N log N)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The min-heap holds at most K elements (heads of K lists) at any moment. For each of the N elements, extract-min and insert takes O(log K), totaling O(N log K).",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Median from Data Stream",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "The 'Find Median from Data Stream' problem balances elements in real-time using:",
    "options": [
      "A Max-Heap for the lower half and a Min-Heap for the upper half",
      "A single binary search tree",
      "Two stacks",
      "A circular array"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Balancing sizes so max_heap stores smaller half and min_heap stores larger half gives O(1) median access and O(log N) insertion.",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Heaps",
    "subtopic": "Heap Property Invariant",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the fundamental invariant of a Max-Heap?",
    "options": [
      "Every parent node's value is greater than or equal to the values of its children",
      "All leaf nodes have equal values",
      "Inorder traversal is strictly sorted",
      "Left child must always be strictly less than right child"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A max-heap guarantees only that parent >= children; unlike a BST, there is no horizontal ordering between left and right siblings.",
    "tags": [
      "DSA",
      "Heaps",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Auto-complete",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does a Trie support fast autocomplete prefix queries in a dictionary?",
    "options": [
      "Traverse down to prefix end node in O(P) time, then perform DFS/BFS to collect all subtree words",
      "Scan all dictionary words sequentially",
      "Binary search on unsorted words",
      "Hash the prefix and compare"
    ],
    "correctAnswerIndex": 0,
    "explanation": "All words sharing prefix P share the identical ancestor path up to node P, allowing subtree traversal to retrieve matching completions.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Space Optimization Compressed Trie",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is a Radix Tree (Patricia Trie) compared to a standard character Trie?",
    "options": [
      "A space-optimized Trie where every non-branching node is merged with its child edge (edges hold substrings)",
      "A Trie that uses hashing instead of arrays",
      "A Trie with depth limited to 3",
      "A binary search tree"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Single-child paths are compressed into single edges storing substrings, drastically reducing the total number of nodes.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Bitwise Trie Max XOR",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "To find the maximum XOR of two numbers in an array in O(N * 32) time, numbers are inserted into a Binary Trie bit-by-bit from:",
    "options": [
      "Most Significant Bit (MSB) to Least Significant Bit (LSB)",
      "LSB to MSB",
      "Middle bit outwards",
      "Random bit order"
    ],
    "correctAnswerIndex": 0,
    "explanation": "To maximize XOR, we greedily seek the opposite bit at the highest possible position (MSB), since 2^31 outweighs the sum of all lower bits.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Wildcard Matching",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "When searching for a pattern with '.' (matches any single character) in a Trie, how does the search proceed?",
    "options": [
      "Branch recursively into all non-null children of the current node",
      "Return false immediately",
      "Stop search at '.'",
      "Treat '.' as root"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The wildcard '.' matches any character, requiring branching into every child node at the current depth.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Word Search II Complexity",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In the Boggle / Word Search II 2D grid problem, why is inserting dictionary words into a Trie better than searching each word independently?",
    "options": [
      "Allows pruning grid DFS backtracking immediately when current path prefix does not exist in the Trie",
      "Trie uses less disk space",
      "Grid does not need to be traversed",
      "Avoids checking boundary conditions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If the character sequence formed so far on the grid is not a prefix of any dictionary word, the DFS branch terminates immediately.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Alphabet Array vs Map",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "For standard lowercase English alphabet (a-z), what is the size of the child pointer array in each standard Trie node?",
    "options": [
      "26 pointers",
      "256 pointers",
      "52 pointers",
      "Dynamic list"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each node allocates 26 pointers child[0..25] where index = char - 'a', achieving O(1) child lookups.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Tries",
    "subtopic": "Prefix Tree Deletion",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When deleting a word from a Trie, when can a Trie node be safely deallocated from memory?",
    "options": [
      "When it is not marked as end-of-word and has zero remaining non-null children",
      "Immediately when delete() is called",
      "Only root can be deleted",
      "Whenever end-of-word is set to false"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A node can only be freed if it no longer serves as an internal prefix node for any other dictionary word.",
    "tags": [
      "DSA",
      "Tries",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "N-Queens Constraint",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In the N-Queens problem on an N x N chessboard, what mathematical relationship identifies that two queens at (r1, c1) and (r2, c2) share the same diagonal?",
    "options": [
      "r1 - c1 == r2 - c2 or r1 + c1 == r2 + c2",
      "r1 * c1 == r2 * c2",
      "r1 + r2 == c1 + c2",
      "r1 / c1 == r2 / c2"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Major diagonals have constant (r - c) and minor anti-diagonals have constant (r + c), enabling O(1) conflict detection using hash sets or boolean arrays.",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "Sudoku Solver Complexity",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In standard 9x9 Sudoku solver backtracking, how many candidate numbers (1-9) are tested for each empty cell?",
    "options": [
      "Only numbers that do not already appear in the same row, column, and 3x3 subgrid box",
      "All 9 numbers unconditionally",
      "Numbers 1 through 5 only",
      "Depends on board symmetry"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Validating row, column, and box constraints before recursing prunes invalid branches before exploring deeper subtrees.",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "State Restoration",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the defining characteristic of Backtracking compared to simple Depth First Search?",
    "options": [
      "Reverting (undoing) the state changes after the recursive branch returns before trying the next choice",
      "Using a queue instead of call stack",
      "Sorting all candidates first",
      "Ignoring leaf nodes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Backtracking mutates shared state (e.g. board, path) on the forward step and explicitly un-mutates (backtracks) when returning to explore sibling choices.",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "Permutations with Duplicates",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "To generate unique permutations of an array containing duplicates like [1, 1, 2], how are redundant branches skipped after sorting?",
    "options": [
      "if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;",
      "Skip all duplicate elements entirely",
      "Use a hash set on output",
      "Permutations cannot have duplicates"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Enforcing that identical numbers can only be picked in order (if nums[i-1] is not yet used in current permutation, picking nums[i] would create a duplicate subtree).",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "Combination Sum Pruning",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Combination Sum where candidates can be used repeatedly to reach target T, sorting candidates in ascending order allows which pruning optimization?",
    "options": [
      "If candidate > remaining_target, break the loop immediately since all subsequent candidates will also exceed target",
      "Stop at target / 2",
      "Convert to greedy choice",
      "Skip all odd numbers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because the array is sorted, as soon as a candidate exceeds remaining target, all subsequent larger candidates will also exceed it, saving iterations.",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "Graph Coloring NP-Complete",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is the m-Coloring Decision Problem on graphs solved by backtracking?",
    "options": [
      "Determine if vertices can be colored using at most m colors such that no two adjacent vertices share the same color",
      "Find minimum spanning tree with m colors",
      "Color edges of graph",
      "Find Hamiltonian cycle"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The m-Coloring problem assigns colors 1..m to vertices ensuring for every edge (u, v), color(u) != color(v); backtracking explores colorings with constraint checks.",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  },
  {
    "subject": "DSA",
    "topic": "Backtracking",
    "subtopic": "Hamiltonian Path vs Eulerian",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why does finding a Hamiltonian Path (visits every vertex once) require backtracking O(N!) whereas an Eulerian Path (visits every edge once) runs in O(E)?",
    "options": [
      "Hamiltonian path is NP-complete, while Eulerian path is polynomial (Euler's theorem on vertex degrees)",
      "Hamiltonian path only works on trees",
      "Eulerian paths require negative weights",
      "Backtracking cannot be used on edges"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Eulerian path existence is determined purely by vertex in/out degrees (O(V+E)), whereas Hamiltonian path requires exhaustive NP-complete search in the general case.",
    "tags": [
      "DSA",
      "Backtracking",
      "Algorithms",
      "GATE",
      "FAANG"
    ],
    "examRelevance": "GATE CS & IT, University Exams",
    "placementRelevance": "Google, Amazon, Microsoft, Uber OA"
  }
];
