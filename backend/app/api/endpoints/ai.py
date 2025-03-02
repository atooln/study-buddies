from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.utils.ai_helper import AIHelper

router = APIRouter()

class TextGenerationRequest(BaseModel):
    prompt: str
    max_tokens: int = 100

class TextAnalysisRequest(BaseModel):
    text: str

@router.post("/generate", response_model=Dict[str, Any])
def generate_text(request: TextGenerationRequest):
    """
    Generate text based on a prompt.
    """
    if not AIHelper.is_ai_enabled():
        raise HTTPException(status_code=400, detail="AI functionality is not enabled")
    
    generated_text = AIHelper.generate_text(request.prompt, request.max_tokens)
    
    if not generated_text:
        raise HTTPException(status_code=500, detail="Failed to generate text")
    
    return {"generated_text": generated_text}

@router.post("/analyze", response_model=Dict[str, Any])
def analyze_text(request: TextAnalysisRequest):
    """
    Analyze text and return insights.
    """
    if not AIHelper.is_ai_enabled():
        raise HTTPException(status_code=400, detail="AI functionality is not enabled")
    
    analysis = AIHelper.analyze_text(request.text)
    
    if "error" in analysis:
        raise HTTPException(status_code=500, detail=analysis["error"])
    
    return analysis 