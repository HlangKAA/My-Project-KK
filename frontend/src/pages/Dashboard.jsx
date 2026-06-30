import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import regionRedForest from '../assets/images/region-red-forest.png';
import regionAshPeaks from '../assets/images/region-ash-peaks.png';
import regionWhisperingCaverns from '../assets/images/region-whispering-caverns.png';
import './dashboard.css';

const REGIONS = [
    {
        id: 1,
        name: 'THE RED FOREST',
        image: regionRedForest,
        top: '42%',
        left: '28%',
        essence: { name: 'Crimson Vitality', color: '#dc2626', pct: 75, potency: 'HIGH POTENCY' }
    },
    {
        id: 2,
        name: 'ASH PEAKS',
        image: regionAshPeaks,
        top: '28%',
        left: '55%',
        essence: { name: 'Veridian Wisdom', color: '#16a34a', pct: 45, potency: 'MODERATE POTENCY' }
    },
    {
        id: 3,
        name: 'WHISPERING CAVERNS',
        image: regionWhisperingCaverns,
        top: '62%',
        left: '52%',
        essence: { name: 'Azure Focus', color: '#3b82f6', pct: 10, potency: 'DEPLETED' }
    }
];

const Dashboard = () => {
    const { user, logout } = useGame();
    const navigate = useNavigate();
    const userLevel = user?.level || 1;

    const getRegionStatus = (regionId) => {
        if (regionId < userLevel) return 'complete';
        if (regionId === userLevel) return 'active';
        return 'locked';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1a0a0a', color: '#f1e8e0' }}>
            {/* ─── Top Navbar ─── */}
            <nav className="dash-navbar">
                <div className="dash-brand">
                    <div className="dash-brand-icon">
                        <i className="fas fa-chess-rook"></i>
                    </div>
                    <span className="dash-brand-text">The Lost Spectrum</span>
                </div>

                <div className="dash-nav-links">
                    <button className="dash-nav-link active">
                        <i className="fas fa-map"></i> MAP
                    </button>
                    <button className="dash-nav-link">
                        <i className="fas fa-book"></i> JOURNAL
                    </button>
                    <button className="dash-nav-link">
                        <i className="fas fa-cog"></i> SETTINGS
                    </button>
                </div>

                <div className="dash-user">
                    <div className="dash-user-info">
                        <div className="dash-user-role">SCHOLAR</div>
                        <div className="dash-user-name">{user?.username || 'Explorer'}</div>
                    </div>
                    <div className="dash-avatar">
                        <i className="fas fa-hat-wizard"></i>
                    </div>
                    <button className="dash-logout" onClick={logout} title="Disconnect Session">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </nav>

            {/* ─── Main Content ─── */}
            <div className="dash-main">
                {/* ─── Map Area ─── */}
                <div className="dash-map-area">
                    <div className="dash-header">
                        <div className="dash-header-actions">
                            <div>
                                <h1 className="dash-title">Mission Select</h1>
                                <p className="dash-quote">"The path is illuminated only by what you know."</p>
                            </div>
                            <button className="dash-view-btn">
                                <i className="fas fa-scroll"></i> VIEW LEGENDS
                            </button>
                        </div>
                    </div>

                    <div className="dash-map">
                        <div className="dash-map-search">
                            <input type="text" placeholder="Search regions..." />
                        </div>

                        {/* Region Nodes */}
                        {REGIONS.map((region) => {
                            const status = getRegionStatus(region.id);
                            return (
                                <Link
                                    key={region.id}
                                    to={status !== 'locked' ? `/game/${region.id}` : '#'}
                                    className="dash-region"
                                    style={{ top: region.top, left: region.left }}
                                    onClick={(e) => status === 'locked' && e.preventDefault()}
                                >
                                    <div className={`dash-region-icon ${status}`}>
                                        <img src={region.image} alt={region.name} />
                                        {status === 'locked' && (
                                            <span className="dash-region-badge lock">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                        )}
                                        {status === 'complete' && (
                                            <span className="dash-region-badge check">
                                                <i className="fas fa-check"></i>
                                            </span>
                                        )}
                                    </div>
                                    <span className={`dash-region-label ${status}`}>
                                        {region.name}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Map Controls */}
                        <div className="dash-map-controls">
                            <button className="dash-map-ctrl-btn"><i className="fas fa-plus"></i></button>
                            <button className="dash-map-ctrl-btn"><i className="fas fa-minus"></i></button>
                            <button className="dash-map-ctrl-btn" style={{ marginTop: '0.5rem' }}>
                                <i className="fas fa-crosshairs"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Sidebar: Essence Inventory ─── */}
                <aside className="dash-sidebar">
                    <h2 className="dash-sidebar-title">
                        <i className="fas fa-flask"></i> Essence Inventory
                    </h2>

                    {REGIONS.map((region) => (
                        <div key={region.id} className="dash-essence-card">
                            <div className="dash-essence-header">
                                <span className="dash-essence-name">{region.essence.name}</span>
                                <span className="dash-essence-pct" style={{ color: region.essence.color }}>
                                    {region.essence.pct}%
                                </span>
                            </div>
                            <div className="dash-essence-sub">{region.essence.potency}</div>
                            <div className="dash-essence-bar">
                                <div
                                    className="dash-essence-fill"
                                    style={{
                                        width: `${region.essence.pct}%`,
                                        background: `linear-gradient(90deg, ${region.essence.color}40, ${region.essence.color})`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}

                    <div className="dash-resonance">
                        <span className="dash-resonance-label">Total Resonance</span>
                        <div>
                            <span className="dash-resonance-value">1,240</span>
                            <span className="dash-resonance-xp">XP</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
