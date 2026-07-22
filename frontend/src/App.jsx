import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegionMap from './pages/RegionMap';
import StagePage from './pages/StagePage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useGame();
  
  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading magic...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/region/:regionId" 
            element={
              <ProtectedRoute>
                <RegionMap />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/region/:regionId/stage/:stageId" 
            element={
              <ProtectedRoute>
                <StagePage />
              </ProtectedRoute>
            } 
          />

          {/* Backward compatibility: redirect old /game/:levelId */}
          <Route 
            path="/game/:levelId" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;

