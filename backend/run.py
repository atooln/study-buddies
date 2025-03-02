import uvicorn
import os
import sys

# Add the project root to path if running directly
if __name__ == "__main__":
    # Get the absolute path to the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Add the project root to sys.path
    project_root = os.path.dirname(script_dir)
    sys.path.insert(0, project_root)
    
    # Start the uvicorn server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    ) 