from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.user import User
from app.ai.writing_assistant import generate_ai_prompts

router = APIRouter()

class WritingInput(BaseModel):
    """Input for writing assistant API"""
    text: str
    writing_stage: str = "thesis"  # Options: thesis, evidence, structure

class WritingAssistantResponse(BaseModel):
    """Response for writing assistant API"""
    questions: list
    context: str
    sources: list

@router.post("/prompt", response_model=WritingAssistantResponse)
async def get_writing_prompts(
    input_data: WritingInput,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Generate writing prompts based on the user's current text and stage.
    
    This endpoint helps users develop their writing by providing targeted questions
    and relevant context from their documents.
    
    Args:
        input_data: Contains the user's current text and writing stage
        current_user: The authenticated user
        
    Returns:
        Dictionary with questions, context, and sources
    """
    try:
        result = generate_ai_prompts(
            current_text=input_data.text,
            user_id=current_user.id,
            writing_stage=input_data.writing_stage
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate writing prompts: {str(e)}"
        ) 