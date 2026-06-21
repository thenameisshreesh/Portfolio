from flask import jsonify
from app import db
from app.models.skill import serialize

def get_all_skills():
    skills = list(db.skills.find())
    return jsonify([serialize(s) for s in skills])
