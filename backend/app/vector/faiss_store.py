import faiss
import numpy as np
import os
import pickle
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from app.core.config import settings

class FAISSDocumentStore:
    """FAISS-based vector store for document chunks"""
    
    def __init__(self, embedding_model_name: str = "all-MiniLM-L6-v2"):
        """Initialize the FAISS document store
        
        Args:
            embedding_model_name: Name of the sentence-transformers model to use
        """
        self.index_path = os.path.join(settings.DATA_DIR, "faiss_index")
        self.metadata_path = os.path.join(settings.DATA_DIR, "faiss_metadata.pkl")
        self.dimension = 384  # Default dimension for all-MiniLM-L6-v2
        
        # Initialize the embedding model
        self.embedding_model = SentenceTransformer(embedding_model_name)
        
        # Create the data directory if it doesn't exist
        os.makedirs(settings.DATA_DIR, exist_ok=True)
        
        # Initialize or load the index
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.metadata_path, 'rb') as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = {}
    
    def _get_embedding(self, text: str) -> np.ndarray:
        """Generate an embedding for the given text
        
        Args:
            text: The text to embed
            
        Returns:
            The embedding as a numpy array
        """
        return self.embedding_model.encode(text)
    
    def add_documents(self, chunk_ids: List[str], texts: List[str], metadatas: List[Dict[str, Any]]) -> None:
        """Add document chunks to the index
        
        Args:
            chunk_ids: List of chunk IDs
            texts: List of text chunks
            metadatas: List of metadata dictionaries
        """
        if len(chunk_ids) == 0:
            return
            
        # Generate embeddings for all texts
        embeddings = self.embedding_model.encode(texts)
        
        # Add to index
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)
        
        # Store metadata
        for i, chunk_id in enumerate(chunk_ids):
            self.metadata[chunk_id] = {
                "text": texts[i],
                "metadata": metadatas[i]
            }
        
        # Save the index and metadata
        self._save()
    
    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for document chunks similar to the query
        
        Args:
            query: The search query
            limit: Maximum number of results to return
            
        Returns:
            List of search results, each containing id, score, text, and metadata
        """
        if len(self.metadata) == 0:
            return []
            
        # Generate query embedding
        query_embedding = self._get_embedding(query)
        query_embedding = query_embedding.reshape(1, -1)
        faiss.normalize_L2(query_embedding)
        
        # Search the index
        scores, indices = self.index.search(query_embedding, limit)
        
        # Convert indices to chunk IDs and retrieve metadata
        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1 or idx >= len(self.metadata):  # Invalid index
                continue
                
            chunk_id = list(self.metadata.keys())[idx]
            results.append({
                "id": chunk_id,
                "score": float(scores[0][i]),
                "text": self.metadata[chunk_id]["text"],
                "metadata": self.metadata[chunk_id]["metadata"]
            })
            
        return results
    
    def delete_documents(self, document_id: str) -> None:
        """Delete all chunks for a document
        
        Args:
            document_id: The document ID
        """
        # Find all chunks for this document
        chunk_ids_to_delete = []
        for chunk_id, item in self.metadata.items():
            if item["metadata"].get("document_id") == document_id:
                chunk_ids_to_delete.append(chunk_id)
        
        if not chunk_ids_to_delete:
            return
        
        # Since FAISS doesn't support deletion easily, we'll rebuild the index
        remaining_chunk_ids = []
        remaining_texts = []
        remaining_metadatas = []
        
        for chunk_id, item in self.metadata.items():
            if chunk_id not in chunk_ids_to_delete:
                remaining_chunk_ids.append(chunk_id)
                remaining_texts.append(item["text"])
                remaining_metadatas.append(item["metadata"])
        
        # Clear the index and metadata
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = {}
        
        # Re-add the remaining documents
        if remaining_chunk_ids:
            self.add_documents(remaining_chunk_ids, remaining_texts, remaining_metadatas)
    
    def _save(self) -> None:
        """Save the index and metadata to disk"""
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, 'wb') as f:
            pickle.dump(self.metadata, f)

# Create a singleton instance
_faiss_store: Optional[FAISSDocumentStore] = None

def get_faiss_store() -> FAISSDocumentStore:
    """Get the FAISS document store instance
    
    Returns:
        The FAISS document store instance
    """
    global _faiss_store
    if _faiss_store is None:
        _faiss_store = FAISSDocumentStore()
    return _faiss_store

def semantic_search(query: str, user_id: str = None, limit: int = 5) -> List[Dict[str, Any]]:
    """Search for document chunks similar to the query
    
    Args:
        query: The search query
        user_id: Optional user ID to filter results
        limit: Maximum number of results to return
            
    Returns:
        List of search results, each containing document_id, title, text, and score
    """
    store = get_faiss_store()
    results = store.search(query, limit)
    
    # Filter by user_id if provided
    if user_id:
        results = [r for r in results if r["metadata"].get("user_id") == user_id]
    
    # Transform results to match expected format for the writing assistant
    transformed_results = []
    for result in results:
        transformed_results.append({
            "document_id": result["metadata"].get("document_id"),
            "title": result["metadata"].get("title", "Untitled"),
            "text": result["text"],
            "score": result["score"]
        })
    
    return transformed_results

def add_documents_to_store(chunk_ids: List[str], texts: List[str], metadatas: List[Dict[str, Any]]):
    """Add document chunks to the store
    
    Args:
        chunk_ids: List of chunk IDs
        texts: List of text chunks
        metadatas: List of metadata dictionaries
    """
    store = get_faiss_store()
    store.add_documents(chunk_ids, texts, metadatas)

def delete_documents_from_store(document_id: str):
    """Delete all chunks for a document
    
    Args:
        document_id: The document ID
    """
    store = get_faiss_store()
    store.delete_documents(document_id)

def close_store():
    """Save and close the document store"""
    global _faiss_store
    if _faiss_store is not None:
        _faiss_store._save()
        _faiss_store = None
        
def init_store():
    """Initialize the document store"""
    get_faiss_store() 