from fastapi import APIRouter
from app.api.v1.endpoints import auth, contacts, reports, sos, routes

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(contacts.router)
api_router.include_router(reports.router)
api_router.include_router(sos.router)
api_router.include_router(routes.router)
