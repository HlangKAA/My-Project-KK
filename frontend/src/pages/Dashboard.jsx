import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import useCharacterProgression from '../hooks/useCharacterProgression';
import { STAGE_DATA } from '../data/stageData';
import api from '../api/axios';
import WizardProfile from '../components/WizardProfile';
import worldMap from '../assets/images/the-lost-spectrum-world-map.png';
import regionRedForest from '../assets/images/region-red-forest.png';
import regionAshPeaks from '../assets/images/region-ash-peaks.png';
import regionWhisperingCaverns from '../assets/images/region-whispering-caverns.png';
import thescholarsarchive from '../assets/images/the-scholars-archive.png';
import './dashboard.css';

const REGIONS = [
    {
        id: 1,
        name: 'THE RED FOREST',
        image: regionRedForest,
        top: '31%',
        left: '14%',
    },
    {
        id: 2,
        name: "THE SCHOLAR'S ARCHIVE",
        image: thescholarsarchive,
        top: '45%',
        left: '65%',
    },
    {
        id: 3,
        name: 'ASH PEAKS',
        image: regionAshPeaks,
        top: '38%',
        left: '94%',
    },
    {
        id: 4,
        name: 'WHISPERING CAVERNS',
        image: regionWhisperingCaverns,
        top: '70%',
        left: '82%',
    }
];

