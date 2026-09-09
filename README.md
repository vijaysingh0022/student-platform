# LearnX — Student Growth & Career Intelligence Platform

> **"Learn. Practice. Grow. Succeed."**  
> *More Than Learning, A Brighter You.*

LearnX is an AI-powered diagnostic, assessment, and career acceleration platform engineered for Computer Science & Engineering (CSE) students, faculty, and academic institutions. It bridges the gap between curriculum exams and top-tier tech placements through continuous skill gap analysis, personalized AI roadmaps, 24/7 academic tutoring, and resilient low-bandwidth offline learning.

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
- 1-click dynamic interview doubt suggestions tailored per subject.

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

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Recharts, Lucide Icons, React Router DOM |
| **Backend** | Node.js, Express.js, JWT Authentication, CORS, Dotenv |
| **Database** | MongoDB / MongoDB Atlas (with automatic Embedded Local MongoDB fallback) |
| **AI Integration** | OpenAI API / OpenRouter (`google/gemini-2.0-flash-001`, `gpt-4o-mini`) |
| **DevOps / CI** | GitHub Actions CI, Gitflow Branching |

---

## 📁 Repository Structure

```text
student-platform/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions continuous integration pipeline
├── backend/
│   ├── config/                  # DB connection & AI client setup
│   ├── controllers/             # Auth, Test, Roadmap, Tutor, Offline, Institution
│   ├── middleware/              # JWT auth & role protection
│   ├── models/                  # User, Question, TestResult, Roadmap schemas
│   ├── routes/                  # Express REST API endpoints
│   ├── seed/                    # 82 calibrated placement MCQs & offline study packs
│   ├── .env.example             # Template environment variables
│   ├── package.json
│   └── server.js                # Server entrypoint
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Navbar, Logo, RoadmapVisualizer, MarkdownRenderer
│   │   ├── context/             # AuthContext, OfflineContext
│   │   ├── pages/               # Dashboard, TestPage, Tutor, OfflineLearning, etc.
│   │   ├── services/            # Axios API service, Offline storage engine
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore                   # Comprehensive secrets & build ignores
├── CONTRIBUTING.md              # Git workflow, branching & PR guidelines
├── LICENSE                      # MIT License
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9.x or higher)
- **Git**

---

### Installation

1. **Clone the Repository**
   ```bash
   git clone <YOUR_REPO_URL>
   cd student-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

   Fill in your `.env` variables:
   ```env
   # MongoDB connection string (Optional: if empty or unreachable, embedded MongoDB starts automatically)
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student-platform

   PORT=5001
   JWT_SECRET=your_super_secret_jwt_key_here

   # OpenAI / OpenRouter API Key for AI Tutor & Roadmap Generation
   OPENAI_API_KEY=your_openai_or_openrouter_api_key_here
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

---

### Running the Application Locally

#### Terminal 1 — Backend Server
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5001`.*  
*(Note: If MongoDB Atlas is not configured, the built-in auto-seeder will launch a local embedded MongoDB database and seed all 82 placement questions automatically).*

#### Terminal 2 — Frontend Dev Server
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Default Demo Accounts

Upon initial server boot, the database is auto-seeded with:

| Role | Email | Password | Access |
|---|---|---|---|
| **Student** | `demo@example.com` | `password123` | Dashboard, Tests, AI Tutor, Offline Hub |
| **Faculty** | `faculty@example.com` | `password123` | Faculty Portal, Institutional Analytics |

---

## 🌿 Git Branching Workflow

This project adheres to a clean Gitflow workflow:
- **`main`**: Production code only.
- **`develop`**: Active development branch.
- **`feature/*`**: Feature branches (e.g. `feature/system-design-module`).

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for full branch naming conventions, commit guidelines, and Pull Request instructions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
