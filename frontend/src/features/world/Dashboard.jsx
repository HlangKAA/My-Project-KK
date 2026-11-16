import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '@/shared/context/GameContext';
import useCharacterProgression from '@/features/character/useCharacterProgression';
import { REGIONS as PLAYABLE_REGIONS, STAGE_DATA } from '@/features/stages/stageData';
import { CONCEPT_MAP } from '@/features/stages/conceptMap';
import api from '@/shared/api/axios';
import { useLanguage } from '@/shared/i18n/useLanguage';
import { localRegion, localStage } from '@/shared/i18n/th';
import WizardProfile from '@/features/character/WizardProfile';
import StoryScene from './StoryScene';
import GameplayWalkthrough from './GameplayWalkthrough';
import worldMap from '@/assets/images/the-lost-spectrum-world-map.png';
import regionRedForest from '@/assets/images/region-red-forest.png';
import regionAshPeaks from '@/assets/images/region-ash-peaks.png';
import regionWhisperingCaverns from '@/assets/images/region-whispering-caverns.png';
import thescholarsarchive from '@/assets/images/the-scholars-archive.png';
import './dashboard.css';

const REGIONS = [
    {
        id: 1,
        name: 'THE RED FOREST',
        image: regionRedForest,
        top: 'calc(22% + 38px)',
        left: '19%',
    },
    {
        id: 2,
        name: "THE SCHOLAR'S ARCHIVE",
        image: thescholarsarchive,
        top: 'calc(39% + 38px)',
        left: '56%',
    },
    {
        id: 3,
        name: 'WHISPERING CAVERNS',
        image: regionWhisperingCaverns,
        top: '70%',
        left: '82%',
    },
    {
        id: 4,
        name: 'ASH PEAKS',
        image: regionAshPeaks,
        top: '38%',
        left: '94%',
    }
];

const conceptLabel = key => CONCEPT_MAP[key]?.name
    || key.replace(/-/g, ' ').replace(/^./, first => first.toUpperCase());

