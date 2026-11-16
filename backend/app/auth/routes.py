from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, current_app
from html import escape
from psycopg2.errors import UniqueViolation
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash
from psycopg2 import Error
from datetime import datetime, timedelta
import secrets
from app import mail
from app.db import get_db_connection
from app.game.progress import CATALOG
from app.auth.password_policy import password_error

auth_bp = Blueprint('auth', __name__)

def send_verification_email(email, token, username):
    """Send verification email to user"""
    try:
        verification_url = url_for('auth.verify_email', token=token, _external=True)
        
        msg = Message(
            'Verify Your Email - Lost Spectrum',
            recipients=[email]
        )
        
        safe_username = escape(username)
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background-color: #15130f; margin: 0; padding: 0;">
            <div style="width: 100%; padding: 40px 0; background-color: #15130f;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e1d18; border: 1px solid rgba(184,137,73,0.4); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(90deg, #1e1d18, #30291e); padding: 30px; text-align: center; border-bottom: 1px solid rgba(184,137,73,0.2);">
                        <h1 style="margin: 0; font-size: 24px; color: #f3e7d0; text-transform: uppercase; letter-spacing: 2px;">
                            The Lost <span style="color: #b88949;">Spectrum</span>
                        </h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #f3e7d0; margin-top: 0; font-size: 20px;">Verify Your Arcane Mail</h2>
                        <p style="color: #c2b49e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Welcome, Explorer <strong>{safe_username}</strong>.<br>
                            Confirm your address to enter the realm.
                        </p>

                        <a href="{verification_url}" style="background-color: #b88949; border: 1px solid #d0a55f; color: #1e1d18; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                            Verify Email
                        </a>

                        <p style="color: #a89080; font-size: 14px; margin-top: 30px;">
                            Or paste this link into your browser:<br>
                            <a href="{verification_url}" style="color: #d0a55f; text-decoration: none; word-break: break-all;">{verification_url}</a>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #15130f; padding: 20px; text-align: center; font-size: 12px; color: #8f806c;">
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
        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password/{token}"
        safe_username = escape(username)
        
        msg = Message(
            'Reset Your Password - Lost Spectrum',
            recipients=[email]
        )
        
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background-color: #15130f; margin: 0; padding: 0;">
            <div style="width: 100%; padding: 40px 0; background-color: #15130f;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e1d18; border: 1px solid rgba(184,137,73,0.4); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(90deg, #1e1d18, #30291e); padding: 30px; text-align: center; border-bottom: 1px solid rgba(184,137,73,0.2);">
                        <h1 style="margin: 0; font-size: 24px; color: #f3e7d0; text-transform: uppercase; letter-spacing: 2px;">
                            The Lost <span style="color: #b88949;">Spectrum</span>
                        </h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #f3e7d0; margin-top: 0; font-size: 20px;">Forge a New Incantation</h2>
                        <p style="color: #c2b49e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Hello, Explorer <strong>{safe_username}</strong>.<br>
                            A request to reset your access key has been received.
                        </p>

                        <a href="{reset_url}" style="background-color: #b88949; border: 1px solid #d0a55f; color: #1e1d18; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                            Reset Password
                        </a>

                        <p style="color: #a89080; font-size: 14px; margin-top: 30px;">
                            Or paste this link into your browser:<br>
                            <a href="{reset_url}" style="color: #d0a55f; text-decoration: none; word-break: break-all;">{reset_url}</a>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #15130f; padding: 20px; text-align: center; font-size: 12px; color: #8f806c;">
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
    """Keep legacy links in the React authentication flow."""
    return redirect(f"{current_app.config['FRONTEND_URL']}/login")

@auth_bp.route('/signup')
def signup_page():
    return redirect(f"{current_app.config['FRONTEND_URL']}/register")

@auth_bp.route('/forgot-password')
def forgot_password_page():
    return redirect(f"{current_app.config['FRONTEND_URL']}/forgot-password")

