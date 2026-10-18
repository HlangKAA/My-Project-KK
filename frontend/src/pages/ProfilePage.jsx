import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useGame } from '../context/GameContext';
import useCharacterProgression from '../hooks/useCharacterProgression';
import ProfileNameForm from '../components/ProfileNameForm';
import { SPELLS } from '../data/characterData';
import './profilepage.css';

const dateLabel = value => value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
    : 'Not completed';

export default function ProfilePage() {
    const { user } = useGame();
    const { character, levelProgress } = useCharacterProgression();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        </main>
    );
}
