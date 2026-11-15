export const PASSWORD_RULES = [
  { key: 'length', label: '6 to 128 characters', test: password => [...password].length >= 6 && [...password].length <= 128 },
  { key: 'upper', label: 'An uppercase letter (A-Z)', test: password => /[A-Z]/.test(password) },
  { key: 'lower', label: 'A lowercase letter (a-z)', test: password => /[a-z]/.test(password) },
  { key: 'number', label: 'A number (0-9)', test: password => /[0-9]/.test(password) },
  { key: 'symbol', label: 'A symbol (such as !, @, $, or /)', test: password => /[\p{P}\p{S}]/u.test(password) },
];

export const passwordChecks = password => PASSWORD_RULES.map(rule => ({
  key: rule.key,
  label: rule.label,
  met: rule.test(password),
}));

export const isValidPassword = password => passwordChecks(password).every(check => check.met);
