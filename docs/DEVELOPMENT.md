# Development Guide

Quick reference for local development setup.

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **Docker** & **Docker Compose**

---

## Quick Setup

```bash
# Clone and start infrastructure
git clone https://github.com/qlpak/stone-guide-app.git
cd stone-guide-app
docker-compose up -d mongo redis keycloak
```

---

## Environment Configuration

### Backend (`backend/.env`)

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/stoneguide
REDIS_HOST=localhost
REDIS_PORT=6379
KEYCLOAK_BASE_URL=http://localhost:8080/auth
KEYCLOAK_REALM=stone-guide
KEYCLOAK_CLIENT_ID=stone-guide-app
JWT_SECRET=your-secret-key
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080/auth
NEXT_PUBLIC_KEYCLOAK_REALM=stone-guide
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=stone-guide-app
```

### AI Module (`ai-module/.env`)

```env
FLASK_ENV=development
MODEL_PATH=model/resnet50_best.h5
PORT=5002
```

---

## Development Commands

### Backend (Node.js)

```bash
cd backend
npm install
npm run dev          # Start with hot reload
npm test             # Run tests
npm test -- --coverage
```

**URL**: http://localhost:5001  
**API Docs**: http://localhost:5001/api-docs

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev          # Start dev server
npm test             # Run tests
npm run build        # Production build
```

**URL**: http://localhost:3000

### AI Module (Python)

```bash
cd ai-module
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py       # Start Flask server
pytest               # Run tests with coverage (configured in pytest.ini)
```

**URL**: http://localhost:5002

---

## Database Access

### MongoDB

- **URI**: `mongodb://localhost:27017`
- **Database**: `stoneguide`
- **GUI**: MongoDB Compass

### Redis

- **Host**: `localhost:6379`
- **CLI**: `redis-cli`

### Keycloak

- **URL**: http://localhost:8080/auth/admin
- **Credentials**: admin / admin
