from app.db.base import init_db as init_duckdb
from app.core.config import settings
import os

def init_db() -> None:
    """Initialize the database by creating all tables."""
    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Initialize DuckDB schema
    init_duckdb()
    
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db() 