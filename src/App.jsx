import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import toast from 'react-hot-toast';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Kanban = lazy(() => import('./pages/Kanban'));
const Finances = lazy(() => import('./pages/Finances'));
const Ventures = lazy(() => import('./pages/Ventures'));
const Agents = lazy(() => import('./pages/Agents'));
const AuditLog = lazy(() => import('./pages/AuditLog'));
const Login = lazy(() => import('./pages/Login'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
}

// Auth Guard - protects routes that require login
function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-muted">Loading Chad CMS...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Sidebar>{children}</Sidebar>;
}

// Layout wrapper for pages that have their own sidebar (legacy pages)
function LegacyLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Login screen with auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl">💵</div>
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-muted">Loading Chad CMS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main app with Sidebar layout */}
          <Route path="/" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/tasks" element={
            <AuthGuard>
              <Tasks />
            </AuthGuard>
          } />
          <Route path="/kanban" element={
            <AuthGuard>
              <Kanban />
            </AuthGuard>
          } />
          <Route path="/finances" element={
            <AuthGuard>
              <Finances />
            </AuthGuard>
          } />
          <Route path="/ventures" element={
            <AuthGuard>
              <Ventures />
            </AuthGuard>
          } />
          <Route path="/agents" element={
            <AuthGuard>
              <Agents />
            </AuthGuard>
          } />
          <Route path="/audit" element={
            <AuthGuard>
              <AuditLog />
            </AuthGuard>
          } />
          
          {/* Redirect login page when logged in */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* 404 */}
          <Route path="*" element={
            <Navigate to="/" replace />
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}
