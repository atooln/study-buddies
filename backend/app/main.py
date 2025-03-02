import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.api import api_router
from app.core.config import settings
from app.db.crud import init_db
from app.vector.faiss_store import init_store, close_store

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Add startup event to initialize services
@app.on_event("startup")
def startup_event():
    logger.info("Initializing database...")
    init_db()
    
    logger.info("Initializing vector store...")
    init_store()
    
    logger.info("Application startup complete")

# Add shutdown event to clean up resources
@app.on_event("shutdown")
def shutdown_event():
    logger.info("Closing vector store...")
    close_store()
    
    logger.info("Application shutdown complete")

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to Study Buddies API",
        "docs_url": "/docs",
        "version": settings.VERSION,
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": settings.VERSION,
    }

# Import and include routers
# This will be handled in the api package

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 