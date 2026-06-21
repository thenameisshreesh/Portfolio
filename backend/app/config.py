import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/portfolio")
    #SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")
    PORT = int(os.getenv("PORT", 5000))
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
