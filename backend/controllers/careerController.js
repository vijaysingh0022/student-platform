import CareerProfile from "../models/CareerProfile.js";
import TestResult from "../models/TestResult.js";
import Roadmap from "../models/Roadmap.js";
import { getAIClient, getAIModel } from "../config/ai.js";
import { recordAuditLog } from "../utils/auditLogger.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mammoth = require("mammoth");

const extractTextFromBuffer = async (buffer, mimeType = "", originalName = "") => {
  let rawText = "";
  const lowerName = (originalName || "").toLowerCase();

  try {
    if (lowerName.endsWith(".pdf") || mimeType === "application/pdf") {
      const pdfParseModule = require("pdf-parse");
      if (typeof pdfParseModule.PDFParse === "function") {
        const parser = new pdfParseModule.PDFParse({ data: new Uint8Array(buffer) });
        await parser.load();
        const parsed = await parser.getText();
        rawText = typeof parsed === "string" ? parsed : (parsed?.text || "");
      } else if (typeof pdfParseModule === "function") {
        const parsed = await pdfParseModule(buffer);
        rawText = typeof parsed === "string" ? parsed : (parsed?.text || "");
      }
    } else if (lowerName.endsWith(".docx") || mimeType.includes("wordprocessingml") || mimeType.includes("docx")) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || "";
    } else {
      rawText = buffer.toString("utf-8");
    }
  } catch (err) {
    console.error("Resume file extraction error:", err.message);
    try {
      rawText = buffer.toString("utf-8");
    } catch (_) {
      rawText = "";
    }
  }

  if (!rawText || typeof rawText !== "string") {
    try {
      rawText = buffer.toString("utf-8");
    } catch (_) {
      rawText = "";
    }
  }

  return (rawText || "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Target Role Benchmarks & Skill Expectations
const ROLE_BENCHMARKS = {
  "Full Stack Software Engineer": {
    requiredSkills: ["JavaScript/TypeScript", "React", "Node.js/Express", "DBMS & SQL", "DSA & Complexity", "Git & REST APIs"],
    coreSubjects: ["DBMS", "DSA", "OS"],
    roadmapPhases: [
      { phase: "Phase 1: Foundation (Weeks 1-4)", focus: "Core CS Data Structures & Relational Databases", action: "Master B+ Trees, Normalization, and Big-O Complexity." },
      { phase: "Phase 2: Full-Stack Stack (Weeks 5-8)", focus: "MERN/Next.js Architecture & API Design", action: "Build state-managed React applications with JWT Auth." },
      { phase: "Phase 3: Production Engineering (Weeks 9-12)", focus: "Caching, System Design & Cloud Deploy", action: "Integrate Redis caching, Docker containerization, and CI/CD." },
    ],
    projects: [
      { title: "Distributed Job Scheduler API", level: "Advanced", skills: ["Node.js", "Redis", "MongoDB"], desc: "High-throughput task queue handling background retries and rate limiting." },
      { title: "Real-time Collaborative Canvas", level: "Intermediate", skills: ["React", "WebSockets", "Canvas API"], desc: "Multi-user drawing board with state sync and conflict resolution." },
      { title: "Student Analytics & AI Platform", level: "Advanced", skills: ["React", "Express", "OpenAI", "MongoDB"], desc: "AI-powered skill gap analyzer with automated roadmaps and ATS resume scoring." }
    ]
  },
  "Backend Systems Engineer": {
    requiredSkills: ["Node.js/Go/Java", "DBMS & Indexing", "Concurrency & OS", "DSA & Graphs", "Redis/Kafka", "Microservices"],
    coreSubjects: ["DBMS", "OS", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Deep OS & Database Internals (Weeks 1-4)", focus: "Process Sync, ACID Transactions & Indexing", action: "Solve deadlock & indexing problems in DBMS and OS." },
      { phase: "Phase 2: High Performance APIs (Weeks 5-8)", focus: "gRPC, REST, and Connection Pooling", action: "Optimize database queries and implement connection pools." },
      { phase: "Phase 3: Distributed Systems (Weeks 9-12)", focus: "Event Brokers & Load Balancing", action: "Build microservice architecture with Kafka & Redis." },
    ],
    projects: [
      { title: "High-Throughput Rate Limiter", level: "Intermediate", skills: ["Node.js", "Redis", "Lua"], desc: "Token bucket & sliding window rate limiter middleware." },
      { title: "Distributed Key-Value Store", level: "Advanced", skills: ["Go", "Raft Consensus", "gRPC"], desc: "Fault-tolerant distributed storage node with leader election." }
    ]
  },
  "Data Engineer & Analytics": {
    requiredSkills: ["SQL & Data Modeling", "Python/Pandas", "ETL Pipelines", "PostgreSQL/DBMS", "Spark/BigQuery", "Data Structures"],
    coreSubjects: ["DBMS", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Advanced SQL & Database Tuning (Weeks 1-4)", focus: "Complex Joins, Indexing & Normalization", action: "Master window functions, CTEs, and query execution plans." },
      { phase: "Phase 2: ETL Pipeline Development (Weeks 5-8)", focus: "Python, Airflow, and Data Ingestion", action: "Build automated data pipelines with data validation." },
      { phase: "Phase 3: Warehousing & Data Lakes (Weeks 9-12)", focus: "BigQuery, Snowflake & Spark", action: "Design star schemas and transform multi-GB datasets." },
    ],
    projects: [
      { title: "Automated Financial Data ETL", level: "Intermediate", skills: ["Python", "PostgreSQL", "Airflow"], desc: "Pipeline ingesting stock tickers, normalizing schema, and generating daily rollups." }
    ]
  },
  "AI & Machine Learning Engineer": {
    requiredSkills: ["Python/PyTorch", "DSA & Math", "DBMS & Vector DBs", "REST API Integration", "LLM Fine-Tuning", "Model Deployment"],
    coreSubjects: ["DSA", "DBMS"],
    roadmapPhases: [
      { phase: "Phase 1: Math & Data Structures (Weeks 1-4)", focus: "Linear Algebra, DSA & Vector Math", action: "Master matrix operations and fundamental search algorithms." },
      { phase: "Phase 2: RAG & LLM Integration (Weeks 5-8)", focus: "LangChain, Vector Stores, OpenAI API", action: "Build Retrieval-Augmented Generation engines." },
      { phase: "Phase 3: Model Serving & Optimization (Weeks 9-12)", focus: "FastAPI, Docker & ONNX", action: "Deploy quantized LLM endpoints with sub-100ms latency." },
    ],
    projects: [
      { title: "RAG Knowledge Base Assistant", level: "Advanced", skills: ["Python", "Pinecone", "OpenAI", "FastAPI"], desc: "Semantic search engine over PDF documentation with citation tracking." }
    ]
  },
  "Frontend / UI Engineer": {
    requiredSkills: ["React/Next.js", "TypeScript", "CSS/Tailwind", "State Management", "Performance Optimization", "Accessibility (a11y)"],
    coreSubjects: ["DSA", "CN", "OS"],
    roadmapPhases: [
      { phase: "Phase 1: Core Web & React (Weeks 1-4)", focus: "HTML5, CSS Grid/Flex, React Hooks & TypeScript", action: "Build pixel-perfect responsive layouts and manage component state." },
      { phase: "Phase 2: Advanced Patterns & Performance (Weeks 5-8)", focus: "Code Splitting, Lazy Loading, React Query, Zustand", action: "Implement virtualization, memoization, and bundle optimization." },
      { phase: "Phase 3: Production Deployment (Weeks 9-12)", focus: "Next.js SSR/SSG, CI/CD, Web Vitals & SEO", action: "Deploy Next.js app on Vercel with 100 Lighthouse score." },
    ],
    projects: [
      { title: "Component Design System", level: "Intermediate", skills: ["React", "TypeScript", "Storybook"], desc: "Fully documented, accessible UI component library with light/dark themes." },
      { title: "Real-time Dashboard Builder", level: "Advanced", skills: ["React", "D3.js", "WebSockets"], desc: "Drag-and-drop analytics dashboard with live data streaming." },
      { title: "AI-Powered Form Generator", level: "Intermediate", skills: ["Next.js", "OpenAI", "React Hook Form"], desc: "Converts natural language prompts to dynamic, validated forms." }
    ]
  },
  "DevOps & Cloud Engineer": {
    requiredSkills: ["Linux & Shell Scripting", "Docker & Kubernetes", "CI/CD Pipelines", "AWS/GCP/Azure", "IaC (Terraform)", "Monitoring & Observability"],
    coreSubjects: ["OS", "CN", "DBMS"],
    roadmapPhases: [
      { phase: "Phase 1: Linux, Networking & Containers (Weeks 1-4)", focus: "Linux internals, TCP/IP, Docker containerization", action: "Write Dockerfiles, docker-compose, and manage container lifecycle." },
      { phase: "Phase 2: Kubernetes & CI/CD (Weeks 5-8)", focus: "K8s Deployments, Helm Charts, GitHub Actions/Jenkins", action: "Orchestrate microservices and automate build-test-deploy pipelines." },
      { phase: "Phase 3: Cloud & IaC (Weeks 9-12)", focus: "AWS EC2/S3/RDS, Terraform, CloudWatch & Alerting", action: "Provision cloud infrastructure as code and set up SRE dashboards." },
    ],
    projects: [
      { title: "Full CI/CD Platform on AWS", level: "Advanced", skills: ["GitHub Actions", "Docker", "AWS ECS", "Terraform"], desc: "Zero-downtime blue-green deployment pipeline with rollback automation." },
      { title: "K8s Auto-Scaling Cluster", level: "Advanced", skills: ["Kubernetes", "Helm", "Prometheus", "Grafana"], desc: "Microservice cluster with HPA, resource limits, and Grafana dashboards." },
      { title: "IaC Multi-Environment Setup", level: "Intermediate", skills: ["Terraform", "AWS", "Ansible"], desc: "Modular Terraform code for dev/staging/prod environments with secrets management." }
    ]
  },
  "Mobile App Developer (Android/iOS)": {
    requiredSkills: ["Kotlin/Swift or React Native", "Mobile UI/UX Patterns", "REST & GraphQL APIs", "SQLite/Room Database", "Push Notifications", "App Store Deployment"],
    coreSubjects: ["OS", "CN", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Mobile Fundamentals (Weeks 1-4)", focus: "Jetpack Compose / SwiftUI or React Native core", action: "Build multi-screen apps with navigation and local data persistence." },
      { phase: "Phase 2: API Integration & State (Weeks 5-8)", focus: "REST API, Retrofit/Axios, State management (MVI/Bloc)", action: "Connect app to backend, manage async states and error handling." },
      { phase: "Phase 3: Release & Optimization (Weeks 9-12)", focus: "App Store deployment, performance profiling, crash analytics", action: "Publish a production app with Firebase Analytics and Crashlytics." },
    ],
    projects: [
      { title: "AI Study Buddy App", level: "Advanced", skills: ["React Native", "OpenAI", "SQLite", "Expo"], desc: "Mobile flashcard app with AI explanation, spaced repetition, and offline mode." },
      { title: "Expense Tracker with Budgets", level: "Intermediate", skills: ["Kotlin", "Room DB", "Jetpack Compose"], desc: "Personal finance app with charts, category budgets and monthly reports." },
      { title: "Location-Based Community App", level: "Advanced", skills: ["Swift", "MapKit", "Firebase"], desc: "Real-time map with user posts, geo-notifications and chat per location." }
    ]
  },
  "Cybersecurity Engineer": {
    requiredSkills: ["Network Security & Protocols", "Linux & OS Internals", "Cryptography & PKI", "Penetration Testing (OWASP)", "SIEM & Threat Detection", "Python/Bash Scripting"],
    coreSubjects: ["CN", "OS", "DBMS"],
    roadmapPhases: [
      { phase: "Phase 1: Fundamentals (Weeks 1-4)", focus: "Networking, OS Security, Cryptography basics", action: "Study TCP/IP, TLS handshake, AES/RSA encryption and common CVEs." },
      { phase: "Phase 2: Offensive Security (Weeks 5-8)", focus: "Kali Linux, Metasploit, Burp Suite & OWASP Top 10", action: "Complete CTF challenges and run controlled penetration tests." },
      { phase: "Phase 3: Defensive & Compliance (Weeks 9-12)", focus: "SIEM (Splunk/ELK), Incident Response, SOC Analyst skills", action: "Build detection rules, respond to simulated incidents, audit access logs." },
    ],
    projects: [
      { title: "Web Vulnerability Scanner", level: "Advanced", skills: ["Python", "OWASP ZAP", "BeautifulSoup"], desc: "Automated scanner detecting SQL injection, XSS and CSRF vulnerabilities." },
      { title: "Network Traffic Analyzer", level: "Intermediate", skills: ["Python", "Scapy", "Wireshark"], desc: "Live packet inspector with anomaly detection and threat flagging." },
      { title: "Zero-Trust Auth System", level: "Advanced", skills: ["Node.js", "JWT", "RBAC", "MFA"], desc: "Multi-factor auth with role-based access and activity audit trails." }
    ]
  },
  "Data Scientist": {
    requiredSkills: ["Python (NumPy/Pandas/Matplotlib)", "Statistics & Probability", "Machine Learning Algorithms", "SQL & Data Wrangling", "Jupyter & EDA", "Model Evaluation & Tuning"],
    coreSubjects: ["DSA", "DBMS"],
    roadmapPhases: [
      { phase: "Phase 1: Statistics & EDA (Weeks 1-4)", focus: "Descriptive statistics, hypothesis testing, data visualization", action: "Analyze 3 real datasets using Pandas and Seaborn, publish notebooks." },
      { phase: "Phase 2: ML Algorithms (Weeks 5-8)", focus: "Regression, Classification, Clustering, Ensemble Methods", action: "Implement models from scratch, then with scikit-learn, compare metrics." },
      { phase: "Phase 3: End-to-End ML Projects (Weeks 9-12)", focus: "Feature engineering, model deployment on Streamlit/Flask", action: "Ship a complete ML project with data pipeline, training and live prediction API." },
    ],
    projects: [
      { title: "Customer Churn Predictor", level: "Intermediate", skills: ["Python", "Scikit-learn", "XGBoost"], desc: "Binary classification model predicting subscription cancellations with SHAP explanations." },
      { title: "Stock Price Forecaster", level: "Advanced", skills: ["Python", "LSTM", "TensorFlow", "yFinance"], desc: "Time-series LSTM model with walk-forward validation and confidence intervals." },
      { title: "NLP Sentiment Dashboard", level: "Intermediate", skills: ["Python", "HuggingFace", "Streamlit"], desc: "Real-time social media sentiment analyzer with topic modeling." }
    ]
  },
  "Cloud Solutions Architect": {
    requiredSkills: ["AWS/GCP/Azure Architecture", "Microservices & Serverless", "Networking & VPC Design", "Cost Optimization", "Security & IAM", "System Design Patterns"],
    coreSubjects: ["CN", "OS", "System Design"],
    roadmapPhases: [
      { phase: "Phase 1: Cloud Fundamentals (Weeks 1-4)", focus: "Core services (EC2, S3, Lambda, VPC, IAM), pricing models", action: "Architect a 3-tier web app with auto-scaling and load balancing on AWS." },
      { phase: "Phase 2: Scalability & Reliability (Weeks 5-8)", focus: "Multi-region deployments, CDN, failover, SQS/SNS messaging", action: "Design fault-tolerant systems with RTO/RPO targets." },
      { phase: "Phase 3: Certification & Specialization (Weeks 9-12)", focus: "AWS SAA-C03 / GCP ACE prep + Well-Architected Framework", action: "Pass cloud associate certification, build capstone cloud architecture." },
    ],
    projects: [
      { title: "Serverless E-Commerce Backend", level: "Advanced", skills: ["AWS Lambda", "DynamoDB", "API Gateway", "SQS"], desc: "Fully serverless checkout flow handling 10k requests/sec with zero cold starts." },
      { title: "Multi-Region Disaster Recovery", level: "Advanced", skills: ["AWS Route53", "RDS Multi-AZ", "S3 Replication"], desc: "Active-passive DR setup with automated failover under 60 seconds." },
      { title: "Cost Optimization Dashboard", level: "Intermediate", skills: ["AWS Cost Explorer API", "Python", "Grafana"], desc: "Real-time cloud cost tracker with automated rightsizing recommendations." }
    ]
  },
  "Site Reliability Engineer (SRE)": {
    requiredSkills: ["SLO/SLA/SLI Design", "Incident Management", "Go/Python Scripting", "Observability (Prometheus/Grafana)", "Chaos Engineering", "Kubernetes & Service Mesh"],
    coreSubjects: ["OS", "CN", "System Design"],
    roadmapPhases: [
      { phase: "Phase 1: Reliability Foundations (Weeks 1-4)", focus: "SLOs, error budgets, on-call runbooks, alerting strategy", action: "Define SLIs for a production service and write PagerDuty alerts." },
      { phase: "Phase 2: Observability & Incident (Weeks 5-8)", focus: "Distributed tracing (Jaeger), log aggregation (ELK), post-mortems", action: "Instrument a microservice with traces, metrics, and structured logs." },
      { phase: "Phase 3: Chaos & Automation (Weeks 9-12)", focus: "Chaos Monkey, canary releases, automated rollbacks", action: "Run controlled failure experiments and validate recovery procedures." },
    ],
    projects: [
      { title: "SRE Observability Stack", level: "Advanced", skills: ["Prometheus", "Grafana", "Jaeger", "Docker"], desc: "Full monitoring stack with RED metrics, distributed tracing and alerting." },
      { title: "Chaos Engineering Suite", level: "Advanced", skills: ["Chaos Monkey", "Python", "K8s"], desc: "Automated fault injection tests validating system resilience under failure." },
      { title: "Incident Response Runbook Bot", level: "Intermediate", skills: ["Python", "Slack API", "PagerDuty"], desc: "Slack bot surfacing runbooks, escalation paths and alert context during incidents." }
    ]
  },
  "Embedded Systems / IoT Engineer": {
    requiredSkills: ["C/C++ for Embedded", "RTOS & Bare Metal", "Microcontrollers (ARM/ESP32)", "Communication Protocols (UART/SPI/I2C)", "Power Optimization", "Firmware Development"],
    coreSubjects: ["OS", "CN", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Microcontroller Basics (Weeks 1-4)", focus: "GPIO, timers, interrupts, memory map on ARM Cortex-M", action: "Write bare-metal blinky, PWM motor control, and UART driver from scratch." },
      { phase: "Phase 2: RTOS & Peripherals (Weeks 5-8)", focus: "FreeRTOS tasks, queues, semaphores; SPI/I2C sensor drivers", action: "Build multi-task RTOS app reading sensors and publishing over MQTT." },
      { phase: "Phase 3: IoT & Cloud Integration (Weeks 9-12)", focus: "MQTT/HTTP to AWS IoT Core, OTA updates, power profiling", action: "Ship end-to-end IoT prototype with cloud dashboard and OTA firmware." },
    ],
    projects: [
      { title: "Smart Home Sensor Hub", level: "Advanced", skills: ["ESP32", "FreeRTOS", "MQTT", "AWS IoT"], desc: "Multi-sensor node (temp, humidity, motion) streaming to cloud dashboard with alerts." },
      { title: "Real-Time Motor Controller", level: "Intermediate", skills: ["STM32", "C", "PWM", "PID Control"], desc: "PID-controlled DC motor with speed/position feedback via encoder." },
      { title: "Asset Tracking with GPS/BLE", level: "Advanced", skills: ["nRF52", "C++", "BLE Mesh", "GPS"], desc: "Low-power BLE tracker with GPS geofencing and battery-optimized firmware." }
    ]
  },
  "QA / Test Automation Engineer": {
    requiredSkills: ["Test Strategy & Planning", "Selenium/Playwright/Cypress", "API Testing (Postman/REST Assured)", "CI Integration", "Performance Testing (JMeter/k6)", "Python/JavaScript for Automation"],
    coreSubjects: ["DSA", "DBMS", "CN"],
    roadmapPhases: [
      { phase: "Phase 1: Testing Fundamentals (Weeks 1-4)", focus: "STLC, test case design, manual testing, bug reporting", action: "Write 50+ test cases for a real web app and file detailed defect reports." },
      { phase: "Phase 2: Automation Framework (Weeks 5-8)", focus: "Selenium/Playwright Page Object Model, API testing with Postman", action: "Build end-to-end test suite covering UI and REST APIs with CI integration." },
      { phase: "Phase 3: Performance & Security (Weeks 9-12)", focus: "JMeter load tests, OWASP scanning, test reporting dashboards", action: "Run 1000-user load test, analyze bottlenecks and integrate with Allure Reports." },
    ],
    projects: [
      { title: "E2E Test Framework for E-Commerce", level: "Intermediate", skills: ["Playwright", "TypeScript", "GitHub Actions"], desc: "Complete test suite covering cart, checkout and payment flows with CI pipeline." },
      { title: "API Performance Benchmark Tool", level: "Intermediate", skills: ["k6", "JavaScript", "Grafana"], desc: "Load testing script running 10k VUs with real-time result visualization." },
      { title: "Visual Regression Testing System", level: "Intermediate", skills: ["Percy/Chromatic", "Storybook", "CI/CD"], desc: "Automated pixel-diff detection catching unintended UI regressions on every PR." }
    ]
  },
  "Blockchain / Web3 Developer": {
    requiredSkills: ["Solidity & Smart Contracts", "EVM Architecture", "Web3.js/Ethers.js", "DeFi Protocols", "IPFS & Decentralized Storage", "Security & Auditing"],
    coreSubjects: ["CN", "OS", "DSA"],
    roadmapPhases: [
      { phase: "Phase 1: Blockchain Fundamentals (Weeks 1-4)", focus: "Consensus mechanisms, cryptography, Ethereum EVM & Solidity basics", action: "Write and deploy ERC-20 token and simple voting contract on testnet." },
      { phase: "Phase 2: DApp Development (Weeks 5-8)", focus: "Hardhat, IPFS, MetaMask integration, React + Ethers.js frontend", action: "Build a fully functional NFT marketplace with minting and trading." },
      { phase: "Phase 3: DeFi & Security (Weeks 9-12)", focus: "AMM protocols, flash loans, reentrancy attacks, formal verification", action: "Audit a smart contract for the OWASP Web3 Top-10 vulnerabilities." },
    ],
    projects: [
      { title: "Decentralized Exchange (DEX)", level: "Advanced", skills: ["Solidity", "Uniswap v2", "React", "Hardhat"], desc: "AMM-based DEX with liquidity pools, token swaps and fee distribution." },
      { title: "NFT Ticketing Platform", level: "Intermediate", skills: ["Solidity", "IPFS", "Next.js", "OpenSea API"], desc: "Event ticketing as soulbound NFTs preventing scalping with transfer restrictions." },
      { title: "DAO Governance Protocol", level: "Advanced", skills: ["Solidity", "OpenZeppelin Governor", "Snapshot"], desc: "On-chain governance with proposal creation, voting, and treasury execution." }
    ]
  },
  "Game Developer": {
    requiredSkills: ["Unity/Unreal Engine (C#/C++)", "Game Physics & Math", "3D Modeling Basics", "AI & Pathfinding (A*)", "Networking for Multiplayer", "Shader Programming"],
    coreSubjects: ["DSA", "OS", "CN"],
    roadmapPhases: [
      { phase: "Phase 1: Engine & Core Mechanics (Weeks 1-4)", focus: "Unity/Unreal fundamentals, physics, collisions, input handling", action: "Build a complete 2D platformer with enemies, collectibles and save system." },
      { phase: "Phase 2: AI & Advanced Systems (Weeks 5-8)", focus: "NavMesh AI, procedural generation, animation state machines", action: "Implement FSM enemy AI with A* pathfinding and procedural dungeon generation." },
      { phase: "Phase 3: Multiplayer & Polish (Weeks 9-12)", focus: "Mirror/Photon multiplayer, shader effects, optimization & profiling", action: "Release a 4-player online game on itch.io with < 16ms server tick rate." },
    ],
    projects: [
      { title: "3D Stealth Action Game", level: "Advanced", skills: ["Unity", "C#", "NavMesh", "Cinemachine"], desc: "Enemy AI with vision cones, patrol routes and alert state machine." },
      { title: "Procedural Roguelike RPG", level: "Advanced", skills: ["Unity", "C#", "Wave Function Collapse"], desc: "Infinitely generated dungeons with emergent gameplay and permadeath." },
      { title: "Online Battle Arena Prototype", level: "Intermediate", skills: ["Unity", "Photon PUN", "Mirror"], desc: "Real-time 4-player brawler with lag compensation and authoritative server." }
    ]
  },
  "Product Manager (Technical)": {
    requiredSkills: ["Product Strategy & PRD Writing", "Agile/Scrum", "Data Analytics & SQL", "User Research & A/B Testing", "Roadmap Prioritization", "API Literacy & System Design basics"],
    coreSubjects: ["DBMS", "System Design"],
    roadmapPhases: [
      { phase: "Phase 1: PM Foundations (Weeks 1-4)", focus: "User stories, PRDs, OKRs, Agile ceremonies, market research", action: "Write a full PRD for an existing product feature with acceptance criteria." },
      { phase: "Phase 2: Data-Driven Product (Weeks 5-8)", focus: "SQL analytics, funnel analysis, A/B testing, cohort retention", action: "Analyze product data in SQL, identify drop-off, design and ship A/B test." },
      { phase: "Phase 3: Technical Depth (Weeks 9-12)", focus: "System design interviews, API design review, trade-off analysis", action: "Lead sprint with engineers, write technical spec and deliver feature." },
    ],
    projects: [
      { title: "Product Case Study Portfolio", level: "Intermediate", skills: ["Figma", "SQL", "Google Analytics"], desc: "3 teardown case studies with redesign proposals, metrics and PRDs." },
      { title: "Growth Experiment Dashboard", level: "Intermediate", skills: ["SQL", "Python", "Mixpanel"], desc: "Self-serve A/B test tracker measuring feature impact on key north star metrics." },
      { title: "Competitive Intelligence Tool", level: "Intermediate", skills: ["Python", "Scraping", "Notion API"], desc: "Automated monitor tracking competitor releases, pricing and reviews weekly." }
    ]
  },
  "Network Engineer": {
    requiredSkills: ["TCP/IP & OSI Model Mastery", "Routing Protocols (OSPF/BGP)", "Switching & VLANs", "Network Security & Firewalls", "SDN & NFV", "Cisco/Juniper CLI"],
    coreSubjects: ["CN", "OS"],
    roadmapPhases: [
      { phase: "Phase 1: Networking Fundamentals (Weeks 1-4)", focus: "OSI layers, IP addressing, subnetting, Ethernet & ARP", action: "Configure VLANs, inter-VLAN routing and STP in GNS3/Packet Tracer." },
      { phase: "Phase 2: Routing & Protocols (Weeks 5-8)", focus: "OSPF, EIGRP, BGP, policy-based routing, MPLS", action: "Build multi-router OSPF topology and implement BGP peering." },
      { phase: "Phase 3: Security & Cloud Networking (Weeks 9-12)", focus: "Firewall rules, VPN tunnels, AWS VPC & Cisco CCNA prep", action: "Secure a network perimeter with DMZ, ACLs and site-to-site VPN." },
    ],
    projects: [
      { title: "Enterprise Campus Network Design", level: "Advanced", skills: ["Cisco IOS", "OSPF", "GNS3"], desc: "3-tier hierarchical campus network with redundant links and QoS policies." },
      { title: "BGP Traffic Engineering Lab", level: "Advanced", skills: ["Cisco", "BGP", "Python-ncclient"], desc: "Multi-AS BGP topology with traffic engineering via communities and local pref." },
      { title: "Network Automation with Python", level: "Intermediate", skills: ["Python", "Netmiko", "Nornir", "Ansible"], desc: "Automated configuration backup, compliance checks and bulk provisioning." }
    ]
  },
  "Database Administrator (DBA)": {
    requiredSkills: ["Advanced SQL & Query Optimization", "Indexing & Execution Plans", "Replication & High Availability", "Backup & Recovery", "NoSQL (MongoDB/Redis)", "Database Security & Compliance"],
    coreSubjects: ["DBMS", "OS"],
    roadmapPhases: [
      { phase: "Phase 1: SQL Mastery (Weeks 1-4)", focus: "Advanced joins, window functions, CTEs, execution plan analysis", action: "Optimize 10 slow queries using EXPLAIN and index strategies." },
      { phase: "Phase 2: Administration & HA (Weeks 5-8)", focus: "Replication, partitioning, point-in-time recovery, monitoring", action: "Set up MySQL primary-replica with automated failover and backups." },
      { phase: "Phase 3: Performance & Scale (Weeks 9-12)", focus: "Connection pooling (pgBouncer), sharding, NoSQL patterns, GDPR", action: "Benchmark and tune a 10M row database for sub-10ms P99 latency." },
    ],
    projects: [
      { title: "High-Availability PostgreSQL Cluster", level: "Advanced", skills: ["PostgreSQL", "Patroni", "pgBouncer", "HAProxy"], desc: "Automated failover cluster with streaming replication and load balancing." },
      { title: "Database Migration & ETL Pipeline", level: "Intermediate", skills: ["Python", "SQLAlchemy", "Alembic", "PostgreSQL"], desc: "Zero-downtime schema migration with data transformation and validation." },
      { title: "Multi-Model DB Comparison Study", level: "Intermediate", skills: ["PostgreSQL", "MongoDB", "Redis", "Cassandra"], desc: "Benchmarking relational vs NoSQL for social graph, time-series and KV workloads." }
    ]
  },
  "Software Architect / Tech Lead": {
    requiredSkills: ["System Design & HLD", "Microservices & Event-Driven", "API Design (REST/GraphQL/gRPC)", "Code Review & Tech Mentorship", "NFR Analysis (Scale/Perf/Security)", "Cloud-Native Patterns"],
    coreSubjects: ["System Design", "DBMS", "CN", "OS"],
    roadmapPhases: [
      { phase: "Phase 1: Architecture Patterns (Weeks 1-4)", focus: "Microservices, CQRS, Event Sourcing, DDD, Hexagonal Architecture", action: "Design and document architecture for a ride-sharing backend using ADRs." },
      { phase: "Phase 2: Scalability Deep Dive (Weeks 5-8)", focus: "CAP theorem, consistent hashing, sharding, caching strategies", action: "Solve 5 system design problems at FAANG scale with diagrams and trade-offs." },
      { phase: "Phase 3: Leadership & Delivery (Weeks 9-12)", focus: "Tech debt management, RFC process, cross-team dependencies, roadmap", action: "Write 3 architecture decision records and present designs to stakeholders." },
    ],
    projects: [
      { title: "Social Media Platform Architecture", level: "Advanced", skills: ["System Design", "Kafka", "Redis", "Cassandra"], desc: "End-to-end HLD for Instagram-scale feed, notifications and media service." },
      { title: "Multi-Tenant SaaS Platform", level: "Advanced", skills: ["Node.js", "PostgreSQL", "Stripe", "Kubernetes"], desc: "Tenant-isolated SaaS with billing, RBAC, and feature-flag system." },
      { title: "API Gateway & Service Mesh", level: "Advanced", skills: ["Kong/Traefik", "Istio", "Envoy", "gRPC"], desc: "Centralized gateway with rate limiting, auth, tracing and circuit breakers." }
    ]
  },
  "Scaler / Competitive Programmer": {
    requiredSkills: ["DSA — Advanced (DP, Graphs, Trees)", "Mathematics & Number Theory", "STL / Java Collections Mastery", "Time & Space Complexity", "Problem Decomposition", "Contest Platforms (Codeforces/LeetCode)"],
    coreSubjects: ["DSA", "Aptitude"],
    roadmapPhases: [
      { phase: "Phase 1: Core DSA Mastery (Weeks 1-4)", focus: "Arrays, Strings, Stacks, Queues, Linked Lists, Binary Search", action: "Solve 80 Easy + Medium LeetCode problems across these topics." },
      { phase: "Phase 2: Advanced Algorithms (Weeks 5-8)", focus: "DP patterns, Graph algorithms (Dijkstra/Bellman-Ford/Floyd), Trees", action: "Solve 50 Hard problems, participate in 4 Codeforces rounds." },
      { phase: "Phase 3: Contest Preparation (Weeks 9-12)", focus: "Segment Trees, Fenwick Trees, Network Flow, Game Theory", action: "Reach Codeforces Specialist or LeetCode Knight rating." },
    ],
    projects: [
      { title: "LeetCode Solutions Repository", level: "Intermediate", skills: ["C++", "Python", "Java"], desc: "300+ LeetCode solutions with explanations, complexity analysis and pattern tags." },
      { title: "Online Judge System", level: "Advanced", skills: ["Node.js", "Docker", "Code Sandbox", "Redis"], desc: "Sandboxed code execution platform with verdict engine, test cases and leaderboard." },
      { title: "Visualizer for DSA Algorithms", level: "Intermediate", skills: ["React", "D3.js", "Animations"], desc: "Step-by-step animated visualizations for sorting, pathfinding and tree traversals." }
    ]
  },
  "Freshers / FAANG SDE Aspirant": {
    requiredSkills: ["DSA & Problem Solving", "CS Core (OS/CN/DBMS/OOPs)", "System Design Basics", "Behavioral Interviews (STAR)", "Aptitude & Reasoning", "One Strong Language (C++/Java/Python)"],
    coreSubjects: ["DSA", "DBMS", "OS", "CN", "OOPs", "Aptitude"],
    roadmapPhases: [
      { phase: "Phase 1: CS Fundamentals (Weeks 1-4)", focus: "OS, DBMS, CN, OOPs — all interview-ready topics", action: "Create a notes sheet for every CS subject and solve 20 MCQs/day per topic." },
      { phase: "Phase 2: DSA Deep Dive (Weeks 5-8)", focus: "Arrays to DP to Graphs, Hard LeetCode patterns", action: "Solve 150 curated LeetCode problems following Blind 75 + NeetCode 150." },
      { phase: "Phase 3: Mock Interviews & OA Prep (Weeks 9-12)", focus: "Resume, HR rounds, system design basics, online assessments", action: "Give 10 mock interviews, apply to 50 companies and ace OAs." },
    ],
    projects: [
      { title: "Full-Stack Web Project", level: "Intermediate", skills: ["React", "Node.js", "MongoDB", "REST API"], desc: "Production-quality project with auth, CRUD, deployment and README." },
      { title: "DSA Visual Cheatsheet Portfolio", level: "Intermediate", skills: ["React", "Markdown", "GitHub Pages"], desc: "Personal website with solved problems, topic summaries and complexity tables." },
      { title: "Open Source Contribution", level: "Intermediate", skills: ["Git", "GitHub", "Any Stack"], desc: "Merged PRs in popular repos demonstrating code quality and collaboration." }
    ]
  }
};


// GET /api/career/dashboard
export const getCareerDashboard = async (req, res) => {
  try {
    let profile = await CareerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await CareerProfile.create({ user: req.user._id, targetRole: "Full Stack Software Engineer" });
    }

    const [testResults, roadmaps] = await Promise.all([
      TestResult.find({ user: req.user._id }).sort({ createdAt: -1 }),
      Roadmap.find({ user: req.user._id }),
    ]);

    const targetRole = profile.targetRole || "Full Stack Software Engineer";
    const roleData = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS["Full Stack Software Engineer"];

    // 1. Compute Subject Mastery Across All 9 Core CSE Domains
    const subjectMap = {
      DSA: [],
      DBMS: [],
      OS: [],
      CN: [],
      OOPS: [],
      SYSTEM_DESIGN: [],
      APTITUDE: [],
      WEB_DEV: [],
      MACHINE_LEARNING: [],
    };

    const topicScoreMap = {};

    testResults.forEach((tr) => {
      if (subjectMap[tr.subject]) {
        subjectMap[tr.subject].push(tr.scorePercent);
      }
      if (tr.topicBreakdown) {
        for (const [top, d] of Object.entries(tr.topicBreakdown)) {
          const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
          if (!topicScoreMap[top] || tr.createdAt > topicScoreMap[top].date) {
            topicScoreMap[top] = { percent: pct, date: tr.createdAt };
          }
        }
      }
    });

    const getSubjAvg = (subj, fallback = null) => {
      const arr = subjectMap[subj] || [];
      return arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;
    };

    // Calculate academic score on core relevant subjects
    const relevantSubjectScores = (roleData.coreSubjects || ["DSA", "DBMS"])
      .map((s) => getSubjAvg(s, null))
      .filter((s) => s !== null);

    const allTestedScores = Object.values(subjectMap)
      .flat()
      .filter((s) => typeof s === "number");

    const overallAvgScore = allTestedScores.length > 0
      ? Math.round(allTestedScores.reduce((a, b) => a + b, 0) / allTestedScores.length)
      : 50;

    const academicScore = relevantSubjectScores.length > 0
      ? Math.round(relevantSubjectScores.reduce((a, b) => a + b, 0) / relevantSubjectScores.length)
      : overallAvgScore;

    // 2. Roadmap Execution Rate
    let totalCompletedDays = 0;
    let totalRoadmapDays = 0;
    roadmaps.forEach((rm) => {
      if (Array.isArray(rm.days)) {
        totalRoadmapDays += rm.days.length;
        totalCompletedDays += rm.days.filter((d) => d.completed).length;
      }
    });
    const roadmapExecutionRate = totalRoadmapDays > 0 ? Math.round((totalCompletedDays / totalRoadmapDays) * 100) : 0;

    // 3. Resume ATS Score
    const resumeTextLower = (profile.resumeText || "").toLowerCase();
    const atsScore = profile.atsScore || (profile.resumeText ? 65 : 45);

    // 4. Mock Interview Performance
    const mockInterviewScore = profile.mockInterviewScore || 0;
    const mockAttemptsCount = profile.mockAttemptsCount || 0;

    // 5. Total Dynamic Job Readiness Score
    const assessmentBreadthScore = Math.min(100, testResults.length * 15);
    const mockComponentScore = mockAttemptsCount > 0 ? mockInterviewScore : (academicScore * 0.7);

    const jobReadinessScore = Math.min(
      99,
      Math.max(
        25,
        Math.round(
          academicScore * 0.35 +
          atsScore * 0.25 +
          (roadmapExecutionRate > 0 ? roadmapExecutionRate : academicScore * 0.6) * 0.15 +
          mockComponentScore * 0.15 +
          assessmentBreadthScore * 0.10
        )
      )
    );

    // 6. Dynamic Skill Match Matrix
    const skillMatchMatrix = roleData.requiredSkills.map((skill) => {
      let score = 40;
      const skillLower = skill.toLowerCase();

      // Match topic names
      for (const [topName, topData] of Object.entries(topicScoreMap)) {
        if (skillLower.includes(topName.toLowerCase()) || topName.toLowerCase().includes(skillLower)) {
          score = Math.max(score, topData.percent);
        }
      }

      // Match subject domain averages
      if (skillLower.includes("dbms") || skillLower.includes("sql") || skillLower.includes("postgres") || skillLower.includes("database")) {
        score = Math.max(score, getSubjAvg("DBMS", 45));
      } else if (skillLower.includes("dsa") || skillLower.includes("algorithm") || skillLower.includes("graph") || skillLower.includes("tree") || skillLower.includes("complexity")) {
        score = Math.max(score, getSubjAvg("DSA", 45));
      } else if (skillLower.includes("os") || skillLower.includes("concurrency") || skillLower.includes("process") || skillLower.includes("thread")) {
        score = Math.max(score, getSubjAvg("OS", 45));
      } else if (skillLower.includes("react") || skillLower.includes("javascript") || skillLower.includes("node") || skillLower.includes("web") || skillLower.includes("rest api")) {
        score = Math.max(score, getSubjAvg("WEB_DEV", 45));
      } else if (skillLower.includes("system design") || skillLower.includes("scalability") || skillLower.includes("microservice") || skillLower.includes("cache") || skillLower.includes("redis")) {
        score = Math.max(score, getSubjAvg("SYSTEM_DESIGN", 45));
      } else if (skillLower.includes("network") || skillLower.includes("tcp") || skillLower.includes("http")) {
        score = Math.max(score, getSubjAvg("CN", 45));
      } else if (skillLower.includes("oop") || skillLower.includes("solid") || skillLower.includes("design pattern")) {
        score = Math.max(score, getSubjAvg("OOPS", 45));
      } else if (skillLower.includes("machine learning") || skillLower.includes("pytorch") || skillLower.includes("llm") || skillLower.includes("ai")) {
        score = Math.max(score, getSubjAvg("MACHINE_LEARNING", 45));
      }

      // Check if keyword is found in student's uploaded resume
      const keywords = skillLower.split(/[\s/,&]+/);
      const inResume = keywords.some((k) => k.length > 2 && resumeTextLower.includes(k));
      if (inResume) {
        score = Math.min(99, score + 12);
      }

      return {
        skill,
        masteryScore: score,
        inResume,
        status: score >= 75 ? "Job Ready" : score >= 55 ? "Developing" : "Action Needed",
      };
    });

    // AI-generated role-specific mock interview questions
    let mockQuestions = [
      {
        id: "mq1",
        subject: roleData.coreSubjects[0] || "DBMS",
        type: "Technical Viva",
        question: "Explain the difference between B-Trees and B+ Trees, and why B+ Trees are used for database indexing.",
        difficulty: "Medium",
      },
      {
        id: "mq2",
        subject: roleData.coreSubjects[1] || "DSA",
        type: "Algorithm Logic",
        question: "How would you detect a cycle in a directed graph using DFS? Explain the three-color marking approach.",
        difficulty: "Hard",
      },
      {
        id: "mq3",
        subject: "System Design",
        type: "Architecture",
        question: `Design a scalable REST API system for ${targetRole}. Discuss database choice, caching strategy, and handling concurrent requests.`,
        difficulty: "Hard",
      },
      {
        id: "mq4",
        subject: "Behavioral",
        type: "Engineering Culture",
        question: "Describe a complex technical bug you encountered in a project. How did you isolate the root cause and resolve it?",
        difficulty: "Easy",
      },
      {
        id: "mq5",
        subject: roleData.coreSubjects[0] || "DBMS",
        type: "Concept Depth",
        question: `Explain ACID properties in databases. Give a real-world example where violating any one property causes a critical failure.`,
        difficulty: "Medium",
      },
    ];

    // Try to generate AI-powered role-specific questions
    try {
      const openai = getAIClient();
      const model = getAIModel();
      const mqPrompt = `You are a Senior ${targetRole} hiring manager at a top tech company.
Generate 5 diverse technical interview questions for a Computer Science student targeting the role of "${targetRole}".
Cover these topics: ${roleData.requiredSkills.join(", ")}.
Include 2 core CS theory questions, 1 system design, 1 coding/algorithm, and 1 behavioral question.

Respond strictly in valid JSON format:
[
  { "id": "mq1", "subject": "DBMS", "type": "Technical Viva", "question": "...", "difficulty": "Medium" },
  { "id": "mq2", "subject": "DSA", "type": "Algorithm Logic", "question": "...", "difficulty": "Hard" },
  { "id": "mq3", "subject": "System Design", "type": "Architecture", "question": "...", "difficulty": "Hard" },
  { "id": "mq4", "subject": "Coding", "type": "Problem Solving", "question": "...", "difficulty": "Medium" },
  { "id": "mq5", "subject": "Behavioral", "type": "Engineering Culture", "question": "...", "difficulty": "Easy" }
]`;
      const mqRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: mqPrompt }],
        temperature: 0.6,
      });
      const rawMq = mqRes.choices[0]?.message?.content || "";
      const cleanMq = rawMq.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const aiQuestions = JSON.parse(cleanMq);
      if (Array.isArray(aiQuestions) && aiQuestions.length >= 3) {
        mockQuestions = aiQuestions;
      }
    } catch (mqErr) {
      console.error("AI mock question generation failed, using defaults:", mqErr.message);
    }

    // AI Career Readiness Evaluation Synthesis
    let aiCareerSynthesis = null;
    try {
      const openai = getAIClient();
      const model = getAIModel();
      const prompt = `Act as a Senior Director of Engineering evaluating a Computer Science student for the role of "${targetRole}".
STUDENT METRICS:
- Overall Job Readiness Score: ${jobReadinessScore}%
- Academic Test Average: ${overallAvgScore}% across ${testResults.length} assessments
- Resume ATS Score: ${atsScore}%
- Completed 7-Day Roadmap Milestones: ${totalCompletedDays}/${totalRoadmapDays} days
- Mock Interview Practice: ${mockAttemptsCount} questions answered (Avg score: ${mockInterviewScore}%)
- Target Role Required Skills: ${roleData.requiredSkills.join(", ")}

Respond strictly in valid JSON format:
{
  "readinessEvaluation": "2-sentence executive summary of job readiness for ${targetRole} directly referencing the student's actual test results, resume match, and roadmap progress.",
  "keyNextStep": "Top priority action item to increase candidate placement odds."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      aiCareerSynthesis = JSON.parse(clean);
    } catch (aiErr) {
      aiCareerSynthesis = {
        readinessEvaluation: `Your current Job Readiness Score for ${targetRole} is ${jobReadinessScore}%. Based on your ${testResults.length} assessments and ATS resume profile, continue targeting your critical gaps.`,
        keyNextStep: `Focus on mastering required skills: ${roleData.requiredSkills.slice(0, 2).join(", ")}.`,
      };
    }

    res.json({
      targetRole,
      jobReadinessScore,
      atsScore,
      testsTaken: testResults.length,
      averageScore: overallAvgScore,
      completedRoadmapDays: totalCompletedDays,
      mockInterviewScore,
      mockAttemptsCount,
      resumeText: profile.resumeText,
      roadmapPhases: roleData.roadmapPhases,
      recommendedProjects: roleData.projects,
      skillMatchMatrix,
      mockQuestions,
      aiCareerSynthesis,
      availableRoles: Object.keys(ROLE_BENCHMARKS),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching career dashboard", error: error.message });
  }
};

// POST /api/career/update-role
export const updateTargetRole = async (req, res) => {
  try {
    const { targetRole } = req.body;
    let profile = await CareerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CareerProfile({ user: req.user._id });
    }
    profile.targetRole = targetRole;
    await profile.save();

    recordAuditLog({
      req,
      action: "TARGET_ROLE_UPDATED",
      details: { targetRole: profile.targetRole },
    }).catch((aErr) => console.warn("Career audit warning:", aErr.message));

    res.json({ message: "Target role updated", targetRole: profile.targetRole });
  } catch (error) {
    res.status(500).json({ message: "Error updating target role", error: error.message });
  }
};

// Helper for AI ATS Resume Evaluation
export const analyzeResumeCore = async (resumeText, targetRole, userId) => {
  const role = targetRole || "Full Stack Software Engineer";
  const roleData = ROLE_BENCHMARKS[role] || ROLE_BENCHMARKS["Full Stack Software Engineer"];

  let analysis = null;
  const openai = getAIClient();
  const model = getAIModel();

  try {
    const prompt = `Act as an elite Silicon Valley Tech Recruiter & Lead ATS Architect.
Analyze this candidate's resume text for the target role of "${role}".

RESUME TEXT:
"""
${resumeText}
"""

REQUIRED CORE SKILLS FOR "${role}":
${roleData.requiredSkills.join(", ")}

Respond strictly in valid JSON format:
{
  "atsScore": 82,
  "formattingRating": "Executive Grade",
  "roleFitLevel": "Strong Fit",
  "executiveSummary": "2-3 detailed sentences evaluating candidate's alignment with ${role}.",
  "matchedSkills": ["JavaScript/TypeScript", "React", "Node.js/Express"],
  "missingSkills": ["Docker & Containers", "CI/CD Deployment", "Redis Caching"],
  "strengthAreas": [
    "Clear separation of technical projects with relevant stack details",
    "Solid academic computer science foundation"
  ],
  "criticalRedFlags": [
    "Lacks quantified metrics (e.g. %, ms latency, user scale) in project accomplishment bullets",
    "Missing system design, indexing, and cloud deployment keywords for ${role}"
  ],
  "actionableBullets": [
    "Rewrite project bullets to follow Action Verb + Task + Quantified Result (e.g., 'Optimized database queries reducing API latency by 35%').",
    "Add an explicit section for CS Core Fundamentals (DSA, DBMS, OS, Computer Networks).",
    "Include Docker, Redis, and CI/CD pipelines under your Technical Skills section."
  ],
  "atsKeywordDensity": [
    { "keyword": "React / Frontend Architecture", "status": "Matched" },
    { "keyword": "Node.js / Express APIs", "status": "Matched" },
    { "keyword": "DBMS / Indexing & Normalization", "status": "Missing" },
    { "keyword": "Docker & Redis Caching", "status": "Missing" }
  ]
}`;

    const aiRes = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = aiRes.choices[0]?.message?.content || "";
    const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    analysis = JSON.parse(clean);
  } catch (aiErr) {
    console.error("OpenAI Resume Analysis error, using smart fallback:", aiErr.message);
  }

  // Fallback if AI fails or returns incomplete output
  if (!analysis || typeof analysis.atsScore !== "number") {
    const lowerText = resumeText.toLowerCase();
    const matched = roleData.requiredSkills.filter((s) => lowerText.includes(s.toLowerCase().split("/")[0]));
    const missing = roleData.requiredSkills.filter((s) => !lowerText.includes(s.toLowerCase().split("/")[0]));

    const calculatedScore = Math.min(94, Math.max(48, Math.round(55 + (matched.length / roleData.requiredSkills.length) * 38)));

    analysis = {
      atsScore: calculatedScore,
      formattingRating: lowerText.includes("project") && lowerText.includes("education") ? "Good" : "Needs Structure",
      roleFitLevel: calculatedScore >= 75 ? "Strong Fit" : calculatedScore >= 60 ? "Moderate Fit" : "Requires Skill Expansion",
      executiveSummary: `Candidate shows baseline readiness for ${role} with ${matched.length} matched core skills. Adding missing technical keywords and quantified metrics will elevate ATS matching.`,
      matchedSkills: matched.length > 0 ? matched : [roleData.requiredSkills[0]],
      missingSkills: missing.length > 0 ? missing : ["Docker & Microservices", "CI/CD Deployment"],
      strengthAreas: ["Relevant Computer Science coursework", "Hands-on project experience"],
      criticalRedFlags: [
        "Unquantified bullet points — add percentage improvements, scale, or performance metrics.",
        `Missing critical role keywords for ${role}: ${missing.slice(0, 2).join(", ")}.`
      ],
      actionableBullets: [
        `Incorporate missing role keywords for ${role}: ${missing.slice(0, 2).join(", ")}`,
        "Quantify project results (e.g., 'Improved database query speed by 40%')",
        "Highlight system design, database indexing, and API optimization experience under technical skills"
      ],
      atsKeywordDensity: roleData.requiredSkills.map((sk) => ({
        keyword: sk,
        status: matched.includes(sk) ? "Matched" : "Missing"
      }))
    };
  }

  // Save ATS score & resume text to user's CareerProfile
  if (userId) {
    let profile = await CareerProfile.findOne({ user: userId });
    if (!profile) {
      profile = new CareerProfile({ user: userId });
    }
    profile.resumeText = resumeText;
    profile.atsScore = analysis.atsScore;
    await profile.save();
  }

  return analysis;
};

// POST /api/career/analyze-resume
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText || resumeText.length < 15) {
      return res.status(400).json({ message: "Please provide valid resume content." });
    }

    const analysis = await analyzeResumeCore(resumeText, targetRole, req.user._id);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Error analyzing resume", error: error.message });
  }
};

// POST /api/career/upload-resume
export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const { targetRole } = req.body;
    const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype, req.file.originalname);

    if (!extractedText || extractedText.length < 15) {
      return res.status(400).json({ message: "Could not extract readable text from uploaded file. Please upload a PDF, DOCX, or text file." });
    }

    const analysis = await analyzeResumeCore(extractedText, targetRole, req.user._id);

    res.json({
      filename: req.file.originalname,
      resumeText: extractedText,
      ...analysis,
    });
  } catch (error) {
    console.error("Upload & Analyze Resume Error:", error);
    res.status(500).json({ message: "Failed to process resume file upload.", error: error.message });
  }
};

// POST /api/career/optimize-bullet
export const optimizeResumeBullet = async (req, res) => {
  try {
    const { bulletText, targetRole } = req.body;
    if (!bulletText || bulletText.trim().length < 5) {
      return res.status(400).json({ message: "Please enter a valid resume bullet point." });
    }

    const role = targetRole || "Full Stack Software Engineer";
    const openai = getAIClient();
    const model = getAIModel();

    let result = null;
    try {
      const prompt = `Act as an expert Tech Resume Writer.
Rewrite and optimize this resume bullet point for a candidate applying for the role of "${role}".
Make it high-impact, active-voice, professional, and include placeholder metrics (e.g. [X]%, [Y] ms, [Z] users).

ORIGINAL BULLET: "${bulletText}"

Respond strictly in valid JSON format:
{
  "original": "${bulletText.replace(/"/g, '\\"')}",
  "optimized": "High impact rewritten bullet point with action verb and quantified outcome.",
  "alternative": "Second high impact variation highlighting tech stack and system performance.",
  "keyImprovement": "Explanation of why this rewrite ranks higher in ATS and recruiter screening."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      result = JSON.parse(clean);
    } catch (aiErr) {
      console.error("OpenAI Optimize Bullet error:", aiErr.message);
    }

    if (!result) {
      result = {
        original: bulletText,
        optimized: `Engineered and optimized ${bulletText.toLowerCase().replace(/^(built|created|made|worked on|did)\s*/i, "")}, boosting system performance by 35% and reducing response latency.`,
        alternative: `Architected scalable features for ${bulletText.toLowerCase()}, ensuring 99.9% uptime and streamlined API integration.`,
        keyImprovement: "Transformed passive phrasing into strong action verbs with quantified performance metrics."
      };
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error optimizing bullet point", error: error.message });
  }
};

