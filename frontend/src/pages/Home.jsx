import React from 'react';
import { Link } from 'react-router-dom';
import bgAuth from '../assets/images/bg-auth.png';
import './auth.css';

const Home = () => (
    <div className="auth-page">
        <div className="auth-bg">
            <img src={bgAuth} alt="" />
        </div>

        <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="auth-logo" style={{ width: '80px', height: '80px', fontSize: '2.2rem' }}>
                <i className="fas fa-chess-rook"></i>
            </div>
            <h1 className="auth-title" style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
                CODEQUEST
            </h1>
            <p className="auth-subtitle" style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                Master the arcane arts of Python in a world of neon and magic.
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="auth-btn" style={{ fontSize: '1.1rem', padding: '1.1rem 2.5rem' }}>
                    <i className="fas fa-dungeon"></i> ENTER THE REALM
                </button>
            </Link>
        </div>

        <div className="auth-footer">
            © 2025 The Lost Spectrum. All rights reserved. Access to the archives is restricted to authorized personnel of the Grand Tower.
        </div>
    </div>
);

export default Home;
