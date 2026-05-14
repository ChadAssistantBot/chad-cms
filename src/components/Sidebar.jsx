import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  DollarSign,
  Briefcase,
  Kanban,
  LogOut,
  Search,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home, exact: true },
    { path: '/tasks', label: 'Tasks', icon: Kanban },
    { path: '/kanban', label: 'Kanban Board', icon: Kanban },
    { path: '/finances', label: 'Finances', icon: DollarSign },
    { path: '/ventures', label: 'Ventures', icon: Briefcase },
    { path: '/agents', label: 'Agents', icon: Users },
    { path: '/audit', label: 'Audit Log', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-panel-strong focus-ring"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 glass-panel flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-line">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="text-2xl flex-shrink-0">💵</div>
            {!isCollapsed && (
              <div>
                <div className="font-bold text-lg">Chad CMS</div>
                <div className="text-xs text-muted">Enterprise Platform</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full mt-2 p-2 rounded-lg hover:bg-line/20 transition focus-ring"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-fast ${
                  isActive
                    ? 'bg-gold/10 text-gold font-semibold'
                    : 'text-muted hover:text-white hover:bg-line/20'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-line">
          {!isCollapsed && user && (
            <div className="mb-3 px-2">
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs text-muted">{user.role}</div>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full ${isCollapsed ? 'justify-center p-2' : ''}`}
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
