"""Persistence for the current stage catalog, using existing Supabase tables only."""
import json
import math
import threading
from datetime import datetime, timezone
from pathlib import Path

CATALOG_PATH = Path(__file__).with_name('catalog.json')
CATALOG_DATA = json.loads(CATALOG_PATH.read_text(encoding='utf-8'))
CATALOG = CATALOG_DATA['catalog']
STAGES = {row['map_data']['stage_key']: row for row in CATALOG_DATA['levels']}
_CATALOG_MTIME_NS = CATALOG_PATH.stat().st_mtime_ns
_CATALOG_LOCK = threading.Lock()


def _stage_catalog():
    """Reload generated stage data when it changes without requiring a Flask restart."""
    global CATALOG_DATA, STAGES, _CATALOG_MTIME_NS
    modified_at = CATALOG_PATH.stat().st_mtime_ns
    if modified_at == _CATALOG_MTIME_NS:
        return STAGES
    with _CATALOG_LOCK:
        modified_at = CATALOG_PATH.stat().st_mtime_ns
        if modified_at != _CATALOG_MTIME_NS:
            catalog_data = json.loads(CATALOG_PATH.read_text(encoding='utf-8'))
            if catalog_data.get('catalog') != CATALOG:
                raise RuntimeError('The stage catalog identifier changed. Restart the backend.')
            CATALOG_DATA = catalog_data
            STAGES = {row['map_data']['stage_key']: row for row in catalog_data['levels']}
            _CATALOG_MTIME_NS = modified_at
    return STAGES


def validate_submission(data):
    stages = _stage_catalog()
    if not isinstance(data, dict) or not isinstance(data.get('stage_key'), str) or data['stage_key'] not in stages:
        raise ValueError('Unknown stage.')
    if data.get('result') not in ('Success', 'Fail', 'Error'):
        raise ValueError('Invalid result.')
    if not isinstance(data.get('code'), str) or len(data['code']) > 100000:
        raise ValueError('Code must be text of at most 100000 characters.')
    runtime = data.get('runtime')
    if isinstance(runtime, bool) or not isinstance(runtime, (int, float)) or not math.isfinite(runtime) or not 0 <= runtime <= 86400:
        raise ValueError('Invalid runtime in seconds.')
    hints_used = data.get('hints_used')
    if hints_used is not None and (isinstance(hints_used, bool) or not isinstance(hints_used, int) or not 0 <= hints_used <= 100):
        raise ValueError('Invalid hint count.')
    try:
        submitted_at = datetime.fromisoformat(data['submitted_at'].replace('Z', '+00:00'))
        if submitted_at.tzinfo is None:
            raise ValueError()
        submitted_at = submitted_at.astimezone(timezone.utc).replace(tzinfo=None)
    except (KeyError, ValueError, TypeError, AttributeError):
        raise ValueError('A UTC submitted_at timestamp is required.')
    return {**data, 'submitted_at': submitted_at}


def read_progress(cursor, player_id):
    stages = _stage_catalog()
    cursor.execute('''
        SELECT DISTINCT ON (l.map_data->>'stage_key')
               l.map_data->>'stage_key' AS stage_key, s.submitted_at AS completed_at,
               COALESCE((g.detail::jsonb->>'earned_xp')::int, 0) AS xp
        FROM public.code_submissions s
        JOIN public.levels l ON l.level_id = s.level_id
        LEFT JOIN public.game_logs g ON g.player_id = s.player_id
                                    AND g.action = 'stage_attempt:' || s.submission_id
        WHERE s.player_id = %s AND s.result = 'Success' AND l.map_data->>'catalog' = %s
        ORDER BY l.map_data->>'stage_key', s.submitted_at, s.submission_id
    ''', (player_id, CATALOG))
    completed = {r['stage_key']: {'completedAt': r['completed_at'].replace(tzinfo=timezone.utc).isoformat(),
                                  'xp': r['xp']}
                 for r in cursor.fetchall() if r['stage_key'] in stages}
    cursor.execute('''SELECT a.achievement_id, a.title, a.description, a.unlock_condition, pa.unlocked_at
                      FROM public.player_achievements pa JOIN public.achievements a USING (achievement_id)
                      WHERE pa.player_id = %s ORDER BY a.achievement_id''', (player_id,))
    award_rows = cursor.fetchall()
    legacy_completed_regions = {
        region for region in (1, 2, 3, 4)
        if any(row['unlock_condition'] == f'{CATALOG}:region:{region}' for row in award_rows)
    }
    achievements = [
        {key: value for key, value in row.items() if key != 'unlock_condition'}
        for row in award_rows
    ]
    stage_progress = {}
    completed_regions = []
    for region in range(1, 5):
        keys = [key for key, value in stages.items() if value['chapter'] == region]
        contiguous = 0
        for key in keys:
            if key not in completed:
                break
            contiguous += 1
        stage_progress[str(region)] = contiguous
        if all(key in completed for key in keys) or region in legacy_completed_regions:
            completed_regions.append(region)
    level = 1
    while level in completed_regions:
        level += 1
    cursor.execute('SELECT COALESCE(MAX(high_score), 0) AS high_score FROM public.game_progress WHERE player_id = %s', (player_id,))
    return {'level': level, 'stageProgress': stage_progress, 'completedStages': completed,
            'completedRegions': completed_regions, 'achievements': achievements,
            'highScore': cursor.fetchone()['high_score']}


