"""Read-only leaderboard for players with a completed playable stage."""

from app.game.progress import CATALOG, STAGES


def read_leaderboard(cursor, player_id):
    cursor.execute('''
        WITH first_wins AS (
            SELECT s.player_id, l.map_data->>'stage_key' AS stage_key,
                   MIN(s.submitted_at) AS completed_at
            FROM public.code_submissions s
            JOIN public.levels l ON l.level_id = s.level_id
            WHERE s.result = 'Success'
              AND l.map_data->>'catalog' = %s
              AND l.map_data->>'stage_key' = ANY(%s)
            GROUP BY s.player_id, l.map_data->>'stage_key'
        ),
        totals AS (
            SELECT player_id, COUNT(*)::int AS completed_stages,
                   MAX(completed_at) AS reached_at
            FROM first_wins
            GROUP BY player_id
        ),
        scores AS (
            SELECT player_id, COALESCE(MAX(high_score), 0)::int AS score
            FROM public.game_progress
            GROUP BY player_id
        ),
        ranked AS (
            SELECT p.player_id, p.username, t.completed_stages,
                   COALESCE(sc.score, 0) AS score,
                   ROW_NUMBER() OVER (
                       ORDER BY COALESCE(sc.score, 0) DESC, t.completed_stages DESC,
                                t.reached_at ASC, p.player_id ASC
                   )::int AS rank
            FROM totals t
            JOIN public.players p ON p.player_id = t.player_id
            LEFT JOIN scores sc ON sc.player_id = t.player_id
        )
        SELECT player_id, username, completed_stages, score, rank
        FROM ranked
        WHERE rank <= 20 OR player_id = %s
        ORDER BY rank
    ''', (CATALOG, list(STAGES), player_id))
    rows = [dict(row) for row in cursor.fetchall()]
    return {
        'entries': [row for row in rows if row['rank'] <= 20],
        'me': next((row for row in rows if row['player_id'] == player_id), None),
    }
