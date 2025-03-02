from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime


class FileType(str, Enum):
    """File type enum"""
    PDF = "pdf"
    MARKDOWN = "markdown"
    TEXT = "text"


class DocumentBase(BaseModel):
    """Base document model"""
    title: str = Field(..., description="Document title")
    description: Optional[str] = Field(None, description="Document description")


class DocumentCreate(DocumentBase):
    """Document creation model"""
    file_path: Optional[str] = Field(None, description="Path to the document file")


class DocumentUpdate(DocumentBase):
    """Document update model"""
    file_path: Optional[str] = Field(None, description="Path to the document file")


class Document(DocumentBase):
    """Document model"""
    id: str = Field(..., description="Document ID")
    user_id: str = Field(..., description="User ID")
    file_path: Optional[str] = Field(None, description="Path to the document file")
    content: Optional[str] = Field(None, description="Document content")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        orm_mode = True


class DocumentChunk(BaseModel):
    """Document chunk model"""
    id: str = Field(..., description="Chunk ID")
    document_id: str = Field(..., description="Document ID")
    text: str = Field(..., description="Chunk text")
    chunk_index: int = Field(..., description="Chunk index")


class SearchQuery(BaseModel):
    """Search query model"""
    query: str = Field(..., description="Search query")
    limit: int = Field(5, description="Maximum number of results") 