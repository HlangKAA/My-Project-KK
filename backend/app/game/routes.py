from datetime import timezone
from flask import Blueprint, session, request, jsonify, current_app
from app.db import get_db_connection
from app.game.leaderboard import read_leaderboard
from app.game.progress import CATALOG, _stage_catalog, read_progress, save_submission, validate_submission

game_bp = Blueprint('game', __name__)


@game_bp.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    if 'player_id' not in session:
        return jsonify(message='Not logged in'), 401
    conn = get_db_connection()
    if conn is None:
        return jsonify(message='Database connection failed'), 503
    try:
        with conn:
            with conn.cursor() as cursor:
                result = read_leaderboard(cursor, session['player_id'])
        return jsonify(success=True, **result)
    except Exception:
        current_app.logger.exception('Unable to load leaderboard')
        return jsonify(message='Unable to load leaderboard. Please retry.'), 503
    finally:
        conn.close()
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
                    WHERE s.player_id = %s
                      AND l.map_data->>'catalog' = %s
                      AND l.map_data->>'stage_key' = ANY(%s)
                    GROUP BY l.map_data->>'stage_key', l.level_name
                    ORDER BY l.map_data->>'stage_key'
                ''', (session['player_id'], CATALOG, list(_stage_catalog())))
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
