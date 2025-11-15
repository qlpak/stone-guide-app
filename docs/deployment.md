# Deployment Guide

Guide for deploying StoneGuide to production.

---

## Prerequisites

- **Docker** & **Docker Compose** 20.10+
- **kubectl** 1.25+
- **Ansible** 2.9+ (for automated deployment)
- Kubernetes cluster (Minikube, Docker Desktop, or cloud)

```bash
./verify-env.sh  # Check prerequisites
```

---

## Local Development

```bash
docker-compose up -d     # Start all services
docker-compose ps        # Check status
docker-compose down      # Stop services
```

**Access**:

- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- AI Module: http://localhost:5002
- Keycloak: http://localhost:8080

---

## Ansible Deployment (Recommended)

### Setup

```bash
./setup-ansible.sh
```

### Deploy Commands

```bash
# Full deployment
ansible-playbook deploy.yaml

# Quick deploy (skip validation)
ansible-playbook deploy.yaml --tags quick

# Deploy specific service
ansible-playbook deploy.yaml --tags backend
ansible-playbook deploy.yaml --tags frontend
ansible-playbook deploy.yaml --tags ai-module

# Rollback
ansible-playbook deploy.yaml --tags rollback
```

### Available Tags

- `quick` - Skip validation, faster deployment
- `backend`, `frontend`, `ai-module` - Deploy specific service
- `secrets` - Update secrets only
- `ingress` - Update ingress rules
- `rollback` - Rollback to previous version

### Configuration

Edit `deploy.yaml` variables:

```yaml
vars:
  namespace: "stone-guide"
  app_domain: "stoneguide.local"
  backend_image: "your-registry/stone-guide-backend:latest"
  frontend_image: "your-registry/stone-guide-frontend:latest"
  ai_module_image: "your-registry/stone-guide-ai:latest"
```

### Secrets

Create files in `secrets/` directory:

```
secrets/
├── MONGO_URI.txt
├── REDIS_HOST.txt
├── REDIS_PORT.txt
└── JWT_SECRET.txt
```

Ansible automatically creates Kubernetes secrets from these files.

---

## Manual Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace stone-guide

# Deploy all services
kubectl apply -f k8s/ -n stone-guide

# Check status
kubectl get pods -n stone-guide
kubectl get svc -n stone-guide
kubectl get ingress -n stone-guide

# View logs
kubectl logs -f deployment/backend -n stone-guide
```

### Create Secrets

```bash
kubectl create secret generic app-secrets \
  --from-literal=MONGO_URI='mongodb://mongo:27017/stoneguide' \
  --from-literal=REDIS_HOST='redis' \
  --from-literal=REDIS_PORT='6379' \
  -n stone-guide
```

**Configuration Note:** For Kubernetes, update URLs in `frontend/.env.local`, `backend/src/server.js`, `backend/src/middlewares/auth.js`, `backend/.env`, and `keycloak-custom/stone-guide-realm.json` to use `http://stoneguide.local` (with ingress paths) instead of `localhost` ports used for Docker development.

---

## Accessing the Application

### Local Kubernetes

Add to `/etc/hosts`:

```
127.0.0.1 stoneguide.local
```

**Access URLs**:

- Application: http://stoneguide.local
- API: http://stoneguide.local/api
- AI Service: http://stoneguide.local/ai
- Keycloak: http://stoneguide.local/auth

### Production

1. Get Ingress IP: `kubectl get ingress -n stone-guide`
2. Point your domain to the Ingress IP
