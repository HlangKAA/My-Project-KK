import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { REGIONS } from '../data/stageData';
import './regionmap.css';

const RegionMap = () => {
    const { regionId } = useParams();
    const navigate = useNavigate();
    const { user } = useGame();
    const region = REGIONS[regionId];

    if (!region) {
        navigate('/dashboard');
        return null;
    }

    const getStageStatus = (stageIndex) => {
        const completedStages = user?.stageProgress?.[regionId] || 0;
        if (stageIndex < completedStages) return 'complete';
        return 'active';
    };

    return (
        <div className="rmap-page">
            {/* ─── Navbar ─── */}
            <nav className="rmap-navbar">
                <div className="rmap-nav-brand">
                    <div className="rmap-nav-brand-icon"><i className="fas fa-chess-rook"></i></div>
                    <span className="rmap-nav-brand-text">The Lost Spectrum</span>
                </div>

                <div className="rmap-nav-center">
                    <i className="fas fa-map-marked-alt"></i>
                    <span>{region.name}</span>
                </div>

                <div className="rmap-nav-actions">
                    <button className="rmap-back-btn" onClick={() => navigate('/dashboard')}>
                        <i className="fas fa-arrow-left"></i> Back to Map
                    </button>
                </div>
            </nav>

            {/* ─── Main Content ─── */}
            <div className="rmap-content">
                {/* Background particles */}
                <div className="rmap-bg-particles">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="rmap-bg-particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${4 + Math.random() * 4}s`
                        }}></div>
                    ))}
                </div>

                {/* Region Header */}
                <div className="rmap-header">
                    <div className="rmap-header-badge">
                        <span className="rmap-header-region-num">Region {regionId}</span>
                    </div>
                    <h1 className="rmap-title">{region.name}</h1>
                    <p className="rmap-subtitle">{region.subtitle}</p>
                    <p className="rmap-description">{region.description}</p>
                </div>

                {/* Stage Timeline */}
                <div className="rmap-timeline">
                    <div className="rmap-timeline-line"></div>

                    {region.stages.map((stage, index) => {
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
                                        <span className="rmap-stage-number">Stage {regionId}-{stage.id}</span>
                                        <span className={`rmap-stage-type ${stage.type}`}>
                                            {stage.type === 'story' ? '◆ STORY' : '◇ CHALLENGE'}
                                        </span>
                                    </div>
                                    <h3 className="rmap-stage-name">{stage.name}</h3>
                                    <p className="rmap-stage-desc">{stage.description}</p>

                                    <div className="rmap-stage-card-footer">
                                        {status === 'complete' && (
                                            <span className="rmap-stage-status complete">
                                                <i className="fas fa-check-circle"></i> Completed
                                            </span>
                                        )}
                                        {status === 'active' && (
                                            <button className="rmap-stage-enter-btn">
                                                <i className="fas fa-play"></i> Enter Stage
                                            </button>
                                        )}
                                        {status === 'locked' && (
                                            <span className="rmap-stage-status locked">
                                                <i className="fas fa-lock"></i> Locked
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
