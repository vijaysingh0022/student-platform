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

## 🌍 Live Deployment (Vercel)

The platform is production-deployed on **Vercel** with a serverless Node.js + Express backend and a Vite/React frontend served as a CDN-optimized static site.

> 🔗 **[View Live on Vercel →](https://student-platform-vijaysingh0022.vercel.app)** *(deploy in progress — link active after first push)*

**Architecture on Vercel:**
- **Frontend** — React SPA built by Vite, served from Vercel's global CDN edge network
- **Backend API** — Express.js deployed as a Vercel Serverless Function (`/api/*`)
- **Database** — MongoDB Atlas (cloud-hosted, persistent data across all requests)
- **AI** — OpenRouter API key wired to `openai/gpt-4o-mini` and `google/gemini-2.0-flash-001`

---

## 🌟 Core Features

### 1. 🎯 CSE Placement Diagnostic Assessment Arena
- **8 Core Placement Tracks** (total 92 calibrated MCQs):
  - ⚡ **DSA**: Data Structures & Algorithms
  - 🗄️ **DBMS**: Database Systems & SQL
  - 💻 **OS**: Operating Systems
  - 🌐 **CN**: Computer Networks
  - 🧩 **OOPS**: OOPs & SOLID Principles
  - 🏗️ **System Design**: Architecture & Scalability
  - 🧠 **Aptitude**: Quantitative Aptitude & Reasoning
  - 🚀 **Web Dev**: Web Development & Cloud/DevOps
- Real-time client-side and server-side evaluation
- Unanswered questions warning & auto-scroll protection
- Instant topic-by-topic accuracy breakdown & weak topic detection (<60% threshold)

### 2. 🤖 24/7 AI Academic Tutor (Powered by OpenRouter)
- Specialized pedagogical guidance across all 8 CSE placement subjects
- Markdown explanations with TL;DR overview, step-by-step logic, code blocks (C++, Python, Java, SQL, JS), and exam pitfalls
- Quick action buttons: **"💡 Simpler Analogy"**, **"💻 Code Example"**, and **"❓ Quiz Me"**
- Backed by `openai/gpt-4o-mini` via OpenRouter API

### 3. 🗺️ Personalized 7-Day AI Remediation Roadmap
- Auto-generated after assessment, targeting specific weak topics
- Day-by-day actionable tasks, pro tips, time allocation, and interactive checklist

### 4. 📡 Offline & Low-Bandwidth Learning Hub
- **Client-Side Storage**: Offline study packs & formula cheatsheets stored locally
- **Offline Quiz Arena**: Complete diagnostic tests running 100% in-browser with zero latency
- **Auto-Sync Queue**: Local test records queued in `localStorage` and auto-synced when connectivity resumes
- **Low Data Mode & Offline Simulator**: Toggleable bandwidth controls for low-connectivity regions

### 5. 🎓 Teacher & Institution Dashboard
- Class performance overview, average scores, and pass rates
- Departmental weak topics aggregation across batches
- At-risk student alert system based on performance velocity
- Student-wise progress and exportable institutional reports

### 6. 💼 Placement Prediction & Career Readiness Engine
- Predictive placement readiness score calibrated against Tier-1 Product Giants, FinTech Unicorns, Startups, and IT Services
- Learning velocity tracking across longitudinal assessment attempts

### 7. 🔒 Security & Governance
- **RBAC** — Role-based access control (student / teacher / admin)
- **SSO** — Single Sign-On via Google Workspace, Microsoft 365 & Institutional SAML
- **Audit Logs** — Every login, registration, and role-switch is recorded immutably
- **Enterprise Security Middleware** — HSTS, CSP, rate limiting (150 req/min), XSS & NoSQL injection protection
- **Data Privacy** — GDPR-compliant data export, consent management, and data purge

### 8. 🧠 AI Quiz & MCQ Generator
- Upload study material (PDF/DOCX) and auto-generate multiple-choice quizzes
- Instant AI-powered quiz evaluation and scoring

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Recharts, React Router DOM |
| **Backend** | Node.js, Express.js, JWT Authentication, CORS, Dotenv |
| **Database** | MongoDB Atlas (persistent cloud DB) **+** Auto-embedded fallback for local dev |
| **AI Integration** | OpenRouter API (`openai/gpt-4o-mini`, `google/gemini-2.0-flash-001`) |
| **Security** | RBAC, SSO (SAML/OAuth2), Audit Logs, Rate Limiting (150 req/min), CSP, HSTS |
| **Deployment** | Vercel (Serverless Functions + CDN Edge) |
| **DevOps** | GitHub Codespaces, Concurrently, Nodemon, GitHub Actions ready |

---

## 📁 Repository Structure

```text
student-platform/
├── .devcontainer/
│   └── devcontainer.json        # GitHub Codespaces 1-click launch config
├── api/
│   └── index.js                 # ✅ Vercel Serverless Function entry point
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB Atlas + embedded fallback (connection caching)
│   │   └── ai.js                # OpenRouter/OpenAI client factory
│   ├── controllers/             # Auth, Quiz, Security, Privacy, Career, Tutor, Roadmap…
│   ├── middleware/              # JWT auth, RBAC, security headers, rate limiter
│   ├── models/                  # User, Question, Quiz, AuditLog, TestResult, CareerProfile…
│   ├── routes/                  # Express REST API endpoints
│   ├── seed/                    # 92 calibrated placement MCQs (all 8 tracks)
│   ├── utils/                   # generateToken, auditLogger
│   ├── .env                     # Environment config (not committed — see .env.example)
│   ├── .env.example             # Template for all required environment variables
│   ├── package.json
│   └── server.js                # Express app (exported for serverless + standalone)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Logo, RoadmapVisualizer, MarkdownRenderer
│   │   ├── context/             # AuthContext, OfflineContext
│   │   ├── pages/               # Dashboard, TestPage, Tutor, QuizGenerator, OfflineLearning…
│   │   ├── services/            # Axios API client (auto JWT injection)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── vercel.json                  # ✅ Vercel deployment config (rewrites + function settings)
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── package.json                 # Root: `npm run dev` starts everything concurrently
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+
- **Git**

> **✅ No database setup needed** — the app automatically starts an embedded in-process MongoDB and seeds all demo data on first boot. Just clone and run.

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

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- Frontend → `http://localhost:3000`
- Backend API → `http://localhost:5001`

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

## ⚙️ Environment Variables

### Local Development (`backend/.env`)

The `backend/.env` file ships with safe working defaults for local dev. You can optionally customize:

```env
# MongoDB Atlas URI (optional — embedded in-memory DB starts automatically if blank)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/student-platform

# Server port (default: 5001)
PORT=5001

# JWT secret — change this in production!
JWT_SECRET=your_secret_key_here

# OpenAI / OpenRouter API Key — required for AI Tutor & Roadmap features
# Get a free key at: https://openrouter.ai
OPENAI_API_KEY=sk-or-your-key-here
```

### Vercel Production Environment Variables

Set these in the [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long, random secret string for signing JWT tokens |
| `OPENAI_API_KEY` | Your OpenRouter or OpenAI API key |

> ⚠️ **Important:** After adding environment variables on Vercel, redeploy the project to apply them.

> ⚠️ **MongoDB Atlas:** Make sure to whitelist `0.0.0.0/0` (Allow from Anywhere) in your Atlas **Network Access** settings, since Vercel uses dynamic IP addresses.

---

## ☁️ Deploying to Vercel

This project is pre-configured for one-command Vercel deployment.

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy to production
vercel deploy --prod
```

Then set the environment variables (`MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`) in the Vercel dashboard and trigger a redeploy.

**How it works on Vercel:**
- `vercel.json` routes all `/api/*` requests to the serverless Express handler at `api/index.js`
- All other routes (`/`, `/dashboard`, `/login`, etc.) are served by the Vite-built React SPA from `frontend/dist/`
- The backend uses connection caching to reuse MongoDB connections across serverless warm invocations

---

## 🌿 Git Branching Workflow

- **`main`**: Production-ready code (auto-deploys to Vercel)
- **`develop`**: Active development branch
- **`feature/*`**: Feature branches (e.g. `feature/quiz-generator`)

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
