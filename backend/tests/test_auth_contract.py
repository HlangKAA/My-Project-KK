"""Regression checks for the auth routes preserved during the refactor."""
import unittest
from unittest.mock import MagicMock, patch

from app import app
from app.game.progress import _applied_bonuses
from werkzeug.security import generate_password_hash


class AuthenticationContractTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True, SECRET_KEY='test-only-secret')
        self.client = app.test_client()
        self.user = {
            'player_id': 1, 'username': 'Tester', 'email': 'tester@example.invalid',
            'password': generate_password_hash('correct-password'), 'onboarding_step': 0,
        }

    def connection_for(self, *, verified, token):
        connection = MagicMock()
        connection.cursor.return_value.fetchone.return_value = {
            **self.user, 'is_verified': verified, 'verification_token': token,
        }
        return connection

    def test_verified_account_with_old_token_can_log_in(self):
        connection = self.connection_for(verified=True, token='old-token')
        with patch('app.auth.routes.get_db_connection', return_value=connection):
            response = self.client.post('/api/login', json={
                'email': self.user['email'], 'password': 'correct-password',
            })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['success'])

    def test_unverified_account_stays_blocked(self):
        connection = self.connection_for(verified=False, token='pending')
        with patch('app.auth.routes.get_db_connection', return_value=connection):
            response = self.client.post('/api/login', json={
                'email': self.user['email'], 'password': 'correct-password',
            })
        self.assertEqual(response.status_code, 403)
        self.assertTrue(response.json['email_not_verified'])

    def test_verified_account_cannot_resend(self):
        connection = self.connection_for(verified=True, token='old-token')
        with patch('app.auth.routes.get_db_connection', return_value=connection), \
             patch('app.auth.routes.send_verification_email') as send:
            response = self.client.post('/api/resend-verification', json={
                'email': self.user['email'],
            })
        self.assertEqual(response.status_code, 400)
        send.assert_not_called()
        connection.commit.assert_not_called()

    def test_existing_auth_urls_still_redirect_to_react(self):
        for path, destination in (
            ('/login', '/login'), ('/signup', '/register'),
            ('/forgot-password', '/forgot-password'), ('/dashboard', '/dashboard'),
        ):
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 302)
                self.assertTrue(response.headers['Location'].endswith(destination))

    def test_progress_and_submissions_still_require_login(self):
        for path, method in (('/api/progress', 'get'), ('/api/submissions', 'post')):
            with self.subTest(path=path):
                response = getattr(self.client, method)(path)
                self.assertEqual(response.status_code, 401)

    def test_tiered_hint_xp_bonuses_scale_and_hide_when_exhausted(self):
        b0 = _applied_bonuses(150, first_attempt=True, first_clear=True, hints_used=0)
        b1 = _applied_bonuses(150, first_attempt=True, first_clear=True, hints_used=1)
        b2 = _applied_bonuses(150, first_attempt=True, first_clear=True, hints_used=2)
        b3 = _applied_bonuses(150, first_attempt=True, first_clear=True, hints_used=3)

        self.assertEqual([item['bonusXP'] for item in b0], [75, 45])
        self.assertEqual(b0[1]['label'], 'No Hints Used')
        self.assertEqual([item['bonusXP'] for item in b1], [75, 30])
        self.assertEqual(b1[1]['label'], 'Hint Bonus (1/3 Hints Used)')
        self.assertEqual([item['bonusXP'] for item in b2], [75, 15])
        self.assertEqual(b2[1]['label'], 'Hint Bonus (2/3 Hints Used)')
        self.assertEqual([item['bonusXP'] for item in b3], [75])


if __name__ == '__main__':
    unittest.main()
