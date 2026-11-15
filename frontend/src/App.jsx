import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { GameProvider, useGame } from '@/shared/context/GameContext';
import { LanguageProvider } from '@/shared/i18n/LanguageContext';

// Pages
import Home from '@/features/auth/Home';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import ForgotPassword from '@/features/auth/ForgotPassword';
import ResetPassword from '@/features/auth/ResetPassword';
import Dashboard from '@/features/world/Dashboard';
import RegionMap from '@/features/world/RegionMap';
import StagePage from '@/features/gameplay/StagePage';
import ProfilePage from '@/features/character/ProfilePage';

// Redirect old /world/:zoneId to code-driven /region/:regionId
const WorldRedirect = () => {
  const { zoneId } = useParams();
  return <Navigate to={`/region/${zoneId || 1}`} replace />;
};

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
      <LanguageProvider><GameProvider>
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
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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

          {/* Redirect /world/:zoneId to code-driven /region/:zoneId */}
          <Route 
            path="/world/:zoneId" 
            element={
              <ProtectedRoute>
                <WorldRedirect />
              </ProtectedRoute>
            } 
          />

          {/* Backward compatibility: redirect old /game/:levelId */}
          <Route 
            path="/game/:levelId" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </GameProvider></LanguageProvider>
    </Router>
  );
}

export default App;

