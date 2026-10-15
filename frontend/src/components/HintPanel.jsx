import React, { useState } from 'react';
import './stagetypes.css';

/**
 * HintPanel — Progressive hint system
 * แสดง hint ที่ค่อยๆ เปิดเผยมากขึ้นตามจำนวน attempt
 */
const HintPanel = ({ hints = [], attemptCount = 0, onRequestHint }) => {
    const [maxRevealedLevel, setMaxRevealedLevel] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-reveal hints based on attempts
    const currentLevel = Math.min(
        Math.max(maxRevealedLevel, Math.floor(attemptCount / 2)),
        hints.length - 1
    );

    // Auto-expand if a new hint level is revealed
    React.useEffect(() => {
        if (currentLevel > 0) {
            setIsExpanded(true);
        }
    }, [currentLevel]);

    const handleRequestMore = (e) => {
        e.stopPropagation(); // prevent toggling accordion
        if (maxRevealedLevel < hints.length - 1) {
            setMaxRevealedLevel(prev => prev + 1);
            setIsExpanded(true);
            if (onRequestHint) onRequestHint(maxRevealedLevel + 1);
        }
    };

    if (!hints || hints.length === 0) return null;

    return (
        <div className={`hint-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="hint-panel-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="hint-panel-icon">
                    <i className="fas fa-lightbulb"></i>
                </div>
                <span className="hint-panel-title">
                    Hint {currentLevel + 1} / {hints.length}
                </span>
                {currentLevel > 0 && (
                    <span className="hint-panel-warning">
                        <i className="fas fa-exclamation-triangle"></i>
                        Using hints reduces XP bonus
                    </span>
                )}
                <div className="hint-panel-toggle">
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                </div>
            </div>

            {isExpanded && (
                <>
                    <div className="hint-panel-body">
                        {hints.slice(0, currentLevel + 1).map((hint, i) => (
                            <div key={i} className={`hint-item ${i === currentLevel ? 'current' : 'previous'}`}>
                                <span className="hint-level-badge">Hint {i + 1}</span>
                                <p className="hint-text">{hint.text}</p>
                            </div>
                        ))}
                    </div>

                    {currentLevel < hints.length - 1 && (
                        <button className="hint-panel-more-btn" onClick={handleRequestMore}>
                            <i className="fas fa-question-circle"></i>
                            Need more help? ({hints.length - currentLevel - 1} more available)
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default HintPanel;
