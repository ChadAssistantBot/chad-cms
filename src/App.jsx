import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Finances from './pages/Finances'
import Ventures from './pages/Ventures'
import Agents from './pages/Agents'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('cms_auth')
    setIsAuthenticated(auth === 'true')
  }, [])

  const handleLogin = () => {
    localStorage.setItem('cms_auth', 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('cms_auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
          <Route path="/finances" element={<Finances onLogout={handleLogout} />} />
          <Route path="/ventures" element={<Ventures onLogout={handleLogout} />} />
          <Route path="/agents" element={<Agents onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
