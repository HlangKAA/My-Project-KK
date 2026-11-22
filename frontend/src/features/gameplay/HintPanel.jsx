import React, { useState } from 'react';
import { useLanguage } from '@/shared/i18n/useLanguage';
import '@/shared/styles/stagetypes.css';

/**
 * HintPanel — Progressive hint system (3 levels)
 * Tracks exact number of hints revealed (0 -> 1 -> 2 -> 3) and reduces hint XP bonus accordingly.
 */
const HintPanel = ({ hints = [], hintsUsed = 0, onRequestHint, defaultExpanded = false }) => {
    const { isThai } = useLanguage();
    const [revealedCount, setRevealedCount] = useState(hintsUsed);
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    if (!hints || hints.length === 0) return null;

    const totalHints = hints.length;
    const effectiveRevealed = Math.min(Math.max(revealedCount, hintsUsed), totalHints);
    const remainingBonusPct = Math.max(0, (totalHints - effectiveRevealed) * 10);

    const handleRevealNext = (e) => {
        e.stopPropagation();
        if (effectiveRevealed < totalHints) {
            const nextCount = effectiveRevealed + 1;
            setRevealedCount(nextCount);
            setIsExpanded(true);
            if (onRequestHint) onRequestHint(nextCount);
        }
    };

    const handleHeaderClick = () => {
        if (effectiveRevealed === 0) {
            setRevealedCount(1);
            setIsExpanded(true);
            if (onRequestHint) onRequestHint(1);
            return;
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`hint-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="hint-panel-header" onClick={handleHeaderClick}>
                <div className="hint-panel-icon">
                    <i className="fas fa-lightbulb"></i>
                </div>
                <span className="hint-panel-title">
                    {effectiveRevealed === 0
                        ? (isThai ? `คำใบ้ (0 / ${totalHints})` : `Hints (0 / ${totalHints})`)
                        : (isThai ? `เปิดใช้คำใบ้แล้ว ${effectiveRevealed} / ${totalHints}` : `Hint ${effectiveRevealed} / ${totalHints} Used`)}
                </span>
                <span className="hint-panel-warning">
                    <i className={`fas ${effectiveRevealed >= totalHints ? 'fa-times-circle' : effectiveRevealed > 0 ? 'fa-exclamation-triangle' : 'fa-brain'}`}></i>
                    {effectiveRevealed === 0
                        ? (isThai ? 'โบนัสไม่ใช้คำใบ้ +30% XP (กดเพื่อดูคำใบ้ที่ 1)' : 'No-Hint Bonus +30% XP (Click to reveal Hint 1)')
                        : effectiveRevealed < totalHints
                            ? (isThai ? `โบนัสคำใบ้ลดเหลือ +${remainingBonusPct}% XP` : `Hint XP bonus reduced to +${remainingBonusPct}%`)
                            : (isThai ? 'ใช้คำใบ้ครบ 3 ครั้ง (ไม่ได้รับโบนัสคำใบ้)' : 'All 3 hints used (No hint XP bonus)')}
                </span>
                <div className="hint-panel-toggle">
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                </div>
            </div>

            {isExpanded && effectiveRevealed > 0 && (
                <>
                    <div className="hint-panel-body">
                        {hints.slice(0, effectiveRevealed).map((hint, i) => (
                            <div key={i} className={`hint-item ${i === effectiveRevealed - 1 ? 'current' : 'previous'}`}>
                                <span className="hint-level-badge">
                                    {isThai
                                        ? (i === totalHints - 1 ? `คำใบ้ ${i + 1} (แนวทางเฉลย)` : `คำใบ้ ${i + 1}`)
                                        : (i === totalHints - 1 ? `Hint ${i + 1} (Solution)` : `Hint ${i + 1}`)}
                                </span>
                                <p className="hint-text">{hint.text}</p>
                            </div>
                        ))}
                    </div>

                    {effectiveRevealed < totalHints && (
                        <button type="button" className="hint-panel-more-btn" onClick={handleRevealNext}>
                            <i className="fas fa-question-circle"></i>
                            {isThai
                                ? `เปิดคำใบ้ที่ ${effectiveRevealed + 1}/${totalHints} (${effectiveRevealed + 1 >= totalHints ? 'จะไม่ได้รับโบนัสคำใบ้' : `โบนัสจะเหลือ +${Math.max(0, (totalHints - effectiveRevealed - 1) * 10)}%`})`
                                : `Reveal Hint ${effectiveRevealed + 1}/${totalHints} (${effectiveRevealed + 1 >= totalHints ? '0% hint bonus' : `+${Math.max(0, (totalHints - effectiveRevealed - 1) * 10)}% hint bonus left`})`}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default HintPanel;
