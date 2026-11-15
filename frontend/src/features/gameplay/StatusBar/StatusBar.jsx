/*  ═══════════════════════════════════════════════════
    StatusBar — HP, MP, XP, and Quest progress bar
    ═══════════════════════════════════════════════════ */

import React from 'react';
import './StatusBar.css';

export default function StatusBar({ hp, mp, xp, questProgress, totalQuests, zoneName }) {
    return (
        <div className="sb-bar">
            {/* HP */}
            <div className="sb-stat">
                <div className="sb-stat-icon sb-hp-icon">
                    <i className="fas fa-heart" />
                </div>
                <div className="sb-stat-track">
                    <div className="sb-stat-fill sb-hp-fill" style={{ width: `${hp}%` }} />
                </div>
                <span className="sb-stat-value">{hp}</span>
            </div>

            {/* MP */}
            <div className="sb-stat">
                <div className="sb-stat-icon sb-mp-icon">
                    <i className="fas fa-flask" />
                </div>
                <div className="sb-stat-track">
                    <div className="sb-stat-fill sb-mp-fill" style={{ width: `${mp}%` }} />
                </div>
                <span className="sb-stat-value">{mp}</span>
            </div>

            {/* Divider */}
            <div className="sb-divider" />

            {/* Quest progress */}
            <div className="sb-quest">
                <i className="fas fa-scroll" />
                <span>Quests: {questProgress}/{totalQuests}</span>
            </div>

            {/* XP */}
            <div className="sb-xp">
                <i className="fas fa-star" />
                <span>{xp} XP</span>
            </div>

            {/* Zone name */}
            <div className="sb-zone">
                <i className="fas fa-map-marker-alt" />
                <span>{zoneName}</span>
            </div>
        </div>
    );
}
