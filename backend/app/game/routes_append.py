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
            # Update current_level to level_id + 1, but only if it's higher than what's there
            # (Prevent setting it back if replaying old levels)
            # Also assuming 'current_level' stores the *next* playable level, or the highest unlocked.
            # Using GREATEST logic as per user request
            
            cursor.execute("""
                UPDATE player_stats 
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

