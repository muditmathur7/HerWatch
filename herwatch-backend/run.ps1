Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Starting HerWatch FastAPI Backend Server" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "API:      http://127.0.0.1:8000"
Write-Host "Swagger:  http://127.0.0.1:8000/docs"
Write-Host "=============================================="

& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000
