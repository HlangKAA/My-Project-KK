from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash
from psycopg2 import Error
from datetime import datetime, timedelta
import secrets
from app import mail
from app.db import get_db_connection

auth_bp = Blueprint('auth', __name__)

def send_verification_email(email, token, username):
    """Send verification email to user"""
    try:
        verification_url = url_for('auth.verify_email', token=token, _external=True)
        
        msg = Message(
            'Verify Your Email - Lost Spectrum',
            recipients=[email]
        )
        
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #0f172a; margin: 0; padding: 0;">
            <div style="width: 100%; padding: 40px 0; background-color: #0f172a;">
                <div style="max-width: 600px; margin: 0 auto; background-color: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(90deg, #0f172a, #1e293b); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <h1 style="margin: 0; font-size: 24px; color: #f1f5f9; text-transform: uppercase; letter-spacing: 2px;">
                            The Lost <span style="color: #22d3ee; text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);">Spectrum</span>
                        </h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #f8fafc; margin-top: 0; font-size: 20px;">Verify Your Identity</h2>
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Welcome, Explorer <strong>{username}</strong>.<br>
                            To access the void, you must verify your communication channel.
                        </p>

                        <a href="{verification_url}" style="background-color: transparent; border: 2px solid #22d3ee; color: #22d3ee; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                            Verify Email
                        </a>

                        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                            Or paste this link into your browser:<br>
                            <a href="{verification_url}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">{verification_url}</a>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #020617; padding: 20px; text-align: center; font-size: 12px; color: #475569;">
                        <p style="margin: 0;">Link expires in 24 hours.</p>
                        <p style="margin: 5px 0 0;">&copy; The Lost Spectrum</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_password_reset_email(email, token, username):
    """Send password reset email to user"""
    try:
        reset_url = f"http://localhost:5173/reset-password/{token}"
        
        msg = Message(
            'Reset Your Password - Lost Spectrum',
            recipients=[email]
        )
        
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #0f172a; margin: 0; padding: 0;">
            <div style="width: 100%; padding: 40px 0; background-color: #0f172a;">
                <div style="max-width: 600px; margin: 0 auto; background-color: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(90deg, #0f172a, #1e293b); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <h1 style="margin: 0; font-size: 24px; color: #f1f5f9; text-transform: uppercase; letter-spacing: 2px;">
                            The Lost <span style="color: #a855f7; text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);">Spectrum</span>
                        </h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #f8fafc; margin-top: 0; font-size: 20px;">Access Recovery Initiated</h2>
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Hello, Explorer <strong>{username}</strong>.<br>
                            A request to reset your access key has been received.
                        </p>

                        <a href="{reset_url}" style="background-color: transparent; border: 2px solid #a855f7; color: #a855f7; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                            Reset Password
                        </a>

                        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                            Or paste this link into your browser:<br>
                            <a href="{reset_url}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">{reset_url}</a>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #020617; padding: 20px; text-align: center; font-size: 12px; color: #475569;">
                        <p style="margin: 0;">Link expires in 1 hour.</p>
                        <p style="margin: 5px 0 0;">If you didn't request this, ignore this message.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@auth_bp.route('/login')
def login_page():
    """Render login page"""
    return render_template('auth/login.html')

@auth_bp.route('/signup')
def signup_page():
    """Render signup page"""
    return render_template('auth/signup.html')

@auth_bp.route('/forgot-password')
def forgot_password_page():
    """Render forgot password page"""
    return render_template('auth/forgot_password.html')

@auth_bp.route('/reset-password/<token>')
def reset_password_page(token):
    """Render reset password page"""
    return render_template('auth/reset_password.html', token=token)

@auth_bp.route('/verify-email/<token>')
def verify_email(token):
    """Verify email with token"""
    connection = get_db_connection()
    if not connection:
        return render_template('auth/verification_result.html', 
                             success=False, 
                             message='Database connection failed')
    
    try:
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT player_id, username, email, is_verified, token_expiry 
            FROM players 
            WHERE verification_token = %s
        """, (token,))
        
        user = cursor.fetchone()
        
        if not user:
            return render_template('auth/verification_result.html',
                                 success=False,
                                 message='Invalid verification link')
        
        if user['is_verified']:
            return render_template('auth/verification_result.html',
                                 success=True,
                                 message='Your email is already verified! You can now log in.',
                                 already_verified=True)
        
        if user['token_expiry'] and datetime.now() > user['token_expiry']:
            return render_template('auth/verification_result.html',
                                 success=False,
                                 message='Verification link has expired. Please request a new one.',
                                 expired=True,
                                 email=user['email'])
        
        cursor.execute("""
            UPDATE players 
            SET is_verified = TRUE, 
                verification_token = NULL, 
                token_expiry = NULL 
            WHERE player_id = %s
        """, (user['player_id'],))
        
        connection.commit()
        
        return render_template('auth/verification_result.html',
                             success=True,
                             message=f'Email verified successfully!\nWelcome, {user["username"]}!')
        
    except Error as e:
        print(f"Database error: {e}")
        return render_template('auth/verification_result.html',
                             success=False,
                             message='An error occurred during verification')
    finally:
        cursor.close()
        connection.close()

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT player_id, username, email, is_verified 
            FROM players 
            WHERE email = %s
        """, (email,))
        
        user = cursor.fetchone()
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Email not found'
            }), 404
        
        if user['is_verified']:
            return jsonify({
                'success': False,
                'message': 'Email is already verified'
            }), 400
        
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(hours=24)
        
        cursor.execute("""
            UPDATE players 
            SET verification_token = %s, token_expiry = %s 
            WHERE player_id = %s
        """, (token, expiry, user['player_id']))
        
        connection.commit()
        
        if send_verification_email(user['email'], token, user['username']):
            return jsonify({
                'success': True,
                'message': 'Verification email sent! Please check your inbox.'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to send email. Please try again later.'
            }), 500
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500
    finally:
        if connection:
            cursor.close()
            connection.close()

