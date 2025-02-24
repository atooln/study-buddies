import { useBasic } from "@basictech/react";
import { useState, useCallback } from "react";

interface Document {
  id: string;
  title: string;
  content: string;
}

export function useDocument(documentId?: string) {
  const { useQuery, useMutation } = useBasic();
  const [error, setError] = useState<string | null>(null);

  // Get document
  const { data: document, loading } = useQuery<Document>(
    "documents",
    documentId ? { where: { id: documentId } } : undefined
  );

  // Create document
  const createDocument = useMutation("documents", "create");
  const handleCreateDocument = useCallback(
    async (title: string) => {
      try {
        const newDoc = {
          id: documentId || Date.now().toString(),
          title,
          content: "",
        };
        const result = await createDocument({ data: newDoc });
        return result;
      } catch (err) {
        setError("Failed to create document");
        throw err;
      }
    },
    [createDocument, documentId]
  );

  // Update document
  const updateDocument = useMutation("documents", "update");
  const handleUpdateDocument = useCallback(
    async (id: string, updates: Partial<Document>) => {
      try {
        const result = await updateDocument({
          where: { id },
          data: updates,
        });
        return result;
      } catch (err) {
        setError("Failed to update document");
        throw err;
      }
    },
    [updateDocument]
  );

  return {
    document,
    loading,
    error,
    createDocument: handleCreateDocument,
    updateDocument: handleUpdateDocument,
  };
}
