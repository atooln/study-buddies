import os
import duckdb
from app.core.config import settings
from contextlib import contextmanager
from typing import Generator

# Create data directory if it doesn't exist
os.makedirs(settings.DATA_DIR, exist_ok=True)

# Database file path
DB_PATH = os.path.join(settings.DATA_DIR, "study_buddies.db")

@contextmanager
def get_connection() -> Generator[duckdb.DuckDBPyConnection, None, None]:
    """Get a DuckDB connection
    
    Yields:
        A DuckDB connection
    """
    # Connect to DuckDB
    conn = duckdb.connect(DB_PATH)
    
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initialize the database by executing the schema.sql file"""
    # Get absolute path to schema.sql
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    
    # Check if schema.sql exists
    if not os.path.exists(schema_path):
        raise FileNotFoundError(f"Schema file not found at {schema_path}")
    
    # Read schema.sql
    with open(schema_path, "r") as f:
        schema_sql = f.read()
    
    # Execute schema.sql
    with get_connection() as conn:
        conn.execute(schema_sql)
        
    print("Database initialized successfully") 