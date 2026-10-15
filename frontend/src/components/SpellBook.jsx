import React, { useState } from 'react';
import { SPELLS } from '../data/characterData';
import './stagetypes.css';

/**
 * SpellBook — Grid of unlocked spells
 * แสดง spells ทั้งหมด ที่ปลดล็อกแล้วจะสด ที่ยังไม่ปลดล็อกจะเทา
 */
const SpellBook = ({ unlockedSpells = [], onClose }) => {
    const [selectedSpell, setSelectedSpell] = useState(null);
    const allSpells = Object.entries(SPELLS);

    return (
        <div className="spellbook-overlay" onClick={onClose}>
            <div className="spellbook-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="spellbook-header">
                    <div className="spellbook-title-area">
                        <i className="fas fa-book-open"></i>
                        <h2>Spell Book</h2>
                    </div>
                    <div className="spellbook-count">
                        <span className="spellbook-unlocked">{unlockedSpells.length}</span>
                        <span className="spellbook-sep">/</span>
                        <span className="spellbook-total">{allSpells.length}</span>
                        <span className="spellbook-label">Spells Unlocked</span>
                    </div>
                    <button className="spellbook-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Spell Grid */}
                <div className="spellbook-grid">
                    {allSpells.map(([key, spell]) => {
                        const isUnlocked = unlockedSpells.includes(key);
                        const isSelected = selectedSpell === key;

                        return (
                            <div
                                key={key}
                                className={`spell-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`}
                                onClick={() => isUnlocked && setSelectedSpell(isSelected ? null : key)}
                                style={isUnlocked ? { '--spell-color': spell.color } : {}}
                            >
                                <div className="spell-card-icon" style={{ color: isUnlocked ? spell.color : '#4b5563' }}>
                                    {isUnlocked ? (
                                        <i className={spell.icon}></i>
                                    ) : (
                                        <i className="fas fa-lock"></i>
                                    )}
                                </div>
                                <div className="spell-card-name">
                                    {isUnlocked ? spell.name : '???'}
                                </div>
                                <div className="spell-card-category">
                                    {spell.category}
                                </div>

                                {/* Expanded Detail */}
                                {isSelected && isUnlocked && (
                                    <div className="spell-card-detail">
                                        <p className="spell-card-desc">{spell.description}</p>
                                        <div className="spell-card-code">
                                            <code>{spell.pythonCode}</code>
                                        </div>
                                    </div>
                                )}

                                {/* Glow effect for unlocked */}
                                {isUnlocked && <div className="spell-card-glow" style={{ backgroundColor: spell.color }}></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SpellBook;
