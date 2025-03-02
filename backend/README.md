# Study Buddies Backend

A backend service for the Study Buddies application, which helps students organize their study materials and generate AI-powered writing prompts.

## Features

- Document management (uploading, retrieving, updating, deleting)
- Document semantic search with FAISS vector database
- AI-powered writing assistant for generating targeted questions
- Simple API design with FastAPI

## Getting Started

### Prerequisites

- Python 3.10+
- Conda or Miniconda (recommended for environment management)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/study-buddies.git
cd study-buddies/backend
```

2. Create and activate the conda environment:

```bash
conda env create -f environment.yml
conda activate study-buddies
```

3. Run the application:

```bash
python run.py
```

The API server will start at http://localhost:8000. You can access the API documentation at http://localhost:8000/docs.

## Project Structure

```
backend/
├── app/
│   ├── api/               # API endpoints
│   │   ├── api.py         # Main API router
│   │   ├── deps.py        # API dependencies (auth)
│   │   └── endpoints/     # API endpoint modules
│   │       ├── documents.py
│   │       └── writing.py
│   ├── core/              # Core application code
│   │   └── config.py      # Configuration settings
│   ├── db/                # Database code
│   │   ├── crud.py        # Database connection functions
│   │   └── schema.sql     # Database schema
│   ├── models/            # Pydantic models
│   │   ├── document.py
│   │   └── user.py
│   ├── services/          # Business logic services
│   │   ├── document_service.py
│   │   └── writing_assistant.py
│   ├── utils/             # Utility functions
│   │   └── text.py
│   ├── vector/            # Vector storage
│   │   └── faiss_store.py
│   └── main.py            # Application entry point
├── data/                  # Data storage (created at runtime)
│   ├── faiss_index        # FAISS index file
│   ├── faiss_metadata.pkl # FAISS metadata
│   ├── study_buddies.db   # DuckDB database file
│   └── uploads/           # Uploaded files
├── environment.yml        # Conda environment file
├── run.py                 # Script to run the application
└── README.md              # This file
```

## API Endpoints

### Documents

- `GET /api/v1/documents` - Get all documents for the current user
- `POST /api/v1/documents` - Create a new document
- `GET /api/v1/documents/{document_id}` - Get a specific document
- `PUT /api/v1/documents/{document_id}` - Update a document
- `DELETE /api/v1/documents/{document_id}` - Delete a document
- `POST /api/v1/documents/upload` - Upload a document file
- `POST /api/v1/documents/search` - Search for documents

### Writing Assistant

- `POST /api/v1/writing/generate` - Generate writing prompts based on a topic and optional documents
- `POST /api/v1/writing/save` - Save a user-created writing prompt
- `GET /api/v1/writing` - Get all writing prompts for the current user

## Authentication

For simplicity, the application uses a pre-defined superuser. In a production environment, you would want to implement proper user authentication.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
