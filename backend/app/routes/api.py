from flask import Blueprint
from app.controllers.project_controller import get_all_projects
from app.controllers.skill_controller import get_all_skills
from app.controllers.contact_controller import submit_contact

api_bp = Blueprint("api", __name__)

api_bp.get("/projects")(get_all_projects)
api_bp.get("/skills")(get_all_skills)
api_bp.post("/contact")(submit_contact)
