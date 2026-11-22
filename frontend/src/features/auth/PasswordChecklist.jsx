import { passwordChecks } from './passwordPolicy';

const PasswordChecklist = ({ password }) => (
  <ul className="auth-password-checklist" aria-label="Password requirements">
    {passwordChecks(password).map(check => (
      <li key={check.key} className={check.met ? 'met' : ''}>
        <i className={`fas ${check.met ? 'fa-check-circle' : 'fa-circle'}`} aria-hidden="true" />
        {check.label}
      </li>
    ))}
  </ul>
);

export default PasswordChecklist;
