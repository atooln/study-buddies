from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import List, Optional
import os
from datetime import datetime

from app.api.deps import get_current_user
from app.models.user import User
from app.models.document import Document, DocumentCreate, DocumentUpdate, SearchQuery
from app.services.document_service import (
    create_document, get_document, get_user_documents, 
    update_document, delete_document, search_documents, save_uploaded_file
)

router = APIRouter()

@router.get("/", response_model=List[Document])
def get_user_documents_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Get all documents for the current user"""
    return get_user_documents(current_user.id)

@router.post("/", response_model=Document)
def create_document_endpoint(
    document: DocumentCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new document"""
    return create_document(document, current_user.id)

@router.get("/{document_id}", response_model=Document)
def get_document_endpoint(
    document_id: str,
    include_content: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Get a document by ID"""
    document = get_document(document_id, include_content)
    
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    # Check permission
    if document["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized to access this document"
        )
    
    return document

@router.put("/{document_id}", response_model=Document)
def update_document_endpoint(
    document_id: str,
    document: DocumentUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a document"""
    updated_doc = update_document(document_id, document, current_user.id)
    
    if not updated_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    return updated_doc

@router.delete("/{document_id}")
def delete_document_endpoint(
    document_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a document"""
    success = delete_document(document_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    return {"message": "Document deleted successfully"}

@router.post("/upload", response_model=Document)
def upload_document(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload a document file"""
    # Validate file type (PDF only for now)
    if not file.filename.lower().endswith(('.pdf', '.txt', '.md')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Only PDF, TXT, and MD files are supported"
        )
    
    # Save file
    file_path = save_uploaded_file(file, current_user.id)
    
    # Create document
    document = DocumentCreate(
        title=title,
        description=description or "",
        file_path=file_path
    )
    
    return create_document(document, current_user.id)

@router.post("/search")
def search_documents_endpoint(
    query: SearchQuery,
    current_user: User = Depends(get_current_user)
):
    """Search documents semantically"""
    return search_documents(query.query, current_user.id, query.limit)