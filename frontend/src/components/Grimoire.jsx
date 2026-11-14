import React, { useEffect, useRef, useState } from 'react';
import { STAGE_GUIDES } from '../data/stageGuides';
import { localGrimoirePage } from '../data/grimoireTh';
import './grimoire.css';

const WHEEL_COLORS = [
    { name: 'red', hex: '#b88949', angle: 0 },
    { name: 'orange', hex: '#f97316', angle: 51 },
    { name: 'yellow', hex: '#eab308', angle: 103 },
    { name: 'green', hex: '#16a34a', angle: 154 },
    { name: 'blue', hex: '#3b82f6', angle: 206 },
    { name: 'indigo', hex: '#6366f1', angle: 257 },
    { name: 'violet', hex: '#8b5cf6', angle: 308 },
];

const Grimoire = ({ level, stageKey, isThai = false, startPage = 0, onClose }) => {
    const pages = level.grimoire;
    const [currentPage, setCurrentPage] = useState(startPage);
    const [activeTab, setActiveTab] = useState('guide');
    const closeRef = useRef(null);
    const dialogRef = useRef(null);
    const guide = STAGE_GUIDES[stageKey]?.[isThai ? 'th' : 'en'];

    useEffect(() => {
        const previousFocus = document.activeElement;
        closeRef.current?.focus();
        return () => {
            if (previousFocus?.isConnected) previousFocus.focus();
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
        }
        if (event.key !== 'Tab') return;
        const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled])')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    if (!pages || pages.length === 0) return null;

    const g = localGrimoirePage(pages[currentPage] || pages[0], stageKey, level.title, isThai);
    const totalPages = pages.length;

    const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
    const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

    return (
        <div className="grimoire-overlay" onClick={onClose}>
            <div className="grimoire-book" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="grimoire-title" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
                <div className="grimoire-header">
                    <div>
                        <span className="grimoire-eyebrow">{isThai ? 'คัมภีร์เวท' : 'SPELLS'}</span>
                        <h2 id="grimoire-title">{level.title}</h2>
                    </div>
                    <button ref={closeRef} className="grimoire-close" type="button" onClick={onClose} aria-label={isThai ? 'ปิดคัมภีร์' : 'Close spells'}>
                        <i className="fas fa-times" aria-hidden="true"></i>
                        <span className="grimoire-close-label">{isThai ? 'ปิด' : 'CLOSE'}</span>
                    </button>
                </div>
                <div className="grimoire-tabs" role="tablist" aria-label={isThai ? 'หน้าคัมภีร์' : 'Spellbook pages'}>
                    <button type="button" role="tab" id="grimoire-guide-tab" aria-selected={activeTab === 'guide'} aria-controls="grimoire-guide-panel" className={activeTab === 'guide' ? 'active' : ''} onClick={() => setActiveTab('guide')}>{isThai ? 'วิธีเล่นด่านนี้' : 'Quick Guide'}</button>
                    <button type="button" role="tab" id="grimoire-reference-tab" aria-selected={activeTab === 'reference'} aria-controls="grimoire-reference-panel" className={activeTab === 'reference' ? 'active' : ''} onClick={() => setActiveTab('reference')}>{isThai ? 'ข้อมูลอ้างอิง' : 'Reference'}</button>
                </div>
                {activeTab === 'guide' ? (
                    <div className="grimoire-guide" id="grimoire-guide-panel" role="tabpanel" aria-labelledby="grimoire-guide-tab">
                        <div className="grimoire-guide-row"><span>{isThai ? 'เป้าหมาย' : 'GOAL'}</span><p>{guide?.goal}</p></div>
                        <div className="grimoire-guide-row"><span>{isThai ? 'แนวคิด' : 'KEY IDEA'}</span><p>{guide?.idea}</p></div>
                        <div className="grimoire-guide-row"><span>{isThai ? 'เริ่มตรงนี้' : 'TRY FIRST'}</span><p>{guide?.first}</p></div>
                        <div className="grimoire-guide-example"><span>{isThai ? 'ตัวอย่างสั้น ๆ' : 'TINY EXAMPLE'}</span><pre><code>{guide?.example}</code></pre></div>
                        <button type="button" className="grimoire-start-btn" onClick={onClose}>{isThai ? 'เริ่มเล่น' : 'START PLAYING'}</button>
                    </div>
                ) : (
                <div className="grimoire-pages" id="grimoire-reference-panel" role="tabpanel" aria-labelledby="grimoire-reference-tab">
                {/* ─── Left Page ─── */}
                <div className="grimoire-page grimoire-page-left">
                    <h2 className="grimoire-section-title">
                        <i className={g.leftIcon}></i> {g.leftTitle}
                    </h2>

                    <p className="grimoire-text" dangerouslySetInnerHTML={{ __html: g.leftContent }} />

                    <div className="grimoire-code-block">
                        {g.leftCode.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>

                    {/* Index Demo */}
                    {stageKey === '3-2' && <div className="grimoire-index-demo">
                        <div style={{ textAlign: 'center' }}>
                            <div className="grimoire-index-box">0</div>
                            <div className="grimoire-index-label">{isThai ? 'ตำแหน่ง' : 'Index'}</div>
                        </div>
                        <span className="grimoire-index-arrow">→</span>
                        <div className="grimoire-index-value">
                            {g.leftCode.includes('[') ?
                                g.leftCode.match(/\['([^']+)'/)?.[1] || g.leftCode.match(/= (\d+)/)?.[1] || 'item'
                                : g.leftCode.match(/= (\S+)/)?.[1] || 'value'}
                        </div>
                    </div>}

                    <p className="grimoire-note" dangerouslySetInnerHTML={{ __html: g.leftNote }} />

                    {/* Incantations */}
                    <div className="grimoire-incantations-title">{isThai ? 'คำสั่งที่ใช้บ่อย:' : 'Common Incantations:'}</div>
                    <ul className="grimoire-incantations">
                        {g.leftIncantations.map((inc, i) => (
                            <li key={i}>
                                <code>{inc.code}</code> – {inc.desc}
                            </li>
                        ))}
                    </ul>

                    {/* Page Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                        <span className="grimoire-page-num" style={{ position: 'static' }}>
                            {isThai ? 'หน้า' : 'PAGE'} {currentPage * 2 + 1}
                        </span>
                        {currentPage > 0 && (
                            <button onClick={handlePrev} style={{
                                background: 'none', border: '1px solid #b8a88a', borderRadius: 6,
                                color: '#5a4a3a', padding: '0.3rem 0.8rem', cursor: 'pointer',
                                fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: 1
                            }}>
                                ← {isThai ? 'ก่อนหน้า' : 'PREV'}
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── Right Page ─── */}
                <div className="grimoire-page grimoire-page-right">
                    <h2 className="grimoire-section-title">
                        <i className={g.rightIcon}></i> {g.rightTitle}
                    </h2>

                    <p className="grimoire-text" dangerouslySetInnerHTML={{ __html: g.rightContent }} />

                    {/* Color Wheel (if colors available) */}
                    {g.rightColors && g.rightColors.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
                            <div className="grimoire-color-wheel">
                                <div className="grimoire-wheel-circle">
                                    <span className="grimoire-wheel-label">{isThai ? <>พลัง<br />สีหลัก</> : <>Primary<br />Power</>}</span>
                                    {WHEEL_COLORS
                                        .filter(c => g.rightColors.includes(c.name))
                                        .map((c) => {
                                            const rad = (c.angle - 90) * (Math.PI / 180);
                                            const r = 76;
                                            const x = 50 + (r * Math.cos(rad) / 90) * 50;
                                            const y = 50 + (r * Math.sin(rad) / 90) * 50;
                                            return (
                                                <div
                                                    key={c.name}
                                                    className="grimoire-wheel-dot"
                                                    style={{
                                                        backgroundColor: c.hex,
                                                        left: `${x}%`,
                                                        top: `${y}%`,
                                                        transform: 'translate(-50%, -50%)'
                                                    }}
                                                />
                                            );
                                        })}
                                </div>
                            </div>

                            <div className="grimoire-color-legend">
                                {WHEEL_COLORS
                                    .filter(c => g.rightColors.includes(c.name))
                                    .map((c) => (
                                        <div key={c.name} className="grimoire-color-item">
                                            <div className="grimoire-color-dot" style={{ backgroundColor: c.hex }}></div>
                                            "{c.name}"
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Quote */}
                    <div className="grimoire-quote">
                        <p>{g.rightQuote}</p>
                    </div>

                    {/* Page Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                        {currentPage < totalPages - 1 && (
                            <button onClick={handleNext} style={{
                                background: 'none', border: '1px solid #b8a88a', borderRadius: 6,
                                color: '#5a4a3a', padding: '0.3rem 0.8rem', cursor: 'pointer',
                                fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: 1,
                                marginLeft: 'auto'
                            }}>
                                {isThai ? 'ถัดไป' : 'NEXT'} →
                            </button>
                        )}
                        <span className="grimoire-page-num" style={{ position: 'static', marginLeft: currentPage >= totalPages - 1 ? 'auto' : '0' }}>
                            {isThai ? 'หน้า' : 'PAGE'} {currentPage * 2 + 2}
                        </span>
                    </div>
                </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default Grimoire;
