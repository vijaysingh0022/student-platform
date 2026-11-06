/**
 * LearnX Academic Diagram Registry & Visual Synthesis Engine
 * 
 * Provides vector-perfect, responsive academic diagrams with:
 * - High aesthetic clarity (custom gradients, soft borders, crisp typography)
 * - Directional arrows & accurate mappings (e.g. Three-Schema Architecture, Process State, OSI, TCP)
 * - Fully downloadable (SVG / PNG) and zoomable
 * - Embedded explanation and university exam labels
 */

export const ACADEMIC_DIAGRAMS = {
  // ── 1. DBMS: THREE-SCHEMA ARCHITECTURE ───────────────────────────────────────
  "dbms_three_schema_architecture": {
    id: "dbms_three_schema_architecture",
    title: "Three-Schema (ANSI/SPARC) Architecture of DBMS",
    figure: "Figure 1.1",
    subject: "DBMS",
    category: "Architecture",
    caption: "The ANSI/SPARC Three-Level Architecture displaying separation of External, Conceptual, and Internal levels with logical and physical data independence mappings.",
    tags: ["three-schema", "ansi sparc", "three level", "database architecture", "external schema", "conceptual schema", "internal schema", "data independence"],
    svg: `<svg viewBox="0 0 800 620" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
  <defs>
    <linearGradient id="extGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="concGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
    <linearGradient id="intGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b"/>
    </marker>
    <marker id="doubleArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569"/>
    </marker>
  </defs>

  <!-- Canvas Background -->
  <rect width="100%" height="100%" fill="#f8fafc" rx="16"/>

  <!-- Level 1: External Level (Views) -->
  <g transform="translate(60, 40)">
    <rect width="680" height="110" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="20" y="30" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#1e40af" letter-spacing="0.5">1. EXTERNAL LEVEL (View Level - End Users & Applications)</text>
    
    <!-- User Views -->
    <rect x="30" y="45" width="180" height="52" rx="8" fill="url(#extGrad)" filter="url(#shadow)"/>
    <text x="120" y="68" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">View 1 (Student View)</text>
    <text x="120" y="86" font-family="system-ui, sans-serif" font-size="11" fill="#dbeafe" text-anchor="middle">Grades, Enrolled Courses</text>

    <rect x="250" y="45" width="180" height="52" rx="8" fill="url(#extGrad)" filter="url(#shadow)"/>
    <text x="340" y="68" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">View 2 (Faculty View)</text>
    <text x="340" y="86" font-family="system-ui, sans-serif" font-size="11" fill="#dbeafe" text-anchor="middle">Salary, Class Attendance</text>

    <rect x="470" y="45" width="180" height="52" rx="8" fill="url(#extGrad)" filter="url(#shadow)"/>
    <text x="560" y="68" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">View n (Admin View)</text>
    <text x="560" y="86" font-family="system-ui, sans-serif" font-size="11" fill="#dbeafe" text-anchor="middle">Complete Audit Records</text>
  </g>

  <!-- Mapping 1: External / Conceptual Mapping -->
  <g transform="translate(60, 150)">
    <!-- Connecting bidirectional arrows -->
    <line x1="150" y1="0" x2="280" y2="40" stroke="#94a3b8" stroke-width="2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    <line x1="340" y1="0" x2="340" y2="40" stroke="#94a3b8" stroke-width="2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    <line x1="530" y1="0" x2="400" y2="40" stroke="#94a3b8" stroke-width="2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    
    <!-- Badge -->
    <rect x="450" y="10" width="220" height="24" rx="12" fill="#e0e7ff" stroke="#c7d2fe"/>
    <text x="560" y="26" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#4338ca" text-anchor="middle">Logical Data Independence</text>
  </g>

  <!-- Level 2: Conceptual Level -->
  <g transform="translate(60, 195)">
    <rect width="680" height="100" rx="12" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="20" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#6b21a8" letter-spacing="0.5">2. CONCEPTUAL LEVEL (Logical Level - Community View)</text>

    <rect x="100" y="38" width="480" height="48" rx="8" fill="url(#concGrad)" filter="url(#shadow)"/>
    <text x="340" y="60" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">Conceptual Schema</text>
    <text x="340" y="76" font-family="system-ui, sans-serif" font-size="11" fill="#ede9fe" text-anchor="middle">Entities, Attributes, Relationships, Integrity Constraints & Security Rules</text>
  </g>

  <!-- Mapping 2: Conceptual / Internal Mapping -->
  <g transform="translate(60, 295)">
    <line x1="340" y1="0" x2="340" y2="45" stroke="#94a3b8" stroke-width="2.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    
    <rect x="450" y="10" width="220" height="24" rx="12" fill="#ede9fe" stroke="#ddd6fe"/>
    <text x="560" y="26" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#5b21b6" text-anchor="middle">Physical Data Independence</text>
  </g>

  <!-- Level 3: Internal Level -->
  <g transform="translate(60, 340)">
    <rect width="680" height="100" rx="12" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="20" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#0369a1" letter-spacing="0.5">3. INTERNAL LEVEL (Physical Level - Storage View)</text>

    <rect x="100" y="38" width="480" height="48" rx="8" fill="url(#intGrad)" filter="url(#shadow)"/>
    <text x="340" y="60" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">Internal Schema</text>
    <text x="340" y="76" font-family="system-ui, sans-serif" font-size="11" fill="#e0f2fe" text-anchor="middle">Record Formats, B+ Tree Indexes, Hashing, Compression & Block Allocations</text>
  </g>

  <!-- Mapping 3: OS / Storage Interface -->
  <g transform="translate(60, 440)">
    <line x1="340" y1="0" x2="340" y2="40" stroke="#94a3b8" stroke-width="2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
    <text x="355" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748b">OS File System Interface</text>
  </g>

  <!-- Physical Database Cylinder -->
  <g transform="translate(240, 480)">
    <rect width="320" height="95" rx="14" fill="url(#dbGrad)" filter="url(#shadow)"/>
    <text x="160" y="35" font-family="system-ui, sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">Physical Database</text>
    <text x="160" y="55" font-family="system-ui, sans-serif" font-size="11" fill="#ecfdf5" text-anchor="middle">Physical Disk / SSD / Storage Media</text>
    <text x="160" y="74" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#a7f3d0" text-anchor="middle">(Actual Binary Data, Data Files, Indexes & Transaction Logs)</text>
  </g>

  <!-- Legend / Footnote -->
  <g transform="translate(70, 588)">
    <circle cx="10" cy="10" r="4" fill="#3b82f6"/>
    <text x="20" y="14" font-family="system-ui, sans-serif" font-size="11" fill="#475569">External Level</text>
    <circle cx="140" cy="10" r="4" fill="#8b5cf6"/>
    <text x="150" y="14" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Conceptual Level</text>
    <circle cx="280" cy="10" r="4" fill="#0ea5e9"/>
    <text x="290" y="14" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Internal Level</text>
    <circle cx="410" cy="10" r="4" fill="#10b981"/>
    <text x="420" y="14" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Physical Storage</text>
  </g>
</svg>`,
    explanation: [
      "**1. External Level (View Level):** Highest level describing user-specific views. Users only see relevant data (e.g., student sees course list, faculty sees salary). Hides physical storage and other views.",
      "**2. Conceptual Level (Logical Level):** Community view designed by DBA. Describes *what* data is stored across the entire database, entity relationships, integrity constraints, and types without physical details.",
      "**3. Internal Level (Physical Level):** Describes *how* data is physically stored on disk (block allocation, B+ trees, clustering, hashing, and encryption algorithms).",
      "**4. Logical Data Independence:** Capacity to change the Conceptual schema without needing to rewrite External schemas or user application programs.",
      "**5. Physical Data Independence:** Capacity to change the Internal storage structures (e.g., adding an index, migrating to SSD) without modifying the Conceptual schema.",
    ],
  },

  // ── 2. OPERATING SYSTEMS: PROCESS STATE TRANSITION DIAGRAM ───────────────────
  "os_process_state_diagram": {
    id: "os_process_state_diagram",
    title: "Five-State Process Transition Model",
    figure: "Figure 2.1",
    subject: "OS",
    category: "State Machine",
    caption: "The canonical 5-state lifecycle of a process in Operating Systems: New, Ready, Running, Waiting (Blocked), and Terminated.",
    tags: ["process state", "process lifecycle", "five state model", "pcb", "cpu scheduling", "ready running waiting"],
    svg: `<svg viewBox="0 0 780 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
  <defs>
    <linearGradient id="pStateNew" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="pStateReady" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="pStateRunning" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="pStateWaiting" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="pStateTerm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
    <marker id="osArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#334155"/>
    </marker>
    <filter id="pDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.1"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="#f8fafc" rx="16"/>

  <!-- New State -->
  <rect x="40" y="160" width="105" height="55" rx="28" fill="url(#pStateNew)" filter="url(#pDrop)"/>
  <text x="92" y="193" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">NEW</text>

  <!-- Ready State -->
  <rect x="230" y="160" width="115" height="55" rx="28" fill="url(#pStateReady)" filter="url(#pDrop)"/>
  <text x="287" y="193" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">READY</text>

  <!-- Running State -->
  <rect x="440" y="160" width="120" height="55" rx="28" fill="url(#pStateRunning)" filter="url(#pDrop)"/>
  <text x="500" y="193" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">RUNNING</text>

  <!-- Terminated State -->
  <rect x="640" y="160" width="110" height="55" rx="28" fill="url(#pStateTerm)" filter="url(#pDrop)"/>
  <text x="695" y="193" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">TERMINATED</text>

  <!-- Waiting / Blocked State -->
  <rect x="330" y="300" width="130" height="55" rx="28" fill="url(#pStateWaiting)" filter="url(#pDrop)"/>
  <text x="395" y="333" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">WAITING</text>

  <!-- Transitions -->
  <!-- 1. New -> Ready (Admitted) -->
  <path d="M 145 187 L 222 187" stroke="#334155" stroke-width="2" marker-end="url(#osArrow)"/>
  <text x="183" y="178" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Admitted</text>

  <!-- 2. Ready -> Running (Scheduler Dispatch) -->
  <path d="M 345 178 L 432 178" stroke="#334155" stroke-width="2" marker-end="url(#osArrow)"/>
  <text x="390" y="170" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#1e40af" text-anchor="middle">Scheduler Dispatch</text>

  <!-- 3. Running -> Ready (Interrupt / Time slice expired) -->
  <path d="M 470 160 C 430 110, 340 110, 300 160" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#osArrow)"/>
  <text x="385" y="115" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Interrupt (Time-Slice Expired)</text>

  <!-- 4. Running -> Terminated (Exit) -->
  <path d="M 560 187 L 632 187" stroke="#334155" stroke-width="2" marker-end="url(#osArrow)"/>
  <text x="596" y="178" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#b91c1c" text-anchor="middle">Exit</text>

  <!-- 5. Running -> Waiting (I/O or Event Wait) -->
  <path d="M 500 215 C 500 270, 480 320, 465 325" fill="none" stroke="#d97706" stroke-width="2" marker-end="url(#osArrow)"/>
  <text x="525" y="275" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#b45309">I/O or Event Wait</text>

  <!-- 6. Waiting -> Ready (I/O or Event Completion) -->
  <path d="M 330 325 C 270 325, 270 260, 280 220" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#osArrow)"/>
  <text x="180" y="280" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#1d4ed8">I/O or Event Done</text>
</svg>`,
    explanation: [
      "**New:** Process is being created in secondary memory and initialized with a PCB.",
      "**Ready:** Process resides in main memory, fully prepared and waiting for CPU allocation by the short-term scheduler.",
      "**Running:** Instructions are actively being executed on the CPU core.",
      "**Waiting (Blocked):** Process cannot run until an asynchronous event or I/O operation completes (placed on I/O queue).",
      "**Terminated:** Process has finished execution; OS deallocates resources and reclaims memory.",
    ],
  },

  // ── 3. NETWORKING: TCP THREE-WAY HANDSHAKE ────────────────────────────────────
  "cn_tcp_threeway_handshake": {
    id: "cn_tcp_threeway_handshake",
    title: "TCP 3-Way Handshake Connection Establishment",
    figure: "Figure 3.1",
    subject: "CN",
    category: "Sequence Diagram",
    caption: "Chronological message sequence (SYN, SYN-ACK, ACK) ensuring reliable full-duplex transmission between client and server.",
    tags: ["tcp handshake", "three way handshake", "syn ack", "connection establishment", "transmission control protocol"],
    svg: `<svg viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
  <defs>
    <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
    <marker id="tcpArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1e293b"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#f8fafc" rx="16"/>

  <!-- Client Host -->
  <rect x="100" y="30" width="160" height="50" rx="10" fill="url(#clientGrad)"/>
  <text x="180" y="55" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">CLIENT</text>
  <text x="180" y="70" font-family="system-ui, sans-serif" font-size="10" fill="#dbeafe" text-anchor="middle">(Active Open)</text>

  <!-- Server Host -->
  <rect x="500" y="30" width="160" height="50" rx="10" fill="url(#serverGrad)"/>
  <text x="580" y="55" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">SERVER</text>
  <text x="580" y="70" font-family="system-ui, sans-serif" font-size="10" fill="#ede9fe" text-anchor="middle">(Passive Open / LISTEN)</text>

  <!-- Timelines -->
  <line x1="180" y1="80" x2="180" y2="400" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="6,4"/>
  <line x1="580" y1="80" x2="580" y2="400" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="6,4"/>

  <!-- Step 1: SYN -->
  <line x1="180" y1="120" x2="572" y2="180" stroke="#2563eb" stroke-width="2.5" marker-end="url(#tcpArrow)"/>
  <rect x="270" y="115" width="220" height="36" rx="6" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="380" y="132" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#1e40af" text-anchor="middle">Step 1: SYN = 1, Seq = x</text>
  <text x="380" y="145" font-family="system-ui, sans-serif" font-size="10" fill="#3b82f6" text-anchor="middle">(Client synchronizes its ISN)</text>

  <!-- Step 2: SYN + ACK -->
  <line x1="580" y1="210" x2="188" y2="270" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#tcpArrow)"/>
  <rect x="250" y="205" width="260" height="36" rx="6" fill="#faf5ff" stroke="#e9d5ff"/>
  <text x="380" y="222" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#6d28d9" text-anchor="middle">Step 2: SYN = 1, ACK = 1, Seq = y, Ack = x + 1</text>
  <text x="380" y="235" font-family="system-ui, sans-serif" font-size="10" fill="#8b5cf6" text-anchor="middle">(Server acknowledges and sends its own ISN)</text>

  <!-- Step 3: ACK -->
  <line x1="180" y1="300" x2="572" y2="360" stroke="#059669" stroke-width="2.5" marker-end="url(#tcpArrow)"/>
  <rect x="270" y="295" width="220" height="36" rx="6" fill="#ecfdf5" stroke="#a7f3d0"/>
  <text x="380" y="312" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#047857" text-anchor="middle">Step 3: ACK = 1, Seq = x + 1, Ack = y + 1</text>
  <text x="380" y="325" font-family="system-ui, sans-serif" font-size="10" fill="#10b981" text-anchor="middle">(Connection Established / Ready for Data)</text>

  <!-- State badges -->
  <rect x="90" y="275" width="90" height="22" rx="4" fill="#dcfce7" stroke="#86efac"/>
  <text x="135" y="290" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#166534" text-anchor="middle">ESTABLISHED</text>

  <rect x="580" y="365" width="90" height="22" rx="4" fill="#dcfce7" stroke="#86efac"/>
  <text x="625" y="380" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#166534" text-anchor="middle">ESTABLISHED</text>
</svg>`,
    explanation: [
      "**Step 1 (SYN):** The client sends a segment with `SYN=1` and an Initial Sequence Number (`Seq = x`) to initiate connection setup.",
      "**Step 2 (SYN-ACK):** The server allocates transmission buffers and replies with `SYN=1`, `ACK=1`, acknowledging the client's packet with `Ack = x + 1` and advertising its own ISN (`Seq = y`).",
      "**Step 3 (ACK):** The client acknowledges receipt with `ACK=1` and `Ack = y + 1`. Both sockets transition to the `ESTABLISHED` state.",
    ],
  },

  // ── 4. NETWORKING: OSI 7-LAYER MODEL ─────────────────────────────────────────
  "cn_osi_model": {
    id: "cn_osi_model",
    title: "ISO/OSI Reference Model Architecture",
    figure: "Figure 4.1",
    subject: "CN",
    category: "Architecture",
    caption: "The 7 abstraction layers of the OSI model with standard protocol data units (PDUs) and corresponding network devices.",
    tags: ["osi model", "7 layers", "open systems interconnection", "iso osi", "osi reference model", "networking layers"],
    svg: `<svg viewBox="0 0 780 460" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
  <defs>
    <filter id="osiShadow"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.06"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="#f8fafc" rx="16"/>

  <g transform="translate(40, 25)">
    <!-- Headers -->
    <text x="80" y="20" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#475569">LAYER</text>
    <text x="260" y="20" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#475569">PRIMARY RESPONSIBILITY</text>
    <text x="490" y="20" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#475569">DATA UNIT (PDU)</text>
    <text x="630" y="20" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#475569">PROTOCOLS</text>

    <!-- Layer 7 -->
    <rect x="0" y="35" width="700" height="48" rx="8" fill="#eff6ff" stroke="#bfdbfe" filter="url(#osiShadow)"/>
    <rect x="10" y="44" width="130" height="30" rx="6" fill="#2563eb"/>
    <text x="75" y="64" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">7. Application</text>
    <text x="160" y="64" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">Network services to user applications</text>
    <text x="490" y="64" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#2563eb">Data / Message</text>
    <text x="630" y="64" font-family="system-ui, sans-serif" font-size="11" fill="#475569">HTTP, DNS, SMTP</text>

    <!-- Layer 6 -->
    <rect x="0" y="90" width="700" height="48" rx="8" fill="#f5f3ff" stroke="#ddd6fe" filter="url(#osiShadow)"/>
    <rect x="10" y="99" width="130" height="30" rx="6" fill="#7c3aed"/>
    <text x="75" y="119" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">6. Presentation</text>
    <text x="160" y="119" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">Data translation, encryption, and compression</text>
    <text x="490" y="119" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#7c3aed">Data</text>
    <text x="630" y="119" font-family="system-ui, sans-serif" font-size="11" fill="#475569">SSL/TLS, JPEG, ASCII</text>

    <!-- Layer 5 -->
    <rect x="0" y="145" width="700" height="48" rx="8" fill="#faf5ff" stroke="#e9d5ff" filter="url(#osiShadow)"/>
    <rect x="10" y="154" width="130" height="30" rx="6" fill="#9333ea"/>
    <text x="75" y="174" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">5. Session</text>
    <text x="160" y="174" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">Dialog control, synchronization, checkpointing</text>
    <text x="490" y="174" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#9333ea">Data</text>
    <text x="630" y="174" font-family="system-ui, sans-serif" font-size="11" fill="#475569">RPC, NetBIOS, PPTP</text>

    <!-- Layer 4 -->
    <rect x="0" y="200" width="700" height="48" rx="8" fill="#ecfeff" stroke="#a5f3fc" filter="url(#osiShadow)"/>
    <rect x="10" y="209" width="130" height="30" rx="6" fill="#0891b2"/>
    <text x="75" y="229" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">4. Transport</text>
    <text x="160" y="229" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">End-to-end delivery, flow & error control</text>
    <text x="490" y="229" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0891b2">Segment / Datagram</text>
    <text x="630" y="229" font-family="system-ui, sans-serif" font-size="11" fill="#475569">TCP, UDP</text>

    <!-- Layer 3 -->
    <rect x="0" y="255" width="700" height="48" rx="8" fill="#f0fdf4" stroke="#bbf7d0" filter="url(#osiShadow)"/>
    <rect x="10" y="264" width="130" height="30" rx="6" fill="#16a34a"/>
    <text x="75" y="284" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">3. Network</text>
    <text x="160" y="284" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">Logical routing, packet forwarding & IP addressing</text>
    <text x="490" y="284" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#16a34a">Packet</text>
    <text x="630" y="284" font-family="system-ui, sans-serif" font-size="11" fill="#475569">IPv4, IPv6, ICMP</text>

    <!-- Layer 2 -->
    <rect x="0" y="310" width="700" height="48" rx="8" fill="#fffbeb" stroke="#fde68a" filter="url(#osiShadow)"/>
    <rect x="10" y="319" width="130" height="30" rx="6" fill="#d97706"/>
    <text x="75" y="339" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">2. Data Link</text>
    <text x="160" y="339" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">Framing, MAC physical addressing, hop-to-hop flow</text>
    <text x="490" y="339" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#d97706">Frame</text>
    <text x="630" y="339" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Ethernet, Wi-Fi, PPP</text>

    <!-- Layer 1 -->
    <rect x="0" y="365" width="700" height="48" rx="8" fill="#fef2f2" stroke="#fecaca" filter="url(#osiShadow)"/>
    <rect x="10" y="374" width="130" height="30" rx="6" fill="#dc2626"/>
    <text x="75" y="394" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">1. Physical</text>
    <text x="160" y="394" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b">Unstructured raw bit stream transmission over physical media</text>
    <text x="490" y="394" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#dc2626">Bits</text>
    <text x="630" y="394" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Cables, Fiber, Hubs</text>
  </g>
</svg>`,
    explanation: [
      "**Layers 5-7 (Software/Application Layers):** Implemented in user-space and OS software; focuses on user experience, format conversion, and session states.",
      "**Layer 4 (Heart of OSI):** Bridges user applications with network communications, offering reliable flow control, port addressing, and error detection.",
      "**Layers 1-3 (Hardware/Network Layers):** Implemented in network devices (routers, switches, NICs) to route packets across diverse physical links.",
    ],
  },

  // ── 5. DAA / DATA STRUCTURES: BINARY SEARCH FLOWCHART ─────────────────────────
  "dsa_binary_search_flowchart": {
    id: "dsa_binary_search_flowchart",
    title: "Binary Search Divide & Conquer Algorithm Flowchart",
    figure: "Figure 5.1",
    subject: "DAA",
    category: "Flowchart",
    caption: "Algorithmic decision tree for logarithmic O(log N) search on a pre-sorted contiguous array.",
    tags: ["binary search", "binary search flowchart", "divide and conquer", "log n search", "array search"],
    svg: `<svg viewBox="0 0 740 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
  <defs>
    <marker id="flowArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#f8fafc" rx="16"/>

  <!-- Start -->
  <rect x="300" y="20" width="140" height="42" rx="21" fill="#0284c7"/>
  <text x="370" y="46" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">START</text>

  <line x1="370" y1="62" x2="370" y2="88" stroke="#334155" stroke-width="2" marker-end="url(#flowArrow)"/>

  <!-- Init low, high -->
  <polygon points="260,90 480,90 460,132 240,132" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="360" y="116" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0369a1" text-anchor="middle">low = 0, high = n - 1</text>

  <line x1="360" y1="132" x2="360" y2="160" stroke="#334155" stroke-width="2" marker-end="url(#flowArrow)"/>

  <!-- While low <= high -->
  <polygon points="360,160 460,195 360,230 260,195" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="360" y="199" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#92400e" text-anchor="middle">low &lt;= high ?</text>

  <!-- No branch -> Not Found -->
  <line x1="460" y1="195" x2="600" y2="195" stroke="#dc2626" stroke-width="2" marker-end="url(#flowArrow)"/>
  <text x="510" y="188" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#dc2626">No</text>
  <rect x="600" y="175" width="115" height="40" rx="8" fill="#fee2e2" stroke="#fca5a5"/>
  <text x="657" y="199" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#991b1b" text-anchor="middle">Return -1 (Not Found)</text>

  <!-- Yes branch -> Calculate mid -->
  <line x1="360" y1="230" x2="360" y2="260" stroke="#16a34a" stroke-width="2" marker-end="url(#flowArrow)"/>
  <text x="375" y="248" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#16a34a">Yes</text>
  <rect x="250" y="260" width="220" height="38" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="360" y="284" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">mid = low + (high - low)/2</text>

  <line x1="360" y1="298" x2="360" y2="330" stroke="#334155" stroke-width="2" marker-end="url(#flowArrow)"/>

  <!-- Decision: arr[mid] == target -->
  <polygon points="360,330 460,365 360,400 260,365" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="360" y="369" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#92400e" text-anchor="middle">arr[mid] == target ?</text>

  <!-- Equal -> Return mid -->
  <line x1="460" y1="365" x2="600" y2="365" stroke="#16a34a" stroke-width="2" marker-end="url(#flowArrow)"/>
  <text x="510" y="358" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#16a34a">Yes</text>
  <rect x="600" y="345" width="115" height="40" rx="8" fill="#dcfce7" stroke="#86efac"/>
  <text x="657" y="370" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#166534" text-anchor="middle">Return mid (Found!)</text>

  <!-- Not equal -> check if arr[mid] < target -->
  <line x1="360" y1="400" x2="360" y2="430" stroke="#334155" stroke-width="2"/>
  <line x1="360" y1="430" x2="230" y2="430" stroke="#334155" stroke-width="2"/>
  <line x1="360" y1="430" x2="490" y2="430" stroke="#334155" stroke-width="2"/>

  <!-- Left: arr[mid] < target => low = mid + 1 -->
  <line x1="230" y1="430" x2="230" y2="455" stroke="#334155" stroke-width="2" marker-end="url(#flowArrow)"/>
  <rect x="150" y="455" width="160" height="32" rx="6" fill="#f8fafc" stroke="#94a3b8"/>
  <text x="230" y="475" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">low = mid + 1</text>

  <!-- Right: arr[mid] > target => high = mid - 1 -->
  <line x1="490" y1="430" x2="490" y2="455" stroke="#334155" stroke-width="2" marker-end="url(#flowArrow)"/>
  <rect x="410" y="455" width="160" height="32" rx="6" fill="#f8fafc" stroke="#94a3b8"/>
  <text x="490" y="475" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">high = mid - 1</text>
</svg>`,
    explanation: [
      "**1. Pre-requisite:** Array elements must be monotonically sorted in ascending order.",
      "**2. Time Complexity:** Best Case: O(1) (found at middle on first try), Average/Worst Case: O(log₂ N).",
      "**3. Space Complexity:** O(1) iterative, O(log N) recursive call stack.",
    ],
  },
};

