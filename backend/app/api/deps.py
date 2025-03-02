from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Union
import uuid

from app.core.config import settings
from app.models.user import User
from app.db.base import Transaction
import json

# This is a dummy OAuth2 scheme that doesn't actually require authentication
# We use it for type consistency, but our dependency will bypass it
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> User:
    """
    For development purposes, this always returns a default superuser.
    
    In production, you would replace this with actual token validation.
    """
    # Create and return a default superuser
    default_user = User(
        id=str(uuid.uuid4()),  # Generate a new UUID each time
        email="admin@example.com",
        full_name="Default Admin",
        is_active=True,
        is_superuser=True,
        created_at=datetime.now()
    )
    
    return default_user
    
async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get the current active user.
    
    This function checks if the user is active and returns it if true.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user 