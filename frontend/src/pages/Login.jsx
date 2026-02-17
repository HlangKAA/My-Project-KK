import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useGame();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ padding: '40px', width: '300px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary-cyan)', marginBottom: '30px' }}>IDENTIFY YOURSELF</h2>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Email Access Key" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '10px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Secret Code" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '10px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                        required
                    />
                    
                    {error && <div style={{ color: '#ff5f56', fontSize: '0.85rem' }}>{error}</div>}

                    <button type="submit" className="btn-neon" style={{ width: '100%', marginTop: '10px' }}>
                        LOGIN
                    </button>
                </form>

                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
                    New explorer? <span style={{ color: 'var(--primary-cyan)', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register Protocol</span>
                </div>
            </div>
        </div>
    );
};
export default Login;