/**
 * Intelligent Diagram Detector: Evaluates user prompt, topicId, and subjectId
 * to determine whether an academic diagram is required.
 */
export function detectDiagram(topicId = "", subjectId = "", question = "") {
  const text = `${topicId} ${subjectId} ${question}`.toLowerCase();

  // 1. Check Three-Schema Architecture (DBMS)
  if (
    text.includes("three-schema") ||
    text.includes("three schema") ||
    text.includes("ansi/sparc") ||
    text.includes("ansi sparc") ||
    text.includes("3-schema") ||
    text.includes("three level architecture") ||
    (text.includes("schema architecture") && text.includes("dbms"))
  ) {
    return ACADEMIC_DIAGRAMS["dbms_three_schema_architecture"];
  }

  // 2. Check Process State Transition (OS)
  if (
    text.includes("process state") ||
    text.includes("five state") ||
    text.includes("process lifecycle") ||
    text.includes("process transition") ||
    (text.includes("state diagram") && (text.includes("os") || text.includes("operating")))
  ) {
    return ACADEMIC_DIAGRAMS["os_process_state_diagram"];
  }

  // 3. Check TCP 3-Way Handshake (CN)
  if (
    text.includes("three-way handshake") ||
    text.includes("three way handshake") ||
    text.includes("3-way handshake") ||
    text.includes("tcp handshake") ||
    text.includes("syn ack")
  ) {
    return ACADEMIC_DIAGRAMS["cn_tcp_threeway_handshake"];
  }

  // 4. Check OSI Model (CN)
  if (
    text.includes("osi") ||
    text.includes("iso/osi") ||
    text.includes("open systems interconnection")
  ) {
    return ACADEMIC_DIAGRAMS["cn_osi_model"];
  }

  // 5. Check Binary Search Flowchart (DSA/DAA)
  if (
    text.includes("binary search") &&
    (text.includes("flowchart") || text.includes("algorithm") || text.includes("diagram") || text.includes("steps"))
  ) {
    return ACADEMIC_DIAGRAMS["dsa_binary_search_flowchart"];
  }

  // Fallback: Check if generic diagram tags match any entry
  for (const key of Object.keys(ACADEMIC_DIAGRAMS)) {
    const item = ACADEMIC_DIAGRAMS[key];
    for (const tag of item.tags) {
      if (text.includes(tag)) {
        return item;
      }
    }
  }

  return null;
}