const Dashboard = () => {
    const { language, setLanguage, isThai } = useLanguage();
    const { user, logout, advanceOnboarding } = useGame();
    const navigate = useNavigate();
    const { character, levelProgress } = useCharacterProgression();
    const [showLegends, setShowLegends] = useState(false);
    const [storyScene, setStoryScene] = useState(null);
    const [walkthroughReplay, setWalkthroughReplay] = useState(false);
    const [onboardingSaving, setOnboardingSaving] = useState(false);
    const [onboardingError, setOnboardingError] = useState('');
    const [mapZoom, setMapZoom] = useState(1);
    const [leaderboard, setLeaderboard] = useState({ loading: true, error: '', entries: [], me: null });

    const hasPlayed = Object.values(user?.completedStages || {}).some(Boolean);
    const legacyPrologueSeen = user?.player_id
        ? Boolean(localStorage.getItem(`lost-spectrum-prologue:${user.player_id}`)) : false;
    const autoPrologue = user?.player_id && !hasPlayed && user.onboarding_step === 0 && !legacyPrologueSeen;
    const activeStoryScene = storyScene || (autoPrologue ? 'prologue' : null);
    const autoWalkthrough = user?.player_id && !hasPlayed
        && (user.onboarding_step === 1 || (user.onboarding_step === 0 && legacyPrologueSeen));
    const showWalkthrough = walkthroughReplay || (!activeStoryScene && autoWalkthrough);

    const closeStoryScene = async () => {
        if (onboardingSaving) return;
        if (storyScene || activeStoryScene !== 'prologue') {
            setStoryScene(null);
            return;
        }
        setOnboardingSaving(true);
        setOnboardingError('');
        try {
            await advanceOnboarding(1);
        } catch (error) {
            setOnboardingError(isThai ? 'บันทึกตอนเปิดเรื่องไม่สำเร็จ ลองอีกครั้งนะ' : (error.response?.data?.message || 'Could not save your introduction. Please retry.'));
        } finally {
            setOnboardingSaving(false);
        }
    };

    const finishWalkthrough = async () => {
        if (onboardingSaving) return;
        if (walkthroughReplay) {
            setWalkthroughReplay(false);
            setOnboardingError('');
            return;
        }
        setOnboardingSaving(true);
        setOnboardingError('');
        try {
            await advanceOnboarding(2);
            navigate('/region/1');
        } catch (error) {
            setOnboardingError(isThai ? 'บันทึกวิธีเล่นไม่สำเร็จ ลองอีกครั้งนะ' : (error.response?.data?.message || 'Could not save the guide. Please retry.'));
        } finally {
            setOnboardingSaving(false);
        }
    };

    useEffect(() => {
        let active = true;
        api.get('/api/leaderboard').then(response => {
            if (active) setLeaderboard({
                loading: false, error: '',
                entries: response.data.entries,
                me: response.data.me,
            });
        }).catch(error => {
            if (active) setLeaderboard({
                loading: false,
                error: error.response?.data?.message || 'Could not load the leaderboard.',
                entries: [],
                me: null,
            });
        });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!showLegends) return undefined;
        const closeOnEscape = event => { if (event.key === 'Escape') setShowLegends(false); };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [showLegends]);

    const getRegionStatus = (regionId) => {
        const completed = user?.completedRegions || [];
        if (completed.includes(regionId)) return 'complete';
        if (regionId === 1 || completed.includes(regionId - 1)) return 'active';
        return 'locked';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#171a17', color: '#e9e0ca' }}>
            {/* ─── Top Navbar ─── */}
            <nav className="dash-navbar">
                <div className="dash-brand">
                    <div className="dash-brand-icon">
                        <i className="fas fa-chess-rook"></i>
                    </div>
                    <span className="dash-brand-text">{'The Lost Spectrum'}</span>
                </div>

                <div className="dash-nav-links">
                    <button className="dash-nav-link active" onClick={() => setShowLegends(false)}>
                        <i className="fas fa-map"></i> {isThai ? 'แผนที่' : 'MAP'}
                    </button>
                </div>

                <div className="dash-user">
                    <button type="button" className="dash-nav-link dash-language-toggle" onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} aria-label={isThai ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'} title={isThai ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}>
                        <i className="fas fa-language" /> {isThai ? 'EN' : 'ไทย'}
                    </button>
                    <div className="dash-user-info">
                        <span className="dash-user-role">{isThai ? 'นักปราชญ์' : 'SCHOLAR'}</span>
                        <span className="dash-user-name" title={user?.username || 'Explorer'}>{user?.username || 'Explorer'}</span>
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
                                <h1 className="dash-title">{isThai ? 'เลือกภารกิจ' : 'Mission Select'}</h1>
                                <p className="dash-quote">{isThai ? '“ความรู้จะช่วยส่องทางให้เรา”' : '"The path is illuminated only by what you know."'}</p>
                            </div>
                            <button className="dash-view-btn" onClick={() => setShowLegends(true)}>
                                <i className="fas fa-scroll"></i> {isThai ? 'ดูเรื่องราวโลก' : 'VIEW LEGENDS'}
                            </button>
                        </div>
                    </div>

                    <div className="dash-map">
                        <div className="dash-map-world" style={{ backgroundImage: `url(${worldMap})`, transform: `scale(${mapZoom})` }}>
                        {/* Region Nodes */}
                        {REGIONS.map((rawRegion) => {
                            const region = localRegion(rawRegion, isThai);
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
                    <div className="dash-map-help">
                        <button type="button" onClick={() => { setOnboardingError(''); setWalkthroughReplay(true); }}
                            aria-label={isThai ? 'เปิดวิธีเล่น' : 'Open gameplay tutorial'}>
                            <i className="fas fa-question-circle" aria-hidden="true" /> {isThai ? 'วิธีเล่น' : 'Tutorial'}
                        </button>
                    </div>
                </div>

                {/* Leaderboard */}
                <aside className="dash-sidebar" aria-labelledby="leaderboard-title">
                    <h2 className="dash-sidebar-title" id="leaderboard-title">
                        <i className="fas fa-trophy" aria-hidden="true"></i> {isThai ? 'ตารางอันดับ' : 'Leaderboard'}
                    </h2>
                    {leaderboard.loading && <p role="status">Loading leaderboard…</p>}
                    {leaderboard.error && <p role="alert">{leaderboard.error}</p>}
                    {!leaderboard.loading && !leaderboard.error && leaderboard.entries.length === 0 && (
                        <p className="dash-leaderboard-empty">No ranked explorers yet. Complete a stage to join.</p>
                    )}
                    {!leaderboard.error && leaderboard.entries.map(entry => (
                        <div className={`dash-leaderboard-entry ${entry.rank <= 7 ? `rainbow-rank-${entry.rank}` : ''} ${entry.player_id === user?.player_id ? 'is-me' : ''}`}
                            key={entry.player_id} aria-label={`Rank ${entry.rank}, ${entry.username}, ${entry.score} XP, ${entry.completed_stages} stages completed`}>
                            <span className="dash-leaderboard-rank" aria-hidden="true">#{entry.rank}</span>
                            <span className="dash-leaderboard-player">
                                <strong title={entry.username}>{entry.username}</strong>
                                <small><b>{entry.score.toLocaleString()} XP</b> · {entry.completed_stages} stage{entry.completed_stages === 1 ? '' : 's'}</small>
                            </span>
                            {entry.player_id === user?.player_id && <span className="dash-leaderboard-you">You</span>}
                        </div>
                    ))}
                    {!leaderboard.loading && !leaderboard.error && leaderboard.me && leaderboard.me.rank > 20 && (
                        <div className="dash-leaderboard-own">
                            <p>Your rank</p>
                            <div className="dash-leaderboard-entry is-me" aria-label={`Your rank ${leaderboard.me.rank}, ${leaderboard.me.score} XP, ${leaderboard.me.completed_stages} stages completed`}>
                                <span className="dash-leaderboard-rank">#{leaderboard.me.rank}</span>
                                <span className="dash-leaderboard-player">
                                    <strong title={leaderboard.me.username}>{leaderboard.me.username}</strong>
                                    <small><b>{leaderboard.me.score.toLocaleString()} XP</b> · {leaderboard.me.completed_stages} stages</small>
                                </span>
                                <span className="dash-leaderboard-you">You</span>
                            </div>
                        </div>
                    )}
                    {!leaderboard.loading && !leaderboard.error && !leaderboard.me && (
                        <p className="dash-leaderboard-unranked">Complete a stage to earn your rank.</p>
                    )}
                </aside>
            </div>
            {showLegends && (
                <div className="dash-panel-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowLegends(false); }}>
                    <section className="dash-panel" role="dialog" aria-modal="true"
                        aria-labelledby="dash-panel-title" onMouseDown={event => event.stopPropagation()}>
                        <header className="dash-panel-header">
                            <h2 id="dash-panel-title">{isThai ? 'เรื่องราวของโลก' : 'World Legends'}</h2>
                            <button type="button" className="dash-panel-close" aria-label="Close panel" onClick={() => setShowLegends(false)}>×</button>
                        </header>
                        <div className="dash-panel-content dash-legends-content">
                                <p className="dash-legends-intro">{isThai ? 'สำรวจด่านและเรื่องที่ได้เรียนรู้ในแต่ละดินแดน' : 'Explore the playable stages and the ideas they teach.'}</p>
                                <div className="dash-story-replays">
                                    <button type="button" onClick={() => { setShowLegends(false); setStoryScene('prologue'); }}>
                                        <i className="fas fa-book-open" /> {isThai ? 'ดูตอนเปิดเรื่อง' : 'Replay Opening'}
                                    </button>
                                    {user?.completedStages?.['4-7'] && <button type="button" onClick={() => { setShowLegends(false); setStoryScene('epilogue'); }}>
                                        <i className="fas fa-sun" /> {isThai ? 'ดูตอนจบ' : 'Replay Ending'}
                                    </button>}
                                </div>
                                {Object.values(PLAYABLE_REGIONS).map(rawRegion => {
                                    const region = localRegion(rawRegion, isThai);
                                    return (
                                    <article className="dash-legend-region" key={region.id}>
                                        <h3>{region.name}</h3>
                                        <div className="dash-legend-stages">
                                            {region.stages.map(rawStage => {
                                                const stage = localStage(rawStage, region.id, isThai);
                                                const key = `${region.id}-${stage.id}`;
                                                const concepts = STAGE_DATA[key]?.teachingConcepts || [];
                                                return (
                                                    <div className="dash-legend-stage" key={key}>
                                                        <div className="dash-legend-stage-heading">
                                                            <span className="dash-legend-stage-icon" aria-hidden="true"><i className={stage.icon} /></span>
                                                            <div>
                                                                <small>{isThai ? 'ด่าน' : 'Stage'} {key}</small>
                                                                <strong>{stage.name}</strong>
                                                            </div>
                                                        </div>
                                                        <p>{stage.description}</p>
                                                        {concepts.length > 0 && (
                                                            <div className="dash-legend-concepts" aria-label="Concepts">
                                                                {concepts.map(concept => (
                                                                    <span className="dash-legend-concept" key={concept}>{isThai && concept === 'indexing' ? 'ตำแหน่ง' : isThai && concept === 'boolean-logic' ? 'boolean' : conceptLabel(concept)}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </article>
                                );})}
                        </div>
                    </section>
                </div>
            )}
            {activeStoryScene && <StoryScene scene={activeStoryScene} playerName={user?.username} isThai={isThai}
                onClose={closeStoryScene} saving={onboardingSaving} error={onboardingError} />}
            {showWalkthrough && <GameplayWalkthrough isThai={isThai} onFinish={finishWalkthrough}
                saving={onboardingSaving} error={onboardingError} replay={walkthroughReplay} />}
        </div>
    );
};

export default Dashboard;