// POST /api/career/evaluate-mock
export const evaluateMockAnswer = async (req, res) => {
  try {
    const { question, answer, subject, difficulty } = req.body;
    if (!answer || answer.trim().length < 2) {
      return res.status(400).json({ message: "Please enter an answer before evaluating." });
    }

    const trimmedAns = answer.trim();
    let evaluation = null;

    const openai = getAIClient();
    const model = getAIModel();

    try {
      const prompt = `Act as a Senior Technical Interviewer & Computer Science Professor conducting a ${difficulty || "Medium"} difficulty technical interview.
Evaluate this student's response thoroughly.

SUBJECT: ${subject || "Computer Science"}
QUESTION: "${question || "Technical Interview Question"}"
CANDIDATE ANSWER: "${trimmedAns}"

Provide a thorough evaluation. Respond strictly in valid JSON format:
{
  "score": 7,
  "maxScore": 10,
  "grade": "B+",
  "feedback": "2-3 detailed sentences analyzing what the student got right, what concepts they demonstrated, and what technical depth was missing.",
  "strengths": ["Correctly identified X concept", "Good explanation of Y"],
  "gaps": ["Did not mention Z mechanism", "Missing Big-O complexity analysis", "No mention of edge cases"],
  "modelAnswer": "A concise 2-3 sentence ideal answer that would score 9-10, covering all key concepts, mechanisms, and trade-offs a senior engineer would mention.",
  "keyTakeaway": "One specific, actionable coaching tip to immediately improve performance in the next live interview round."
}`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      evaluation = JSON.parse(clean);
    } catch (aiErr) {
      console.error("OpenAI Mock Evaluation error, using smart fallback:", aiErr.message);
    }

    // Smart Fallback Evaluation
    if (!evaluation || typeof evaluation.score !== "number") {
      const lowerAns = trimmedAns.toLowerCase();
      const length = trimmedAns.length;
      const wordCount = trimmedAns.split(/\s+/).length;
      const technicalKeywords = ["index", "leaf", "range", "dfs", "bfs", "stack", "queue", "heap", "tree",
        "query", "process", "lock", "transaction", "acid", "cache", "hash", "complexity", "big-o",
        "pointer", "recursion", "dynamic", "greedy", "graph", "node", "edge", "binary"];
      const matchedKeywords = technicalKeywords.filter(k => lowerAns.includes(k));

      let score, grade, feedback, strengths, gaps;

      if (matchedKeywords.length >= 4 && wordCount >= 40) {
        score = 9; grade = "A";
        feedback = `Strong technical response covering ${matchedKeywords.slice(0,3).join(", ")} and demonstrating solid conceptual grasp. The answer covers the key mechanisms well.`;
        strengths = ["Good technical vocabulary", "Covered core mechanisms", "Structured explanation"];
        gaps = ["Could include time/space complexity", "Edge cases not discussed"];
      } else if (matchedKeywords.length >= 2 && wordCount >= 20) {
        score = 7; grade = "B";
        feedback = "Decent foundational response that touches on key concepts. Needs deeper technical elaboration and trade-off analysis to score higher.";
        strengths = ["Basic concept understanding shown", "Relevant terminology used"];
        gaps = ["Answer lacks depth", "No Big-O or complexity discussion", "Missing implementation detail"];
      } else if (wordCount >= 8) {
        score = 5; grade = "C";
        feedback = "Partial answer. While some understanding is shown, the response needs significantly more technical detail, examples, and mechanism-level explanation.";
        strengths = ["Attempted an answer"];
        gaps = ["Too brief", "Missing core technical concepts", "No examples or trade-off analysis"];
      } else {
        score = 3; grade = "D";
        feedback = "Very brief answer. Technical interviews require detailed explanations with mechanisms, data structures, algorithms, and real-world applicability.";
        strengths = [];
        gaps = ["Answer too short", "No technical substance", "Lacks any mechanism explanation"];
      }

      evaluation = {
        score,
        maxScore: 10,
        grade,
        feedback,
        strengths,
        gaps,
        modelAnswer: `A strong answer would explain the core ${subject} mechanism step-by-step, mention relevant data structures and their Big-O complexity, discuss trade-offs, and provide a real-world application example.`,
        keyTakeaway: "Structure your answer as: 1) Define the concept, 2) Explain the mechanism, 3) Give Big-O/performance analysis, 4) Provide a real-world use case.",
      };
    }

    // Persist score & attempt count in CareerProfile
    try {
      let profile = await CareerProfile.findOne({ user: req.user._id });
      if (!profile) {
        profile = new CareerProfile({ user: req.user._id });
      }
      profile.mockAttemptsCount = (profile.mockAttemptsCount || 0) + 1;
      const prevScore = profile.mockInterviewScore || 0;
      const currentScaled = Math.round((evaluation.score / (evaluation.maxScore || 10)) * 100);
      profile.mockInterviewScore = prevScore > 0 ? Math.round(prevScore * 0.7 + currentScaled * 0.3) : currentScaled;
      await profile.save();

      recordAuditLog({
        req,
        action: "MOCK_INTERVIEW_EVALUATED",
        details: {
          subject,
          score: evaluation.score,
          grade: evaluation.grade,
        },
      }).catch((aErr) => console.warn("Mock interview audit warning:", aErr.message));
    } catch (saveErr) {
      console.warn("Could not save mock interview score to profile:", saveErr.message);
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: "Error evaluating mock answer", error: error.message });
  }
};

// POST /api/career/generate-question
export const generateMockQuestion = async (req, res) => {
  try {
    const { subject, difficulty, targetRole } = req.body;
    const role = targetRole || "Full Stack Software Engineer";
    const openai = getAIClient();
    const model = getAIModel();

    let question = null;
    try {
      const prompt = `Generate one fresh ${difficulty || "Medium"} difficulty technical interview question for a ${role} candidate.
Subject focus: ${subject || "Computer Science"}.
The question should test deep conceptual understanding, not just surface definitions.
Respond in valid JSON:
{ "question": "...", "subject": "${subject || "CS"}", "type": "Technical Viva", "difficulty": "${difficulty || "Medium"}" }`;

      const aiRes = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });
      const raw = aiRes.choices[0]?.message?.content || "";
      const clean = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      question = JSON.parse(clean);
    } catch (err) {
      question = {
        question: `Explain the internal working of ${subject || "Hash Tables"} and discuss time complexity for insert, search, and delete operations with collision handling strategies.`,
        subject: subject || "DSA",
        type: "Concept Depth",
        difficulty: difficulty || "Medium"
      };
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Error generating question", error: error.message });
  }
};
