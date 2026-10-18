"""Run unit tests normally; pass --live to test committed writes in Supabase.

Live tests create two isolated temporary players and delete only their records
in tearDownClass. No schema, policies, or existing player data are modified.
"""
import sys
import unittest
import json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch
from uuid import uuid4

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from app.db import get_db_connection
from app.game.progress import STAGES, validate_submission, save_submission
from werkzeug.security import generate_password_hash

LIVE = '--live' in sys.argv
if LIVE:
    sys.argv.remove('--live')


def attempt(stage='1-1', result='Success'):
    return {'stage_key': stage, 'code': 'print("persistence test")', 'result': result,
            'runtime': 0.1, 'submitted_at': datetime.now(timezone.utc).isoformat()}


class ValidationTests(unittest.TestCase):
    def test_rejects_invalid_input(self):
        for change in ({'stage_key': '99-1'}, {'stage_key': []}, {'result': 'pending'}, {'runtime': float('nan')},
                       {'runtime': True}, {'runtime': -1}, {'code': None}, {'submitted_at': 'bad'}):
            with self.subTest(change=change), self.assertRaises(ValueError):
                validate_submission({**attempt(), **change})
        with self.assertRaises(ValueError):
            validate_submission(None)

    def test_normalizes_timestamp(self):
        self.assertIsNone(validate_submission(attempt())['submitted_at'].tzinfo)

    def test_auth_required(self):
        with app.test_client() as client:
            self.assertEqual(client.get('/api/progress').status_code, 401)
            self.assertEqual(client.post('/api/submissions', json=attempt()).status_code, 401)


@unittest.skipUnless(LIVE, 'Use --live to run against configured Supabase')
class LivePersistenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ids = []
        cls.password = uuid4().hex
        cls.tag = uuid4().hex[:12]
        cls.emails = [f'progress-test-{cls.tag}-{n}@example.invalid' for n in range(2)]
        conn = get_db_connection()
        if conn is None:
            raise RuntimeError('Cannot connect to Supabase')
        try:
            with conn:
                with conn.cursor() as cursor:
                    for n, email in enumerate(cls.emails):
                        cursor.execute('''INSERT INTO public.players (username, email, password, is_verified)
                                          VALUES (%s, %s, %s, TRUE) RETURNING player_id''',
                                       (f'progress-test-{cls.tag}-{n}', email, generate_password_hash(cls.password)))
                        cls.ids.append(cursor.fetchone()['player_id'])
        finally:
            conn.close()

    @classmethod
    def tearDownClass(cls):
        conn = get_db_connection()
        try:
            with conn:
                with conn.cursor() as cursor:
                    for table in ('player_achievements', 'game_logs', 'code_submissions', 'game_progress', 'player_stats'):
                        cursor.execute(f'DELETE FROM public.{table} WHERE player_id = ANY(%s)', (cls.ids,))
                    cursor.execute('DELETE FROM public.players WHERE player_id = ANY(%s) AND username LIKE %s',
                                   (cls.ids, f'progress-test-{cls.tag}-%'))
        finally:
            conn.close()

    def login(self, index=0):
        client = app.test_client()
        response = client.post('/api/login', json={'email': self.emails[index], 'password': self.password})
        self.assertEqual(response.status_code, 200, response.json)
        return client

    def count(self, table, player=0):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT count(*) AS total FROM public.{table} WHERE player_id = %s', (self.ids[player],))
                return cursor.fetchone()['total']
        finally:
            conn.close()

    def test_full_persistence_flow(self):
        client = self.login()
        # Failures and runtime errors are saved without unlocking a stage.
        for result in ('Fail', 'Error'):
            response = client.post('/api/submissions', json=attempt(result=result))
            self.assertEqual(response.status_code, 200, response.json)
            self.assertEqual(response.json['progress']['completedStages'], {})
        self.assertEqual(self.count('game_progress'), 0)
        self.assertEqual(self.count('player_stats'), 1)
        self.assertEqual(self.count('game_logs'), 2)
        # Player identity from the request body must be ignored.
        payload = {**attempt(), 'player_id': self.ids[1]}
        first = client.post('/api/submissions', json=payload)
        self.assertEqual(first.status_code, 200, first.json)
        self.assertIn('1-1', first.json['progress']['completedStages'])
        self.assertEqual(self.count('player_achievements'), 1)
        self.assertEqual(self.count('code_submissions', player=1), 0)
        duplicate = client.post('/api/submissions', json=payload)
        self.assertEqual(first.json['submission_id'], duplicate.json['submission_id'])
        self.assertEqual(self.count('code_submissions'), 3)
        self.assertEqual(self.count('game_logs'), 3)
        self.assertEqual(self.count('player_stats'), 1)
        # A fresh run is another submission, but it must not duplicate awards/progress.
        replay = client.post('/api/submissions', json=attempt())
        self.assertEqual(replay.status_code, 200, replay.json)
        self.assertEqual(self.count('player_achievements'), 1)
        self.assertEqual(self.count('game_progress'), 1)
        self.assertEqual(self.count('player_stats'), 1)
        self.assertEqual(self.count('game_logs'), 4)
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute('SELECT current_level FROM public.player_stats WHERE player_id = %s', (self.ids[0],))
                self.assertEqual(cursor.fetchone()['current_level'], 1)
                cursor.execute('SELECT action, detail FROM public.game_logs WHERE player_id = %s ORDER BY log_id', (self.ids[0],))
                events = cursor.fetchall()
                self.assertTrue(all(row['action'].startswith('stage_attempt:') for row in events))
                self.assertEqual(json.loads(events[-1]['detail'])['stage_key'], '1-1')
        finally:
            conn.close()
        # Exercise all playable stages and all six new achievement rules.
        for stage in STAGES:
            if stage == '1-1':
                continue
            response = client.post('/api/submissions', json=attempt(stage))
            self.assertEqual(response.status_code, 200, response.json)
        fresh_client = self.login()
        progress = fresh_client.get('/api/progress').json['progress']
        self.assertEqual(len(progress['completedStages']), 18)
        self.assertEqual(progress['level'], 5)
        self.assertEqual(progress['stageProgress'], {'1': 4, '2': 2, '3': 6, '4': 6})
        self.assertEqual(len(progress['achievements']), 6)
        self.assertEqual(self.count('player_stats'), 1)
        self.assertEqual(self.count('game_logs'), 21)
        self.assertEqual(self.login(1).get('/api/progress').json['progress']['completedStages'], {})
        # A mid-transaction error must roll back the submission, too.
        before = self.count('code_submissions')
        def fail_after_write(*args):
            save_submission(*args)
            raise RuntimeError('Intentional rollback test')
        with patch('app.game.routes.save_submission', side_effect=fail_after_write):
            response = client.post('/api/submissions', json=attempt())
        self.assertEqual(response.status_code, 503)
        self.assertEqual(self.count('code_submissions'), before)
        # Concurrent first completions must not create two game_progress rows.
        def submit(stage):
            with app.test_client() as worker:
                with worker.session_transaction() as session:
                    session['player_id'] = self.ids[1]
                return worker.post('/api/submissions', json=attempt(stage)).status_code
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(list(pool.map(submit, ('1-1', '1-2'))), [200, 200])
        self.assertEqual(self.count('game_progress', player=1), 1)
        self.assertEqual(self.count('player_stats', player=1), 1)
        self.assertEqual(self.count('game_logs', player=1), 2)


if __name__ == '__main__':
    unittest.main(verbosity=2)
