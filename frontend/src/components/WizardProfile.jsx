import React from 'react';
import { useNavigate } from 'react-router-dom';
import './stagetypes.css';

/**
 * WizardProfile — Character avatar + level + XP bar
 * ใช้ใน Dashboard, StagePage navbar, Level Complete
 */
const WizardProfile = ({ character, levelProgress, compact = false, showXPBar = true }) => {
    const navigate = useNavigate();
    if (!character || !levelProgress) return null;

    const { current, next, progress, xpInLevel, xpNeeded } = levelProgress;
    const outfitColor = character.equippedOutfit === 'default' ? '#6b7280' : (current?.color || '#6b7280');

    if (compact) {
        return (
            <button type="button" className="wizard-profile compact wizard-profile-trigger"
                aria-label="Open your profile" onClick={() => navigate('/profile')}>
                <div className="wizard-avatar-compact" style={{ borderColor: current?.color || '#6b7280' }}>
                    <i className={current?.icon || 'fas fa-hat-wizard'} style={{ color: outfitColor }}></i>
                </div>
                <div className="wizard-info-compact">
                    <span className="wizard-title-compact">{current?.title || 'Novice'}</span>
                    <span className="wizard-level-compact">Lv.{current?.level || 1}</span>
                </div>
                {showXPBar && (
                    <div className="wizard-xp-bar-compact">
                        <div className="wizard-xp-fill-compact" style={{ width: `${progress}%`, backgroundColor: current?.color || '#6b7280' }}></div>
                    </div>
                )}
            </button>
        );
    }

    return (
        <div className="wizard-profile">
            {/* Avatar */}
            <div className="wizard-avatar" style={{ borderColor: current?.color || '#6b7280' }}>
                <div className="wizard-avatar-inner" style={{ background: `radial-gradient(circle, ${current?.color || '#6b7280'}22, transparent)` }}>
                    <i className="fas fa-hat-wizard" style={{ color: outfitColor, fontSize: '2.5rem' }}></i>
                </div>
                <div className="wizard-level-badge" style={{ backgroundColor: current?.color || '#6b7280' }}>
                    {current?.level || 1}
                </div>
            </div>

            {/* Info */}
            <div className="wizard-info">
                <div className="wizard-title" style={{ color: current?.color || '#9ca3af' }}>
                    <i className={current?.icon || 'fas fa-seedling'}></i>
                    <span>{current?.title || 'Novice'}</span>
                </div>
                <div className="wizard-xp-text">
                    {character.xp} XP
                    {next && <span className="wizard-xp-next"> / {next.xpRequired} XP</span>}
                </div>

                {/* XP Bar */}
                {showXPBar && (
                    <div className="wizard-xp-bar">
                        <div
                            className="wizard-xp-fill"
                            style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${current?.color || '#6b7280'}, ${next?.color || current?.color || '#6b7280'})`
                            }}
                        ></div>
                        <span className="wizard-xp-label">
                            {next ? `${xpInLevel} / ${xpNeeded}` : 'MAX LEVEL'}
                        </span>
                    </div>
                )}
            </div>

            {/* Spells Count */}
            <div className="wizard-stats">
                <div className="wizard-stat">
                    <i className="fas fa-magic"></i>
                    <span>{character.unlockedSpells?.length || 0}</span>
                    <label>Spells</label>
                </div>
                <div className="wizard-stat">
                    <i className="fas fa-check-circle"></i>
                    <span>{Object.keys(character.completedStages || {}).length}</span>
                    <label>Stages</label>
                </div>
            </div>
        </div>
    );
};

export default WizardProfile;
