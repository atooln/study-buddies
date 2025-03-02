from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr = Field(..., description="User email")
    name: str = Field(..., description="User name")
    is_active: bool = Field(True, description="Whether the user is active")
    is_superuser: bool = Field(False, description="Whether the user is a superuser")


class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., description="User password")


class UserUpdate(BaseModel):
    """User update model"""
    email: Optional[EmailStr] = Field(None, description="User email")
    name: Optional[str] = Field(None, description="User name")
    is_active: Optional[bool] = Field(None, description="Whether the user is active")
    password: Optional[str] = Field(None, description="User password")


class User(UserBase):
    """User model"""
    id: str = Field(..., description="User ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        orm_mode = True


class UserInDB(User):
    """User model in database"""
    hashed_password: str = Field(..., description="Hashed password")


class UserWithDocuments(User):
    """User model with documents"""
    documents: list = [] 