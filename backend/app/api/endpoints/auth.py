from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt
from typing import Any

from app.core.config import settings
from app.models.user import User
from app.db.base import Transaction
from app.api.deps import get_current_user
from passlib.context import CryptContext

router = APIRouter()

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def authenticate_user(email: str, password: str) -> User:
    """Authenticate user by email and password"""
    with Transaction() as conn:
        user_data = conn.execute(
            "SELECT * FROM users WHERE email = ? AND is_active = TRUE", 
            [email]
        ).fetchone()
        
        if not user_data:
            return None
        
        user_dict = dict(user_data)
        
        if not verify_password(password, user_dict["hashed_password"]):
            return None
        
        return User(
            id=user_dict["id"],
            email=user_dict["email"],
            full_name=user_dict["full_name"],
            is_active=user_dict["is_active"],
            is_superuser=user_dict["is_superuser"],
            created_at=user_dict["created_at"]
        )

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({"exp": expire.timestamp()})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> dict[str, Any]:
    """Login endpoint to get JWT token"""
    user = authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_superuser": user.is_superuser
        }
    }

@router.get("/me", response_model=User)
async def get_user_me(current_user: User = Depends(get_current_user)) -> User:
    """Get current user information"""
    return current_user 