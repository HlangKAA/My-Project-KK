import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../i18n/useLanguage';
import useCharacterProgression from '../hooks/useCharacterProgression';
import ProfileNameForm from '../components/ProfileNameForm';
import { SPELLS } from '../data/characterData';
import './profilepage.css';

const dateLabel = value => value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
    : 'Not completed';

export default function ProfilePage() {
    const { user, deleteAccount } = useGame();
    const { isThai } = useLanguage();
    const navigate = useNavigate();
    const { character, levelProgress } = useCharacterProgression();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const passwordRef = useRef(null);

    useEffect(() => {
        let active = true;
        api.get('/api/profile/history')
            .then(response => { if (active) setHistory(response.data.history); })
            .catch(failure => {
                if (active) setError(failure.response?.data?.message || 'Could not load stage history. Please retry.');
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!showDelete) return undefined;
        passwordRef.current?.focus();
        const onEscape = event => {
            if (event.key === 'Escape' && !deleting) {
                setShowDelete(false);
                setDeletePassword('');
                setDeleteError('');
            }
        };
        window.addEventListener('keydown', onEscape);
        return () => window.removeEventListener('keydown', onEscape);
    }, [showDelete, deleting]);

    const closeDeleteDialog = () => {
        if (deleting) return;
        setShowDelete(false);
        setDeletePassword('');
        setDeleteError('');
    };

    const handleDelete = async event => {
        event.preventDefault();
        if (deleting) return;
        if (!deletePassword) {
            setDeleteError(isThai ? 'ใส่รหัสผ่านปัจจุบันก่อนนะ' : 'Enter your current password.');
            return;
        }
        setDeleting(true);
        setDeleteError('');
        try {
            await deleteAccount(deletePassword);
            navigate('/login', { replace: true });
        } catch (failure) {
            setDeletePassword('');
            setDeleteError(isThai
                ? (failure.response?.status === 403 ? 'รหัสผ่านไม่ถูกต้อง ลองอีกครั้งนะ' : 'ลบบัญชีไม่สำเร็จ ลองอีกครั้งนะ')
                : (failure.response?.data?.message || 'Could not delete your account. Please retry.'));
        } finally {
            setDeleting(false);
        }
    };

    const successfulCount = history.filter(row => row.completed_at).length;

    return (
        <main className="profile-page">
            <header className="profile-page-header">
                <Link className="profile-back" to="/dashboard"><i className="fas fa-arrow-left" /> World Map</Link>
                <h1>Player Profile</h1>
            </header>
            <section className="profile-card" aria-label="Player details">
                <div className="profile-summary">
                    <div className="profile-emblem" aria-hidden="true"><i className="fas fa-hat-wizard" /></div>
                    <div>
                        <p className="profile-kicker">{levelProgress.current?.title || 'Novice'}</p>
                        <h2>{user?.username || 'Explorer'}</h2>
                        <p>Level {levelProgress.current?.level || 1} · {character.xp} XP</p>
                        <div className="profile-xp-track" aria-label={`${levelProgress.progress}% to next level`}>
                            <div style={{ width: `${levelProgress.progress}%` }} />
                        </div>
                    </div>
                </div>
                <ProfileNameForm />
                <div className="profile-stats">
                    <div><strong>{successfulCount}</strong><span>Stages passed</span></div>
                    <div><strong>{history.reduce((sum, row) => sum + row.attempts, 0)}</strong><span>Total attempts</span></div>
                    <div><strong>{character.unlockedSpells?.length || 0}</strong><span>Spells unlocked</span></div>
                </div>
                <div className="profile-account-corner">
                    <button type="button" className="profile-delete-entry" onClick={() => setShowDelete(true)}>
                        {isThai ? 'ลบบัญชี' : 'Delete account'}
                    </button>
                </div>
            </section>

            <section className="profile-collections" aria-label="Collected progress">
                <article className="profile-collection-card">
                    <h2>Unlocked spells</h2>
                    {character.unlockedSpells?.length ? (
                        <ul>{character.unlockedSpells.map(key => <li key={key}>{SPELLS[key]?.name || key}</li>)}</ul>
                    ) : <p>Complete stages to unlock your first spell.</p>}
                </article>
                <article className="profile-collection-card">
                    <h2>Mastered concepts</h2>
                    {character.conceptsMastered?.length
                        ? <ul>{character.conceptsMastered.map(concept => <li key={concept}>{concept}</li>)}</ul>
                        : <p>Complete stages to master new concepts.</p>}
                </article>
            </section>

            <section className="profile-history" aria-labelledby="profile-history-title">
                <h2 id="profile-history-title">Stage history</h2>
                {loading && <p role="status">Loading stage history…</p>}
                {error && <p role="alert">{error}</p>}
                {!loading && !error && history.length === 0 && <p>No attempts yet. Play a stage to start your history.</p>}
                <div className="profile-history-list">
                    {history.map(row => {
                        const stageXP = character.completedStages?.[row.stage_key]?.xp || 0;
                        return (
                            <article className="profile-history-row" key={row.stage_key}>
                                <div className="profile-stage-heading">
                                    <div><h3>{row.stage_name}</h3><p>Stage {row.stage_key}</p></div>
                                    <span className={row.completed_at ? 'profile-result passed' : 'profile-result'}>
                                        {row.completed_at ? 'Passed' : 'In progress'}
                                    </span>
                                </div>
                                <dl>
                                    <div><dt>Attempts</dt><dd>{row.attempts}</dd></div>
                                    <div><dt>Completed</dt><dd>{dateLabel(row.completed_at)}</dd></div>
                                    <div><dt>XP earned</dt><dd>{row.completed_at ? `${stageXP} XP` : '—'}</dd></div>
                                    <div><dt>Average run</dt><dd>{row.average_runtime}s</dd></div>
                                </dl>
                                <Link className="profile-replay" to={`/region/${row.stage_key.split('-')[0]}/stage/${row.stage_key.split('-')[1]}`}>
                                    {row.completed_at ? 'Replay stage' : 'Continue stage'}
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </section>
            {showDelete && (
                <div className="profile-delete-backdrop">
                    <section className="profile-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-delete-title" aria-describedby="profile-delete-description">
                        <h2 id="profile-delete-title">{isThai ? 'ลบบัญชีถาวร' : 'Delete account permanently'}</h2>
                        <p id="profile-delete-description">{isThai
                            ? 'บัญชี ด่านที่ผ่าน โค้ดที่ส่ง คะแนน และรางวัลทั้งหมดจะถูกลบถาวร และกู้คืนไม่ได้'
                            : 'Your account, stage progress, code submissions, score, and achievements will be permanently deleted. This cannot be undone.'}</p>
                        <form onSubmit={handleDelete}>
                            <label htmlFor="profile-delete-password">{isThai ? 'ยืนยันด้วยรหัสผ่านปัจจุบัน' : 'Confirm with your current password'}</label>
                            <input id="profile-delete-password" ref={passwordRef} type="password" autoComplete="current-password"
                                value={deletePassword} onChange={event => setDeletePassword(event.target.value)} disabled={deleting} required />
                            {deleteError && <p className="profile-delete-error" role="alert">{deleteError}</p>}
                            <div className="profile-delete-actions">
                                <button type="button" className="profile-delete-cancel" onClick={closeDeleteDialog} disabled={deleting}>
                                    {isThai ? 'ยกเลิก' : 'Cancel'}
                                </button>
                                <button type="submit" className="profile-delete-confirm" disabled={deleting || !deletePassword}>
                                    {deleting ? (isThai ? 'กำลังลบ...' : 'Deleting...') : (isThai ? 'ลบบัญชีถาวร' : 'Delete permanently')}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}
