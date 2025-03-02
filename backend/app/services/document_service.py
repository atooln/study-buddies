import os
import uuid
import shutil
from datetime import datetime
from typing import List, Optional, Dict, Any
import PyPDF2
from app.db.crud import get_connection
from app.vector.faiss_store import get_faiss_store, add_documents_to_store, delete_documents_from_store
from app.core.config import settings
from app.models.document import Document, DocumentCreate, DocumentUpdate
from app.utils.text import chunk_text

def create_document(document_data: DocumentCreate, user_id: str) -> Document:
    """Create a new document
    
    Args:
        document_data: The document data
        user_id: The user ID
        
    Returns:
        The created document
    """
    document_id = str(uuid.uuid4())
    now = datetime.now()
    
    document = {
        "id": document_id,
        "user_id": user_id,
        "title": document_data.title,
        "description": document_data.description,
        "file_path": document_data.file_path,
        "created_at": now,
        "updated_at": now
    }
    
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO documents (id, user_id, title, description, file_path, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                document_id, user_id, document_data.title, document_data.description,
                document_data.file_path, now, now
            )
        )
    
    # If a file path is provided, process the document content
    if document_data.file_path:
        process_document_content(document_id, document_data.file_path)
    
    return Document(**document)

def get_document(document_id: str, include_content: bool = False) -> Optional[Dict[str, Any]]:
    """Get a document by ID
    
    Args:
        document_id: The document ID
        include_content: Whether to include the document content
        
    Returns:
        The document or None if not found
    """
    with get_connection() as conn:
        if include_content:
            row = conn.execute(
                """
                SELECT d.id, d.user_id, d.title, d.description, d.file_path, d.created_at, d.updated_at, 
                       (SELECT group_concat(content, ' ') FROM document_chunks WHERE document_id = d.id ORDER BY chunk_index) as content
                FROM documents d
                WHERE d.id = ?
                """,
                (document_id,)
            ).fetchone()
        else:
            row = conn.execute(
                "SELECT id, user_id, title, description, file_path, created_at, updated_at FROM documents WHERE id = ?",
                (document_id,)
            ).fetchone()
        
        if not row:
            return None
        
        column_names = [col[0] for col in conn.description]
        document_dict = {col: row[i] for i, col in enumerate(column_names)}
        
        return document_dict

def get_user_documents(user_id: str) -> List[Dict[str, Any]]:
    """Get all documents for a user
    
    Args:
        user_id: The user ID
        
    Returns:
        List of documents
    """
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, user_id, title, description, file_path, created_at, updated_at FROM documents WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        ).fetchall()
        
        column_names = [col[0] for col in conn.description]
        documents = []
        
        for row in rows:
            document_dict = {col: row[i] for i, col in enumerate(column_names)}
            documents.append(document_dict)
        
        return documents

def update_document(document_id: str, document_data: DocumentUpdate, user_id: str) -> Optional[Dict[str, Any]]:
    """Update a document
    
    Args:
        document_id: The document ID
        document_data: The updated document data
        user_id: The user ID
        
    Returns:
        The updated document or None if not found
    """
    # Check if document exists and belongs to the user
    document = get_document(document_id)
    if not document or document["user_id"] != user_id:
        return None
    
    # Get non-None fields for update
    update_data = document_data.dict(exclude_unset=True)
    if not update_data:
        return document
    
    # Build SQL update statement dynamically
    fields = list(update_data.keys())
    sql_fields = [f"{field} = ?" for field in fields]
    values = [update_data[field] for field in fields]
    
    # Add updated_at
    sql_fields.append("updated_at = ?")
    now = datetime.now()
    values.append(now)
    
    # Add document_id to values
    values.append(document_id)
    
    with get_connection() as conn:
        conn.execute(
            f"UPDATE documents SET {', '.join(sql_fields)} WHERE id = ?",
            tuple(values)
        )
    
    # Check if file_path was updated and process new content if needed
    if document_data.file_path and document_data.file_path != document["file_path"]:
        process_document_content(document_id, document_data.file_path)
    
    return get_document(document_id)

