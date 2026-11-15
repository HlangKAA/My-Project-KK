import React, { useState, useEffect } from 'react';
import { SPELLS } from '@/features/character/characterData';
import { useLanguage } from '@/shared/i18n/useLanguage';
import '@/shared/styles/stagetypes.css';

const SPELL_CATEGORIES_TH = {
    OUTPUT: 'การแสดงผล',
    STORAGE: 'การเก็บค่า',
    FORMATTING: 'การจัดข้อความ',
    SPECTRUM: 'แสงและสี',
    SPELLCRAFT: 'การสร้างคาถา',
    MOVEMENT: 'การเคลื่อนที่',
    STRUCTURE: 'โครงสร้างข้อมูล',
    ITERATION: 'การวนซ้ำ',
    LOGIC: 'เงื่อนไข',
};

/**
 * SpellBook — Grid of unlocked spells
 * แสดง spells ทั้งหมด ที่ปลดล็อกแล้วจะสด ที่ยังไม่ปลดล็อกจะเทา
 */
const SpellBook = ({ unlockedSpells = [], onClose }) => {
    const { isThai } = useLanguage();
    const spellNames = { print: 'เสียงแห่งโค้ด', variables: 'มนตร์เก็บค่า', 'f-strings': 'ถ้อยคำถักทอ', cast_color: 'ร่ายแสงสี', functions: 'ผูกคาถา', move: 'ก้าวผ่านมิติ', type: 'ทอแสง', type_convert: 'ความทรงจำสีเงิน', lists: 'ควบคุมลิสต์', for_loop: 'เสียงสะท้อนไม่สิ้นสุด', conditionals: 'เลือกชะตา', boolean: 'ค้นหาความจริง' };
    const [selectedSpell, setSelectedSpell] = useState(null);
    const allSpells = Object.entries(SPELLS);
    const activeSpell = selectedSpell ? SPELLS[selectedSpell] : null;
    useEffect(() => {
        const closeOnEscape = event => {
            if (event.key === 'Escape') {
                if (selectedSpell) setSelectedSpell(null);
                else onClose();
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [selectedSpell, onClose]);

    return (
        <div className="spellbook-overlay" onClick={onClose}>
            <div className="spellbook-modal" role="dialog" aria-modal="true" aria-labelledby="spellbook-title" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="spellbook-header">
                    <div className="spellbook-title-area">
                        <i className="fas fa-book-open"></i>
                        <h2 id="spellbook-title">{isThai ? 'หนังสือคาถา' : 'Spell Book'}</h2>
                    </div>
                    <div className="spellbook-count">
                        <span className="spellbook-unlocked">{unlockedSpells.length}</span>
                        <span className="spellbook-sep">/</span>
                        <span className="spellbook-total">{allSpells.length}</span>
                        <span className="spellbook-label">{isThai ? 'คาถาที่ปลดล็อก' : 'Spells Unlocked'}</span>
                    </div>
                    <button className="spellbook-close" aria-label={isThai ? 'ปิดหนังสือคาถา' : 'Close Spell Book'} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Spell Grid */}
                <div className="spellbook-grid">
                    {allSpells.map(([key, spell]) => {
                        const isUnlocked = unlockedSpells.includes(key);
                        const isSelected = selectedSpell === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                disabled={!isUnlocked}
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
                                    {isUnlocked ? (isThai ? spellNames[key] || spell.name : spell.name) : '???'}
                                </div>
                                <div className="spell-card-category">
                                    {isUnlocked ? (isThai ? SPELL_CATEGORIES_TH[spell.category] || spell.category : spell.category) : (isThai ? 'ยังไม่ปลดล็อก' : 'LOCKED')}
                                </div>

                                {/* Glow effect for unlocked */}
                                {isUnlocked && <div className="spell-card-glow" style={{ backgroundColor: spell.color }}></div>}
                            </button>
                        );
                    })}
                </div>
            </div>
            {activeSpell && (
                <div className="spell-detail-overlay" onClick={event => { event.stopPropagation(); setSelectedSpell(null); }}>
                    <div className="spell-detail-modal" role="dialog" aria-modal="true" aria-labelledby="spell-detail-title" onClick={event => event.stopPropagation()} style={{ '--spell-color': activeSpell.color }}>
                        <button type="button" className="spell-detail-close" aria-label={isThai ? 'ปิดรายละเอียดคาถา' : 'Close spell details'} onClick={() => setSelectedSpell(null)} autoFocus><i className="fas fa-times" /></button>
                        <i className={`${activeSpell.icon} spell-detail-icon`} />
                        <div className="spell-card-category">{isThai ? SPELL_CATEGORIES_TH[activeSpell.category] || activeSpell.category : activeSpell.category}</div>
                        <h2 id="spell-detail-title">{isThai ? spellNames[selectedSpell] || activeSpell.name : activeSpell.name}</h2>
                        <p className="spell-detail-description">{isThai ? activeSpell.descriptionTh : activeSpell.description}</p>
                        <h3>{isThai ? 'ตัวอย่างโค้ด' : 'Example code'}</h3>
                        <pre><code>{activeSpell.pythonCode}</code></pre>
                        <div className="spell-detail-guide">
                            <section>
                                <h3>{isThai ? 'ใช้ตอนไหน' : 'When to use it'}</h3>
                                <p>{activeSpell.guide[isThai ? 'th' : 'en'].when}</p>
                            </section>
                            <section>
                                <h3>{isThai ? 'ใช้ในเกม' : 'In the game'}</h3>
                                <p>{activeSpell.guide[isThai ? 'th' : 'en'].note}</p>
                            </section>
                        </div>
                        <p className="spell-detail-reminder">{isThai ? 'นี่คือตัวอย่างวิธีใช้ ลองปรับค่าและเส้นทางให้ตรงกับโจทย์ของด่าน' : 'This shows the technique. Adapt the values and path to the stage objective.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpellBook;
