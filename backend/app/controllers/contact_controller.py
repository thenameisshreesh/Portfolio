from flask import request, jsonify
from app import db
from app.models.contact import build_contact

import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

def emailsend(visitor_name, visitor_email, visitor_message):
    load_dotenv()
    
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    
    # Use environment variables if available, otherwise use hardcoded defaults
    username = os.getenv("SMTP_EMAIL", 'shreeshpitambare084@gmail.com')
    password = os.getenv("SMTP_PASSWORD", 'pmyp jdws ihui skap')
    
    try:
        # Open connection once and send BOTH emails
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  
            server.login(username, password)

            # 1. Send the details TO YOU (the owner)
            msg_owner = MIMEMultipart()
            msg_owner['From'] = username
            msg_owner['To'] = username
            msg_owner['Subject'] = f'New Portfolio Contact from {visitor_name}'
            owner_body = f"Name: {visitor_name}\nEmail: {visitor_email}\nMessage:\n{visitor_message}"
            msg_owner.attach(MIMEText(owner_body, 'plain'))
            
            server.send_message(msg_owner)
            print(f"Notification sent to you at {username}")

            # 2. Send the "I got your message" auto-reply TO THE VISITOR
            msg_visitor = MIMEMultipart()
            msg_visitor['From'] = username
            msg_visitor['To'] = visitor_email
            msg_visitor['Subject'] = 'Thank you for reaching out!'
            visitor_body = f"Hi {visitor_name},\n\nI got your message!\n\nBest regards,\nShreesh"
            msg_visitor.attach(MIMEText(visitor_body, 'plain'))
            
            server.send_message(msg_visitor)
            print(f"Auto-reply sent to the visitor at {visitor_email}")

    except Exception as e:
        print(f'Failed to send email: {e}')

def submit_contact():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not all([name, email, message]):
        return jsonify({"error": "name, email and message are required"}), 422

    contact = build_contact(name, email, message)
    result = db.contacts.insert_one(contact)

    # Calling the email function
    emailsend(name, email, message)

    return jsonify({"success": True, "id": str(result.inserted_id)}), 201