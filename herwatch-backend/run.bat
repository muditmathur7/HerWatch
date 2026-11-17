@echo off
echo ==============================================
echo   Starting HerWatch FastAPI Backend Server
echo ==============================================
echo API:      http://127.0.0.1:8000
echo Swagger:  http://127.0.0.1:8000/docs
echo ==============================================
".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
