@echo off
echo ============================================
echo  AI Video Pre-Production Studio - Agents Backend
echo ============================================
echo.

REM Check if .env exists, if not copy from example
IF NOT EXIST "agents\.env" (
  echo [!] No .env found in agents/ - copying from .env.example
  copy "agents\.env.example" "agents\.env"
  echo [!] Please open agents\.env and add your GOOGLE_API_KEY
  echo.
)

echo [*] Starting FastAPI Agents Backend on http://localhost:8000
echo [*] Press Ctrl+C to stop
echo.

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --app-dir agents
