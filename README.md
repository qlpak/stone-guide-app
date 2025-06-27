# 🪨 StoneGuide
<<<<<<< HEAD

**StoneGuide** is a full-stack, secure, and AI-enhanced web application that helps users explore, search, filter, recommend, and price natural stones for kitchens, bathrooms, stairs, and more.

> **Status**: ✅ Backend complete and production-ready · 🚧 Frontend in progress · 🧠 AI integration planned  

---

## 🔐 Key Features

- Role-based access control with **Keycloak (OAuth 2.0)**
- JWT-secured REST API using `express-jwt` middleware
- Fully tested backend with **100% coverage** using **Jest + Supertest**
- CI/CD pipeline with **GitHub Actions** and test enforcement
- **Swagger API Documentation** for all endpoints
- Modular and scalable backend architecture
- Dockerized infrastructure using **Docker Compose**
- Smart pricing logic with currency conversion and validation
- Redis caching layer for exchange rates

---

## 🧠 Upcoming AI Module

- **Model**: CNNs with MobileNetV2/ResNet for stone name prediction from photos
- **Integration**: Flask-based microservice queried by the main backend
- **Frontend**: Upload image → receive label + confidence → display metadata
=======
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
>>>>>>> 37e17af197e8b3701d5ae4e87093d73b95fec5aa

---

## 📁 Project Structure

```
/backend
<<<<<<< HEAD
  /coverage         # Jest coverage reports
  /logs             # Winston logs
  /src
    /config         # DB, Redis, and other configs
    /controllers    # Route controllers (pricing, stones)
    /middlewares    # Auth, error handling, logging
    /models         # Mongoose schemas
    /routes         # Express routers
    /services       # Business logic (pricing, recommendation)
    /utils          # Utilities (e.g., validators, conversion)
  app.js
  server.js
  tests/            # Unit & integration tests
  Dockerfile
  docker-compose.yml

/frontend (in progress)
  /public           # Static assets
  /src
    /app            # Next.js routing & auth context
    /components     # Reusable UI components
    /hooks          # Custom React hooks
    /pages          # Page-level routing
    /services       # API handlers
    /styles         # Tailwind & MUI overrides
    /utils          # Helpers
  App.tsx

/ai-service (planned)
  app.py            # Flask app for CNN prediction
  /model            # Saved Keras/TensorFlow model
=======
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
>>>>>>> 37e17af197e8b3701d5ae4e87093d73b95fec5aa
```

---

## 🧪 Running Locally

```bash
<<<<<<< HEAD
# Start MongoDB, Redis, and backend
docker-compose up --build

# Run backend tests
=======
# Start the full stack (Mongo, Redis, Backend, Frontend, AI, Keycloak)
docker-compose up --build

# Open in browser
http://localhost:3000

# Run backend tests
cd backend
>>>>>>> 37e17af197e8b3701d5ae4e87093d73b95fec5aa
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
<<<<<<< HEAD



=======
>>>>>>> 37e17af197e8b3701d5ae4e87093d73b95fec5aa
