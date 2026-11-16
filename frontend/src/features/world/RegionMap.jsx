import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '@/shared/context/GameContext';
import { REGIONS } from '@/features/stages/stageData';
import { useLanguage } from '@/shared/i18n/useLanguage';
import { localRegion, localStage } from '@/shared/i18n/th';
import './regionmap.css';

const MAP_PARTICLES = Array.from({ length: 20 }, () => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 6}s`, animationDuration: `${4 + Math.random() * 4}s`,
}));

const RegionMap = () => {
    const { regionId } = useParams();
    const navigate = useNavigate();
    const { user } = useGame();
    const { isThai } = useLanguage();
    const region = REGIONS[regionId] && localRegion(REGIONS[regionId], isThai);

    if (!region) {
        navigate('/dashboard');
        return null;
    }

    const archiveCleared = regionId === '2'
        ? region.stages.filter(stage => user?.completedStages?.[`2-${stage.id}`]).length
        : 0;

    const getStageStatus = (stageIndex) => {
        const key = `${regionId}-${region.stages[stageIndex].id}`;
        if (user?.completedStages?.[key]) return 'complete';
        return 'active';
    };

    return (
        <div className={`rmap-page ${regionId === '1' ? 'chapter-one-noir' : ''} ${regionId === '2' ? 'chapter-two-restoring' : ''} ${regionId === '3' ? 'chapter-three-caverns' : ''} ${regionId === '4' ? 'chapter-four-peaks' : ''}`}
            style={regionId === '2' ? { '--archive-glow': 0.12 + archiveCleared / region.stages.length * 0.55 } : undefined}>
            {/* ─── Navbar ─── */}
            <nav className="rmap-navbar">
                <div className="rmap-nav-brand">
                    <div className="rmap-nav-brand-icon"><i className="fas fa-chess-rook"></i></div>
                    <span className="rmap-nav-brand-text">{isThai ? 'โลกแห่งสีที่สาบสูญ' : 'The Lost Spectrum'}</span>
                </div>

                <div className="rmap-nav-center">
                    <i className="fas fa-map-marked-alt"></i>
                    <span>{region.name}</span>
                </div>

                <div className="rmap-nav-actions">
                    <button className="rmap-back-btn" onClick={() => navigate('/dashboard')}>
                        <i className="fas fa-arrow-left"></i> {isThai ? 'กลับไปแผนที่' : 'Back to Map'}
                    </button>
                </div>
            </nav>

            {/* ─── Main Content ─── */}
            <div className="rmap-content">
                {/* Background particles */}
                <div className="rmap-bg-particles">
                    {MAP_PARTICLES.map((style, i) => (
                        <div key={i} className="rmap-bg-particle" style={style}></div>
                    ))}
                </div>

                {/* Region Header */}
                <div className="rmap-header">
                    <div className="rmap-header-badge">
                        <span className="rmap-header-region-num">{isThai ? 'ดินแดน' : 'Region'} {regionId}</span>
                    </div>
                    <h1 className="rmap-title">{region.name}</h1>
                    <p className="rmap-subtitle">{region.subtitle}</p>
                    <p className="rmap-description">{region.description}</p>
                </div>

                {/* Stage Timeline */}
                <div className="rmap-timeline">
                    <div className="rmap-timeline-line"></div>

                    {region.stages.map((rawStage, index) => {
                        const stage = localStage(rawStage, regionId, isThai);
                        const status = getStageStatus(index);
                        return (
                            <div key={stage.id} className={`rmap-stage-node ${status}`}>
                                {/* Timeline dot */}
                                <div className="rmap-stage-dot">
                                    <div className="rmap-stage-dot-inner">
                                        {status === 'complete' ? (
                                            <i className="fas fa-check"></i>
                                        ) : status === 'locked' ? (
                                            <i className="fas fa-lock"></i>
                                        ) : (
                                            <i className={stage.icon}></i>
                                        )}
                                    </div>
                                    {status === 'active' && <div className="rmap-stage-dot-pulse"></div>}
                                </div>

                                {/* Stage Card */}
                                <div
                                    className={`rmap-stage-card ${status}`}
                                    onClick={() => {
                                        navigate(`/region/${regionId}/stage/${stage.id}`);
                                    }}
                                >
                                    <div className="rmap-stage-card-header">
                                        <span className="rmap-stage-number">{isThai ? 'ด่าน' : 'Stage'} {regionId}-{regionId === '3' || regionId === '4' ? index + 1 : stage.id}</span>
                                        <span className="rmap-stage-type">
                                            {isThai
                                                ? ({ lesson: 'บทเรียน', challenge: 'ภารกิจ', boss: 'ด่านสุดท้าย', story: 'เนื้อเรื่อง' }[stage.type] || 'ภารกิจ')
                                                : ({ lesson: 'LESSON', challenge: 'CHALLENGE', boss: 'BOSS', story: 'STORY' }[stage.type] || 'CHALLENGE')}
                                        </span>
                                    </div>
                                    <h3 className="rmap-stage-name"><i className={`rmap-stage-card-icon ${stage.icon}`} aria-hidden="true" />{stage.name}</h3>
                                    <p className="rmap-stage-desc">{stage.description}</p>

                                    <div className="rmap-stage-card-footer">
                                        {status === 'complete' && (
                                            <span className="rmap-stage-status complete">
                                                <i className="fas fa-check-circle"></i> {isThai ? 'ผ่านแล้ว' : 'Completed'}
                                            </span>
                                        )}
                                        {status === 'active' && (
                                            <button className="rmap-stage-enter-btn">
                                                <i className="fas fa-play"></i> {isThai ? 'เข้าด่าน' : 'Enter Stage'}
                                            </button>
                                        )}
                                        {status === 'locked' && (
                                            <span className="rmap-stage-status locked">
                                                <i className="fas fa-lock"></i> {isThai ? 'ยังไม่ปลดล็อก' : 'Locked'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RegionMap;
