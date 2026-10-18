import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import api from '../api/axios';

const GameContext = createContext();
// Existing consumers import the context hook alongside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const generation = useRef(0);

  const checkSession = async () => {
    const version = ++generation.current;
    setLoading(true);
    setSessionError('');
    try {
      const account = await api.get('/api/user');
      const saved = await api.get('/api/progress');
      if (version === generation.current) setUser({ ...account.data.user, ...saved.data.progress });
    } catch (error) {
      if (version !== generation.current) return;
      setUser(null);
      if (error.response?.status !== 401) setSessionError('Cannot connect to your account. Please retry.');
    } finally {
      if (version === generation.current) setLoading(false);
    }
  };

  useEffect(() => { checkSession(); }, []);

  const login = async (email, password) => {
    const version = ++generation.current;
    try {
      const res = await api.post('/api/login', { email, password });
      if (!res.data.success) return { success: false, message: res.data.message };
      const saved = await api.get('/api/progress');
      if (version === generation.current) {
        setUser({ ...res.data.user, ...saved.data.progress });
        setSessionError('');
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Unable to log in and load progress. Please retry.' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
      ++generation.current;
      setUser(null);
    } catch {
      setSessionError('Logout failed. Please retry.');
    }
  };

  const saveAttempt = async (attempt) => {
    const version = generation.current;
    const res = await api.post('/api/submissions', attempt);
    if (version === generation.current) {
      setUser(previous => previous ? { ...previous, ...res.data.progress } : previous);
    }
    return res.data;
  };

  const updateProfile = async (username) => {
    const version = generation.current;
    const res = await api.patch('/api/profile', { username });
    if (version === generation.current) {
      setUser(previous => previous ? { ...previous, ...res.data.user } : previous);
    }
    return res.data;
  };

  return (
    <GameContext.Provider value={{ user, loading, login, logout, saveAttempt, updateProfile }}>
      {sessionError ? (
        <div role="alert" style={{ padding: 32, color: 'white' }}>
          <p>{sessionError}</p>
          <button onClick={checkSession}>Retry connection</button>
        </div>
      ) : loading ? <p style={{ color: 'white', padding: 24 }}>Loading your progress...</p> : children}
    </GameContext.Provider>
  );
};
