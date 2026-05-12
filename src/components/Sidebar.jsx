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
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import { useForm } from 'react-hook-form';
import { getCurrentUser, canCreate, canDelete } from '../lib/rbac';

const Sidebar = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // State for the new venture modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCreateVenture = async (data) => {
    try {
      // In a real app, you'd interact with your backend/API here
      // For now, we'll just log it and close the modal
      console.log('Creating new venture:', data);
      toast.success('Venture creation initiated!');
      setIsCreateModalOpen(false);
      reset();
      // Ideally, you'd also re-fetch the list of ventures
    } catch (error) {
      toast.error('Failed to create venture.');
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/agents', label: 'Agents', icon: Users },
    { path: '/finances', label: 'Finances', icon: DollarSign },
    { path: '/ventures', label: 'Ventures', icon: Briefcase },
    { path: '/kanban', label: 'Kanban Board', icon: Kanban },
    { path: '/audit', label: 'Audit Log', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-panel border-r border-line p-4 flex flex-col h-screen fixed left-0 top-0">
      <div className="flex items-center justify-center mb-6">
        <div className="text-4xl mr-2">💰</div> 
        <h1 className="text-2xl font-bold">Chad OS</h1>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all data..."
            className="w-full pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
      
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-gold to-yellow-300 text-bg'
                      : 'hover:bg-panel-strong hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Conditionally render "New Venture" button based on role */}
      {canCreate(currentUser.role) && (
        <div className="mt-4 mb-2 px-4">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center gap-2 bg-gold text-bg font-bold hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> New Venture
          </Button>
        </div>
      )}

      {/* Modal for creating a new venture */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Venture">
        <form onSubmit={handleSubmit(handleCreateVenture)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Venture Name</label>
            <Input {...register('name', { required: 'Name is required' })} placeholder="Project Phoenix" />
            {errors.name && <p className="text-red text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              {...register('description')} 
              className="w-full bg-bg border border-line rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              rows="3"
              placeholder="A P2P marketplace for sustainable goods..."
            />
             {errors.description && <p className="text-red text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Time to Revenue</label>
              <Input {...register('time_to_revenue')} placeholder="e.g. 1-3 months" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Startup Cost</label>
              <Input {...register('startup_cost')} placeholder="e.g. €1000" />
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-gold text-bg font-bold">Create Venture</Button>
          </div>
        </form>
      </Modal>

      <div className="mt-auto">
        <Button onClick={onLogout} className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-red-500">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
