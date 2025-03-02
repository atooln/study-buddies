from datetime import datetime
import uuid
from pydantic import BaseModel as PydanticBaseModel, Field
from typing import Optional


class BaseModel(PydanticBaseModel):
    """Base model with common fields"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 