@auth_bp.route('/reset-password/<token>')
def reset_password_page(token):
    return redirect(f"{current_app.config['FRONTEND_URL']}/reset-password/{token}")

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
@auth_bp.route('/api/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email"""
    connection = None
    cursor = None
    try:
        data = request.get_json(silent=True) or {}
        if not isinstance(data, dict):
            return jsonify(success=False, message='Email is required'), 400
        email = data.get('email', '')
        if not isinstance(email, str):
            return jsonify(success=False, message='Email is required'), 400
        email = email.strip()
        
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
            SELECT player_id, username, email, is_verified, verification_token
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
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API Routes
@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    """Handle user registration"""
    try:
        data = request.get_json(silent=True)
        data = data if isinstance(data, dict) else {}

        name = data.get('name', '')
        email = data.get('email', '')
        password = data.get('password', '')
        if not isinstance(name, str) or not isinstance(email, str):
            return jsonify(success=False, message='All fields are required'), 400
        name = name.strip()
        email = email.strip()

        if not name or not email or not password:
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        password_problem = password_error(password)
        if password_problem:
            return jsonify({
                'success': False,
                'message': password_problem
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

        cursor.execute("SELECT level_id FROM public.levels WHERE map_data->>'catalog' = %s AND map_data->>'stage_key' = '1-1'",
                       (CATALOG,))
        first_stage = cursor.fetchone()
        if not first_stage:
            cursor.close()
            connection.close()
            return jsonify(success=False, message='The first playable stage has not been installed.'), 503
        
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(hours=24)
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        insert_query = """
            INSERT INTO players (username, email, password, date_joined, 
                               is_verified, verification_token, token_expiry) 
            VALUES (%s, %s, %s, NOW(), FALSE, %s, %s)
            RETURNING player_id
        """
        cursor.execute(insert_query, (name, email, hashed_password, token, expiry))
        res = cursor.fetchone()
        player_id = res['player_id'] if res else getattr(cursor, 'lastrowid', None)
        cursor.execute('INSERT INTO public.game_progress (player_id, level_id, last_played) VALUES (%s, %s, NULL)',
                       (player_id, first_stage['level_id']))
        cursor.execute('INSERT INTO public.player_stats (player_id, level_id, last_played) VALUES (%s, %s, NULL)',
                       (player_id, first_stage['level_id']))
        connection.commit()
        
        cursor.close()
        connection.close()
        
        email_sent = send_verification_email(email, token, name)
        
        return jsonify({
            'success': True,
            'message': (
                'Account created. Please check your email to verify your account.'
                if email_sent else
                'Account created, but the verification email could not be sent. Please request another link from the login page.'
            ),
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
            SELECT player_id, username, email, password, is_verified, verification_token, onboarding_step
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
        
        if not user['is_verified']:
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Verify your email before logging in. You can request a new link below.',
                'email_not_verified': True
            }), 403
        
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
                'email': user['email'],
                'onboarding_step': user['onboarding_step']
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
        data = request.get_json(silent=True)
        data = data if isinstance(data, dict) else {}
        token = data.get('token', '')
        new_password = data.get('password', '')
        
        if not token or not new_password:
            return jsonify({
                'success': False,
                'message': 'Token and password are required'
            }), 400
        
        password_problem = password_error(new_password)
        if password_problem:
            return jsonify({
                'success': False,
                'message': password_problem
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
    
    connection = get_db_connection()
    if connection is None:
        return jsonify(message='Database connection failed'), 503
    try:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT player_id, username, email, onboarding_step FROM public.players WHERE player_id = %s',
                               (session['player_id'],))
                user = cursor.fetchone()
        if not user:
            return jsonify(message='Please log in again.'), 401
        return jsonify(success=True, user=dict(user))
    except Exception:
        current_app.logger.exception('Unable to load profile')
        return jsonify(message='Unable to load profile. Please retry.'), 503
    finally:
        connection.close()


@auth_bp.route('/api/onboarding', methods=['PATCH'])
def advance_onboarding():
    if 'player_id' not in session:
        return jsonify(message='Not logged in'), 401
    data = request.get_json(silent=True)
    step = data.get('step') if isinstance(data, dict) else None
    if type(step) is not int or step not in (1, 2):
        return jsonify(message='Onboarding step must be 1 or 2.'), 400
    connection = get_db_connection()
    if connection is None:
        return jsonify(message='Database connection failed. Please retry.'), 503
    try:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute('''UPDATE public.players
                                  SET onboarding_step = GREATEST(onboarding_step, %s)
                                  WHERE player_id = %s
                                  RETURNING onboarding_step''',
                               (step, session['player_id']))
                row = cursor.fetchone()
        if not row:
            return jsonify(message='Please log in again.'), 401
        return jsonify(success=True, onboarding_step=row['onboarding_step'])
    except Exception:
        current_app.logger.exception('Unable to save onboarding progress')
        return jsonify(message='Unable to save the introduction. Please retry.'), 503
    finally:
        connection.close()


@auth_bp.route('/api/profile', methods=['PATCH'])
def update_profile():
    if 'player_id' not in session:
        return jsonify(message='Not logged in'), 401
    data = request.get_json(silent=True)
    name = data.get('username') if isinstance(data, dict) else None
    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 50 or not name.strip().isprintable():
        return jsonify(message='Enter a player name of 1–50 printable characters.'), 400
    name = name.strip()
    connection = get_db_connection()
    if connection is None:
        return jsonify(message='Database connection failed. Please retry.'), 503
    try:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT player_id FROM public.players WHERE username = %s AND player_id <> %s',
                               (name, session['player_id']))
                if cursor.fetchone():
                    return jsonify(message='This player name is already taken.'), 409
                cursor.execute('UPDATE public.players SET username = %s WHERE player_id = %s RETURNING player_id, username, email',
                               (name, session['player_id']))
                user = cursor.fetchone()
                if not user:
                    return jsonify(message='Please log in again.'), 401
        session['username'] = user['username']
        return jsonify(success=True, user=dict(user))
    except UniqueViolation:
        return jsonify(message='This player name is already taken.'), 409
    except Exception:
        current_app.logger.exception('Unable to update profile')
        return jsonify(message='Unable to save your name. Please retry.'), 503
    finally:
        connection.close()


@auth_bp.route('/api/account', methods=['DELETE'])
def delete_account():
    player_id = session.get('player_id')
    if player_id is None:
        return jsonify(message='Not logged in'), 401
    data = request.get_json(silent=True)
    password = data.get('password') if isinstance(data, dict) else None
    if not isinstance(password, str) or not password:
        return jsonify(message='Enter your current password.'), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify(message='Database connection failed. Please retry.'), 503
    try:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT password FROM public.players WHERE player_id = %s FOR UPDATE', (player_id,))
                player = cursor.fetchone()
                if not player:
                    return jsonify(message='Please log in again.'), 401
                if not check_password_hash(player['password'], password):
                    return jsonify(message='Current password is incorrect.'), 403

                # Other player-owned rows cascade. Logs have a restrictive foreign key.
                cursor.execute('DELETE FROM public.game_logs WHERE player_id = %s', (player_id,))
                cursor.execute('DELETE FROM public.players WHERE player_id = %s RETURNING player_id', (player_id,))
                if not cursor.fetchone():
                    raise RuntimeError('Player disappeared while deleting account')
        session.clear()
        return jsonify(success=True)
    except Exception:
        current_app.logger.exception('Unable to delete account')
        return jsonify(message='Could not delete your account. Please retry.'), 503
    finally:
        connection.close()
