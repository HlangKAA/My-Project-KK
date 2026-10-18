import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CharacterDemo from './pages/CharacterDemo';
import SpriteEditor from './pages/SpriteEditor';
import Dashboard from './pages/Dashboard';
import RegionMap from './pages/RegionMap';
import StagePage from './pages/StagePage';
import ProfilePage from './pages/ProfilePage';

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
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/demo-characters" element={<CharacterDemo />} />
          <Route path="/sprite-editor" element={<SpriteEditor />} />
          
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
      </GameProvider>
    </Router>
  );
}

export default App;