def save_submission(cursor, player_id, data):
    stages = _stage_catalog()
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
        _update_player_stats(cursor, player_id, stages[data['stage_key']]['chapter'])
        _log_attempt(cursor, player_id, previous['submission_id'], data)
        return {'submission_id': previous['submission_id'], 'progress': read_progress(cursor, player_id),
                'earnedXP': 0, 'appliedBonuses': []}
    cursor.execute('''SELECT COUNT(*)::int AS attempts,
                             COUNT(*) FILTER (WHERE result = 'Success')::int AS wins
                      FROM public.code_submissions WHERE player_id = %s AND level_id = %s''',
                   (player_id, level_id))
    prior = cursor.fetchone()
    first_clear = data['result'] == 'Success' and prior['wins'] == 0
    first_attempt = first_clear and prior['attempts'] == 0
    no_hints = first_clear and data.get('hints_used') == 0
    base_xp = stages[data['stage_key']]['map_data']['xp_reward']
    earned_xp = (base_xp * (3 if first_attempt else 2) * (13 if no_hints else 10) // 20) if first_clear else 0
    applied_bonuses = []
    if first_attempt:
        applied_bonuses.append({'key': 'firstAttempt', 'label': 'First Attempt Bonus',
                                'icon': 'fas fa-bolt', 'bonusXP': base_xp // 2})
    if no_hints:
        applied_bonuses.append({'key': 'noHints', 'label': 'No Hints Used',
                                'icon': 'fas fa-brain', 'bonusXP': base_xp * 3 // 10})
    cursor.execute('''INSERT INTO public.code_submissions (player_id, level_id, code, result, runtime, submitted_at)
                      VALUES (%s, %s, %s, %s, %s, %s) RETURNING submission_id''',
                   (player_id, level_id, data['code'], data['result'], data['runtime'], data['submitted_at']))
    submission_id = cursor.fetchone()['submission_id']
    _update_player_stats(cursor, player_id, stages[data['stage_key']]['chapter'])
    _log_attempt(cursor, player_id, submission_id, data, earned_xp)
    progress = read_progress(cursor, player_id)
    if data['result'] == 'Success':
        cursor.execute('''UPDATE public.game_progress SET current_level = %s, last_played = NOW()
                          WHERE player_id = %s''', (progress['level'], player_id))
        if cursor.rowcount == 0:
            cursor.execute('''INSERT INTO public.game_progress (player_id, current_level, last_played)
                              VALUES (%s, %s, NOW())''', (player_id, progress['level']))
        if earned_xp:
            cursor.execute('''UPDATE public.game_progress
                              SET high_score = COALESCE(high_score, 0) + %s
                              WHERE player_id = %s''', (earned_xp, player_id))
        conditions = [f'{CATALOG}:region:{r}' for r in progress['completedRegions']]
        if '1-1' in progress['completedStages']:
            conditions.append(f'{CATALOG}:stage:1-1')
        if len(progress['completedStages']) == len(stages):
            conditions.append(f'{CATALOG}:all')
        cursor.execute('''INSERT INTO public.player_achievements (player_id, achievement_id)
                          SELECT %s, achievement_id FROM public.achievements WHERE unlock_condition = ANY(%s)
                          ON CONFLICT (player_id, achievement_id) DO NOTHING''', (player_id, conditions))
        progress = read_progress(cursor, player_id)
    return {'submission_id': submission_id, 'progress': progress,
            'earnedXP': earned_xp, 'appliedBonuses': applied_bonuses}


def _update_player_stats(cursor, player_id, current_level):
    """Keep the legacy stats table current without requiring a new unique key."""
    cursor.execute('''UPDATE public.player_stats
                      SET current_level = %s, last_played = NOW()
                      WHERE player_id = %s''', (current_level, player_id))
    if cursor.rowcount == 0:
        cursor.execute('''INSERT INTO public.player_stats (player_id, current_level, last_played)
                          VALUES (%s, %s, NOW())''', (player_id, current_level))


def _log_attempt(cursor, player_id, submission_id, data, earned_xp=0):
    """Append a readable attempt event once, using its existing submission ID."""
    action = f'stage_attempt:{submission_id}'
    detail = json.dumps({
        'stage_key': data['stage_key'],
        'result': data['result'],
        'runtime_seconds': data['runtime'],
        'earned_xp': earned_xp,
    }, separators=(',', ':'), sort_keys=True)
    cursor.execute('''INSERT INTO public.game_logs (player_id, action, detail, created_at)
                      SELECT %s, %s, %s, NOW()
                      WHERE NOT EXISTS (
                          SELECT 1 FROM public.game_logs WHERE player_id = %s AND action = %s
                      )''', (player_id, action, detail, player_id, action))
