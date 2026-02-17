import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/auth/api/signup', formData);
            if (res.data.success) {
                // Redirect to login after successful registration
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ padding: '40px', width: '350px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary-cyan)', marginBottom: '30px' }}>INITIATE REGISTRATION</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Codename (Username)" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ padding: '10px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email Access Key" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ padding: '10px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Secret Code" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ padding: '10px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                        required
                    />
                    
                    {error && <div style={{ color: '#ff5f56', fontSize: '0.85rem' }}>{error}</div>}

                    <button type="submit" className="btn-neon" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                        {loading ? 'PROCESSING...' : 'REGISTER'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
                    Already have an ID? <span style={{ color: 'var(--primary-cyan)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login Protocol</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
