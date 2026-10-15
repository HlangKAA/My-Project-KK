import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

// Configure Axios
const api = axios.create({
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
        console.log("Using Mock User (Backend Offline / Bypass enabled)");
        setUser({
          player_id: 'mock-123',
          username: 'GuestWizard',
          email: 'guest@lostspectrum.com',
          level: 99, // Max level to unlock regions
          stageProgress: {}
        });
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
    if (user) {
      const newLevel = Math.max(user.level || 1, levelId + 1);
      const updatedUser = { ...user, level: newLevel };
      setUser(updatedUser);
    }
  };

  /**
   * Track stage completion within a region.
   * stageProgress = { regionId: completedCount }
   * e.g., { 1: 2 } means region 1 has stages 1 and 2 completed
   */
  const updateStageProgress = (regionId, stageId) => {
    if (user) {
      const currentProgress = user.stageProgress || {};
      const currentCompleted = currentProgress[regionId] || 0;
      const newCompleted = Math.max(currentCompleted, stageId);
      
      const updatedProgress = { ...currentProgress, [regionId]: newCompleted };
      
      // Also update the region-level progress (for Dashboard lock/unlock)
      // A region is "complete" when all its stages are done
      const newLevel = Math.max(user.level || 1, regionId + 1);
      
      const updatedUser = { 
        ...user, 
        stageProgress: updatedProgress,
        level: newLevel
      };
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProgress,
    updateStageProgress
  };

  return (
    <GameContext.Provider value={value}>
      {!loading && children}
    </GameContext.Provider>
  );
};

