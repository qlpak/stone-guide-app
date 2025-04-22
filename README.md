# 🪨 StoneGuide

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

---

## 📁 Project Structure

```
/backend
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
```

---

## 🧪 Running Locally

```bash
# Start MongoDB, Redis, and backend
docker-compose up --build

# Run backend tests
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



