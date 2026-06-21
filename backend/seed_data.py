"""
Seed script — run once to populate MongoDB Atlas with initial data.
Usage: python seed_data.py
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database()

# ── Projects (from resume) ──────────────────────────────────
projects = [
    {
        "id": "p1",
        "title": "Amrut",
        "description": "Milk quality monitoring platform processing 1,000+ daily sensor readings. Built mobile and web dashboards in Flutter for real-time vendor monitoring.",
        "tech": ["Spring Boot", "Flutter", "MongoDB", "Supabase", "Kafka", "Redis"],
        "github": "https://github.com/thenameisshreesh",
        "live": "#",
        "color": "#00F5FF"
    },
    {
        "id": "p2",
        "title": "PASHURAKSHAK",
        "description": "GPS livestock tracking platform with geofencing, anomaly detection, and microservices for 100+ animals. RESTful APIs for real-time sync between backend and Flutter apps.",
        "tech": ["Spring Boot", "Flutter", "MongoDB", "FastAPI", "Kafka", "Redis"],
        "github": "https://github.com/thenameisshreesh",
        "live": "#",
        "color": "#8A2BE2"
    },
    {
        "id": "p3",
        "title": "Smart Academic Assistant Bot",
        "description": "AI-powered WhatsApp assistant using RAG, LangChain, and FAISS. Achieved 95% response accuracy handling 500+ daily API requests for 50+ users.",
        "tech": ["Spring Boot", "Flask", "LangChain", "FAISS", "RAG", "LLM", "n8n"],
        "github": "https://github.com/thenameisshreesh",
        "live": "#",
        "color": "#00FF9F"
    },
    {
        "id": "p4",
        "title": "MAT-PRAHARI",
        "description": "Blockchain-enabled biometric voting platform supporting 500+ voter records with Hyperledger logging and fraud detection.",
        "tech": ["Java", "Hyperledger", "MongoDB", "Kafka"],
        "github": "https://github.com/thenameisshreesh",
        "live": "#",
        "color": "#FF6B6B"
    },
    {
        "id": "p5",
        "title": "Ticket Booking System",
        "description": "Full-stack ticket booking system using Flask, SQL, Google Maps API, and Cashfree Payment Gateway enabling seamless transactions for 100+ concurrent users.",
        "tech": ["Flask", "SQL", "Google Maps API", "Cashfree", "JavaScript"],
        "github": "https://github.com/thenameisshreesh",
        "live": "#",
        "color": "#FFD700"
    },
]

# ── Skills (from resume) ────────────────────────────────────
skills = [
    {
        "name": "Skills",
        "children": [
            {
                "name": "Backend",
                "children": [
                    {"name": "Spring Boot", "level": 90, "years": 3},
                    {"name": "Spring MVC", "level": 85, "years": 3},
                    {"name": "Spring Data JPA", "level": 85, "years": 3},
                    {"name": "Hibernate ORM", "level": 80, "years": 3},
                    {"name": "REST APIs", "level": 92, "years": 3},
                    {"name": "Microservices", "level": 82, "years": 2},
                    {"name": "Flask", "level": 85, "years": 2},
                    {"name": "FastAPI", "level": 75, "years": 1},
                ]
            },
            {
                "name": "Frontend & Mobile",
                "children": [
                    {"name": "Flutter", "level": 80, "years": 2},
                    {"name": "React", "level": 88, "years": 2},
                    {"name": "JavaScript", "level": 88, "years": 4},
                    {"name": "HTML/CSS", "level": 92, "years": 5},
                    {"name": "Dart", "level": 75, "years": 2},
                ]
            },
            {
                "name": "Languages & Tools",
                "children": [
                    {"name": "Java", "level": 90, "years": 4},
                    {"name": "Python", "level": 88, "years": 4},
                    {"name": "C++", "level": 75, "years": 3},
                    {"name": "SQL", "level": 85, "years": 4},
                    {"name": "Git/GitHub", "level": 90, "years": 4},
                    {"name": "MongoDB", "level": 82, "years": 3},
                    {"name": "PostgreSQL", "level": 78, "years": 2},
                    {"name": "Kafka", "level": 70, "years": 1},
                    {"name": "Redis", "level": 70, "years": 1},
                ]
            },
            {
                "name": "Emerging Tech",
                "children": [
                    {"name": "AI/ML", "level": 78, "years": 2},
                    {"name": "RAG/LLMs", "level": 75, "years": 1},
                    {"name": "Blockchain", "level": 65, "years": 1},
                    {"name": "Hyperledger", "level": 60, "years": 1},
                ]
            },
        ]
    }
]

# Drop and re-seed
db.projects.drop()
db.skills.drop()
db.contacts.drop()

db.projects.insert_many(projects)
db.skills.insert_many(skills)

print(f"✅  Seeded {db.projects.count_documents({})} projects")
print(f"✅  Seeded {db.skills.count_documents({})} skill trees")
print("✅  Contacts collection ready")