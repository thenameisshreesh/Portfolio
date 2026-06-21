from flask import current_app

@app.route("/test-db")
def test_db():
    try:
        current_app.db.test.insert_one({"msg": "connected"})
        return "MongoDB Connected ✅"
    except Exception as e:
        return str(e)