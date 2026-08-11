from flask import Blueprint, render_template, session, redirect, url_for, request, jsonify
from app.db import get_db_connection

game_bp = Blueprint('game', __name__)


from app.game.levels import get_level, LEVELS

@game_bp.route('/levels')
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
