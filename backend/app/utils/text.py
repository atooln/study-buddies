from typing import List

def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Split text into chunks with overlap
    
    Args:
        text: The text to split
        chunk_size: The maximum size of each chunk in characters
        chunk_overlap: The overlap between chunks in characters
        
    Returns:
        List of text chunks
    """
    if not text:
        return []
    
    # Clean up text
    text = text.strip()
    if not text:
        return []
    
    # Split text into paragraphs
    paragraphs = [p for p in text.split("\n") if p.strip()]
    
    chunks = []
    current_chunk = []
    current_size = 0
    
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph:
            continue
            
        # If adding this paragraph would exceed the chunk size,
        # and we already have content, save the current chunk and start a new one
        if current_size + len(paragraph) > chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            
            # For overlap, keep some of the last paragraphs
            overlap_size = 0
            overlap_paragraphs = []
            
            for para in reversed(current_chunk):
                if overlap_size + len(para) <= chunk_overlap:
                    overlap_paragraphs.insert(0, para)
                    overlap_size += len(para) + 1  # +1 for space
                else:
                    break
            
            current_chunk = overlap_paragraphs
            current_size = overlap_size
        
        # Add the paragraph to the current chunk
        current_chunk.append(paragraph)
        current_size += len(paragraph) + 1  # +1 for space
    
    # Add the last chunk if it has content
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks 