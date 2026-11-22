"""OpenAPI description of the React game's Flask JSON endpoints.

Keep this document aligned with auth/routes.py and game/routes.py. The stage
result is evaluated by the browser; the API validates and stores the report.
"""


def ref(name):
    return {'$ref': f'#/components/schemas/{name}'}


def json_body(schema):
    return {'required': True, 'content': {'application/json': {'schema': schema}}}


def response(description, schema=None):
    result = {'description': description}
    if schema is not None:
        result['content'] = {'application/json': {'schema': schema}}
    return result


def success(**fields):
    return {'type': 'object', 'properties': {'success': {'type': 'boolean'}, **fields}}


def operation(tag, summary, responses, body=None, authenticated=False, description=None):
    result = {'tags': [tag], 'summary': summary, 'responses': responses}
    if body is not None:
        result['requestBody'] = json_body(body)
    if authenticated:
        result['security'] = [{'sessionCookie': []}]
    if description:
        result['description'] = description
    return result


ERROR = response('Request failed; see message.', ref('Error'))
UNAUTHORIZED = response('No valid login session.', ref('Error'))
UNAVAILABLE = response('Database or save operation unavailable.', ref('Error'))

SCHEMAS = {
    'Error': {
        'type': 'object',
        'properties': {'success': {'type': 'boolean'}, 'message': {'type': 'string'}},
    },
    'Account': {
        'type': 'object',
        'required': ['player_id', 'username', 'email'],
        'properties': {
            'player_id': {'type': 'integer'}, 'username': {'type': 'string'},
            'email': {'type': 'string', 'format': 'email'},
            'onboarding_step': {'type': 'integer', 'minimum': 0, 'maximum': 2},
        },
    },
    'CompletedStage': {
        'type': 'object',
        'properties': {
            'completedAt': {'type': 'string', 'format': 'date-time'},
            'xp': {'type': 'integer'},
        },
    },
    'Achievement': {
        'type': 'object',
        'properties': {
            'achievement_id': {'type': 'integer'}, 'title': {'type': 'string'},
            'description': {'type': 'string'},
            'unlocked_at': {'type': 'string', 'format': 'date-time'},
        },
    },
    'AchievementStatus': {
        'type': 'object',
        'properties': {
            'achievement_id': {'type': 'integer'}, 'title': {'type': 'string'},
            'description': {'type': 'string'}, 'unlocked': {'type': 'boolean'},
            'unlockedAt': {'type': 'string', 'format': 'date-time', 'nullable': True},
            'completedCount': {'type': 'integer'}, 'requiredCount': {'type': 'integer'},
        },
    },
    'Progress': {
        'type': 'object',
        'properties': {
            'level_id': {'type': 'integer', 'nullable': True,
                         'description': 'Database ID of the next unfinished playable stage, or null when all are complete.'},
            'stageProgress': {'type': 'object', 'additionalProperties': {'type': 'integer'}},
            'completedStages': {'type': 'object', 'additionalProperties': ref('CompletedStage')},
            'completedRegions': {'type': 'array', 'items': {'type': 'integer'}},
            'achievements': {'type': 'array', 'items': ref('Achievement')},
            'achievementCatalog': {'type': 'array', 'items': ref('AchievementStatus')},
            'highScore': {'type': 'integer', 'description': 'Server-saved total XP.'},
        },
    },
    'LeaderboardEntry': {
        'type': 'object',
        'properties': {
            'player_id': {'type': 'integer'}, 'username': {'type': 'string'},
            'completed_stages': {'type': 'integer'}, 'score': {'type': 'integer'},
            'rank': {'type': 'integer'},
        },
    },
    'StageHistory': {
        'type': 'object',
        'properties': {
            'stage_key': {'type': 'string'}, 'stage_name': {'type': 'string'},
            'attempts': {'type': 'integer'}, 'successful_attempts': {'type': 'integer'},
            'first_attempt_at': {'type': 'string', 'format': 'date-time', 'nullable': True},
            'last_attempt_at': {'type': 'string', 'format': 'date-time', 'nullable': True},
            'completed_at': {'type': 'string', 'format': 'date-time', 'nullable': True},
            'average_runtime': {'type': 'number'},
        },
    },
    'Submission': {
        'type': 'object',
        'required': ['stage_key', 'code', 'result', 'runtime', 'submitted_at'],
        'properties': {
            'stage_key': {'type': 'string', 'example': '1-1'},
            'code': {'type': 'string', 'maxLength': 100000},
            'result': {'type': 'string', 'enum': ['Success', 'Fail', 'Error']},
            'runtime': {'type': 'number', 'minimum': 0, 'maximum': 86400, 'description': 'Seconds.'},
            'submitted_at': {'type': 'string', 'format': 'date-time', 'description': 'UTC timestamp.'},
            'hints_used': {'type': 'integer', 'minimum': 0, 'maximum': 100},
        },
        'description': 'The browser evaluates the puzzle and reports the result. Player identity comes from the Flask session.',
    },
    'AppliedBonus': {
        'type': 'object',
        'properties': {
            'key': {'type': 'string'}, 'label': {'type': 'string'},
            'icon': {'type': 'string'}, 'bonusXP': {'type': 'integer'},
        },
    },
}

OPENAPI_SPEC = {
    'openapi': '3.0.3',
    'info': {
        'title': 'The Lost Spectrum API',
        'version': '1.0.0',
        'description': (
            'Flask API used by the React game. Login uses a Flask session cookie. '
            'For authenticated Try it out requests, sign in to the game in this browser '
            'and open /api/docs on the same host. Swagger UI cannot set a Cookie header manually. '
            'Stage code runs and is judged in the browser; this API persists the reported result.'
        ),
    },
    'servers': [{'url': '/', 'description': 'Same origin as this documentation'}],
    'tags': [
        {'name': 'Account', 'description': 'Registration, login, recovery, and account management.'},
        {'name': 'Game', 'description': 'Stage submissions, progress, and history.'},
        {'name': 'Leaderboard', 'description': 'Ranked players with at least one cleared stage.'},
    ],
    'components': {
        'securitySchemes': {
            'sessionCookie': {
                'type': 'apiKey', 'in': 'cookie', 'name': 'session',
                'description': 'Flask session cookie set by POST /api/login. Browser sends it automatically on same-origin requests.',
            },
        },
        'schemas': SCHEMAS,
    },
    'paths': {
        '/api/signup': {'post': operation('Account', 'Create an account', {
            '201': response('Account created.', success(message={'type': 'string'}, player_id={'type': 'integer'}, email_sent={'type': 'boolean'})),
            '400': ERROR, '409': ERROR, '500': ERROR,
        }, body={'type': 'object', 'required': ['name', 'email', 'password'], 'properties': {
            'name': {'type': 'string'}, 'email': {'type': 'string', 'format': 'email'},
            'password': {'type': 'string', 'format': 'password'},
        }}, description='Current backend creates the account as verified; email verification is not enforced at login.')},
        '/api/login': {'post': operation('Account', 'Log in and create a session', {
            '200': response('Login successful.', success(message={'type': 'string'}, user=ref('Account'))),
            '400': ERROR, '401': ERROR, '500': ERROR,
        }, body={'type': 'object', 'required': ['email', 'password'], 'properties': {
            'email': {'type': 'string', 'format': 'email'}, 'password': {'type': 'string', 'format': 'password'},
        }})},
        '/api/forgot-password': {'post': operation('Account', 'Request a password reset email', {
            '200': response('Generic acknowledgement, whether or not the email exists.', success(message={'type': 'string'})),
            '400': ERROR, '500': ERROR,
        }, body={'type': 'object', 'required': ['email'], 'properties': {
            'email': {'type': 'string', 'format': 'email'},
        }})},
        '/api/reset-password': {'post': operation('Account', 'Reset password with an email token', {
            '200': response('Password updated.', success(message={'type': 'string'})),
            '400': ERROR, '500': ERROR,
        }, body={'type': 'object', 'required': ['token', 'password'], 'properties': {
            'token': {'type': 'string'}, 'password': {'type': 'string', 'format': 'password'},
        }})},
        '/api/logout': {'post': operation('Account', 'Clear the login session', {
            '200': response('Logged out.', success(message={'type': 'string'})),
        })},
        '/api/user': {'get': operation('Account', 'Read the current account', {
            '200': response('Current account.', success(user=ref('Account'))),
            '401': UNAUTHORIZED, '503': UNAVAILABLE,
        }, authenticated=True)},
        '/api/onboarding': {'patch': operation('Account', 'Advance the introduction or tutorial', {
            '200': response('Saved onboarding step.', success(onboarding_step={'type': 'integer'})),
            '400': ERROR, '401': UNAUTHORIZED, '503': UNAVAILABLE,
        }, body={'type': 'object', 'required': ['step'], 'properties': {
            'step': {'type': 'integer', 'enum': [1, 2]},
        }}, authenticated=True)},
        '/api/profile': {'patch': operation('Account', 'Change the player name', {
            '200': response('Updated account.', success(user=ref('Account'))),
            '400': ERROR, '401': UNAUTHORIZED, '409': ERROR, '503': UNAVAILABLE,
        }, body={'type': 'object', 'required': ['username'], 'properties': {
            'username': {'type': 'string', 'minLength': 1, 'maxLength': 50},
        }}, authenticated=True)},
        '/api/account': {'delete': operation('Account', 'Permanently delete the current account', {
            '200': response('Account deleted.', success()),
            '400': ERROR, '401': UNAUTHORIZED, '403': ERROR, '503': UNAVAILABLE,
        }, body={'type': 'object', 'required': ['password'], 'properties': {
            'password': {'type': 'string', 'format': 'password'},
        }}, authenticated=True, description='Deletes the account and related player data after checking the current password.')},
        '/api/progress': {'get': operation('Game', 'Load completed stages, XP, and achievements', {
            '200': response('Saved progress.', success(progress=ref('Progress'))),
            '401': UNAUTHORIZED, '503': UNAVAILABLE,
        }, authenticated=True)},
        '/api/profile/history': {'get': operation('Game', 'Load stage attempt history', {
            '200': response('Attempts grouped by stage.', success(history={'type': 'array', 'items': ref('StageHistory')})),
            '401': UNAUTHORIZED, '503': UNAVAILABLE,
        }, authenticated=True)},
        '/api/submissions': {'post': operation('Game', 'Save a stage attempt', {
            '200': response('Attempt saved and progress refreshed.', success(
                submission_id={'type': 'integer'}, progress=ref('Progress'), earnedXP={'type': 'integer'},
                appliedBonuses={'type': 'array', 'items': ref('AppliedBonus')},
            )),
            '400': ERROR, '401': UNAUTHORIZED, '409': ERROR, '503': UNAVAILABLE,
        }, body=ref('Submission'), authenticated=True,
            description='The server validates the stage key and attempt format, then calculates first-clear XP. It does not rerun the Python code.')},
        '/api/leaderboard': {'get': operation('Leaderboard', 'Read the top 20 and your own rank', {
            '200': response('Ranked players with at least one playable stage clear.', success(
                entries={'type': 'array', 'items': ref('LeaderboardEntry')},
                me={'type': 'object', 'allOf': [ref('LeaderboardEntry')], 'nullable': True},
            )),
            '401': UNAUTHORIZED, '503': UNAVAILABLE,
        }, authenticated=True)},
    },
}
