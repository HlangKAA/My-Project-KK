"""Rules for passwords chosen during signup and reset."""

import re
import unicodedata


def password_error(password):
    if not isinstance(password, str):
        return 'Password must be text.'

    length = len(password)
    missing = []
    if not 6 <= length <= 128:
        missing.append('6 to 128 characters')
    if not re.search(r'[A-Z]', password):
        missing.append('an uppercase letter')
    if not re.search(r'[a-z]', password):
        missing.append('a lowercase letter')
    if not re.search(r'[0-9]', password):
        missing.append('a number')
    if not any(unicodedata.category(char).startswith(('P', 'S')) for char in password):
        missing.append('a symbol')

    if missing:
        return 'Password needs ' + ', '.join(missing) + '.'
    return None
