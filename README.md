# LearnX — Student Growth & Career Intelligence Platform

> **"Learn. Practice. Grow. Succeed."**  
> *More Than Learning, A Brighter You.*

LearnX is an AI-powered diagnostic, assessment, and career acceleration platform engineered for Computer Science & Engineering (CSE) students, faculty, and academic institutions. It bridges the gap between curriculum exams and top-tier tech placements through continuous skill gap analysis, personalized AI roadmaps, 24/7 academic tutoring, and resilient low-bandwidth offline learning.

---

## 🚀 Instant 1-Click Live Launch (No Setup Required)

Collaborators and friends can launch and test the full **LearnX** platform directly in their web browser with **1 click** via GitHub Codespaces:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=vijaysingh0022/student-platform)

> **Direct Launch Link:**  
> 👉 **[Click here to open LearnX in Cloud Browser](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=vijaysingh0022/student-platform)**
>
> *GitHub Codespaces spins up a full cloud environment, installs dependencies, starts both frontend & backend servers, and opens the running application in your browser automatically — with all 92 placement questions seeded and demo accounts ready.*

---

## 🌟 Core Features

### 1. 🎯 CSE Placement Diagnostic Assessment Arena
- **8 Core Placement Tracks**:
  - ⚡ **DSA**: Data Structures & Algorithms (12 calibrated MCQs)
  - 🗄️ **DBMS**: Database Systems & SQL (10 calibrated MCQs)
  - 💻 **OS**: Operating Systems (10 calibrated MCQs)
  - 🌐 **CN**: Computer Networks (10 calibrated MCQs)
  - 🧩 **OOPS**: OOPs & SOLID Principles (10 calibrated MCQs)
  - 🏗️ **SYSTEM DESIGN**: System Architecture & Scalability (10 calibrated MCQs)
  - 🧠 **APTITUDE**: Quantitative Aptitude & Reasoning (10 calibrated MCQs)
  - 🚀 **WEB DEV**: Web Development & Cloud/DevOps (10 calibrated MCQs)
- Real-time client-side and server-side evaluation.
- Unanswered questions warning & auto-scroll protection.
- Instant topic-by-topic accuracy breakdown & weak topic detection (<60% accuracy threshold).

### 2. 🤖 24/7 AI Academic Tutor
- Specialized pedagogical domain guidance across all 8 CSE placement subjects.
- Markdown explanations with TL;DR concept overview, step-by-step logic, code blocks (C++, Python, Java, SQL, JS), and common exam pitfalls.
- Quick action buttons: **"💡 Simpler Analogy"**, **"💻 Code Example"**, and **"❓ Quiz Me"**.

### 3. 🗺️ Personalized 7-Day AI Remediation Roadmap
- Automatically generated upon assessment completion targeting specific weak topics.
- Day-by-day actionable tasks, pro tips, time allocation, and interactive checklist.

### 4. 🛡️ Offline & Low-Bandwidth Learning Hub
- **Client-Side Storage**: Offline study packs & formula cheatsheets stored locally.
- **Offline Quiz Arena**: Complete diagnostic tests running 100% in-browser with zero network latency.
- **Auto-Sync Queue**: Local test records queued in `localStorage` and automatically synchronized when connectivity resumes.
- **Low Data Mode & Offline Simulator**: Toggleable bandwidth controls for low-connectivity regions.

### 5. 🎓 Teacher & Institution Dashboard
- Class performance overview, average scores, and pass rates.
- Departmental weak topics aggregation across batches.
- At-risk student alert system based on performance velocity.
- Student-wise progress and exportable institutional reports.

### 6. 💼 Placement Prediction & Career Readiness Engine
- Predictive placement readiness score calibrated against Tier-1 Product Giants, FinTech Unicorns, Startups, and IT Services.
- Learning velocity tracking across longitudinal assessment attempts.

