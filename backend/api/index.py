"""
Vercel Serverless Function Entry Point.
Exposes FastAPI app for Vercel Python runtime.
"""
import sys
from pathlib import Path

# Add backend root to path for imports
backend_root = Path(__file__).parent.parent
sys.path.insert(0, str(backend_root))

from app.main import app

# Vercel expects 'app' to be exported for ASGI
