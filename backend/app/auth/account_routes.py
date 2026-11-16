"""Authenticated player profile, onboarding, and account endpoints."""
from flask import current_app, jsonify, request, session
from psycopg2.errors import UniqueViolation
from werkzeug.security import check_password_hash
from app.db import get_db_connection
from app.auth.blueprint import auth_bp

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
