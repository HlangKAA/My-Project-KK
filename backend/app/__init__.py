from flask import Flask
from flask_mail import Mail
import os
from pathlib import Path
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / '.env')

app = Flask(__name__)
# Allow requests from the React Frontend
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}}, supports_credentials=True)

app.secret_key = os.getenv('SECRET_KEY')

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

# Register Blueprints
from app.auth.routes import auth_bp
from app.main.routes import main_bp
from app.game.routes import game_bp

app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)
app.register_blueprint(game_bp)
