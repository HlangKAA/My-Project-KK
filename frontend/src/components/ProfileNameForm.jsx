import { useEffect, useId, useState } from 'react';
import { useGame } from '../context/GameContext';

export default function ProfileNameForm() {
    const { user, updateProfile } = useGame();
    const inputId = useId();
    const [name, setName] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => setName(user?.username || ''), [user?.username]);

    const save = async event => {
        event.preventDefault();
        if (saving) return;
        setError('');
        setMessage('');
        const trimmed = name.trim();
        if (!trimmed || trimmed.length > 50) {
            setError('Enter a player name of 1–50 characters.');
            return;
        }
        setSaving(true);
        try {
            const result = await updateProfile(trimmed);
            setName(result.user.username);
            setMessage('Player name saved.');
        } catch (failure) {
            setError(failure.response?.data?.message || 'Unable to save your name. Please retry.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="profile-name-form" onSubmit={save} aria-busy={saving}>
            <label htmlFor={inputId}>Player name</label>
            <div className="profile-name-controls">
                <input id={inputId} value={name} required maxLength={50} disabled={saving}
                    autoComplete="nickname" onChange={event => {
                        setName(event.target.value);
                        setMessage('');
                        setError('');
                    }} />
                <button type="submit" disabled={saving || name.trim() === user?.username}>
                    {saving ? 'Saving…' : 'Save name'}
                </button>
            </div>
            {error && <p role="alert">{error}</p>}
            <p role="status">{message}</p>
        </form>
    );
}
