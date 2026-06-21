from datetime import datetime

def build_contact(name, email, message):
    return {
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.utcnow().isoformat()
    }
