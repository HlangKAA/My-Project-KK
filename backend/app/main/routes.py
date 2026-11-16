from flask import Blueprint, current_app, jsonify, redirect, render_template, url_for
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
    """Keep old dashboard bookmarks working with the React page."""
    return redirect(f"{current_app.config['FRONTEND_URL']}/dashboard")
