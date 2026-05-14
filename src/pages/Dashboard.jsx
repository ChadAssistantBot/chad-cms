import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckSquare, TrendingUp, Rocket, Users, Loader2, Search } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function Dashboard() {
  const [stats, setStats] = useState({ tasks: 0, ventures: 0, revenue: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [tasksRes, venturesRes, transactionsRes] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('ventures').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('*'),
      ]);

      const income = transactionsRes.data?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const expenses = transactionsRes.data?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      setStats({
        tasks: tasksRes.count || 0,
        ventures: venturesRes.count || 0,
        revenue: income,
        expenses: expenses,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      const [tasks, ventures, transactions] = await Promise.all([
        supabase.from('tasks').select('*').or(`title.ilike.%${searchQuery}%`),
        supabase.from('ventures').select('*').or(`name.ilike.%${searchQuery}%`),
        supabase.from('transactions').select('*').or(`description.ilike.%${searchQuery}%`),
      ]);

      const results = [
        ...(tasks.data || []).map(t => ({ type: 'Task', ...t })),
        ...(ventures.data || []).map(v => ({ type: 'Venture', ...v })),
        ...(transactions.data || []).map(t => ({ type: 'Transaction', ...t })),
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }

  const netProfit = stats.revenue - stats.expenses;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome Back, Chad!</h1>
          <p className="text-muted">Here's what's happening across your empire.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="w-full sm:w-80">
          <Input
            placeholder="Search tasks, ventures, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
          <div className="space-y-2">
            {searchResults.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-panel-strong rounded-lg">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  item.type === 'Task' ? 'bg-blue/20 text-blue' :
                  item.type === 'Venture' ? 'bg-green/20 text-green' :
                  'bg-gold/20 text-gold'
                }`}>
                  {item.type}
                </span>
                <span className="text-sm font-medium">
                  {item.title || item.name || item.description}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-gold/50 transition-normal">
            <CheckSquare className="w-8 h-8 text-blue mb-4" />
            <div className="text-3xl font-bold mb-1">{stats.tasks}</div>
            <div className="text-sm text-muted">Total Tasks</div>
          </Card>

          <Card className="hover:border-gold/50 transition-normal">
            <Rocket className="w-8 h-8 text-green mb-4" />
            <div className="text-3xl font-bold mb-1">{stats.ventures}</div>
            <div className="text-sm text-muted">Active Ventures</div>
          </Card>

          <Card className="hover:border-gold/50 transition-normal">
            <TrendingUp className="w-8 h-8 text-green mb-4" />
            <div className="text-3xl font-bold mb-1 text-green">€{stats.revenue.toFixed(2)}</div>
            <div className="text-sm text-muted">Total Revenue</div>
          </Card>

          <Card className="hover:border-gold/50 transition-normal">
            <TrendingUp className="w-8 h-8 text-gold mb-4" />
            <div className={`text-3xl font-bold mb-1 ${netProfit >= 0 ? 'text-gold' : 'text-red'}`}>
              €{netProfit.toFixed(2)}
            </div>
            <div className="text-sm text-muted">Net Profit</div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/kanban" className="block p-6 glass-panel-strong rounded-xl border border-line hover:border-gold transition-normal group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-normal">📋</div>
            <div className="font-semibold mb-1">Kanban Board</div>
            <div className="text-sm text-muted">Manage your tasks</div>
          </Link>

          <Link to="/finances" className="block p-6 glass-panel-strong rounded-xl border border-line hover:border-gold transition-normal group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-normal">💰</div>
            <div className="font-semibold mb-1">Finances</div>
            <div className="text-sm text-muted">Track revenue & expenses</div>
          </Link>

          <Link to="/ventures" className="block p-6 glass-panel-strong rounded-xl border border-line hover:border-gold transition-normal group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-normal">🚀</div>
            <div className="font-semibold mb-1">Ventures</div>
            <div className="text-sm text-muted">5 business opportunities</div>
          </Link>

          <Link to="/agents" className="block p-6 glass-panel-strong rounded-xl border border-line hover:border-gold transition-normal group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-normal">🤖</div>
            <div className="font-semibold mb-1">AI Team</div>
            <div className="text-sm text-muted">Your agents overview</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-bold mb-4">📈 System Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-panel-strong rounded-lg">
            <div className="text-sm text-muted mb-1">YouTube</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green rounded-full" />
              <span className="font-semibold">Channel Live</span>
            </div>
          </div>
          <div className="p-4 bg-panel-strong rounded-lg">
            <div className="text-sm text-muted mb-1">Twitter / X</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green rounded-full" />
              <span className="font-semibold">Bot Active</span>
            </div>
          </div>
          <div className="p-4 bg-panel-strong rounded-lg">
            <div className="text-sm text-muted mb-1">AI Video Pipeline</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full" />
              <span className="font-semibold">Configured</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
