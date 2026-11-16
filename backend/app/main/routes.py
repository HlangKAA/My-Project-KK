from flask import Blueprint, jsonify, redirect, render_template, session, url_for
from app.api_docs import OPENAPI_SPEC

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """API Root"""
    return jsonify({
        "message": "Welcome to The Lost Spectrum API",
        "status": "online",
        "documentation": "/api/docs"
    })


@main_bp.route('/api/openapi.json')
def openapi_spec():
    """Machine-readable contract for the game's JSON API."""
    return jsonify(OPENAPI_SPEC)


@main_bp.route('/api/docs')
def api_docs():
    """Interactive Swagger UI, reachable through the Vite /api proxy too."""
    return render_template('main/api_docs.html')


@main_bp.route('/docs')
def docs_redirect():
    return redirect(url_for('main.api_docs'))


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
