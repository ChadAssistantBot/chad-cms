// Assuming App.jsx is structured similarly to common React setups
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Finances from './pages/Finances';
import Ventures from './pages/Ventures';
import Kanban from './pages/Kanban';
import AuditLog from './pages/AuditLog'; // Import the new AuditLog page
import Login from './pages/Login';
import './App.css'; // Assuming global styles

function App() {
  // Mock logout function for example purposes
  const handleLogout = () => {
    alert('Logged out!');
    // In a real app, you'd clear tokens, user sessions, etc.
  };

  // Mock authentication check - replace with your actual auth logic
  const isAuthenticated = true; // Assume user is authenticated for now

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isAuthenticated ? (
            <Route path="/login" element={<Login />} />
          ) : (
            <>
              {/* Protected Routes */}
              <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
              <Route path="/agents" element={<Agents onLogout={handleLogout} />} />
              <Route path="/finances" element={<Finances onLogout={handleLogout} />} />
              <Route path="/ventures" element={<Ventures onLogout={handleLogout} />} />
              <Route path="/kanban" element={<Kanban onLogout={handleLogout} />} />
              <Route path="/audit" element={<AuditLog onLogout={handleLogout} />} /> {/* New Route */}
              
              {/* Fallback or 404 Route */}
              {/* <Route path="*" element={<NotFound onLogout={handleLogout} />} /> */}
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
