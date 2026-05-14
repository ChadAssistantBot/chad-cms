import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Loader2, Search, Filter, Calendar, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const PRIORITIES = [
  { value: 'P0', label: 'P0', color: 'bg-red-500/20 text-red border-red-500/30' },
  { value: 'P1', label: 'P1', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'P2', label: 'P2', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'P3', label: 'P3', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

const STATUSES = ['intake', 'triage', 'backlog', 'ready', 'in-progress', 'waiting', 'review', 'done'];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'P2',
    status: 'intake',
    owner: 'Chad',
    due_date: '',
    tags: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const { error } = await supabase.from('tasks').insert([{
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        owner: formData.owner,
        due_date: formData.due_date || null,
        tags: tagsArray,
        approval_required: false,
      }]);

      if (error) throw error;

      toast.success('Task created!');
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'P2',
        status: 'intake',
        owner: 'Chad',
        due_date: '',
        tags: '',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  }

  async function updateStatus(taskId, newStatus) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  }

  async function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      intake: 'bg-gray-500',
      triage: 'bg-blue-500',
      backlog: 'bg-purple-500',
      ready: 'bg-indigo-500',
      'in-progress': 'bg-yellow-500',
      waiting: 'bg-orange-500',
      review: 'bg-pink-500',
      done: 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Tasks</h1>
          <p className="text-muted">Manage and track all tasks</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="gold" icon={Plus}>
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all' ? 'bg-gold/20 text-gold' : 'bg-panel-strong text-muted hover:text-white'
            }`}
          >
            All
          </button>
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
                filter === status ? 'bg-gold/20 text-gold' : 'bg-panel-strong text-muted hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-muted text-lg mb-4">No tasks found</p>
            <Button onClick={() => setIsModalOpen(true)} variant="gold">
              Create your first task
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className="hover:border-gold/50 transition">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Priority & Status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-bold rounded border ${
                    PRIORITIES.find(p => p.value === task.priority)?.color || PRIORITIES[2].color
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-bold rounded text-white ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted line-clamp-2 mb-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <span>{task.owner}</span>
                    {task.tags && task.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {task.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="bg-panel-strong border border-line rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                    aria-label="Update task status"
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <Button
                    onClick={() => deleteTask(task.id)}
                    variant="danger"
                    className="!px-2"
                    aria-label="Delete task"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Review PR #123"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-panel-strong border border-line rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-gold transition"
              rows="3"
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-panel-strong border border-line rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold"
              >
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-panel-strong border border-line rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold"
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            />

            <Input
              label="Owner"
              value={formData.owner}
              onChange={(e) => setFormData({...formData, owner: e.target.value})}
            />
          </div>

          <Input
            label="Tags (comma separated)"
            placeholder="e.g. coding, frontend, bug"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
