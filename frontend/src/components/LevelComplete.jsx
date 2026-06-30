import React from 'react';
import { useNavigate } from 'react-router-dom';
import './levelcomplete.css';

const LevelComplete = ({ level, levelId, user, onReplay, onContinue }) => {
    const navigate = useNavigate();

    return (
        <div className="lc-page">
            {/* ─── Navbar ─── */}
            <nav className="lc-navbar">
                <div className="lc-brand">
                    <div className="lc-brand-icon"><i className="fas fa-chess-rook"></i></div>
                    <span className="lc-brand-text">The Lost Spectrum</span>
                </div>

                <div className="lc-nav-links">
                    <button className="lc-nav-link">Grimoire</button>
                    <button className="lc-nav-link" onClick={() => navigate('/dashboard')}>Map</button>
                    <button className="lc-nav-link">Inventory</button>
                    <button className="lc-nav-link">Settings</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button className="lc-pause-btn">
                        <i className="fas fa-pause"></i> Pause
                    </button>
                    <div className="lc-avatar">
                        <i className="fas fa-hat-wizard"></i>
                    </div>
                </div>
            </nav>

            {/* ─── Content ─── */}
            <div className="lc-content">
                {/* Badge */}
                <div className="lc-badge">
                    <span className="lc-badge-pill">
                        <span className="lc-badge-dot"></span>
                        LEVEL COMPLETE
                    </span>
                </div>

                {/* Title */}
                <h1 className="lc-title">RESTORATION COMPLETE!</h1>
                <p className="lc-subtitle">
                    The spectrum has been stabilized. The ancient magic flows once more through<br />
                    the veins of the world.
                </p>

                {/* Chapter Card */}
                <div className="lc-chapter-card">
                    <div className="lc-chapter-art-placeholder">
                        <i className="fas fa-hat-wizard lc-chapter-art-icon"></i>
                    </div>

                    <div className="lc-chapter-info">
                        <div>
                            <div className="lc-chapter-name">{level.chapter}</div>
                            <div className="lc-chapter-location">
                                <i className="fas fa-map-marker-alt"></i>
                                {level.location}
                            </div>
                        </div>
                        <div className="lc-chapter-tags">
                            <span className="lc-tag xp">XP +450</span>
                            <span className="lc-tag mastery">Mastery Unlocked</span>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <h2 className="lc-skills-title">Skills Recorded</h2>
                <div className="lc-skills-grid">
                    {level.skills && level.skills.map((skill, i) => (
                        <div key={i} className="lc-skill-card">
                            <div className="lc-skill-header">
                                <div className="lc-skill-icon">
                                    <i className={skill.icon}></i>
                                </div>
                                <span className="lc-skill-type">{skill.type}</span>
                            </div>
                            <div className="lc-skill-name">{skill.name}</div>
                            <div className="lc-skill-desc">{skill.desc}</div>
                            <div className="lc-skill-bar-wrap">
                                <div className="lc-skill-bar">
                                    <div
                                        className="lc-skill-bar-fill"
                                        style={{ width: `${skill.pct}%` }}
                                    ></div>
                                </div>
                                <span className="lc-skill-pct">{skill.pct}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="lc-actions">
                    <button className="lc-btn-replay" onClick={onReplay}>
                        <i className="fas fa-redo"></i> Replay Level
                    </button>
                    <button className="lc-btn-continue" onClick={onContinue}>
                        Continue Journey <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelComplete;
