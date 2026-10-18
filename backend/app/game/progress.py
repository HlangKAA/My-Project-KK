"""Persistence for the current stage catalog, using existing Supabase tables only."""
import json
import math
from datetime import datetime, timezone
from pathlib import Path

CATALOG_DATA = json.loads(Path(__file__).with_name('catalog.json').read_text(encoding='utf-8'))
CATALOG = CATALOG_DATA['catalog']
STAGES = {row['map_data']['stage_key']: row for row in CATALOG_DATA['levels']}


def validate_submission(data):
    if not isinstance(data, dict) or not isinstance(data.get('stage_key'), str) or data['stage_key'] not in STAGES:
        raise ValueError('Unknown stage.')
    if data.get('result') not in ('Success', 'Fail', 'Error'):
        raise ValueError('Invalid result.')
    if not isinstance(data.get('code'), str) or len(data['code']) > 100000:
        raise ValueError('Code must be text of at most 100000 characters.')
    runtime = data.get('runtime')
    if isinstance(runtime, bool) or not isinstance(runtime, (int, float)) or not math.isfinite(runtime) or not 0 <= runtime <= 86400:
        raise ValueError('Invalid runtime in seconds.')
    try:
        submitted_at = datetime.fromisoformat(data['submitted_at'].replace('Z', '+00:00'))
        if submitted_at.tzinfo is None:
            raise ValueError()
        submitted_at = submitted_at.astimezone(timezone.utc).replace(tzinfo=None)
    except (KeyError, ValueError, TypeError, AttributeError):
        raise ValueError('A UTC submitted_at timestamp is required.')
    return {**data, 'submitted_at': submitted_at}


def read_progress(cursor, player_id):
    cursor.execute('''
        SELECT l.map_data->>'stage_key' AS stage_key, MIN(s.submitted_at) AS completed_at
        FROM public.code_submissions s JOIN public.levels l ON l.level_id = s.level_id
        WHERE s.player_id = %s AND s.result = 'Success' AND l.map_data->>'catalog' = %s
        GROUP BY l.map_data->>'stage_key'
    ''', (player_id, CATALOG))
    completed = {r['stage_key']: {'completedAt': r['completed_at'].replace(tzinfo=timezone.utc).isoformat()}
                 for r in cursor.fetchall() if r['stage_key'] in STAGES}
    stage_progress = {}
    completed_regions = []
    for region in range(1, 5):
        keys = [key for key, value in STAGES.items() if value['chapter'] == region]
        contiguous = 0
        for key in keys:
            if key not in completed:
                break
            contiguous += 1
        stage_progress[str(region)] = contiguous
        if all(key in completed for key in keys):
            completed_regions.append(region)
    level = 1
    while level in completed_regions:
        level += 1
    cursor.execute('''SELECT a.achievement_id, a.title, a.description, pa.unlocked_at
                      FROM public.player_achievements pa JOIN public.achievements a USING (achievement_id)
                      WHERE pa.player_id = %s ORDER BY a.achievement_id''', (player_id,))
    achievements = [dict(r) for r in cursor.fetchall()]
    cursor.execute('SELECT COALESCE(MAX(high_score), 0) AS high_score FROM public.game_progress WHERE player_id = %s', (player_id,))
    return {'level': level, 'stageProgress': stage_progress, 'completedStages': completed,
            'completedRegions': completed_regions, 'achievements': achievements,
            'highScore': cursor.fetchone()['high_score']}


def save_submission(cursor, player_id, data):
    # Serialize writes for one player without adding a UNIQUE constraint to game_progress.
    cursor.execute('SELECT player_id FROM public.players WHERE player_id = %s FOR UPDATE', (player_id,))
    if not cursor.fetchone():
        raise PermissionError('Please log in again.')
    cursor.execute("SELECT level_id FROM public.levels WHERE map_data->>'catalog' = %s AND map_data->>'stage_key' = %s", (CATALOG, data['stage_key']))
    level = cursor.fetchone()
    if not level:
        raise LookupError('Stage catalog has not been installed in this database.')
    level_id = level['level_id']
    # A retry uses the same attempt timestamp. A new run always gets a new timestamp.
    cursor.execute('''SELECT submission_id, code, result FROM public.code_submissions
                      WHERE player_id = %s AND level_id = %s AND submitted_at = %s''',
                   (player_id, level_id, data['submitted_at']))
    previous = cursor.fetchone()
    if previous:
        if previous['code'] != data['code'] or previous['result'] != data['result']:
            raise ValueError('Attempt timestamp already used. Please run again.')
        # Backfill the secondary records if an attempt saved before they were enabled.
        _update_player_stats(cursor, player_id, STAGES[data['stage_key']]['chapter'])
        _log_attempt(cursor, player_id, previous['submission_id'], data)
        return {'submission_id': previous['submission_id'], 'progress': read_progress(cursor, player_id)}
    cursor.execute('''INSERT INTO public.code_submissions (player_id, level_id, code, result, runtime, submitted_at)
                      VALUES (%s, %s, %s, %s, %s, %s) RETURNING submission_id''',
                   (player_id, level_id, data['code'], data['result'], data['runtime'], data['submitted_at']))
    submission_id = cursor.fetchone()['submission_id']
    _update_player_stats(cursor, player_id, STAGES[data['stage_key']]['chapter'])
    _log_attempt(cursor, player_id, submission_id, data)
    progress = read_progress(cursor, player_id)
    if data['result'] == 'Success':
        cursor.execute('''UPDATE public.game_progress SET current_level = %s, last_played = NOW()
                          WHERE player_id = %s''', (progress['level'], player_id))
        if cursor.rowcount == 0:
            cursor.execute('''INSERT INTO public.game_progress (player_id, current_level, last_played)
                              VALUES (%s, %s, NOW())''', (player_id, progress['level']))
        conditions = [f'{CATALOG}:region:{r}' for r in progress['completedRegions']]
        if '1-1' in progress['completedStages']:
            conditions.append(f'{CATALOG}:stage:1-1')
        if len(progress['completedStages']) == len(STAGES):
            conditions.append(f'{CATALOG}:all')
        cursor.execute('''INSERT INTO public.player_achievements (player_id, achievement_id)
                          SELECT %s, achievement_id FROM public.achievements WHERE unlock_condition = ANY(%s)
                          ON CONFLICT (player_id, achievement_id) DO NOTHING''', (player_id, conditions))
        progress = read_progress(cursor, player_id)
    return {'submission_id': submission_id, 'progress': progress}


def _update_player_stats(cursor, player_id, current_level):
    """Keep the legacy stats table current without requiring a new unique key."""
    cursor.execute('''UPDATE public.player_stats
                      SET current_level = %s, last_played = NOW()
                      WHERE player_id = %s''', (current_level, player_id))
    if cursor.rowcount == 0:
        cursor.execute('''INSERT INTO public.player_stats (player_id, current_level, last_played)
                          VALUES (%s, %s, NOW())''', (player_id, current_level))


def _log_attempt(cursor, player_id, submission_id, data):
    """Append a readable attempt event once, using its existing submission ID."""
    action = f'stage_attempt:{submission_id}'
    detail = json.dumps({
        'stage_key': data['stage_key'],
        'result': data['result'],
        'runtime_seconds': data['runtime'],
    }, separators=(',', ':'), sort_keys=True)
    cursor.execute('''INSERT INTO public.game_logs (player_id, action, detail, created_at)
                      SELECT %s, %s, %s, NOW()
                      WHERE NOT EXISTS (
                          SELECT 1 FROM public.game_logs WHERE player_id = %s AND action = %s
                      )''', (player_id, action, detail, player_id, action))
