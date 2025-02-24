// basic.config.ts lets you define the schema for your database
// after updating this file, you may need to restart the dev server
// docs: https://docs.basic.tech/info/schema

// Basic Project Configuration
// see  the docs for more info: https://docs.basic.tech

// Project: study-buddies
// Link: https://app.basic.tech/project/9904aa30-d529-4166-8882-69fb514eaa46

export const API_KEY = "v4gij98pkasp4jxqvdnzq";

export const schema = {
  project_id: "9904aa30-d529-4166-8882-69fb514eaa46",
  version: 1,
  tables: {
    profiles: {
      type: "collection",
      fields: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        color: { type: "string", required: true },
        created_at: { type: "number", required: true },
        updated_at: { type: "number", required: true },
      },
    },
    notebooks: {
      type: "collection",
      fields: {
        id: { type: "string", required: true },
        profile_id: { type: "string", required: true },
        content: { type: "string", required: true },
        created_at: { type: "number", required: true },
        updated_at: { type: "number", required: true },
      },
    },
    documents: {
      type: "collection",
      fields: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        content: { type: "string", required: true },
        created_at: { type: "number", required: true },
        updated_at: { type: "number", required: true },
      },
    },
    chatHistory: {
      type: "collection",
      fields: {
        id: { type: "string", required: true },
        content: { type: "string", required: true },
        timestamp: { type: "number", required: true },
        documentId: { type: "string", required: true },
        isAI: { type: "boolean", required: true },
        created_at: { type: "number", required: true },
        updated_at: { type: "number", required: true },
      },
    },
    userPreferences: {
      type: "collection",
      fields: {
        userId: { type: "string", required: true },
        theme: { type: "string", required: true },
        editorSettings: { type: "string", required: true },
        lastOpenDocument: { type: "string", required: true },
        created_at: { type: "number", required: true },
        updated_at: { type: "number", required: true },
      },
    },
  },
};