const Dashboard = () => {
    const { user, logout } = useGame();
    const navigate = useNavigate();
    const { character, levelProgress } = useCharacterProgression();
    const userLevel = user?.level || 1;
    const [activePanel, setActivePanel] = useState(null);
    const [mapZoom, setMapZoom] = useState(1);
    const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('lost-spectrum-reduce-motion') === 'true');
    const [journal, setJournal] = useState({ loading: true, error: '', entries: [] });

    useEffect(() => {
        api.get('/api/profile/history').then(response => {
            setJournal({ loading: false, error: '', entries: response.data.history });
        }).catch(error => {
            setJournal({ loading: false, error: error.response?.data?.message || 'Could not load your journal.', entries: [] });
        });
    }, []);

    const recentJournalEntries = [...journal.entries]
        .sort((a, b) => new Date(b.last_attempt_at || 0) - new Date(a.last_attempt_at || 0))
        .slice(0, 8);

    useEffect(() => {
        if (!activePanel) return undefined;
        const closeOnEscape = event => { if (event.key === 'Escape') setActivePanel(null); };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [activePanel]);

    const changeMotionPreference = enabled => {
        setReduceMotion(enabled);
        localStorage.setItem('lost-spectrum-reduce-motion', String(enabled));
    };

    const getRegionStatus = (regionId) => {
        if (regionId < userLevel) return 'complete';
        if (regionId === userLevel) return 'active';
        return 'locked';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1a0a0a', color: '#f1e8e0' }}>
            {/* ─── Top Navbar ─── */}
            <nav className="dash-navbar">
                <div className="dash-brand">
                    <div className="dash-brand-icon">
                        <i className="fas fa-chess-rook"></i>
                    </div>
                    <span className="dash-brand-text">The Lost Spectrum</span>
                </div>

                <div className="dash-nav-links">
                    <button className={`dash-nav-link ${!activePanel ? 'active' : ''}`} onClick={() => setActivePanel(null)}>
                        <i className="fas fa-map"></i> MAP
                    </button>
                    <button className={`dash-nav-link ${activePanel === 'settings' ? 'active' : ''}`} onClick={() => setActivePanel('settings')}>
                        <i className="fas fa-cog"></i> SETTINGS
                    </button>
                </div>

                <div className="dash-user">
                    <div className="dash-user-info">
                        <div className="dash-user-role">SCHOLAR</div>
                        <div className="dash-user-name">{user?.username || 'Explorer'}</div>
                    </div>
                    <WizardProfile character={character} levelProgress={levelProgress} compact />
                    <button className="dash-logout" onClick={() => navigate('/profile')} title="Open profile" aria-label="Open profile">
                        <i className="fas fa-user-cog"></i>
                    </button>
                    <button className="dash-logout" onClick={logout} title="Disconnect Session">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </nav>

            {/* ─── Main Content ─── */}
            <div className="dash-main">
                {/* ─── Map Area ─── */}
                <div className="dash-map-area">
                    <div className="dash-header">
                        <div className="dash-header-actions">
                            <div>
                                <h1 className="dash-title">Mission Select</h1>
                                <p className="dash-quote">"The path is illuminated only by what you know."</p>
                            </div>
                            <button className="dash-view-btn" onClick={() => setActivePanel('legends')}>
                                <i className="fas fa-scroll"></i> VIEW LEGENDS
                            </button>
                        </div>
                    </div>

                    <div className="dash-map">
                        <div className="dash-map-search">
                            <input type="text" placeholder="Search regions..." />
                        </div>

                        <div className={`dash-map-world ${reduceMotion ? 'reduce-motion' : ''}`} style={{ backgroundImage: `url(${worldMap})`, transform: `scale(${mapZoom})` }}>
                        {/* Region Nodes */}
                        {REGIONS.map((region) => {
                            const status = getRegionStatus(region.id);
                            return (
                                <Link
                                    key={region.id}
                                    to={status !== 'locked' ? `/region/${region.id}` : '#'}
                                    className={`dash-region ${status}`}
                                    style={{ top: region.top, left: region.left }}
                                    aria-label={`Open ${region.name}`}
                                    title={region.name}
                                    onClick={(e) => status === 'locked' && e.preventDefault()}
                                >
                                    <span className={`dash-region-icon ${status}`} aria-hidden="true">
                                        <img src={region.image} alt="" />
                                        {status === 'locked' && <span className="dash-region-badge lock"><i className="fas fa-lock" /></span>}
                                        {status === 'complete' && <span className="dash-region-badge check"><i className="fas fa-check" /></span>}
                                    </span>
                                    <span className="sr-only">{region.name} — {status}</span>
                                </Link>
                            );
                        })}
                        </div>

                        {/* Map Controls */}
                        <div className="dash-map-controls">
                            <button className="dash-map-ctrl-btn" aria-label="Zoom in" title="Zoom in" onClick={() => setMapZoom(zoom => Math.min(1.6, Number((zoom + 0.15).toFixed(2))))} disabled={mapZoom >= 1.6}><i className="fas fa-plus"></i></button>
                            <button className="dash-map-ctrl-btn" aria-label="Zoom out" title="Zoom out" onClick={() => setMapZoom(zoom => Math.max(0.8, Number((zoom - 0.15).toFixed(2))))} disabled={mapZoom <= 0.8}><i className="fas fa-minus"></i></button>
                            <button className="dash-map-ctrl-btn" style={{ marginTop: '0.5rem' }} aria-label="Reset map view" title="Reset map view" onClick={() => setMapZoom(1)}>
                                <i className="fas fa-crosshairs"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Sidebar: Essence Inventory ─── */}
                <aside className="dash-sidebar">
                    <h2 className="dash-sidebar-title">
                        <i className="fas fa-book-open"></i> Journal
                    </h2>
                    <p className="dash-journal-intro">Recent stage attempts and progress.</p>
                    {journal.loading && <p role="status">Loading journal…</p>}
                    {journal.error && <p role="alert">{journal.error}</p>}
                    {!journal.loading && !journal.error && recentJournalEntries.length === 0 && (
                        <p className="dash-journal-empty">No attempts yet. Your stage activity will appear here.</p>
                    )}
                    {!journal.error && recentJournalEntries.map(entry => (
                        <Link className="dash-journal-entry" key={entry.stage_key}
                            to={`/region/${entry.stage_key.split('-')[0]}/stage/${entry.stage_key.split('-')[1]}`}>
                            <span className="dash-journal-entry-copy">
                                <strong>{entry.stage_name}</strong>
                                <small>Stage {entry.stage_key} · {entry.attempts} attempt{entry.attempts === 1 ? '' : 's'}</small>
                            </span>
                            <span className={entry.completed_at ? 'dash-journal-status complete' : 'dash-journal-status'}>
                                {entry.completed_at ? 'Passed' : 'In progress'}
                            </span>
                        </Link>
                    ))}
                    <Link className="dash-journal-all" to="/profile">View full history <i className="fas fa-arrow-right" /></Link>
                </aside>
            </div>
            {activePanel && (
                <div className="dash-panel-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setActivePanel(null); }}>
                    <section className="dash-panel" role="dialog" aria-modal="true"
                        aria-labelledby="dash-panel-title" onMouseDown={event => event.stopPropagation()}>
                        <header className="dash-panel-header">
                            <h2 id="dash-panel-title">{{ settings: 'Map Settings', legends: 'World Legends' }[activePanel]}</h2>
                            <button type="button" className="dash-panel-close" aria-label="Close panel" onClick={() => setActivePanel(null)}>×</button>
                        </header>
                        {activePanel === 'settings' && (
                            <div className="dash-panel-content">
                                <label className="dash-setting-row">
                                    <span><strong>Reduce map animation</strong><small>Turn off movement effects on the world map.</small></span>
                                    <input type="checkbox" checked={reduceMotion} onChange={event => changeMotionPreference(event.target.checked)} />
                                </label>
                                <div className="dash-setting-row">
                                    <span><strong>Map zoom</strong><small>Current zoom: {Math.round(mapZoom * 100)}%</small></span>
                                    <button type="button" className="dash-panel-link" onClick={() => setMapZoom(1)}>Reset</button>
                                </div>
                            </div>
                        )}
                        {activePanel === 'legends' && (
                            <div className="dash-panel-content">
                                <p>Regions, stages, and concepts in the current game world.</p>
                                {REGIONS.map(region => (
                                    <article className="dash-legend-region" key={region.id}>
                                        <h3>{region.name}</h3>
                                        {Object.entries(STAGE_DATA).filter(([key]) => key.startsWith(`${region.id}-`)).map(([key, stage]) => (
                                            <div className="dash-legend-stage" key={key}>
                                                <strong>{key} · {stage.title}</strong>
                                                <span>{stage.teachingConcepts?.length ? stage.teachingConcepts.join(' · ') : stage.objective}</span>
                                            </div>
                                        ))}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
