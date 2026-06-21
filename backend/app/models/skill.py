from bson import ObjectId

def serialize(doc):
    """Convert MongoDB document to JSON-serializable dict."""
    if not doc:
        return None

    # Ensure all ObjectIds are strings for JSON serialization
    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        else:
            serialized[key] = value
    return serialized