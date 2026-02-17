import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

// Configure Axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // Auth routes base URL
  withCredentials: true // Important for cookies/session
});

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { player_id, username, email }
  const [loading, setLoading] = useState(true);

  // Initialize - Check if user is logged in (session check)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/api/user');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        // Not logged in or error
        console.log("Session check failed/Not logged in");
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateProgress = (levelId) => {
    // TODO: Sync with backend API for level progress
    if (user) {
      // Temporary local update for UI responsiveness
      // In real app, call API to save progress
      // const updatedUser = { ...user, level: Math.max(user.level || 0, levelId + 1) };
      // setUser(updatedUser);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProgress
  };

  return (
    <GameContext.Provider value={value}>
      {!loading && children}
    </GameContext.Provider>
  );
};
