from flask import render_template, request, jsonify, session, redirect, url_for, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from psycopg2 import Error
from datetime import datetime, timedelta
import secrets
from app.db import get_db_connection
from app.game.progress import CATALOG
from app.auth.password_policy import password_error
from app.auth.email import send_verification_email, send_password_reset_email
from app.auth.blueprint import auth_bp

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
            WHERE player_id = %s AND verification_token = %s
        """, (user['player_id'], token))

        if cursor.rowcount != 1:
            connection.rollback()
            return render_template('auth/verification_result.html',
                                 success=False,
                                 message='This verification link is no longer valid. Please request a new one.')
        
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
