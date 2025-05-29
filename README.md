# 🪨 StoneGuide
*The all-in-one AI-powered stone selection & pricing platform.*

**StoneGuide** is a full-stack, secure, and AI-enhanced web application that helps users explore, search, filter, compare, recommend, and price natural stones for kitchens, bathrooms, stairs, walls, and more.

> **Status**: ✅ Backend complete and production-ready · ✅ Frontend complete & tested · 🧠 AI module live with custom model  

---

## 🔐 Security
- OAuth 2.0 + PKCE via Keycloak — Fine-grained role-based access control
- JWT-secured REST API — Uses `express-jwt` + `jwks-rsa`

## 📦 Infrastructure
- Dockerized microservices: MongoDB, Redis, Backend, Frontend, AI module, Keycloak
- CI/CD with GitHub Actions
- Redis caching for exchange rate performance

## 💡 Functionality
- Smart pricing engine: unit conversion, thickness levels, multi-currency
- AI-powered stone recognition: custom-trained **ResNet50** model
- Fully documented with **Swagger**

## 🧪 Testing
- Fully tested backend — 100% coverage with **Jest + Supertest**
- Frontend testing with **React Testing Library**


---

## 🧠 AI Stone Recognition

- **Model**: `ResNet50` trained on a custom dataset (real stone photos + augmentation)
- **Service**: Flask microservice served by `main.py` at `/ai`
- **Frontend**: Upload a photo → receive top 3 predictions with matching stone metadata

---

## 📁 Project Structure

```
/backend
├── coverage/              # Jest coverage reports
├── logs/                  # Winston logs
├── src/
│   ├── config/            # DB, Redis, and other configs
│   ├── controllers/       # Route controllers (pricing, stones)
│   ├── middlewares/       # Auth, error handling, logging
│   ├── models/            # Mongoose schema
│   ├── routes/            # Express routers
│   ├── services/          # Business logic (pricing, recommendation)
│   └── utils/             # Utilities (validators, conversion, etc.)
├── tests/                 # Unit & integration tests
├── app.js                 # Express app config
├── server.js              # Entry point
└── Dockerfile             # Backend Dockerfile

/frontend/src
├── app/
│   ├── ai/               # AI image upload and results
│   ├── add-stone/        # Admin panel to add stones
│   ├── callback/         # Keycloak redirect
│   ├── compare/          # Compare view
│   ├── dashboard/        # App home
│   ├── pricing/          # Price calculator
│   ├── recommendations/  # Stone suggestions
│   ├── search/           # Search UI
│   └── layout.tsx        # Shared layout
├── components/           # Navbar, AuthSheet, etc.
├── utils/                # Auth, debounce, tokens
Dockerfile

/ai-module
├── main.py
├── Dockerfile
├── requirements.txt
├── /app
│   ├── routes.py       # Flask routes
│   ├── utils.py        # Preprocessing, formatting
├── /model              # Saved model
└── /tests              # Test suite
```

---

## 🧪 Running Locally

```bash
# Start the full stack (Mongo, Redis, Backend, Frontend, AI, Keycloak)
docker-compose up --build

# Open in browser
http://localhost:3000

# Run backend tests
cd backend
npm run test -- --coverage

# Access API docs
http://localhost:5001/api-docs
```

---

## 👨‍💻 Author

Built by [@qlpak](https://github.com/your-username) as a solo full-stack project.

---

## 📜 License

This project is closed-source. All rights reserved.
