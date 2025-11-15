# CI/CD Documentation

Automated testing using GitHub Actions.

---

## Overview

Three independent CI pipelines that run automatically on push/PR to `main`:

- **Backend CI** - Node.js API testing with MongoDB & Redis
- **Frontend CI** - Next.js testing with TypeScript validation
- **AI Module CI** - Python/Flask testing with coverage

---

## Backend CI

**Workflow**: `.github/workflows/backend-ci.yml`

### Triggers

- Push to `main` with `backend/**` changes
- Pull requests affecting `backend/**`
- Manual via `workflow_dispatch`

### What It Does

1. Starts MongoDB & Redis service containers
2. Installs Node.js 18 and dependencies
3. Runs ESLint
4. Executes Jest tests with coverage
5. Generates coverage reports

### Environment

- **Node.js**: 18.x
- **MongoDB**: latest (service container)
- **Redis**: latest (service container)
- **Test Framework**: Jest + Supertest

### Run Locally

```bash
cd backend
npm test -- --coverage
```

---

## Frontend CI

**Workflow**: `.github/workflows/frontend-ci.yml`

### Triggers

- Push to `main` with `frontend/**` changes
- Pull requests affecting `frontend/**`
- Manual via `workflow_dispatch`

### What It Does

1. Installs Node.js 18 and dependencies
2. Runs ESLint
3. Runs TypeScript type checking
4. Executes Jest tests with coverage
5. Attempts production build

### Environment

- **Node.js**: 18.x
- **Test Framework**: Jest + React Testing Library

### Run Locally

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm test -- --coverage
npm run build
```

---

## AI Module CI

**Workflow**: `.github/workflows/ai-ci.yml`

### Triggers

- Push to `main` with `ai-module/**` changes
- Pull requests affecting `ai-module/**`
- Manual via `workflow_dispatch`

### What It Does

1. Installs Python 3.10
2. Caches pip dependencies
3. Installs requirements
4. Runs pytest with coverage
5. Generates HTML coverage report

### Environment

- **Python**: 3.10
- **Test Framework**: pytest + pytest-cov

### Run Locally

```bash
cd ai-module
source venv/bin/activate
pytest --cov=app --cov-report=html
```

---

## Coverage Thresholds

| Module    | Target Coverage |
| --------- | --------------- |
| Backend   | 100%            |
| Frontend  | 80%             |
| AI Module | 100%            |

---

## Manual Workflow Triggers

Via GitHub UI:

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Select branch and run

Via GitHub CLI:

```bash
gh workflow run backend-ci.yml
gh workflow run frontend-ci.yml
gh workflow run ai-ci.yml
```
