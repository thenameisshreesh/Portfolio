import sys
import os

# Add the backend directory to sys.path so the app module can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Load environment variables from .env if present (Vercel will use env vars from dashboard)
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

from app import create_app

app = create_app()

# Vercel Python runtime expects a variable named 'app'