from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from app.config import Config

db = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS — allow all origins for dev to prevent port issues (5173 vs 5174)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # MongoDB Atlas connection
    global db
    client = MongoClient(Config.MONGO_URI)
    db = client.get_database()

    # Register routes
    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app
