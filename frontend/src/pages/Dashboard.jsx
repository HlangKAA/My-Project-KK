import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Dashboard = () => {
    const { user, logout } = useGame();
    
    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 className="title-neon" style={{ fontSize: '1.8rem', margin: 0 }}>WIZARD MONITOR</h2>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--primary-cyan)', fontWeight: 'bold' }}>{user?.username || 'Guest'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Level {user?.level || 1} Apprentice</div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>AVAILABLE MISSIONS</h3>
                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    <Link to="/game/1" style={{ textDecoration: 'none' }}>
                        <button className="btn-neon" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                            <span>LEVEL 01: THE PRISM</span>
                            <span>STATUS: {user?.level > 1 ? 'COMPLETE' : 'ACTIVE'}</span>
                        </button>
                    </Link>
                    <Link to="/game/2" style={{ textDecoration: 'none' }}>
                        <button className="btn-neon" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', opacity: user?.level >= 2 ? 1 : 0.5 }}>
                            <span>LEVEL 02: THE MATRIX</span>
                            <span>{user?.level >= 2 ? (user?.level > 2 ? 'COMPLETE' : 'ACTIVE') : 'LOCKED'}</span>
                        </button>
                    </Link>
                    <Link to="/game/3" style={{ textDecoration: 'none' }}>
                        <button className="btn-neon" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', opacity: user?.level >= 3 ? 1 : 0.5 }}>
                            <span>LEVEL 03: THE LIGHT</span>
                            <span>{user?.level >= 3 ? 'ACTIVE' : 'LOCKED'}</span>
                        </button>
                    </Link>
                </div>
            </div>

            <button onClick={logout} style={{ marginTop: '30px', background: 'transparent', border: 'none', color: '#ff5f56', cursor: 'pointer', fontSize: '1rem' }}>
                <i className="fas fa-sign-out-alt"></i> DISCONNECT SESSION
            </button>
        </div>
    );
};
export default Dashboard;
