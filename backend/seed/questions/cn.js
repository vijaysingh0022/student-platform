// CN Question Bank (110 Questions)
export const CN_QUESTIONS = [
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "7-Layer Model Sequence",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the correct bottom-up sequence of the 7 layers of the ISO/OSI Reference Model?",
    "options": [
      "Physical \u2192 Data Link \u2192 Network \u2192 Transport \u2192 Session \u2192 Presentation \u2192 Application",
      "Physical \u2192 Network \u2192 Data Link \u2192 Transport \u2192 Session \u2192 Presentation \u2192 Application",
      "Application \u2192 Presentation \u2192 Session \u2192 Transport \u2192 Network \u2192 Data Link \u2192 Physical",
      "Data Link \u2192 Physical \u2192 Network \u2192 Transport \u2192 Presentation \u2192 Session \u2192 Application"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 7 layers from Layer 1 (bottom) to Layer 7 (top) are Physical, Data Link, Network, Transport, Session, Presentation, Application.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Presentation Layer Role",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which layer of the OSI model is responsible for Data Encryption, Compression, and Translation (e.g. ASCII to EBCDIC)?",
    "options": [
      "Presentation Layer (Layer 6)",
      "Application Layer",
      "Session Layer",
      "Transport Layer"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Presentation layer formats syntax and semantics of information exchanged, handling compression, serialization, and cryptographic encryption.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Session Layer Checkpointing",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary role of the Session Layer (Layer 5) in file transfer protocols?",
    "options": [
      "Managing dialog control, token management, and inserting synchronization checkpoints to resume interrupted transfers",
      "Routing packets across routers",
      "Framing bit streams",
      "Modulating electrical signals"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Session layer introduces synchronization points into the data stream so that in case of a crash, retransmission resumes from the last checkpoint.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Data Link Layer Framing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "The Protocol Data Unit (PDU) at Layer 2 (Data Link Layer) is called a:",
    "options": [
      "Frame",
      "Packet",
      "Segment",
      "Bit stream"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PDU terminology: Layer 1 = Bits, Layer 2 = Frames, Layer 3 = Packets, Layer 4 = Segments, Layer 5-7 = Data/Messages.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Transport Layer Port Numbers",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which OSI layer is responsible for End-to-End (Process-to-Process) communication using Port numbers?",
    "options": [
      "Transport Layer (Layer 4)",
      "Network Layer (Layer 3)",
      "Data Link Layer (Layer 2)",
      "Session Layer (Layer 5)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Transport layer (TCP/UDP) multiplexes and demultiplexes communications to individual host processes via 16-bit port numbers.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Network Layer Addressing",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Host-to-Host logical packet delivery across multiple interconnected networks is the responsibility of which layer?",
    "options": [
      "Network Layer (Layer 3)",
      "Data Link Layer",
      "Physical Layer",
      "Transport Layer"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Network layer assigns logical IP addresses, makes routing path determinations, and delivers packets across network hops.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Data Link Error Detection",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Which checksum mechanism is predominantly implemented in hardware in Ethernet Data Link layer frame trailers?",
    "options": [
      "Cyclic Redundancy Check (CRC-32)",
      "16-bit Internet Checksum",
      "MD5 Hash",
      "Parity Bit"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Ethernet frames conclude with a 4-byte Frame Check Sequence (FCS) containing a CRC-32 polynomial checksum computed in NIC hardware.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Repeater and Hub Layer",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "At which OSI layer do physical network Repeaters and legacy Hubs operate?",
    "options": [
      "Physical Layer (Layer 1)",
      "Data Link Layer (Layer 2)",
      "Network Layer (Layer 3)",
      "Transport Layer (Layer 4)"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Repeaters and hubs operate purely at Layer 1, regenerating electrical or optical bit signals without parsing MAC frames or IP packets.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Switch vs Router Layers",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Standard Ethernet Switches and IP Routers operate at which respective OSI layers?",
    "options": [
      "Switches operate at Layer 2 (Data Link); Routers operate at Layer 3 (Network)",
      "Switches Layer 3; Routers Layer 2",
      "Both Layer 2",
      "Both Layer 4"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Switches filter and forward based on Layer 2 MAC addresses; routers forward packets based on Layer 3 IP network prefixes.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Flow Control vs Congestion Control",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the difference between Flow Control and Congestion Control in computer networks?",
    "options": [
      "Flow Control prevents a fast sender from overwhelming a slow receiver; Congestion Control prevents senders from overwhelming intermediate network routers",
      "Flow control is in routers; congestion control is in switches",
      "They are identical algorithms",
      "Flow control is only for wireless networks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Flow control is an end-to-end receiver buffer safeguard (TCP sliding window); congestion control manages shared network pipe capacity.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "OSI",
    "subtopic": "Encapsulation Header Order",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "During data transmission down the OSI stack, what is the sequence of headers prepended to user application payload?",
    "options": [
      "Payload \u2192 +Transport Header (TCP/UDP) \u2192 +Network Header (IP) \u2192 +Data Link Header/Trailer (MAC/FCS) \u2192 Bits",
      "Network \u2192 Transport \u2192 Data Link \u2192 Application",
      "Data Link \u2192 Network \u2192 Transport \u2192 Payload",
      "Physical \u2192 Network \u2192 Transport"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Each layer encapsulates the higher layer PDU as its payload, adding its own protocol control header before passing down.",
    "tags": [
      "CN",
      "OSI",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "4-Layer Architecture",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the 4 standard layers of the TCP/IP protocol suite (RFC 1122)?",
    "options": [
      "Network Access (Link) \u2192 Internet \u2192 Transport \u2192 Application",
      "Physical \u2192 Data Link \u2192 Network \u2192 Transport",
      "Hardware \u2192 IP \u2192 TCP \u2192 HTTP",
      "Link \u2192 Routing \u2192 Transmission \u2192 Interface"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TCP/IP collapses OSI layers 5-7 into the Application layer, retaining Transport, Internet (IP), and Network Access (Link) layers.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "IP Packet Header Size",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the minimum header size of an IPv4 packet without optional fields?",
    "options": [
      "20 Bytes",
      "40 Bytes",
      "16 Bytes",
      "8 Bytes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Standard IPv4 base header is 20 bytes (five 32-bit words, IHL = 5); IPv6 base header is fixed at 40 bytes.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "TCP Segment Header Size",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the minimum header size of a TCP segment without options?",
    "options": [
      "20 Bytes",
      "8 Bytes",
      "16 Bytes",
      "32 Bytes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TCP header has a minimum size of 20 bytes (Data Offset = 5). In contrast, UDP header is fixed at strictly 8 bytes.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "ARP Protocol Role",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the function of the Address Resolution Protocol (ARP) in IPv4 networks?",
    "options": [
      "Resolves a known 32-bit logical IP address to a physical 48-bit MAC address on the local local area network (LAN)",
      "Resolves domain names to IP addresses",
      "Assigns IP addresses dynamically",
      "Translates private IP to public IP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ARP broadcasts a query ('Who has IP X? Tell MAC Y') on the local Ethernet segment to discover the destination hardware MAC address.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "RARP vs BOOTP vs DHCP",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What protocol superseded RARP and BOOTP to provide dynamic, lease-based IP configuration to network hosts?",
    "options": [
      "Dynamic Host Configuration Protocol (DHCP)",
      "DNS",
      "ICMP",
      "SNMP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DHCP (operating over UDP ports 67/68) dynamically leases IP addresses, default gateway, subnet mask, and DNS server addresses.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "ICMP Protocol Function",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the primary role of the Internet Control Message Protocol (ICMP)?",
    "options": [
      "Reporting network operational errors (e.g. Destination Unreachable, Time Exceeded) and diagnostic queries (Ping / Traceroute)",
      "Encrypted email transmission",
      "File downloads",
      "Address resolution"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ICMP is a companion protocol to IP used by network devices to send error messages and operational information.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "Traceroute TTL Mechanism",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does the `traceroute` utility discover intermediate routers along a network path?",
    "options": [
      "Sends packets with incremental Time-To-Live (TTL = 1, 2, 3...); each router decrements TTL, drops packet when TTL=0, and returns ICMP Time Exceeded",
      "Asks the destination for router logs",
      "Uses GPS coordinates of cables",
      "Sends broadcast pings to all subnets"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When a packet's TTL counter hits 0 at router hop K, the router discards the packet and sends an ICMP Type 11 (Time Exceeded) source packet back.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "MTU and IP Fragmentation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "If an IP packet of size 3000 bytes arrives at a router whose outgoing interface has Maximum Transmission Unit (MTU) of 1500 bytes and DF bit is 0, what occurs?",
    "options": [
      "The router fragments the IP packet into smaller fragments with matching Identification fields and appropriate Fragment Offsets",
      "The router drops the packet immediately",
      "The router compresses packet with gzip",
      "The router buffers until MTU increases"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The router divides the payload into fragments fitting the 1500-byte MTU, setting More Fragments (MF) flag and byte offset (divided by 8).",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "Path MTU Discovery (PMTUD)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How does Path MTU Discovery (PMTUD) determine the maximum packet size without IP fragmentation?",
    "options": [
      "Sets Don't Fragment (DF = 1) bit on packets; if any router cannot forward without fragmenting, it drops packet and replies with ICMP 'Fragmentation Needed'",
      "Queries DNS for path MTU",
      "Tests MTU using ARP",
      "Assumes MTU is always 576 bytes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PMTUD avoids expensive router fragmentation by discovering the bottleneck MTU along the path via ICMP Type 3 Code 4 feedback.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "Loopback Address",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the designated IPv4 Loopback network block where traffic is routed internally within the host OS without hitting physical network hardware?",
    "options": [
      "127.0.0.0/8 (e.g. 127.0.0.1 / localhost)",
      "192.168.1.1",
      "10.0.0.1",
      "255.255.255.255"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The entire 127.0.0.0/8 subnet is reserved for host internal loopback, serviced by the virtual `lo` interface.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP/IP",
    "subtopic": "NAT Network Address Translation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does Network Address and Port Translation (NAPT / PAT) allow hundreds of internal private hosts to share a single public IP address?",
    "options": [
      "Translates private IP + source port combinations to the single public IP with unique mapped ephemeral port numbers in a NAT state table",
      "Assigns public IPs in round-robin",
      "Uses proxy servers only",
      "Encrypts private IPs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PAT rewrites Layer 3 IP and Layer 4 Port headers, maintaining a translation table to route inbound response packets back to internal private sockets.",
    "tags": [
      "CN",
      "TCP/IP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "IPv4 vs IPv6 Address Size",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How many bits are used for addresses in IPv4 and IPv6 respectively?",
    "options": [
      "IPv4: 32 bits (4 bytes); IPv6: 128 bits (16 bytes)",
      "IPv4: 16 bits; IPv6: 64 bits",
      "IPv4: 64 bits; IPv6: 128 bits",
      "IPv4: 32 bits; IPv6: 64 bits"
    ],
    "correctAnswerIndex": 0,
    "explanation": "IPv4 addresses are 32-bit numbers (giving ~4.3 billion addresses); IPv6 uses 128-bit numbers (giving 3.4 x 10^38 addresses).",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Classful Addressing Ranges",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In historic classful IPv4 addressing, what are the leading bits and first octet range for Class C addresses?",
    "options": [
      "Leading bits '110', range 192 to 223",
      "Leading bits '0', range 1 to 126",
      "Leading bits '10', range 128 to 191",
      "Leading bits '1110', range 224 to 239"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Class A = 0..127 (starts 0), Class B = 128..191 (starts 10), Class C = 192..223 (starts 110), Class D Multicast = 224..239 (starts 1110).",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Private IP RFC 1918 Ranges",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following IPv4 address blocks is designated for Private Intranet use under RFC 1918?",
    "options": [
      "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16",
      "8.8.8.0/24",
      "1.1.1.0/24",
      "200.100.0.0/16"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RFC 1918 reserves 10.0.0.0/8 (Class A), 172.16.0.0 - 172.31.255.255 (Class B), and 192.168.0.0/16 (Class C) for non-routable private networks.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Class D Multicast",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the designated purpose of IPv4 Class D addresses (224.0.0.0 to 239.255.255.255)?",
    "options": [
      "Multicast group delivery (delivering one packet to a subscribed group of hosts)",
      "Broadcast to all internet nodes",
      "Military research only",
      "Loopback testing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Class D addresses are reserved for IP Multicasting (using protocols like IGMP), addressing logical groups of hosts rather than individual interfaces.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Limited Broadcast Address",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the Limited Broadcast IPv4 address that broadcasts to all hosts on the local physical link and is NEVER forwarded by routers?",
    "options": [
      "255.255.255.255",
      "0.0.0.0",
      "127.0.0.1",
      "192.168.255.255"
    ],
    "correctAnswerIndex": 0,
    "explanation": "255.255.255.255 is the local broadcast address; routers discard it at the interface boundary to prevent internet-wide broadcast storms.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Default Route 0.0.0.0/0",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In a host or router routing table, what does destination `0.0.0.0/0` represent?",
    "options": [
      "The Default Route (Gateway of Last Resort for packets matching no specific routing table entry)",
      "The local loopback",
      "The primary DNS server",
      "The local broadcast"
    ],
    "correctAnswerIndex": 0,
    "explanation": "0.0.0.0 with mask 0.0.0.0 matches any IP destination; it directs unmatched outbound internet traffic to the upstream default gateway.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "IPv6 Notation and Zero Compression",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In IPv6 hexadecimal representation, how can consecutive blocks of all-zero 16-bit words be compressed?",
    "options": [
      "Replaced with a single double colon `::` (allowed only ONCE per address string)",
      "Replaced with asterisks `**`",
      "Omitted without punctuation",
      "Replaced with single dot"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`::` compresses one contiguous run of 16-bit zero groups (e.g. `2001:db8::1`); using it more than once creates ambiguous word counts.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Link-Local IPv6 Address",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What prefix designates an IPv6 Link-Local auto-configured address used exclusively on a single local physical network segment?",
    "options": [
      "fe80::/10",
      "fc00::/7",
      "2001::/16",
      "ff02::/16"
    ],
    "correctAnswerIndex": 0,
    "explanation": "IPv6 hosts auto-assign a link-local address starting with fe80::/10 (using EUI-64 or randomized interface ID) for neighbor discovery without DHCP.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Directed Broadcast Address",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "For subnet 192.168.10.0/24, what is the Directed Broadcast address?",
    "options": [
      "192.168.10.255",
      "192.168.10.0",
      "192.168.10.1",
      "255.255.255.255"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The directed broadcast address sets all host bits to 1; for a /24 subnet, host bits are in the last octet: 192.168.10.255.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "Network Address Usability",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why can the first address (all host bits 0) and last address (all host bits 1) of a standard IPv4 subnet NOT be assigned to individual hosts?",
    "options": [
      "The first address is the Network ID, and the last address is the Subnet Broadcast address",
      "They are reserved for DNS servers",
      "They are corrupted by router hardware",
      "They are reserved for government use"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In any subnet of size 2^H, usable host count is 2^H - 2 because host-part all-0 denotes the subnet itself and host-part all-1 is broadcast.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "IP Addressing",
    "subtopic": "APIPA (ZeroConf) Range",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "When a Windows or macOS client fails to receive a response from a DHCP server, what APIPA link-local IPv4 range does it auto-assign?",
    "options": [
      "169.254.0.0/16",
      "192.168.1.0/24",
      "10.0.0.0/24",
      "127.0.0.0/16"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Automatic Private IP Addressing (APIPA) assigns an address from 169.254.1.0 through 169.254.254.255, allowing ad-hoc local subnet communication.",
    "tags": [
      "CN",
      "IP Addressing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "CIDR Notation Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "In Classless Inter-Domain Routing (CIDR) notation `192.168.1.0/26`, what does `/26` signify?",
    "options": [
      "The Subnet Mask contains 26 consecutive binary 1s (prefix length), leaving 6 bits for host addresses",
      "26 hosts are supported",
      "The network has 26 routers",
      "The packet TTL is 26"
    ],
    "correctAnswerIndex": 0,
    "explanation": "/26 indicates 26 network bits. Mask = 255.255.255.192. Remaining host bits = 32 - 26 = 6 bits (2^6 = 64 total addresses, 62 usable).",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Usable Hosts Calculation",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How many usable host IP addresses are available in a `/28` IPv4 subnet?",
    "options": [
      "14 usable hosts (2^(32-28) - 2 = 16 - 2)",
      "16",
      "30",
      "12"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Prefix length is 28, leaving 32 - 28 = 4 host bits. 2^4 = 16 total addresses minus 2 (network and broadcast) = 14 usable host IPs.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Subnet Mask /27 Conversion",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the dotted decimal representation of a `/27` subnet mask?",
    "options": [
      "255.255.255.224",
      "255.255.255.192",
      "255.255.255.240",
      "255.255.255.128"
    ],
    "correctAnswerIndex": 0,
    "explanation": "/27 has 24 bits (255.255.255) + 3 bits in fourth octet (128 + 64 + 32 = 224), giving 255.255.255.224.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Finding Subnet ID via Bitwise AND",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Given IP address `172.16.10.45` and subnet mask `255.255.255.224 (/27)`, what is the Network Subnet ID?",
    "options": [
      "172.16.10.32",
      "172.16.10.0",
      "172.16.10.45",
      "172.16.10.63"
    ],
    "correctAnswerIndex": 0,
    "explanation": "45 in binary is 00101101; 224 is 11100000. Bitwise AND: 00101101 & 11100000 = 00100000 = 32. Subnet ID is 172.16.10.32.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "VLSM Concept",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Variable Length Subnet Masking (VLSM)?",
    "options": [
      "Subnetting an already subnetted network with different mask lengths to allocate address blocks tailored to the exact size of each department/link",
      "Using random subnet masks",
      "Changing IP addresses dynamically",
      "Disabling CIDR"
    ],
    "correctAnswerIndex": 0,
    "explanation": "VLSM prevents IP address waste by using small subnets (e.g. /30 for point-to-point router serial links) and larger subnets (e.g. /24) for user LANs.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "/31 Point-to-Point Links (RFC 3021)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Under RFC 3021 for point-to-point router links, why is a `/31` subnet mask allowed with 2 usable addresses?",
    "options": [
      "On dedicated point-to-point links between two routers, neither network ID nor directed broadcast is required, so both addresses can be assigned",
      "Routers ignore subnet masks",
      "It uses IPv6 internally",
      "Hardware handles broadcasts in software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RFC 3021 saves scarce IPv4 address space by eliminating network and broadcast addresses on links with exactly two nodes.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Route Aggregation (Supernetting)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Four contiguous class C networks `192.168.0.0/24`, `192.168.1.0/24`, `192.168.2.0/24`, and `192.168.3.0/24` can be summarized into what single Supernet?",
    "options": [
      "192.168.0.0/22",
      "192.168.0.0/23",
      "192.168.0.0/21",
      "192.168.0.0/24"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 3rd octets (0=00, 1=01, 2=10, 3=11) share identical first 6 bits; borrowing 2 bits reduces prefix length from /24 to /22: 192.168.0.0/22.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Host Range for /29",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "For subnet `10.0.0.64/29`, what is the valid usable host IP address range?",
    "options": [
      "10.0.0.65 to 10.0.0.70",
      "10.0.0.64 to 10.0.0.72",
      "10.0.0.65 to 10.0.0.71",
      "10.0.0.60 to 10.0.0.70"
    ],
    "correctAnswerIndex": 0,
    "explanation": "/29 block size is 2^(32-29) = 8. Network is .64, broadcast is .71. Usable host range is .65 through .70 (6 usable hosts).",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Longest Prefix Match",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When a router looks up destination IP `192.168.1.130` and finds matching routes `192.168.0.0/16`, `192.168.1.0/24`, and `192.168.1.128/25`, which route is selected?",
    "options": [
      "192.168.1.128/25 (Longest Prefix Match Rule)",
      "192.168.0.0/16",
      "192.168.1.0/24",
      "The route with lowest metric number"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Routers forward packets along the most specific matching route (the route with the highest number of matching prefix bits, i.e. /25).",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Subnetting a /24 into 4 Subnets",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "To divide a standard `/24` network into 4 equal-sized subnets, how many bits must be borrowed from the host portion and what is the new prefix?",
    "options": [
      "Borrow 2 bits (2^2 = 4 subnets), new prefix is /26",
      "Borrow 4 bits, new prefix /28",
      "Borrow 1 bit, new prefix /25",
      "Borrow 3 bits, new prefix /27"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Borrowing 2 bits yields 2^2 = 4 subnets. New mask length = 24 + 2 = /26 (each having 64 addresses, 62 usable).",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Subnetting",
    "subtopic": "Broadcast Address Calculation",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the broadcast address for host `10.1.5.180/28`?",
    "options": [
      "10.1.5.191",
      "10.1.5.255",
      "10.1.5.185",
      "10.1.5.192"
    ],
    "correctAnswerIndex": 0,
    "explanation": "/28 increments in blocks of 16. 180 / 16 = 11.25 -> 11 * 16 = 176 (Subnet ID). Broadcast is 176 + 16 - 1 = 191.",
    "tags": [
      "CN",
      "Subnetting",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "Distance Vector vs Link State",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the primary difference in algorithmic operation between Distance Vector (RIP) and Link State (OSPF) routing protocols?",
    "options": [
      "Distance Vector routers share their entire routing table only with immediate neighbors; Link State routers flood link states to ALL routers to build a full topology map",
      "Distance vector uses Dijkstra algorithm",
      "Link state protocols count hops only",
      "Distance vector protocols converge faster"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Distance Vector ('routing by rumor', Bellman-Ford) shares vectors with neighbors; Link State floods LSAs, each router computing shortest paths via Dijkstra.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "Count-to-Infinity Problem",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What causes the 'Count-to-Infinity' problem in Distance Vector routing protocols?",
    "options": [
      "Routing loops: when a link fails, two adjacent routers update each other with mutually dependent paths, slowly incrementing metric to infinity",
      "Routers having too many CPU cores",
      "Packets exceeding 1500 bytes",
      "TCP retransmissions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If network X goes down, router A thinks B can reach X with cost 2, and B thinks A can reach X with cost 3; they increment mutual costs until reaching infinity (RIP infinity = 16).",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "Split Horizon with Poison Reverse",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does 'Split Horizon with Poison Reverse' prevent two-node routing loops in RIP?",
    "options": [
      "A router never advertises a route back out the same interface it learned it from, or advertises it back with metric of Infinity (16)",
      "Reboots the router on loop",
      "Disables the failed interface",
      "Switches to static routing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Split horizon stops bad news from echoing: if router A learns route to X from B, A tells B that cost to X is Infinity (Poison Reverse).",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "OSPF Dijkstra Algorithm",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which shortest-path algorithm is executed independently by each router in an OSPF area to build its Shortest Path Tree (SPT)?",
    "options": [
      "Dijkstra's Algorithm",
      "Bellman-Ford Algorithm",
      "Floyd-Warshall Algorithm",
      "Kruskal's Algorithm"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Every OSPF router maintains an identical Link State Database (LSDB) and runs Dijkstra's algorithm with itself as root to populate the routing table.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "BGP Border Gateway Protocol",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Border Gateway Protocol (BGP) is classified as what type of routing protocol used between Autonomous Systems on the global Internet?",
    "options": [
      "Path-Vector Protocol (Exterior Gateway Protocol - EGP)",
      "Distance-Vector Protocol",
      "Link-State Protocol",
      "Interior Gateway Protocol"
    ],
    "correctAnswerIndex": 0,
    "explanation": "BGP is the routing protocol of the global Internet, exchanging AS-Path vectors to enforce routing policies and prevent inter-domain loops.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "BGP AS-Path Attribute Loop Prevention",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does BGP detect and reject routing loops across Autonomous Systems?",
    "options": [
      "If a BGP router inspects an incoming route update's AS-PATH attribute and sees its own Autonomous System Number (ASN), it discards the update",
      "Uses TTL hop count of 15",
      "Pings the sender",
      "Uses Dijkstra algorithm across ASes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The AS-Path attribute records every ASN traversed. A router seeing its own ASN in the path knows the route has looped and rejects it.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "Administrative Distance (AD)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In Cisco and multi-vendor routers, what does Administrative Distance (AD) measure?",
    "options": [
      "The trustworthiness/believability of the routing source (lower AD value is preferred over higher AD)",
      "The latency in milliseconds",
      "The hop count",
      "The physical cable length"
    ],
    "correctAnswerIndex": 0,
    "explanation": "If a router learns the same subnet from OSPF (AD 110) and RIP (AD 120), it installs the OSPF route because lower AD indicates higher trustworthiness.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "Autonomous System (AS) Definition",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is an Autonomous System (AS) in Internet architecture?",
    "options": [
      "A collection of IP networks and routers under a single unified administrative and technical management sharing common routing policies",
      "A single autonomous robot router",
      "A country-wide firewall",
      "A private company intranet with no internet"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An AS (e.g. Comcast, Google, MIT) operates interior protocols (OSPF/IS-IS) internally and peers with other ASes via BGP using a unique ASN.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "RIP Hop Count Limit",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the maximum allowed hop count in the Routing Information Protocol (RIPv2), beyond which a destination is considered unreachable?",
    "options": [
      "15 hops (hop count 16 is defined as Infinity)",
      "255 hops",
      "10 hops",
      "32 hops"
    ],
    "correctAnswerIndex": 0,
    "explanation": "RIP limits network diameter to 15 hops to prevent endless count-to-infinity looping, making it suitable only for small autonomous networks.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "OSPF Designated Router (DR)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why do OSPF multi-access broadcast networks (like Ethernet) elect a Designated Router (DR) and Backup DR (BDR)?",
    "options": [
      "Reduces the number of OSPF adjacency peering sessions from O(N^2) full mesh down to O(N), minimizing link-state flooding traffic",
      "Encrypts routing updates",
      "Replaces the default gateway",
      "Balances internet traffic"
    ],
    "correctAnswerIndex": 0,
    "explanation": "With N routers, a full mesh requires N*(N-1)/2 adjacencies; electing a DR allows all routers to peer exclusively with the DR, requiring only N adjacencies.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Routing",
    "subtopic": "Equal-Cost Multi-Path (ECMP)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is Equal-Cost Multi-Path (ECMP) routing in modern datacenter leaf-spine fabrics?",
    "options": [
      "Distributing traffic flows across multiple parallel routes having identical routing metrics to increase effective bandwidth and redundancy",
      "Using two internet providers simultaneously",
      "Routing odd packets through one router and even through another",
      "Duplicating all packets"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ECMP hashes flow 5-tuples (src/dst IP, src/dst port, protocol) to load balance across parallel equal-cost paths without out-of-order packet reordering.",
    "tags": [
      "CN",
      "Routing",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Three-Way Handshake",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the exact sequence of flag control packets exchanged during the TCP Three-Way Connection Handshake?",
    "options": [
      "SYN \u2192 SYN-ACK \u2192 ACK",
      "SYN \u2192 ACK \u2192 SYN-ACK",
      "ACK \u2192 SYN \u2192 ACK",
      "HELLO \u2192 HELLO-ACK \u2192 READY"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Client sends SYN (with Initial Sequence Number ISN_c); Server responds with SYN-ACK (acknowledging ISN_c + 1, proposing ISN_s); Client responds with ACK.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Four-Way Teardown & TIME_WAIT",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why does the client endpoint enter the `TIME_WAIT` state (lasting 2 * MSL) after sending the final ACK in TCP connection teardown?",
    "options": [
      "To ensure the final ACK was received by the server (re-sending it if server retransmits FIN) and allow lingering delayed duplicate segments to drain from the network",
      "To wait for user to close browser",
      "To recharge network buffers",
      "To measure network bandwidth"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TIME_WAIT (typically 60-120 seconds) prevents old packets from an earlier connection incarnation from being mistakenly accepted by a newly opened connection.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Flow Control Sliding Window",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In TCP Flow Control, what does the 'Receive Window' (rwnd) field advertised in the TCP header represent?",
    "options": [
      "The amount of available free buffer space currently remaining in the receiver's TCP socket buffer",
      "The physical bandwidth of the network cable",
      "The maximum packet size allowed by routers",
      "The total bytes transmitted so far"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The receiver advertises rwnd in every segment; the sender is strictly forbidden from having more unacknowledged in-flight bytes than rwnd.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Slow Start Algorithm",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In TCP Congestion Control, how does the Congestion Window (cwnd) grow during the 'Slow Start' phase?",
    "options": [
      "Doubles every Round-Trip Time (RTT) \u2014 increments cwnd by 1 MSS for every received ACK (exponential growth)",
      "Increases linearly by 1 MSS per RTT",
      "Starts at maximum network capacity",
      "Remains constant"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Despite its name 'Slow Start', cwnd increases exponentially from 1 (or 10) MSS, doubling each RTT until reaching the slow start threshold (ssthresh).",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Congestion Avoidance (AIMD)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does Additive Increase / Multiplicative Decrease (AIMD) do once cwnd exceeds ssthresh?",
    "options": [
      "Increases cwnd linearly by 1 MSS per RTT upon successful ACKs; cuts cwnd in half upon detecting packet loss",
      "Doubles cwnd every RTT; resets to 0 on loss",
      "Increases exponentially; decreases linearly",
      "Freezes cwnd permanently"
    ],
    "correctAnswerIndex": 0,
    "explanation": "AIMD is mathematically proven to converge competing TCP flows to fairness and efficiency on shared network links.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Fast Retransmit Trigger",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What network event triggers TCP Fast Retransmit without waiting for the retransmission timeout (RTO) timer to expire?",
    "options": [
      "Receipt of 3 Duplicate ACKs for the same sequence number",
      "Receipt of a single NACK packet",
      "RTO timer expiring",
      "ICMP Host Unreachable arrival"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When receiver gets an out-of-order packet, it immediately generates a duplicate ACK; 3 duplicate ACKs strongly indicate packet loss rather than simple reordering.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Nagle's Algorithm",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What problem does Nagle's Algorithm solve, and why do latency-sensitive applications (like online gaming or SSH) disable it via `TCP_NODELAY`?",
    "options": [
      "Prevents sending tiny 1-byte payload packets (small-packet problem) by buffering until full MSS or previous ACK arrives; causes 200ms latency spikes when combined with Delayed ACK",
      "Prevents memory leaks in kernel",
      "Encrypts TCP headers",
      "Compresses data on wire"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Nagle coalesces small writes to minimize 40-byte header overhead; however, interacting with Delayed ACK creates deadlock pauses, resolved by `TCP_NODELAY`.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "SYN Flood Attack & SYN Cookies",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "How do SYN Cookies protect web servers against TCP SYN Flood denial-of-service attacks?",
    "options": [
      "The server encodes connection state into the Initial Sequence Number (ISN) and sends SYN-ACK without allocating any server memory until the client's final ACK arrives",
      "The server drops all incoming SYN packets",
      "The server bans client IP addresses automatically",
      "The server uses UDP instead of TCP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SYN floods exhaust server half-open connection queues (SYN_RCVD). SYN cookies defer server memory allocation until cryptographic proof arrives in the client ACK.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Silly Window Syndrome",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is 'Silly Window Syndrome' in TCP communication?",
    "options": [
      "A pathological state where sender repeatedly transmits data in tiny chunks (e.g. 1-2 bytes) because receiver advertises tiny buffer openings, generating huge header overhead",
      "A buffer overflow in the browser",
      "A bug in Windows 95 TCP stack",
      "When window size exceeds 64KB"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Clark's solution at receiver (only advertise window when >= min(MSS, buffer/2)) and Nagle at sender prevent wasting bandwidth on tiny packet headers.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Window Scaling Option (RFC 1323)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Why is the TCP Window Scale option necessary on modern high-speed (gigabit/fiber) Long Fat Networks (LFNs)?",
    "options": [
      "The base 16-bit Window field caps maximum in-flight window at 65,535 bytes (64KB); Window Scale shifts this up to 1GB to utilize high Bandwidth-Delay Products (BDP)",
      "Enables IPv6 addresses in TCP header",
      "Increases MSS beyond 1500 bytes",
      "Enables UDP support in TCP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bandwidth-Delay Product (BDP = bandwidth * RTT) on modern links far exceeds 64KB. Window Scale introduces a scale factor multiplying window size up to 1GB.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "TCP",
    "subtopic": "Selective Acknowledgment (SACK)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the advantage of TCP Selective Acknowledgment (SACK) over standard Cumulative ACK?",
    "options": [
      "Allows receiver to notify sender of all non-contiguous blocks of packets received successfully, so sender retransmits ONLY genuinely missing segments",
      "Encrypts TCP payloads",
      "Speeds up handshake",
      "Eliminates need for checksum"
    ],
    "correctAnswerIndex": 0,
    "explanation": "With cumulative ACK, dropping one packet forces retransmission of all subsequent packets (Go-Back-N); SACK allows selective retransmission of missing packets only.",
    "tags": [
      "CN",
      "TCP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "UDP Header Structure",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What are the 4 fields that make up the lightweight 8-byte UDP header?",
    "options": [
      "Source Port (2B), Destination Port (2B), Length (2B), and Checksum (2B)",
      "Sequence Number, Ack Number, Flags, Window",
      "IP Source, IP Destination, TTL, Protocol",
      "Stream ID, Channel ID, Offset, CRC"
    ],
    "correctAnswerIndex": 0,
    "explanation": "UDP's fixed 8-byte header provides minimal multiplexing and error detection without connection state, sequencing, or flow control overhead.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Connectionless Nature",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does 'Connectionless' mean in the User Datagram Protocol (UDP)?",
    "options": [
      "Datagrams are transmitted immediately without establishing a prior connection or handshake, and without maintaining state between packets",
      "UDP requires no network cables",
      "Packets can only be sent to localhost",
      "UDP packets have no destination IP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "UDP transmits datagrams independently. There is no handshake, connection teardown, sequence ordering, or state tracking in the OS kernel.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Best-Effort Delivery",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why is UDP characterized as providing 'Unreliable, Best-Effort Delivery'?",
    "options": [
      "Does not guarantee packet arrival, does not retransmit lost packets, does not preserve delivery order, and does not detect duplicates",
      "UDP cables are prone to interference",
      "Routers drop UDP packets first",
      "UDP has no checksum"
    ],
    "correctAnswerIndex": 0,
    "explanation": "UDP passes datagrams to IP directly; if a packet drops or arrives out of order, UDP makes no attempt to recover or reorder it.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Use Cases for UDP",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following applications is ideally suited for UDP over TCP?",
    "options": [
      "Real-time VoIP audio calls, live video streaming, DNS lookups, and multiplayer online gaming",
      "Financial bank wire transfers",
      "SSH remote terminal access",
      "Git code checkout"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Real-time media and gaming prioritize low latency over 100% reliability; a delayed retransmitted audio frame is useless if already past playback time.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "QUIC Protocol over UDP",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why does the HTTP/3 protocol build its transport (QUIC) on top of UDP rather than TCP?",
    "options": [
      "Avoids TCP Head-of-Line blocking across multiplexed streams and bypasses OS kernel TCP ossification to innovate transport logic in user-space",
      "UDP has hardware encryption built into NICs",
      "UDP is faster because it uses 16-bit IPs",
      "TCP was banned by IETF"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In HTTP/2 over TCP, a single dropped packet stalls all multiplexed streams; QUIC over UDP provides independent per-stream loss recovery and zero-RTT handshakes.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "UDP Checksum Optionality",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "Is the Checksum field in the IPv4 UDP header strictly mandatory?",
    "options": [
      "Optional in IPv4 (all zeroes indicates checksum disabled), but strictly MANDATORY in IPv6",
      "Mandatory in both IPv4 and IPv6",
      "Optional in both",
      "UDP has no checksum"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In IPv4, UDP checksum calculation can be disabled by setting bits to 0. In IPv6, since the IPv6 header removed its own checksum, UDP checksum is mandatory.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "UDP Pseudo-Header",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the UDP Checksum include in its calculation besides the UDP header and payload?",
    "options": [
      "A 12-byte Pseudo-Header containing Source IP, Destination IP, Protocol number (17), and UDP Length",
      "The Ethernet MAC address",
      "The DNS query string",
      "The process ID"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The pseudo-header verifies that the datagram has not been delivered to the wrong IP address due to routing or header corruption.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Broadcast and Multicast Support",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Why can UDP support true Network Broadcast and Multicast while standard TCP cannot?",
    "options": [
      "UDP does not establish 1-to-1 point-to-point state, handshakes, or cumulative ACKs; one UDP packet can be received by multiple listeners",
      "TCP hardware limits connections to 1",
      "Routers block TCP packets",
      "TCP packets have no port numbers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TCP's bidirectional state machine, sequence synchronization, and ACKs require strictly two endpoints; UDP datagrams can be flooded to multiple subscribers.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Head-of-Line (HoL) Blocking",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does UDP prevent Head-of-Line (HoL) blocking at the transport layer?",
    "options": [
      "It delivers packets immediately to the application layer in whatever order they arrive, without waiting for missing earlier packets",
      "It sorts packets in memory before delivery",
      "It retransmits immediately",
      "It drops all out-of-order packets"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TCP buffers out-of-order packets until missing segments arrive to guarantee in-order byte stream; UDP delivers immediately upon arrival.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Maximum UDP Datagram Size",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the theoretical maximum payload size of a single UDP datagram over IPv4?",
    "options": [
      "65,507 Bytes (65,535 bytes total - 20B IPv4 header - 8B UDP header)",
      "1500 Bytes",
      "65,535 Bytes exactly",
      "4096 Bytes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The 16-bit UDP length field allows up to 65,535 bytes. Subtracting 20 bytes minimum IP header and 8 bytes UDP header yields 65,507 bytes.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "UDP",
    "subtopic": "Raw Sockets vs UDP Sockets",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "In socket programming, what does a `SOCK_DGRAM` socket type specify?",
    "options": [
      "An unreliable, datagram-oriented communication endpoint utilizing the UDP protocol",
      "A TCP stream socket",
      "A raw IP socket with custom headers",
      "A Unix domain socket"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`SOCK_STREAM` corresponds to reliable connection-oriented TCP; `SOCK_DGRAM` corresponds to message-oriented connectionless UDP.",
    "tags": [
      "CN",
      "UDP",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "Hierarchical Namespace Structure",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the hierarchical delegation structure of the Domain Name System (DNS) from root to host?",
    "options": [
      "Root Domain (.) \u2192 Top-Level Domain (TLD, e.g. .com) \u2192 Second-Level Domain (example.com) \u2192 Subdomain (api.example.com)",
      "Host \u2192 Router \u2192 ISP \u2192 Root",
      "HTTP \u2192 IP \u2192 MAC \u2192 DNS",
      "Local \u2192 Global \u2192 Regional"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNS is an inverted tree hierarchy rooted at the anonymous dot (.), delegating authority down through TLD registries, authoritative name servers, to leaf nodes.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "Recursive vs Iterative Query",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In DNS resolution, what is the difference between a Recursive query and an Iterative query?",
    "options": [
      "In Recursive, the resolver delegates full resolution to the server (demanding complete answer); in Iterative, the server returns the best referral to the next server",
      "Recursive is faster always",
      "Iterative queries run over TCP only",
      "They are identical"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Clients ask local resolvers recursively ('Find me the IP'). The resolver queries Root, TLD, and Authoritative servers iteratively ('I don't know, ask .com').",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "A vs AAAA Record",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the difference between a DNS 'A' record and an 'AAAA' record?",
    "options": [
      "An 'A' record maps a hostname to an IPv4 address; an 'AAAA' record maps a hostname to a 128-bit IPv6 address",
      "AAAA record is 4x encrypted",
      "A record is for authentication",
      "AAAA record is for mail servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'A' stands for Address (32-bit IPv4); 'AAAA' (quad-A) represents 128-bit IPv6 addresses.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "CNAME vs Alias Record",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a DNS CNAME (Canonical Name) record, and what is its primary operational restriction?",
    "options": [
      "An alias mapping one domain name to another canonical domain name; CANNOT coexist with other records (like MX/TXT) at the zone apex (@)",
      "Maps domain to IP address",
      "Stores SSL certificates",
      "Forwards emails"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CNAME maps alias.example.com to target.com. RFC mandates that no other record type can exist for a name that has a CNAME, restricting apex usage.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "MX Record",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the purpose of an MX (Mail Exchange) record in DNS?",
    "options": [
      "Directs incoming email for a domain to the appropriate Mail Transfer Agent (MTA) servers, with preference priority numbers",
      "Maps website to web server",
      "Validates domain ownership",
      "Stores PGP keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "MX records specify mail servers responsible for accepting email for the domain, with lower integer priority numbers tried first.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "Time-To-Live (TTL) Caching",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What does the TTL (Time-To-Live) field in a DNS Resource Record control?",
    "options": [
      "The duration (in seconds) that intermediate recursive resolvers and client caches are permitted to cache the record before refetching",
      "The time packet can live on wire",
      "The expiration of domain registration",
      "The timeout of TCP socket"
    ],
    "correctAnswerIndex": 0,
    "explanation": "High TTL (e.g. 86400s) minimizes DNS query traffic; low TTL (e.g. 60s) enables rapid DNS failover and seamless IP migration.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "DNS Transport Protocol (UDP 53 vs TCP 53)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "DNS traditionally runs over UDP port 53. Under what two primary conditions does DNS switch to TCP port 53?",
    "options": [
      "When response payload exceeds 512 bytes (TC truncated bit set), or during DNS Zone Transfers (AXFR/IXFR) between primary/secondary servers",
      "Whenever querying .org domains",
      "When internet is slow",
      "Only for IPv6 lookups"
    ],
    "correctAnswerIndex": 0,
    "explanation": "UDP answers exceeding 512 bytes set Truncated (TC) flag, prompting client to retry over TCP port 53; zone transfers require reliable TCP.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "Reverse DNS (PTR Records)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does a Reverse DNS lookup (PTR Record) perform and under which special top-level domain?",
    "options": [
      "Resolves an IP address back to its canonical hostname, using the `in-addr.arpa` (IPv4) or `ip6.arpa` domain hierarchy",
      "Checks domain expiration",
      "Finds the ISP name",
      "Translates MAC to IP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "IP `192.0.2.1` is queried as `1.2.0.192.in-addr.arpa` PTR record; widely used by spam filters to verify email sender identities.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "DNSSEC Cryptographic Protection",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What security vulnerability does DNS Security Extensions (DNSSEC) mitigate?",
    "options": [
      "DNS Cache Poisoning / Spoofing by cryptographically signing resource records with digital signatures (RRSIG) validated via chain of trust (DS/DNSKEY)",
      "DDoS attacks",
      "Domain name expiration theft",
      "Cleartext sniffing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNSSEC does not encrypt queries (records remain public), but guarantees data integrity and authenticity, proving the response was not forged.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "13 Root Server IP Addresses (Anycast)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "There are 13 logical Root DNS server identifiers (named a.root-servers.net to m.root-servers.net). How do they handle global query scale?",
    "options": [
      "Each logical IP address is deployed across hundreds of physical server instances worldwide using BGP Anycast routing",
      "They run on 13 massive supercomputers in California",
      "They only answer 100 queries per second",
      "They route queries to Google"
    ],
    "correctAnswerIndex": 0,
    "explanation": "BGP Anycast advertises the identical IP prefix from hundreds of data centers globally; routers automatically direct queries to the topologically nearest node.",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "DNS",
    "subtopic": "DNS-over-HTTPS (DoH) vs DoT",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What privacy advantage do DNS-over-HTTPS (DoH, RFC 8484) and DNS-over-TLS (DoT, RFC 7858) provide over traditional DNS?",
    "options": [
      "Encrypts DNS queries using TLS, preventing local ISPs and Wi-Fi eavesdroppers from monitoring or spoofing user browsing domain requests",
      "Speeds up website downloads by 10x",
      "Eliminates need for IP addresses",
      "Bypasses all web firewalls"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Classic DNS travels in plain unencrypted UDP, allowing anyone on the network path to log every visited site. DoH wraps queries in encrypted HTTPS (port 443).",
    "tags": [
      "CN",
      "DNS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "Idempotence of HTTP Methods",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "Which of the following HTTP request methods is strictly IDEMPOTENT according to the HTTP specification?",
    "options": [
      "GET, PUT, and DELETE",
      "POST",
      "CONNECT",
      "PATCH in all cases"
    ],
    "correctAnswerIndex": 0,
    "explanation": "An HTTP method is idempotent if executing it multiple times produces identical server state as executing it once. GET, PUT, and DELETE are idempotent; POST is not.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "HTTP Status Code Classes",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What do HTTP response status code ranges 2xx, 3xx, 4xx, and 5xx signify?",
    "options": [
      "2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error",
      "2xx Error, 3xx Success, 4xx Redirect, 5xx Timeout",
      "2xx Server Error, 4xx Success",
      "Codes have no standardized categories"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Standard RFC categories: 1xx Informational, 2xx Success (200 OK, 201 Created), 3xx Redirection, 4xx Client Error (404, 401, 403), 5xx Server Error (500, 502, 503).",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "TLS Handshake 1.3 Latency",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How many network Round-Trip Times (RTTs) does a full TLS 1.3 cryptographic handshake require before encrypted application data can be sent?",
    "options": [
      "1 RTT (compared to 2 RTTs in TLS 1.2)",
      "3 RTTs",
      "0 RTT in all initial visits",
      "4 RTTs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "TLS 1.3 combines key exchange (Diffie-Hellman) into the ClientHello/ServerHello flight, slashing the handshake latency to just 1 RTT (and 0-RTT on resumption).",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "HTTP/1.1 vs HTTP/2 Multiplexing",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What architectural innovation does HTTP/2 introduce to eliminate Head-of-Line blocking at the application layer?",
    "options": [
      "Binary framing layer multiplexing multiple bidirectional request/response streams concurrently over a single shared TCP connection",
      "Opening 50 parallel TCP connections",
      "Using UDP instead of TCP",
      "Removing HTTP headers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HTTP/1.1 requires sequential request-response pipelining per connection; HTTP/2 breaks messages into independent binary frames tagged with Stream IDs.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "HPACK Header Compression",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "Why was HPACK compression specifically designed for HTTP/2 headers instead of general-purpose gzip/zlib?",
    "options": [
      "To eliminate security vulnerabilities like CRIME and BREACH attacks while maintaining static and dynamic header indexing tables",
      "HPACK compresses images",
      "Gzip is not supported in C",
      "HPACK uses lossy compression"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CRIME exploited compression ratio leaks in stream ciphers. HPACK uses differential indexing with Huffman coding tailored specifically to HTTP headers.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "HTTPS Port and Layer",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "HTTPS operates by default on which TCP port and adds which security layer beneath standard HTTP?",
    "options": [
      "Port 443; adds Transport Layer Security (TLS/SSL) encryption between TCP and HTTP",
      "Port 80; adds SSH",
      "Port 8080; adds AES hardware",
      "Port 22; adds IPsec"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HTTPS runs on port 443 (HTTP on port 80), encrypting the HTTP request/response stream with TLS to guarantee confidentiality, authenticity, and integrity.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "HTTP Cookies Security Flags",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What security protections do the `HttpOnly` and `SameSite` cookie attributes provide?",
    "options": [
      "`HttpOnly` blocks JavaScript document.cookie access to stop XSS theft; `SameSite` restricts cross-origin sending to stop CSRF attacks",
      "HttpOnly encrypts the cookie with RSA",
      "SameSite blocks all third party images",
      "They restrict cookie size to 1KB"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HttpOnly prevents malicious scripts from exfiltrating session tokens; SameSite=Strict/Lax stops the browser from attaching cookies on forged third-party requests.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "ETag and Conditional GET",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How does an HTTP client validate cached resources using an `ETag` (Entity Tag) header?",
    "options": [
      "Sends `If-None-Match: <etag>` to server; if resource is unchanged, server replies with `304 Not Modified` and zero payload body",
      "Downloads the full file and compares hashes locally",
      "Deletes the cache immediately",
      "Sends a POST request to update"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ETags act as resource version hashes. A 304 Not Modified response saves bandwidth by confirming the cached client copy is fresh.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "Server-Sent Events (SSE) vs WebSockets",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is a primary distinction between WebSockets and Server-Sent Events (SSE)?",
    "options": [
      "WebSockets are full-duplex bidirectional TCP channels; SSE is unidirectional server-to-client streaming over standard HTTP",
      "SSE requires custom binary protocols",
      "WebSockets only run over UDP",
      "SSE does not support text data"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SSE streams text data from server to client over persistent HTTP (ideal for live feeds/stock tickers); WebSockets allow simultaneous two-way messaging.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "HSTS Header",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What does the `Strict-Transport-Security` (HSTS) HTTP response header instruct the client browser to do?",
    "options": [
      "Force all subsequent connections to the domain to strictly use HTTPS, automatically upgrading any `http://` links before network transmission",
      "Enforce strong user passwords",
      "Block all cookies",
      "Disable browser extensions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HSTS defends against SSL stripping (downgrade) attacks by ensuring the browser never initiates an unencrypted HTTP request to the site.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "HTTP/HTTPS",
    "subtopic": "CORS Preflight (OPTIONS)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "When does a web browser automatically issue an HTTP `OPTIONS` preflight request during Cross-Origin Resource Sharing (CORS)?",
    "options": [
      "When a cross-origin request uses non-simple HTTP methods (PUT, DELETE, PATCH) or custom headers (like Authorization)",
      "On every single GET request",
      "Only when cookies are disabled",
      "Only for image downloads"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The browser sends an OPTIONS preflight to verify that the foreign origin server explicitly permits the custom method or header via Access-Control-Allow-*.",
    "tags": [
      "CN",
      "HTTP/HTTPS",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Symmetric vs Asymmetric Encryption",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is the foundational difference between Symmetric and Asymmetric Cryptography?",
    "options": [
      "Symmetric uses the SAME shared secret key for encryption and decryption (AES); Asymmetric uses a Public/Private key pair (RSA/ECC)",
      "Asymmetric encryption runs 1000x faster than symmetric",
      "Symmetric encryption has no keys",
      "Asymmetric uses only one key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Symmetric (AES) is fast and encrypts bulk data with one shared secret; Asymmetric (RSA/ECC) solves key exchange using mathematically paired public and private keys.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Digital Signatures Function",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How is a Digital Signature created by a sender to ensure message authenticity and Non-Repudiation?",
    "options": [
      "Sender hashes the message and encrypts the hash using their own PRIVATE key; recipient decrypts hash using sender's PUBLIC key",
      "Sender encrypts message with recipient's public key",
      "Sender writes their name in cleartext",
      "Using a symmetric key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Only the sender possesses their private key; if the signature decrypts correctly with the sender's public key, it proves authenticity and integrity.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Public Key Infrastructure (PKI) & CA",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What is the role of a Certificate Authority (CA) in HTTPS SSL/TLS certificates?",
    "options": [
      "A trusted third party that cryptographically signs the server's public key and domain identity, establishing an authentic Chain of Trust",
      "A firewall that blocks hackers",
      "A DNS resolver operated by Google",
      "A government spy server"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Operating systems and browsers ship with trusted Root CA certificates. CAs digitally sign intermediate and leaf certificates, vouching for server identity.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Diffie-Hellman Key Exchange",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What mathematical property enables Diffie-Hellman Key Exchange (DH / ECDH) to establish a shared secret over an insecure channel?",
    "options": [
      "Discrete Logarithm problem: Alice and Bob combine their private keys with each other's public values to arrive at an identical shared secret without transmitting it",
      "Factoring prime numbers in linear time",
      "Multiplying two matrices",
      "Generating random hashes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "g^(ab) mod p is identical whether computed as (g^a)^b or (g^b)^a. Eavesdroppers seeing g^a and g^b cannot derive g^(ab) without solving discrete logs.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Stateful vs Stateless Packet Filtering",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "What distinguishes a Stateful Firewall from a basic Stateless Packet Filter?",
    "options": [
      "A stateful firewall tracks the state of active TCP connections (handshakes, sequence numbers, session table), automatically permitting return traffic",
      "Stateless firewalls consume more memory",
      "Stateful firewalls inspect application layer payloads",
      "Stateless firewalls cannot filter by IP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Stateless firewalls inspect each packet in isolation (rules on IP/port); stateful firewalls understand context, knowing an inbound packet is an established response.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "IPsec Architecture (AH vs ESP)",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "In the IPsec protocol suite used for VPN tunnels, what protection does Encapsulating Security Payload (ESP) provide that Authentication Header (AH) does not?",
    "options": [
      "Confidentiality / Encryption of the payload data (AH provides integrity/authentication only, no encryption)",
      "AH encrypts data; ESP does not",
      "ESP works only on Wi-Fi",
      "AH provides faster routing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "AH provides data integrity, origin authentication, and anti-replay, but transmits payload in plain text; ESP encrypts payload data to provide confidentiality.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Man-in-the-Middle (MITM) Attack",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is an ARP Spoofing / Poisoning attack, and what does it facilitate?",
    "options": [
      "An attacker sends gratuitous forged ARP replies associating their own MAC address with the default gateway's IP, intercepting all local subnet traffic (MITM)",
      "Overheating network switches",
      "Cracking Wi-Fi WPA2 passwords",
      "Crashing DNS root servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ARP has no authentication. An attacker poisons targets' ARP caches to route all egress traffic through the attacker's machine for eavesdropping.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "DDoS Amplification Attacks",
    "difficulty": "medium",
    "questionType": "MCQ",
    "questionText": "How do NTP and DNS Amplification Distributed Denial of Service (DDoS) attacks work?",
    "options": [
      "Attacker sends forged requests with the victim's spoofed source IP to open servers that reply with vastly larger response payloads directed at the victim",
      "Infecting victim with malware",
      "Flooding victim with 1-byte ping packets",
      "Stealing domain names"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Using UDP's lack of source verification, small queries (e.g. 50 bytes) generate massive responses (e.g. 4000 bytes) directed at the spoofed victim IP.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Forward Secrecy (PFS)",
    "difficulty": "hard",
    "questionType": "MCQ",
    "questionText": "What is Perfect Forward Secrecy (PFS) in TLS communication?",
    "options": [
      "Generating unique ephemeral session keys per connection such that compromising the server's long-term private key in the future cannot decrypt past recorded sessions",
      "Storing all passwords in RAM",
      "Encrypting database backups",
      "Using 4096-bit RSA keys permanently"
    ],
    "correctAnswerIndex": 0,
    "explanation": "With static RSA key exchange, stealing the server's private key decrypts all historically recorded traffic. Ephemeral Diffie-Hellman (ECDHE) guarantees forward secrecy.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Cross-Site Scripting (XSS)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "What is Stored (Persistent) Cross-Site Scripting (XSS)?",
    "options": [
      "Malicious JavaScript injected into a database (e.g. in a comment field) that executes in the browser of any user who views the page",
      "Infecting server with a virus",
      "Intercepting network cables",
      "Guessing user passwords with brute force"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Stored XSS occurs when unescaped user input is saved server-side and rendered into HTML, executing arbitrary JavaScript in victims' browser sessions.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  },
  {
    "subject": "CN",
    "topic": "Network Security",
    "subtopic": "Cross-Site Request Forgery (CSRF)",
    "difficulty": "easy",
    "questionType": "MCQ",
    "questionText": "How does an Anti-CSRF Token defend against Cross-Site Request Forgery attacks?",
    "options": [
      "Requires state-changing POST requests to include a unique, unpredictable secret token that a malicious third-party site cannot read or forge",
      "Encrypts the entire HTTP header",
      "Prompts user with CAPTCHA on every click",
      "Restricts logins to one device"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Browsers automatically attach cookies (session credentials) to cross-site requests; an anti-CSRF token validated server-side ensures the request originated intentionally from the genuine site.",
    "tags": [
      "CN",
      "Network Security",
      "Computer Networks",
      "Protocols",
      "GATE"
    ],
    "examRelevance": "GATE CS & IT, Cisco CCNA, University Networks Exams",
    "placementRelevance": "Cisco, Arista, Juniper, Cloudflare, Amazon OA"
  }
];
