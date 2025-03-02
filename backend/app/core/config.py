import os
import secrets
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application settings"""
    # Base settings
    PROJECT_NAME: str = "Study Buddies"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Security settings
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    
    # Path settings
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    UPLOAD_DIR: str = os.path.join(DATA_DIR, "uploads")
    
    # DuckDB Configuration
    DUCKDB_PATH: str = os.path.join(DATA_DIR, "study_buddies.db")
    
    # File Storage
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    
    # Embedding model configuration
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"  # Small, efficient model
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://localhost:3000"]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.setup_directories()
    
    def setup_directories(self) -> None:
        """Create required directories if they don't exist"""
        os.makedirs(self.DATA_DIR, exist_ok=True)
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings() 