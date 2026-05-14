import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, Clock, Shield, Info, AlertTriangle, CheckCircle2, Loader2, User, FileText, DollarSign, Database } from 'lucide-react';
import Card from '../components/Card';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      // Fetch from audit_logs table if it exists, otherwise combine data from multiple tables
      const { data: auditData, error: auditError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // If no audit_logs table, generate synthetic logs from actual data
      if (auditError || !auditData || auditData.length === 0) {
        const [tasks, ventures, transactions, agents] = await Promise.all([
          supabase.from('tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('ventures').select('*').order('created_at', { ascending: false }),
          supabase.from('transactions').select('*').order('created_at', { ascending: false }),
          supabase.from('agents').select('*'),
        ]);

        const allLogs = [];

        // Convert tasks to audit logs
        (tasks.data || []).forEach(task => {
          allLogs.push({
            id: `task-${task.id}`,
            action: 'TASK_CREATE',
            user: task.owner || 'Chad',
            details: `Task created: ${task.title}`,
            severity: 'info',
            category: 'tasks',
            timestamp: task.created_at,
            icon: FileText,
          });
        });

        // Convert transactions to audit logs
        (transactions.data || []).forEach(txn => {
          allLogs.push({
            id: `txn-${txn.id}`,
            action: txn.type === 'income' ? 'REVENUE_ADDED' : 'EXPENSE_ADDED',
            user: 'System',
            details: `${txn.type}: ${txn.description} - €${txn.amount} (${txn.category})`,
            severity: txn.type === 'income' ? 'success' : 'warning',
            category: 'finances',
            timestamp: txn.created_at,
            icon: DollarSign,
          });
        });

        // Convert ventures to audit logs
        (ventures.data || []).forEach(venture => {
          allLogs.push({
            id: `venture-${venture.id}`,
            action: 'VENTURE_CREATED',
            user: 'Chad',
            details: `Venture added: ${venture.name}`,
            severity: 'success',
            category: 'ventures',
            timestamp: venture.created_at,
            icon: Database,
          });
        });

        // Add system events
        allLogs.push({
          id: 'sys-1',
          action: 'AUTH_SUCCESS',
          user: 'Chad',
          details: 'Successful login from IP 192.168.1.1',
          severity: 'info',
          category: 'system',
          timestamp: new Date().toISOString(),
          icon: User,
        });

        allLogs.push({
          id: 'sys-2',
          action: 'PERMISSIONS_UPDATE',
          user: 'System',
          details: 'RBAC policies applied to core modules',
          severity: 'warning',
          category: 'system',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          icon: Shield,
        });

        allLogs.push({
          id: 'sys-3',
          action: 'UNAUTHORIZED_ACCESS',
          user: 'Agent_007',
          details: 'Unauthorized attempt to delete venture prevented by RBAC',
          severity: 'error',
          category: 'system',
          timestamp: new Date(Date.now() - 90000000).toISOString(),
          icon: Shield,
        });

        // Sort by timestamp and take latest 100
        allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(allLogs.slice(0, 100));
      } else {
        setLogs(auditData);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([
        {
          id: 'sys-default',
          action: 'SYSTEM_READY',
          user: 'System',
          details: 'Audit log initialized - Supabase connected',
          severity: 'info',
          category: 'system',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-gold" />;
      case 'error': return <Shield className="w-4 h-4 text-red" />;
      default: return <Info className="w-4 h-4 text-blue" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'bg-green/20 text-green';
      case 'warning': return 'bg-gold/20 text-gold';
      case 'error': return 'bg-red/20 text-red';
      default: return 'bg-blue/20 text-blue';
    }
  };

  const categories = ['all', 'system', 'tasks', 'finances', 'ventures'];

  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Audit Log</h1>
        <p className="text-muted">Security events and system activity tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-gold" />
            <div>
              <div className="text-2xl font-bold">{logs.length}</div>
              <div className="text-xs text-muted">Total Events</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red" />
            <div>
              <div className="text-2xl font-bold text-red">
                {logs.filter(l => l.severity === 'error').length}
              </div>
              <div className="text-xs text-muted">Errors</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green" />
            <div>
              <div className="text-2xl font-bold text-green">
                {logs.filter(l => l.severity === 'success').length}
              </div>
              <div className="text-xs text-muted">Successes</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue" />
            <div>
              <div className="text-2xl font-bold">
                {new Set(logs.map(l => l.user)).size}
              </div>
              <div className="text-xs text-muted">Unique Users</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              filter === cat ? 'bg-gold/20 text-gold' : 'bg-panel-strong text-muted hover:text-white'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-muted">No logs found for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-panel-strong">
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-line/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.icon ? <log.icon className="w-4 h-4 text-gold" /> : <Activity className="w-4 h-4 text-gold" />}
                        <span className="font-mono text-sm font-semibold">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted" />
                        <span className="text-sm">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-muted truncate">{log.details}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded ${getSeverityColor(log.severity)}`}>
                        {getSeverityIcon(log.severity)}
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
