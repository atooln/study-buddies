import duckdb
from app.core.config import settings

# Initialize DuckDB connection
def get_connection():
    """Get a DuckDB connection"""
    conn = duckdb.connect(settings.DUCKDB_PATH)
    
    # Enable JSON extensions
    conn.execute("INSTALL json; LOAD json;")
    
    # Return the connection
    return conn

# Initialize database schema
def init_db():
    """Initialize the database schema"""
    conn = get_connection()
    
    # Create users table
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY,
        email VARCHAR UNIQUE NOT NULL,
        hashed_password VARCHAR NOT NULL,
        full_name VARCHAR,
        is_active BOOLEAN DEFAULT true,
        is_superuser BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    );
    """)
    
    # Create documents table
    conn.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR PRIMARY KEY,
        title VARCHAR,
        file_type VARCHAR NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        is_synced BOOLEAN DEFAULT false,
        local_path VARCHAR,
        word_count INTEGER DEFAULT 0,
        last_synced_at TIMESTAMP,
        sync_version INTEGER DEFAULT 0,
        user_id VARCHAR NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """)
    
    # Create document chunks table
    conn.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        id VARCHAR PRIMARY KEY,
        document_id VARCHAR NOT NULL,
        content TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        metadata JSON,
        FOREIGN KEY (document_id) REFERENCES documents(id)
    );
    """)
    
    conn.close()

# Database transaction context manager
class Transaction:
    """Context manager for database transactions"""
    
    def __init__(self):
        self.conn = None
    
    def __enter__(self):
        self.conn = get_connection()
        return self.conn
    
    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            # An exception occurred, rollback not needed for DuckDB
            pass
        self.conn.close()