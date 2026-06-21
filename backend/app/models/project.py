from bson import ObjectId

def serialize(doc):
    """Convert MongoDB document to JSON-serializable dict."""
    doc["_id"] = str(doc["_id"])
    return doc
