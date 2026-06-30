import React, { useState } from 'react';
import './grimoire.css';

const WHEEL_COLORS = [
    { name: 'red', hex: '#dc2626', angle: 0 },
    { name: 'orange', hex: '#f97316', angle: 51 },
    { name: 'yellow', hex: '#eab308', angle: 103 },
    { name: 'green', hex: '#16a34a', angle: 154 },
    { name: 'blue', hex: '#3b82f6', angle: 206 },
    { name: 'indigo', hex: '#6366f1', angle: 257 },
    { name: 'violet', hex: '#8b5cf6', angle: 308 },
];

const Grimoire = ({ level, startPage = 0, onClose }) => {
    const pages = level.grimoire;
    const [currentPage, setCurrentPage] = useState(startPage);

    if (!pages || pages.length === 0) return null;

    const g = pages[currentPage] || pages[0];
    const totalPages = pages.length;

    const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
    const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

    return (
        <div className="grimoire-overlay" onClick={onClose}>
            {/* Close Button */}
            <button className="grimoire-close" onClick={onClose}>
                <i className="fas fa-times"></i>
                <span className="grimoire-close-label">SEAL</span>
            </button>

            <div className="grimoire-book" onClick={(e) => e.stopPropagation()}>
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
                    <div className="grimoire-index-demo">
                        <div style={{ textAlign: 'center' }}>
                            <div className="grimoire-index-box">0</div>
                            <div className="grimoire-index-label">Index</div>
                        </div>
                        <span className="grimoire-index-arrow">→</span>
                        <div className="grimoire-index-value">
                            {g.leftCode.includes('[') ?
                                g.leftCode.match(/\['([^']+)'/)?.[1] || g.leftCode.match(/= (\d+)/)?.[1] || 'item'
                                : g.leftCode.match(/= (\S+)/)?.[1] || 'value'}
                        </div>
                    </div>

                    <p className="grimoire-note" dangerouslySetInnerHTML={{ __html: g.leftNote }} />

                    {/* Incantations */}
                    <div className="grimoire-incantations-title">Common Incantations:</div>
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
                            PAGE {currentPage * 2 + 1}
                        </span>
                        {currentPage > 0 && (
                            <button onClick={handlePrev} style={{
                                background: 'none', border: '1px solid #b8a88a', borderRadius: 6,
                                color: '#5a4a3a', padding: '0.3rem 0.8rem', cursor: 'pointer',
                                fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: 1
                            }}>
                                ← PREV
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
                                    <span className="grimoire-wheel-label">Primary<br />Power</span>
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
                                NEXT →
                            </button>
                        )}
                        <span className="grimoire-page-num" style={{ position: 'static', marginLeft: currentPage >= totalPages - 1 ? 'auto' : '0' }}>
                            PAGE {currentPage * 2 + 2}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grimoire;
