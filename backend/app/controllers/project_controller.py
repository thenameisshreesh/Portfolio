from flask import jsonify
from app import db
from app.models.project import serialize

def get_all_projects():
    projects = list(db.projects.find())
    return jsonify([serialize(p) for p in projects])
