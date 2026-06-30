import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgAuth from '../assets/images/bg-auth.png';
import './auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Incantations do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('/api/signup', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            if (res.data.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'The void consumed your request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <img src={bgAuth} alt="" />
            </div>

            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="auth-logo">
                        <i className="fas fa-scroll"></i>
                    </div>
                    <h1 className="auth-title">JOIN THE ORDER</h1>
                    <p className="auth-subtitle">Inscribe your name in the ancient archives.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label className="auth-label">Chosen Name</label>
                        <div className="auth-input-wrap">
                            <i className="fas fa-hat-wizard auth-icon-left"></i>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Ex: Merlin_The_Wise"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Runic Mail</label>
                        <div className="auth-input-wrap">
                            <i className="fas fa-envelope auth-icon-left"></i>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="mage@realm.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Secret Incantation</label>
                        <div className="auth-input-wrap">
                            <i className="fas fa-lock auth-icon-left"></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <i
                                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} auth-icon-right`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Confirm Incantation</label>
                        <div className="auth-input-wrap">
                            <i className="fas fa-lock auth-icon-left"></i>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                            <i
                                className={`fas ${showConfirm ? 'fa-eye' : 'fa-eye-slash'} auth-icon-right`}
                                onClick={() => setShowConfirm(!showConfirm)}
                            ></i>
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin"></i> FORGING...</>
                        ) : (
                            <><i className="fas fa-feather-alt"></i> CREATE YOUR LEGACY</>
                        )}
                    </button>
                </form>

                <div className="auth-bottom">
                    Already have an ID?{' '}
                    <span className="auth-link" onClick={() => navigate('/login')}>
                        Enter the Realm
                    </span>
                </div>
            </div>

            <div className="auth-footer">
                © 2025 The Lost Spectrum. All rights reserved. Access to the archives is restricted to authorized personnel of the Grand Tower.
            </div>
        </div>
    );
};

export default Register;
