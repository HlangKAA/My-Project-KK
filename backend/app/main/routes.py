from flask import Blueprint, jsonify, session

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """API Root"""
    return jsonify({
        "message": "Welcome to CodeQuest API", 
        "status": "online",
        "documentation": "/docs" # Placeholder for docs
    })

@main_bp.route('/dashboard')
def dashboard():
    """Dashboard Data API"""
    if 'player_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    return jsonify({
        "username": session.get('username'),
        "role": "Apprentice", # Placeholder
        "message": "Welcome back, wizard!"
    })
