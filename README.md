# AI-Powered Real Estate Intelligence & Property Recommendation Platform

A production-quality full-stack web application demonstrating modern software engineering, database design, REST APIs, authentication, role-based authorization, geospatial search, real-time WebSockets, machine learning regression, NLP/LLM search parsing, hybrid recommendation systems, listing fraud detection, Docker containerization, and automated CI/CD pipelines.

---

## 🌟 Key Architecture & Highlights

- **Frontend**: React + TypeScript + Vite + Bootstrap 5 + Leaflet + Recharts + TanStack Query + Socket.IO Client.
- **Backend API Gateway**: Node.js + Express + TypeScript + Mongoose + Socket.IO + Zod + JWT + bcrypt + Redis caching & rate limiting.
- **AI/ML Service**: Python + FastAPI + Scikit-learn + XGBoost + Sentence Transformers + Gemini LLM integration.
- **Real-Time Layer**: Socket.IO WebSockets for buyer-agent direct messaging, live presence, typing indicators, and instant fraud alert notifications.
- **Geospatial Engine**: MongoDB `2dsphere` spatial indexing supporting radius-based queries (`$near`, `$geoWithin`) and interactive Leaflet map markers.
- **ML Valuation Engine**: XGBoost regression model trained on real estate market data to output estimated valuation with 95% confidence intervals.
- **Listing Anomaly Guard**: Multi-factor fraud detector evaluating market price standard deviation, image hash duplicate checks, and description risk keywords.
- **DevOps**: Multi-stage Dockerfiles, `docker-compose.yml`, and GitHub Actions CI/CD workflows.

---

## 🚀 Quick Start (Local Development)

### Option 1: Running with Docker Compose (Recommended)

1. Clone the repository and copy the environment setup:
   ```bash
   cp .env.example .env
   ```

2. Start the entire multi-container stack:
   ```bash
   docker-compose up --build
   ```

3. Access services:
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   - **Backend Express API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **Python FastAPI AI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Running Standalone Services

#### 1. Start Python AI Service
```bash
cd ai-service
python -m venv venv
# On Windows: venv\Scripts\activate | On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python train_model.py
uvicorn app.main:app --reload --port 8000
```

#### 2. Start Node.js Express Backend
```bash
cd server
npm install
npm run dev
```

#### 3. Start React Frontend Client
```bash
cd client
npm install
npm run dev
```

---

## 👥 Demo User Credentials

The database automatically seeds high-quality demo accounts and luxury property listings:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **BUYER** | `buyer@estateintel.com` | `Password123!` | Search, NL AI search, Favorites, Compare, Schedule visits, Real-time chat |
| **AGENT** | `agent@estateintel.com` | `Password123!` | Create/edit listings, Manage inquiries/appointments, Performance analytics |
| **ADMIN** | `admin@estateintel.com` | `Password123!` | Listing approvals, Fraud risk review & suspensions, User verification, Platform KPIs |

---

## 🧪 Testing Suite

### Run Backend Jest Tests
```bash
cd server
npm test
```

### Run Python AI Pytest Suite
```bash
cd ai-service
pytest
```

### Run Frontend Vitest Component Tests
```bash
cd client
npm test
```

---

## 📡 Core API Endpoint Reference

### Authentication
- `POST /api/auth/register` - User & Agent registration
- `POST /api/auth/login` - JWT token issuance
- `GET /api/auth/me` - Authenticated user profile

### Properties & Search
- `GET /api/properties` - Filter, search, paginate & geospatial query
- `GET /api/properties/:id` - Detailed property view & view counter
- `POST /api/properties` - Post listing (Agent/Admin)
- `POST /api/properties/compare` - Compare selected properties

### AI & Machine Learning
- `POST /api/ai/search` - Natural language search parsing
- `POST /api/ai/predict-price` - XGBoost market valuation prediction
- `POST /api/ai/fraud-check` - Listing anomaly risk score
- `GET /api/ai/recommendations` - Hybrid personalized recommendations with explainable reasons
- `POST /api/ai/chat` - Grounded AI property assistant

---

## 📄 License
MIT License. Developed for Production Full-Stack AI Architecture Portfolio.