def delete_document(document_id: str, user_id: str) -> bool:
    """Delete a document
    
    Args:
        document_id: The document ID
        user_id: The user ID
        
    Returns:
        True if document was deleted, False otherwise
    """
    # Check if document exists and belongs to the user
    document = get_document(document_id)
    if not document or document["user_id"] != user_id:
        return False
    
    with get_connection() as conn:
        # Delete document chunks
        conn.execute("DELETE FROM document_chunks WHERE document_id = ?", (document_id,))
        
        # Delete document
        conn.execute("DELETE FROM documents WHERE id = ?", (document_id,))
    
    # Remove document from vector store
    delete_documents_from_store(document_id)
    
    # Delete file if exists
    if document["file_path"] and os.path.exists(document["file_path"]):
        try:
            os.remove(document["file_path"])
        except Exception as e:
            print(f"Error deleting file {document['file_path']}: {e}")
    
    return True

def process_document_content(document_id: str, file_path: str) -> None:
    """Process document content by extracting text, chunking, and storing in database and vector store
    
    Args:
        document_id: The document ID
        file_path: Path to the document file
    """
    if not os.path.exists(file_path):
        return
    
    # Extract text from PDF
    text = ""
    if file_path.lower().endswith(".pdf"):
        try:
            with open(file_path, "rb") as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error extracting text from PDF {file_path}: {e}")
            return
    elif file_path.lower().endswith((".txt", ".md")):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                text = file.read()
        except Exception as e:
            print(f"Error reading text file {file_path}: {e}")
            return
    
    if not text.strip():
        return
    
    # Get document for metadata
    document = get_document(document_id)
    if not document:
        return
    
    # Chunk the text
    chunks = chunk_text(text, chunk_size=1000, chunk_overlap=200)
    
    # Clear existing chunks
    with get_connection() as conn:
        conn.execute("DELETE FROM document_chunks WHERE document_id = ?", (document_id,))
    
    # Delete from vector store
    delete_documents_from_store(document_id)
    
    # Store chunks in database and prepare for vector store
    chunk_ids = []
    chunk_texts = []
    chunk_metadatas = []
    
    with get_connection() as conn:
        for i, chunk_text in enumerate(chunks):
            chunk_id = str(uuid.uuid4())
            chunk_ids.append(chunk_id)
            chunk_texts.append(chunk_text)
            
            # Store in database
            conn.execute(
                "INSERT INTO document_chunks (id, document_id, content, chunk_index) VALUES (?, ?, ?, ?)",
                (chunk_id, document_id, chunk_text, i)
            )
            
            # Prepare metadata for vector store
            chunk_metadatas.append({
                "document_id": document_id,
                "chunk_index": i,
                "title": document["title"],
                "user_id": document["user_id"]
            })
    
    # Add to vector store
    add_documents_to_store(chunk_ids, chunk_texts, chunk_metadatas)

def search_documents(query: str, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Search for documents
    
    Args:
        query: The search query
        user_id: The user ID
        limit: Maximum number of results
        
    Returns:
        List of search results
    """
    faiss_store = get_faiss_store()
    
    # Perform search
    search_results = faiss_store.search(query, limit=limit)
    
    # Filter results by user_id
    filtered_results = []
    for result in search_results:
        if result["metadata"].get("user_id") == user_id:
            document_id = result["metadata"]["document_id"]
            # Get the document to include its title and description
            document = get_document(document_id)
            if document:
                filtered_results.append({
                    "document_id": document_id,
                    "title": document["title"],
                    "description": document["description"],
                    "chunk_id": result["id"],
                    "chunk_index": result["metadata"]["chunk_index"],
                    "score": result["score"],
                    "text": result["text"]
                })
    
    return filtered_results

def save_uploaded_file(file, user_id: str) -> str:
    """Save an uploaded file to disk
    
    Args:
        file: The uploaded file
        user_id: The user ID
        
    Returns:
        Path to the saved file
    """
    # Create user upload directory if it doesn't exist
    upload_dir = os.path.join(settings.UPLOAD_DIR, user_id)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    filename = str(uuid.uuid4()) + "_" + file.filename
    file_path = os.path.join(upload_dir, filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return file_path