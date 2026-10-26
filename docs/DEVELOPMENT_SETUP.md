# Local Development Setup Guide

## Prerequisites
- Node.js 20+ (LTS)
- Python 3.11+
- Git

## 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

### Environment Configuration (`backend/.env`)
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/omnicreator
BETTER_AUTH_SECRET=omnicreator-saas-better-auth-secret-key-32chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite

LANGSMITH_TRACING=true
LANGSMITH_PROJECT=creator-ai-saas
LANGSMITH_API_KEY=your_langsmith_api_key
```

### Run Backend
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## 2. Frontend Setup (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3. Running Automated Tests
- **Backend Tests**:
  ```bash
  cd backend
  .\venv\Scripts\pytest tests/ -v
  ```
- **Frontend Tests**:
  ```bash
  cd frontend
  npm test
  ```
- **Production Build Validation**:
  ```bash
  cd frontend
  npm run build
  ```
