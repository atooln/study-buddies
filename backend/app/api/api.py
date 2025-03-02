from fastapi import APIRouter
from app.api.endpoints import documents, writing_assistant

api_router = APIRouter()

# Include document endpoints
api_router.include_router(
    documents.router,
    prefix="/documents",
    tags=["documents"]
)

# Include writing assistant endpoints
api_router.include_router(
    writing_assistant.router,
    prefix="/writing",
    tags=["writing"]
)

# Other routers would be included here
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(users.router, prefix="/users", tags=["users"]) 