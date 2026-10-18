import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app
from psycopg2.errors import UniqueViolation


class ProfileTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        with self.client.session_transaction() as session:
            session['player_id'] = 11
            session['username'] = 'Old name'
        self.connection = MagicMock()
        self.cursor = self.connection.cursor.return_value.__enter__.return_value
        self.mock_db = patch('app.auth.routes.get_db_connection', return_value=self.connection)
        self.mock_db.start()
        self.addCleanup(self.mock_db.stop)

    def test_requires_login(self):
        self.assertEqual(app.test_client().patch('/api/profile', json={'username': 'Name'}).status_code, 401)

    def test_invalid_names(self):
        for name in (None, [], '', '   ', 'x' * 51, 'a\nb'):
            with self.subTest(name=name):
                self.assertEqual(self.client.patch('/api/profile', json={'username': name}).status_code, 400)
        self.cursor.execute.assert_not_called()

    def test_updates_only_session_owner(self):
        self.cursor.fetchone.side_effect = [None, {'player_id': 11, 'username': 'New name', 'email': 'a@example.invalid'}]
        response = self.client.patch('/api/profile', json={'username': ' New name ', 'player_id': 22})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.cursor.execute.call_args.args[1], ('New name', 11))
        with self.client.session_transaction() as session:
            self.assertEqual(session['username'], 'New name')
        self.connection.close.assert_called_once()

    def test_duplicate_name(self):
        self.cursor.fetchone.return_value = {'player_id': 22}
        self.assertEqual(self.client.patch('/api/profile', json={'username': 'Taken'}).status_code, 409)
        self.assertEqual(self.cursor.execute.call_count, 1)

    def test_duplicate_race(self):
        self.cursor.fetchone.return_value = None
        self.cursor.execute.side_effect = [None, UniqueViolation()]
        self.assertEqual(self.client.patch('/api/profile', json={'username': 'Taken'}).status_code, 409)
        with self.client.session_transaction() as session:
            self.assertEqual(session['username'], 'Old name')

    def test_unavailable_database(self):
        with patch('app.auth.routes.get_db_connection', return_value=None):
            self.assertEqual(self.client.patch('/api/profile', json={'username': 'Name'}).status_code, 503)

    def test_profile_reads_current_database_name(self):
        self.cursor.fetchone.return_value = {'player_id': 11, 'username': 'Changed elsewhere', 'email': 'a@example.invalid'}
        response = self.client.get('/api/user')
        self.assertEqual(response.json['user']['username'], 'Changed elsewhere')
        self.assertEqual(self.cursor.execute.call_args.args[1], (11,))


if __name__ == '__main__':
    unittest.main()