# API Routes
@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    """Handle user registration"""
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        if len(password) < 6:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters'
            }), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        cursor = connection.cursor()
        
        cursor.execute("SELECT player_id FROM players WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Email already exists'
            }), 409
        
        cursor.execute("SELECT player_id FROM players WHERE username = %s", (name,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Username already exists'
            }), 409
        
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(hours=24)
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        insert_query = """
            INSERT INTO players (username, email, password, date_joined, 
                               is_verified, verification_token, token_expiry) 
            VALUES (%s, %s, %s, NOW(), TRUE, %s, %s)
            RETURNING player_id
        """
        cursor.execute(insert_query, (name, email, hashed_password, token, expiry))
        res = cursor.fetchone()
        player_id = res['player_id'] if res else getattr(cursor, 'lastrowid', None)
        connection.commit()
        
        cursor.close()
        connection.close()
        
        email_sent = send_verification_email(email, token, name)
        
        return jsonify({
            'success': True,
            'message': 'Account created! Please check your email to verify your account.',
            'player_id': player_id,
            'email_sent': email_sent
        }), 201
        
    except Error as e:
        return jsonify({
            'success': False,
            'message': f'Database error: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@auth_bp.route('/api/login', methods=['POST'])
def login():
    """Handle user login"""
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT player_id, username, email, password, is_verified 
            FROM players 
            WHERE email = %s
        """, (email,))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        if not check_password_hash(user['password'], password):
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # if not user['is_verified']:
        #     cursor.close()
        #     connection.close()
        #     return jsonify({
        #         'success': False,
        #         'message': 'Please verify your email before logging in',
        #         'email_not_verified': True
        #     }), 403
        
        cursor.execute(
            "UPDATE players SET last_login = NOW() WHERE player_id = %s",
            (user['player_id'],)
        )
        connection.commit()
        
        cursor.close()
        connection.close()
        
        session['player_id'] = user['player_id']
        session['username'] = user['username']
        session['email'] = user['email']
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'player_id': user['player_id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200
        
    except Error as e:
        return jsonify({
            'success': False,
            'message': f'Database error: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@auth_bp.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    """Handle forgot password request"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT player_id, username, email 
            FROM players 
            WHERE email = %s
        """, (email,))
        
        user = cursor.fetchone()
        
        # Always return success for security (don't reveal if email exists)
        if not user:
            cursor.close()
            connection.close()
            return jsonify({
                'success': True,
                'message': 'If an account exists with this email, you will receive a password reset link.'
            }), 200
        
        # Generate reset token
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(hours=1)  # 1 hour expiry
        
        cursor.execute("""
            UPDATE players 
            SET reset_token = %s, reset_token_expiry = %s 
            WHERE player_id = %s
        """, (token, expiry, user['player_id']))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        # Send reset email
        send_password_reset_email(user['email'], token, user['username'])
        
        return jsonify({
            'success': True,
            'message': 'If an account exists with this email, you will receive a password reset link.'
        }), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500

@auth_bp.route('/api/reset-password', methods=['POST'])
def reset_password():
    """Handle password reset"""
    try:
        data = request.get_json()
        token = data.get('token', '')
        new_password = data.get('password', '')
        
        if not token or not new_password:
            return jsonify({
                'success': False,
                'message': 'Token and password are required'
            }), 400
        
        if len(new_password) < 6:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters'
            }), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT player_id, username, reset_token_expiry 
            FROM players 
            WHERE reset_token = %s
        """, (token,))
        
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Invalid or expired reset link'
            }), 400
        
        # Check if token expired
        if user['reset_token_expiry'] and datetime.now() > user['reset_token_expiry']:
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Reset link has expired. Please request a new one.'
            }), 400
        
        # Update password
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
        
        cursor.execute("""
            UPDATE players 
            SET password = %s, 
                reset_token = NULL, 
                reset_token_expiry = NULL 
            WHERE player_id = %s
        """, (hashed_password, user['player_id']))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'message': 'Password reset successfully! You can now log in with your new password.'
        }), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    """Handle user logout"""
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

@auth_bp.route('/api/user', methods=['GET'])
def get_user():
    """Get current user info"""
    if 'player_id' not in session:
        return jsonify({
            'success': False,
            'message': 'Not logged in'
        }), 401
    
    return jsonify({
        'success': True,
        'user': {
            'player_id': session['player_id'],
            'username': session['username'],
            'email': session['email']
        }
    }), 200
