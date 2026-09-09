# Contributing to LearnX Platform

Welcome to the **LearnX** team! This guide explains our Git workflow, branching conventions, and Pull Request (PR) process to keep our codebase clean, stable, and production-ready.

---

## 🌳 Branching Strategy

We follow a structured Gitflow model:

| Branch | Description | Direct Push Allowed? |
|---|---|---|
| **`main`** | Production-ready, stable releases. | ❌ No direct pushes. Pull Requests only. |
| **`develop`** | Active development branch where features are integrated. | ❌ No direct pushes. Pull Requests only. |
| **`feature/<name>`** | Individual features, bug fixes, or enhancements. | ✅ Push your own work here, then open a PR to `develop`. |
| **`hotfix/<name>`** | Urgent production fixes directly branching off `main`. | ⚠️ Requires code review before merging into `main` and `develop`. |

---

## 🚀 Step-by-Step Developer Workflow

### 1. Clone the Repository
```bash
git clone <YOUR_REPO_URL>
cd student-platform
```

### 2. Switch to `develop` and Pull Latest Changes
Always base your new features on the latest `develop` branch:
```bash
git checkout develop
git pull origin develop
```

### 3. Create a Feature Branch
Give your branch a descriptive name:
```bash
# Syntax: feature/<short-description>
git checkout -b feature/placement-test-analytics
```

### 4. Install Dependencies & Work Locally
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### 5. Commit Your Changes
Make meaningful, atomic commits:
```bash
git add .
git commit -m "feat(assessment): add multi-track scoring for CSE placement test"
```

#### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring without functionality changes
- `docs:` Documentation updates
- `style:` UI / CSS styling changes
- `test:` Adding or updating tests

### 6. Push Your Feature Branch
```bash
git push -u origin feature/placement-test-analytics
```

### 7. Open a Pull Request (PR)
1. Go to your repository on GitHub.
2. Click **Compare & pull request**.
3. Set **Base:** `develop` ← **Compare:** `feature/<your-branch-name>`.
4. Provide a clear PR description:
   - What changed?
   - How to test it?
   - Any screenshots or demo videos if UI changed.
5. Request a review from a teammate. Once approved and CI passes, merge into `develop`.

---

## 🔒 Secrets & Environment Security
- **NEVER** commit `.env` files or hardcode API keys/passwords.
- Use `.env.example` to document any new environment variables required.
- All secrets are protected in `.gitignore`.

---

## 🧪 Testing Before Pushing
Always verify that the frontend builds with zero errors before pushing:
```bash
cd frontend
npm run build
```
Ensure there are no broken imports or build failures.
