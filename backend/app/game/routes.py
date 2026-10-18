from datetime import timezone
from flask import Blueprint, render_template, session, redirect, url_for, request, jsonify, current_app
from app.db import get_db_connection
from app.game.progress import CATALOG, read_progress, save_submission, validate_submission

game_bp = Blueprint('game', __name__)


@game_bp.route('/api/progress', methods=['GET'])
def get_progress():
    if 'player_id' not in session:
        return jsonify(message='Not logged in'), 401
    conn = get_db_connection()
    if conn is None:
        return jsonify(message='Database connection failed'), 503
    try:
        with conn:
            with conn.cursor() as cursor:
                progress = read_progress(cursor, session['player_id'])
        return jsonify(success=True, progress=progress)
    except Exception:
        current_app.logger.exception('Unable to load game progress')
        return jsonify(message='Unable to load progress. Please retry.'), 503
    finally:
        conn.close()


@game_bp.route('/api/profile/history', methods=['GET'])
def profile_history():
    if 'player_id' not in session:
        return jsonify(message='Not logged in'), 401
    conn = get_db_connection()
    if conn is None:
        return jsonify(message='Database connection failed'), 503
    try:
        with conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT l.map_data->>'stage_key' AS stage_key,
                           l.level_name AS stage_name,
                           COUNT(*)::int AS attempts,
                           COUNT(*) FILTER (WHERE s.result = 'Success')::int AS successful_attempts,
                           MIN(s.submitted_at) AS first_attempt_at,
                           MAX(s.submitted_at) AS last_attempt_at,
                           MIN(s.submitted_at) FILTER (WHERE s.result = 'Success') AS completed_at,
                           COALESCE(ROUND(AVG(s.runtime)::numeric, 1), 0)::float AS average_runtime
                    FROM public.code_submissions s
                    JOIN public.levels l ON l.level_id = s.level_id
                    WHERE s.player_id = %s AND l.map_data->>'catalog' = %s
                    GROUP BY l.map_data->>'stage_key', l.level_name
                    ORDER BY l.map_data->>'stage_key'
                ''', (session['player_id'], CATALOG))
                history = [dict(row) for row in cursor.fetchall()]
        for row in history:
            for key in ('first_attempt_at', 'last_attempt_at', 'completed_at'):
                if row[key]:
                    row[key] = row[key].replace(tzinfo=timezone.utc).isoformat()
        return jsonify(success=True, history=history)
    except Exception:
        current_app.logger.exception('Unable to load profile history')
        return jsonify(message='Unable to load profile history. Please retry.'), 503
    finally:
        conn.close()


@game_bp.route('/api/submissions', methods=['POST'])
def submit_code():
    if 'player_id' not in session:
        return jsonify(message='Not logged in'), 401
    try:
        data = validate_submission(request.get_json(silent=True))
    except ValueError as error:
        return jsonify(message=str(error)), 400
    conn = get_db_connection()
    if conn is None:
        return jsonify(message='Database connection failed'), 503
    try:
        with conn:
            with conn.cursor() as cursor:
                result = save_submission(cursor, session['player_id'], data)
        return jsonify(success=True, **result)
    except PermissionError as error:
        return jsonify(message=str(error)), 401
    except ValueError as error:
        return jsonify(message=str(error)), 409
    except LookupError as error:
        return jsonify(message=str(error)), 503
    except Exception:
        current_app.logger.exception('Unable to save game attempt')
        return jsonify(message='Unable to save progress. Please retry.'), 503
    finally:
        conn.close()


from app.game.levels import get_level, LEVELS

@game_bp.route('/levels')
def level_select():
    """Level Select Page"""
    if 'player_id' not in session:
        return redirect(url_for('auth.login_page'))
    
    # Fetch player progress
    current_level = 1
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT current_level FROM game_progress WHERE player_id = %s", (session['player_id'],))
            result = cursor.fetchone()
            if result:
                current_level = result['current_level']
            cursor.close()
            conn.close()
        except:
            if conn: conn.close()
            
    return render_template('game/levels.html', levels=LEVELS, current_level=current_level)

@game_bp.route('/game/<int:level_id>')
def game_page(level_id=1):
    """Get Level Data (API)"""
    # For now, allow public access for development or check session if strict
    # if 'player_id' not in session:
    #     return jsonify({'error': 'Unauthorized'}), 401
    
    level_data = get_level(level_id)
    if not level_data:
        return jsonify({'error': 'Level not found'}), 404
    
    return jsonify({
        'level': level_id,
        'level_data': level_data,
        'max_levels': 3
    })

@game_bp.route('/complete_level', methods=['POST'])
def complete_level():
    if 'player_id' not in session:
        return jsonify({"status": "error", "message": "Not logged in"}), 401
        
    data = request.get_json()
    level_id = data.get('level_id')
    player_id = session.get('player_id')
    
    if not level_id:
        return jsonify({"status": "error", "message": "Missing level_id"}), 400

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            
            # Check if stats exist for this player in game_progress
            cursor.execute("SELECT current_level FROM game_progress WHERE player_id = %s", (player_id,))
            record = cursor.fetchone()

            if not record:
                # First time playing: Insert start record into game_progress
                new_level = int(level_id) + 1
                cursor.execute("""
                    INSERT INTO game_progress (player_id, current_level, last_played)
                    VALUES (%s, %s, NOW())
                """, (player_id, new_level))
            else:
                # Update existing record in game_progress
                cursor.execute("""
                    UPDATE game_progress 
                    SET current_level = GREATEST(current_level, %s),
                        last_played = NOW()
                    WHERE player_id = %s
                """, (int(level_id) + 1, player_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "next_level": int(level_id) + 1})
        except Exception as e:
            conn.close()
            return jsonify({"status": "error", "message": str(e)}), 500
    
    return jsonify({"status": "error", "message": "Database connection failed"}), 500
