import React from 'react';
import { useNavigate } from 'react-router-dom';
import WizardProfile from './WizardProfile';
import './levelcomplete.css';

const LevelComplete = ({ level, levelId, user, character, levelProgress, completionResult, onReplay, onContinue }) => {
    const navigate = useNavigate();

    const result = completionResult || {};
    const { earnedXP = 0, baseXP = 0, appliedBonuses = [], levelUpInfo = null, newSpellUnlock = null, newOutfitUnlock = null } = result;

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
                    <button className="lc-nav-link">Spell Book</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
                        {level?.stageType === 'boss' ? 'BOSS DEFEATED' : 'STAGE COMPLETE'}
                    </span>
                </div>

                {/* Title */}
                <h1 className="lc-title">
                    {level?.stageType === 'boss' ? '⚔️ BOSS DEFEATED! ⚔️' : '⭐ STAGE COMPLETE! ⭐'}
                </h1>
                <p className="lc-subtitle">
                    {level?.completeMessage || 'The spectrum has been stabilized. The ancient magic flows once more.'}
                </p>

                {/* Wizard Profile */}
                {character && levelProgress && (
                    <div className="lc-wizard-section">
                        <WizardProfile
                            character={character}
                            levelProgress={levelProgress}
                            compact={false}
                            showXPBar={true}
                        />
                    </div>
                )}

                {/* Level Up! */}
                {levelUpInfo && (
                    <div className="lc-levelup">
                        <div className="lc-levelup-icon">
                            <i className={levelUpInfo.newIcon || 'fas fa-arrow-up'}></i>
                        </div>
                        <div className="lc-levelup-info">
                            <div className="lc-levelup-label">LEVEL UP!</div>
                            <div className="lc-levelup-text">
                                {levelUpInfo.oldTitle} → <strong style={{ color: levelUpInfo.newColor }}>{levelUpInfo.newTitle}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* XP Breakdown */}
                <div className="lc-xp-section">
                    <h3 className="lc-section-title">
                        <i className="fas fa-star" style={{ color: '#fbbf24' }}></i>
                        XP Earned: <span className="lc-xp-total">+{earnedXP}</span>
                    </h3>
                    <div className="lc-xp-breakdown">
                        <div className="lc-xp-row base">
                            <span><i className="fas fa-scroll"></i> Base XP</span>
                            <span>+{baseXP}</span>
                        </div>
                        {appliedBonuses.map((bonus, i) => (
                            <div key={i} className="lc-xp-row bonus">
                                <span><i className={bonus.icon}></i> {bonus.label}</span>
                                <span className="lc-xp-bonus">+{bonus.bonusXP}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spell Unlock */}
                {newSpellUnlock && (
                    <div className="lc-unlock-section">
                        <div className="lc-unlock-card spell">
                            <div className="lc-unlock-icon" style={{ color: newSpellUnlock.color }}>
                                <i className={newSpellUnlock.icon}></i>
                            </div>
                            <div className="lc-unlock-info">
                                <div className="lc-unlock-label">🔓 NEW SPELL UNLOCKED</div>
                                <div className="lc-unlock-name" style={{ color: newSpellUnlock.color }}>
                                    {newSpellUnlock.name}
                                </div>
                                <div className="lc-unlock-desc">{newSpellUnlock.description}</div>
                                <div className="lc-unlock-code">
                                    <code>{newSpellUnlock.pythonCode}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Outfit Unlock */}
                {newOutfitUnlock && (
                    <div className="lc-unlock-section">
                        <div className="lc-unlock-card outfit">
                            <div className="lc-unlock-icon" style={{ color: newOutfitUnlock.primaryColor }}>
                                <i className={newOutfitUnlock.icon}></i>
                            </div>
                            <div className="lc-unlock-info">
                                <div className="lc-unlock-label">🎭 NEW OUTFIT UNLOCKED</div>
                                <div className="lc-unlock-name" style={{ color: newOutfitUnlock.primaryColor }}>
                                    {newOutfitUnlock.name}
                                </div>
                                <div className="lc-unlock-desc">{newOutfitUnlock.description}</div>
                            </div>
                        </div>
                    </div>
                )}

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
                            <span className="lc-tag xp">XP +{earnedXP || level.xpReward || 0}</span>
                            {level?.stageType === 'boss' && <span className="lc-tag mastery">Boss Cleared</span>}
                            {level?.stageType !== 'boss' && <span className="lc-tag mastery">Stage Complete</span>}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                {level.skills && level.skills.length > 0 && (
                    <>
                        <h2 className="lc-skills-title">Skills Recorded</h2>
                        <div className="lc-skills-grid">
                            {level.skills.map((skill, i) => (
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
                    </>
                )}

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
