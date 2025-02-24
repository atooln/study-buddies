export const API_KEY = "v4gij98pkasp4jxqvdnzq";

export const schema = {
  project_id: "9904aa30-d529-4166-8882-69fb514eaa46",
  tables: {
    chatHistory: {
      fields: {
        content: {
          indexed: true,
          type: "string",
        },
        created_at: {
          indexed: true,
          type: "number",
        },
        documentId: {
          indexed: true,
          type: "string",
        },
        isAI: {
          indexed: true,
          type: "boolean",
        },
        timestamp: {
          indexed: true,
          type: "number",
        },
        updated_at: {
          indexed: true,
          type: "number",
        },
      },
      type: "collection",
    },
    documents: {
      fields: {
        content: {
          indexed: true,
          type: "string",
        },
        created_at: {
          indexed: true,
          type: "number",
        },
        title: {
          indexed: true,
          type: "string",
        },
        updated_at: {
          indexed: true,
          type: "number",
        },
      },
      type: "collection",
    },
    notebooks: {
      fields: {
        content: {
          indexed: true,
          type: "string",
        },
        created_at: {
          indexed: true,
          type: "number",
        },
        profile_id: {
          indexed: true,
          type: "string",
        },
        updated_at: {
          indexed: true,
          type: "number",
        },
      },
      type: "collection",
    },
    profiles: {
      fields: {
        color: {
          indexed: true,
          type: "string",
        },
        created_at: {
          indexed: true,
          type: "number",
        },
        name: {
          indexed: true,
          type: "string",
        },
        updated_at: {
          indexed: true,
          type: "number",
        },
      },
      type: "collection",
    },
    userPreferences: {
      fields: {
        created_at: {
          required: true,
          type: "number",
        },
        editorSettings: {
          required: true,
          type: "string",
        },
        lastOpenDocument: {
          required: true,
          type: "string",
        },
        theme: {
          required: true,
          type: "string",
        },
        updated_at: {
          required: true,
          type: "number",
        },
        userId: {
          required: true,
          type: "string",
        },
      },
      type: "collection",
    },
  },
  version: 2,
};
