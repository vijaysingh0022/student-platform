import React, { useState } from "react";

const TOPIC_PRESETS = {
  network_layers: {
    title: "OSI 7-Layer Protocol Architecture & Packet Encapsulation",
    badge: "Computer Networks Flow",
    nodes: [
      { id: "app", name: "7. Application Layer", desc: "User interface & protocols (HTTP, HTTPS, DNS, FTP)", pdu: "Data" },
      { id: "pres", name: "6. Presentation Layer", desc: "Data translation, compression, and SSL/TLS encryption", pdu: "Data" },
      { id: "sess", name: "5. Session Layer", desc: "Establishes, manages, and terminates network sessions", pdu: "Data" },
      { id: "trans", name: "4. Transport Layer", desc: "End-to-end connection, segmentation (TCP 3-Way Handshake, UDP)", pdu: "Segment" },
      { id: "net", name: "3. Network Layer", desc: "Logical addressing & IP packet routing (IPv4/IPv6, Routers)", pdu: "Packet" },
      { id: "dl", name: "2. Data Link Layer", desc: "Physical MAC framing & error detection (Ethernet Switches, CRC)", pdu: "Frame" },
      { id: "phy", name: "1. Physical Layer", desc: "Raw bitstream transmission over physical cables or radio waves", pdu: "Bits" },
    ],
    analogy: "Like sending an international postal package: Letter written -> Put in envelope -> Stamped -> Boxed -> Routed via post office -> Transported by truck -> Delivered to mailbox!",
  },
  generic_concept: {
    title: "System Architectural Flow & Component Invariants",
    badge: "Structural Breakdown",
    nodes: [
      { id: "input", name: "1. System Inputs & Invariants", desc: "Input parameters, preconditions, schemas, and constraint boundaries", pdu: "Precondition" },
      { id: "process", name: "2. Procedural Processing Engine", desc: "Algorithmic transformation, state transitions, and coordination logic", pdu: "Processing" },
      { id: "validation", name: "3. Verification & Invariant Enforcement", desc: "ACID consistency, error boundaries, and edge case handling", pdu: "Invariant" },
      { id: "output", name: "4. Optimized State & Delivery", desc: "Final deterministic output, storage commit, and downstream delivery", pdu: "Result" },
    ],
    analogy: "Like a precision manufacturing pipeline: Raw components inspected -> Processed via assembly line -> Rigorously stress tested -> Shipped to consumers.",
  },
};

const GenericConceptVisualizer = ({ topicTitle = "Concept Architecture", subjectName = "Computer Science" }) => {
  const isNetwork = topicTitle.toLowerCase().includes("network") || topicTitle.toLowerCase().includes("osi") || topicTitle.toLowerCase().includes("layer");
  const data = isNetwork ? TOPIC_PRESETS.network_layers : TOPIC_PRESETS.generic_concept;

  const [activeNode, setActiveNode] = useState(data.nodes[0]);
  const [showAnalogy, setShowAnalogy] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
              {data.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400">{subjectName}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {topicTitle}: Concept Flow & Component Breakdown
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Step through components to observe input flows, transformation layers, and system guarantees.
          </p>
        </div>

        <button
          onClick={() => setShowAnalogy(!showAnalogy)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          {showAnalogy ? "Hide Analogy" : "💡 Real-Life Analogy"}
        </button>
      </div>

      {showAnalogy && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs space-y-1 animate-fade-in shadow-xs">
          <span className="font-black text-amber-900 block">💡 Everyday Analogy:</span>
          <p className="leading-relaxed">{data.analogy}</p>
        </div>
      )}

      {/* COMPONENT NODES FLOW */}
      <div className="space-y-3">
        {data.nodes.map((node, idx) => {
          const isActive = activeNode.id === node.id;
          return (
            <div key={node.id} className="space-y-1.5">
              <div
                onClick={() => setActiveNode(node)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? "bg-blue-50/90 border-blue-500 shadow-md scale-[1.01]"
                    : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs sm:text-sm font-black ${isActive ? "text-blue-950" : "text-slate-800"}`}>
                      {node.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      PDU / State: {node.pdu}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{node.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                    isActive ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                  }`}>
                    {isActive ? "Active Inspection" : "Inspect →"}
                  </span>
                </div>
              </div>

              {idx < data.nodes.length - 1 && (
                <div className="flex justify-center text-slate-400 text-xs font-bold py-0.5">
                  ↓ (Data Encapsulation & Protocol Flow)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenericConceptVisualizer;
