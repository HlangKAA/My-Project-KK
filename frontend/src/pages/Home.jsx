import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div style={{ 
        textAlign: 'center', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'radial-gradient(circle at center, #1a202c 0%, #0d1117 100%)'
    }}>
        <h1 className="title-neon">CODEQUEST</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '30px' }}>
            Master the arcane arts of Python in a world of neon and magic.
        </p>
        <Link to="/login">
            <button className="btn-neon" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
                ENTER THE REALM
            </button>
        </Link>
    </div>
);
export default Home;
