// basic.config.ts lets you define the schema for your database
// after updating this file, you may need to restart the dev server
// docs: https://docs.basic.tech/info/schema

export const schema = {
  project_id: "study-buddies",
  version: 0,
  tables: {
    users: {
      type: "collection",
      fields: {
        email: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
    },
    notebooks: {
      type: "collection",
      fields: {
        title: {
          type: "string",
        },
        content: {
          type: "string",
        },
        userId: {
          type: "string",
        },
        createdAt: {
          type: "number",
        },
        updatedAt: {
          type: "number",
        },
      },
    },
  },
};
