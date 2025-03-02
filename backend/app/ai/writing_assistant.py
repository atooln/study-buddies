from typing import List, Dict, Any, Optional
import transformers
from transformers import pipeline
import os
import random
from app.core.config import settings
from app.vector.faiss_store import semantic_search

# Initialize the generator model - will use a small model for generating questions
generator = None

def init_generator():
    """Initialize the generator model"""
    global generator
    if generator is None:
        # Use a smaller model for question generation
        model_name = "distilgpt2"  # You can replace with a different model
        generator = pipeline(
            "text-generation",
            model=model_name,
            device=-1,  # Use CPU
        )
        print(f"Initialized generator model: {model_name}")

def get_relevant_context(current_text: str, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Find relevant chunks from the user's documents based on their current writing
    
    Args:
        current_text: The user's current writing
        user_id: The user's ID
        limit: Maximum number of chunks to retrieve
        
    Returns:
        List of relevant document chunks
    """
    # Use semantic search to find relevant chunks
    results = semantic_search(current_text, user_id=user_id, limit=limit)
    return results

def format_context(relevant_chunks: List[Dict[str, Any]]) -> str:
    """Format relevant chunks as context for the model
    
    Args:
        relevant_chunks: List of relevant document chunks
        
    Returns:
        Formatted context string
    """
    if not relevant_chunks:
        return "No relevant context available."
    
    context = "Relevant information from your documents:\n\n"
    for i, chunk in enumerate(relevant_chunks):
        context += f"SOURCE {i+1} - {chunk.get('title', 'Untitled')}:\n{chunk['text']}\n\n"
    
    return context

def generate_thesis_questions(current_text: str, relevant_chunks: List[Dict[str, Any]]) -> List[str]:
    """Generate questions to help develop a thesis statement
    
    Args:
        current_text: The user's current writing
        relevant_chunks: List of relevant document chunks
        
    Returns:
        List of questions
    """
    question_templates = [
        "Based on your sources, what central argument could connect the ideas from {source1} and {source2}?",
        "What contradiction or tension exists between {source1} and {source2} that your thesis could address?",
        "How might you integrate the key insight from {source1} into a compelling thesis statement?",
        "What unique perspective could you contribute to the conversation between {source1} and {source2}?",
        "If you were to challenge the conclusions in {source1}, what alternative thesis might you propose?"
    ]
    
    questions = []
    
    if len(relevant_chunks) >= 2:
        # Get source titles or use defaults
        source1 = relevant_chunks[0].get('title', 'Source 1')
        source2 = relevant_chunks[1].get('title', 'Source 2')
        
        # Generate questions using templates
        for template in random.sample(question_templates, min(3, len(question_templates))):
            questions.append(template.format(source1=source1, source2=source2))
    
    return questions

def generate_evidence_questions(current_text: str, relevant_chunks: List[Dict[str, Any]]) -> List[str]:
    """Generate questions to help develop supporting evidence
    
    Args:
        current_text: The user's current writing
        relevant_chunks: List of relevant document chunks
        
    Returns:
        List of questions
    """
    question_templates = [
        "How does the evidence from {source1} support or challenge your current argument?",
        "What specific examples from {source1} could strengthen your point about {topic}?",
        "How might you address potential counterarguments to your use of evidence from {source1}?",
        "What limitations exist in the evidence from {source1} that you should acknowledge?",
        "How could you synthesize evidence from both {source1} and {source2} to create a stronger argument?"
    ]
    
    questions = []
    topics = extract_topics(current_text)
    
    if relevant_chunks and topics:
        source1 = relevant_chunks[0].get('title', 'Source 1')
        source2 = relevant_chunks[1].get('title', 'Source 2') if len(relevant_chunks) > 1 else 'your other sources'
        topic = random.choice(topics)
        
        # Generate questions using templates
        for template in random.sample(question_templates, min(3, len(question_templates))):
            questions.append(template.format(source1=source1, source2=source2, topic=topic))
    
    return questions

def generate_structure_questions(current_text: str, relevant_chunks: List[Dict[str, Any]]) -> List[str]:
    """Generate questions to help with paper structure
    
    Args:
        current_text: The user's current writing
        relevant_chunks: List of relevant document chunks
        
    Returns:
        List of questions
    """
    question_templates = [
        "How might you reorganize your current points to create a more logical flow?",
        "What transition could connect your discussion of {topic1} with {topic2}?",
        "Which of your points would benefit from additional evidence or examples?",
        "How could you strengthen the connection between your thesis and your supporting points?",
        "What counterarguments should you address to strengthen your overall argument?"
    ]
    
    questions = []
    topics = extract_topics(current_text)
    
    if len(topics) >= 2:
        topic1 = topics[0]
        topic2 = topics[1]
        
        # Generate questions using templates
        for template in random.sample(question_templates, min(3, len(question_templates))):
            questions.append(template.format(topic1=topic1, topic2=topic2))
    
    return questions

def extract_topics(text: str) -> List[str]:
    """Extract potential topics from text
    
    This is a simplified implementation. In a real application,
    you might use NLP techniques like named entity recognition,
    keyword extraction, etc.
    
    Args:
        text: The text to extract topics from
        
    Returns:
        List of topics
    """
    # Simple implementation - split by periods and take first few words of each sentence
    sentences = text.split('.')
    topics = []
    
    for sentence in sentences:
        words = sentence.strip().split()
        if len(words) >= 3:
            # Take first 3 words as a potential topic
            topic = ' '.join(words[:3])
            if len(topic) > 10:  # Only add if it's substantial
                topics.append(topic)
    
    # Return unique topics or default topics if none found
    return list(set(topics)) if topics else ["your main argument", "your key points"]

def generate_ai_prompts(current_text: str, user_id: str, writing_stage: str = "thesis") -> Dict[str, Any]:
    """Generate prompts to help the user with their writing
    
    Args:
        current_text: The user's current writing
        user_id: The user's ID
        writing_stage: The stage of writing (thesis, evidence, structure)
        
    Returns:
        Dictionary with prompts and relevant context
    """
    # Initialize the generator if needed
    if generator is None:
        init_generator()
    
    # Get relevant context
    relevant_chunks = get_relevant_context(current_text, user_id)
    context = format_context(relevant_chunks)
    
    # Generate stage-specific questions
    questions = []
    if writing_stage == "thesis":
        questions = generate_thesis_questions(current_text, relevant_chunks)
    elif writing_stage == "evidence":
        questions = generate_evidence_questions(current_text, relevant_chunks)
    elif writing_stage == "structure":
        questions = generate_structure_questions(current_text, relevant_chunks)
    
    # Ensure we have at least some questions
    if not questions:
        questions = [
            "What's the main argument you want to make in this piece?",
            "What evidence do you have that supports your perspective?",
            "How might someone challenge your argument, and how would you respond?"
        ]
    
    # Add one open-ended question using the generator model
    if generator is not None:
        prompt = f"Write a thought-provoking question about: {current_text[:100]}"
        try:
            generated = generator(prompt, max_length=100, num_return_sequences=1)
            generated_text = generated[0]['generated_text'].replace(prompt, "").strip()
            if '?' in generated_text:
                # Extract the first question
                question = generated_text.split('?')[0] + '?'
                questions.append(question)
        except Exception as e:
            print(f"Error generating question: {e}")
    
    return {
        "questions": questions,
        "context": context,
        "sources": [{"title": chunk.get('title', 'Untitled'), "id": chunk.get('document_id')} for chunk in relevant_chunks]
    } 