### 7. 🔒 Security & Governance
- **RBAC** — Role-based access control (student / teacher / admin).
- **SSO** — Single Sign-On via Google Workspace, Microsoft 365 & Institutional SAML.
- **Audit Logs** — Every login, registration, and role-switch is recorded.
- **Enterprise Security Middleware** — HSTS, CSP, rate limiting (150 req/min), XSS & NoSQL injection protection.
- **Data Privacy** — GDPR-compliant data export, consent management, and data purge.

### 8. 🧠 AI Quiz & MCQ Generator
- Upload study material (PDF/DOCX) and auto-generate multiple-choice quizzes.
- Instant AI-powered quiz evaluation and scoring.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Recharts, React Router DOM |
| **Backend** | Node.js, Express.js, JWT Authentication, CORS, Dotenv |
| **Database** | MongoDB Atlas **or** Auto-embedded In-Process MongoDB (zero config) |
| **AI Integration** | OpenAI API / OpenRouter (`google/gemini-2.0-flash-001`, `gpt-4o-mini`) |
| **Security** | RBAC, SSO (SAML/OAuth2), Audit Logs, Rate Limiting, CSP |
| **DevOps** | GitHub Codespaces, Concurrently, Nodemon |

---

## 📁 Repository Structure

```text
student-platform/
├── .devcontainer/
│   └── devcontainer.json        # GitHub Codespaces 1-click launch config
├── backend/
│   ├── config/                  # DB connection (Atlas + embedded fallback)
│   ├── controllers/             # Auth, Quiz, Security, Privacy, Career, Tutor…
│   ├── middleware/              # JWT auth, RBAC, security headers, rate limiter
│   ├── models/                  # User, Question, Quiz, AuditLog, TestResult…
│   ├── routes/                  # Express REST API endpoints
│   ├── seed/                    # 92 calibrated placement MCQs
│   ├── utils/                   # generateToken, auditLogger
│   ├── .env                     # ✅ Safe defaults — works out of the box
│   ├── .env.example             # Template for custom environment variables
│   ├── package.json
│   └── server.js                # Server entrypoint
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Logo, RoadmapVisualizer, MarkdownRenderer
│   │   ├── context/             # AuthContext, OfflineContext
│   │   ├── pages/               # Dashboard, TestPage, Tutor, QuizGenerator…
│   │   ├── services/            # Axios API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── package.json                 # Root: `npm run dev` starts everything
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+
- **Git**

> **✅ No database setup needed** — the app automatically starts an embedded in-process MongoDB and seeds all demo data on first boot.

---

### ⚡ Quick Start (3 Commands)

```bash
# 1. Clone the repository
git clone https://github.com/vijaysingh0022/student-platform.git
cd student-platform

# 2. Install all dependencies (backend + frontend)
npm run setup

# 3. Start both servers with one command
npm run dev
```

That's it! Open **http://localhost:3000** in your browser.

- Backend API runs at → `http://localhost:5001`
- Frontend app runs at → `http://localhost:3000`

---

### Or Run Separately in 2 Terminals

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Demo Accounts

Upon initial server boot, the database is **auto-seeded** with:

| Role | Email | Password | Access |
|---|---|---|---|
| **Student** | `demo@example.com` | `password123` | Dashboard, Tests, AI Tutor, Offline Hub, Career Engine |
| **Faculty** | `faculty@example.com` | `password123` | Faculty Portal, Institutional Analytics, Student Reports |

> No sign-up required for testing — just use the credentials above on the Login page.

---

## ⚙️ Environment Variables (Optional)

The `backend/.env` file ships with working defaults. You can optionally customize:

```env
# MongoDB Atlas URI (optional — embedded DB starts automatically if blank)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/student-platform

# Server port (default: 5001)
PORT=5001

# JWT secret (change in production!)
JWT_SECRET=your_secret_key_here

# OpenAI / OpenRouter API Key (needed for AI Tutor & Roadmap features)
OPENAI_API_KEY=sk-or-your-key-here
```

---

## 🌿 Git Branching Workflow

- **`main`**: Production-ready code.
- **`develop`**: Active development branch.
- **`feature/*`**: Feature branches (e.g. `feature/quiz-generator`).

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
