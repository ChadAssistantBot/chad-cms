import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Activity, Clock, User, Shield, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'

export default function AuditLog({ onLogout }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      // Mocking logs for now as per task description
      const mockLogs = [
        {
          id: 1,
          action: 'LOGIN_SUCCESS',
          user: 'Chad',
          details: 'Successful login from IP 192.168.1.1',
          severity: 'info',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          action: 'TRANSACTION_ADD',
          user: 'Chad',
          details: 'Added transaction: AWS Cloud Bill (Expense - €45.00)',
          severity: 'success',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          action: 'VENTURE_CREATE',
          user: 'Chad',
          details: 'New venture created: Chad-CMS v2',
          severity: 'success',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 4,
          action: 'PERMISSIONS_UPDATE',
          user: 'System',
          details: 'RBAC transition applied to core modules',
          severity: 'warning',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 5,
            action: 'DELETE_ATTEMPT',
            user: 'Agent_007',
            details: 'Unauthorized attempt to delete venture #5 prevented by RBAC',
            severity: 'error',
            timestamp: new Date(Date.now() - 90000000).toISOString(),
          }
      ]
      setLogs(mockLogs)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-gold" />
      case 'error': return <Shield className="w-4 h-4 text-red" />
      default: return <Info className="w-4 h-4 text-blue" />
    }
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-56 bg-bg/80 backdrop-blur-xl border-r border-line p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-3xl">💵</div>
          <div>
            <div className="font-bold">Chad OS</div>
            <div className="text-xs text-muted">Management System</div>
          </div>
        </div>

        <nav className="space-y-1">
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">📋 Dashboard</Link>
          <Link to="/finances" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">💰 Finances</Link>
          <Link to="/ventures" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🚀 Ventures</Link>
          <Link to="/agents" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🤖 Agents</Link>
          <Link to="/kanban" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">✅ Kanban</Link>
          <Link to="/audit" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">📜 Audit Log</Link>
        </nav>

        <Button onClick={onLogout} className="absolute bottom-4 left-4 right-4 border border-line hover:bg-line/20 transition text-sm">Log Out</Button>
      </aside>

      <main className="ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Audit Log</h1>
          <p className="text-muted">Security events and system activity tracking</p>
        </header>

        <Card className="bg-panel border border-line">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line text-xs font-bold text-muted uppercase tracking-wider">
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-line/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gold" />
                        <span className="font-mono text-sm">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted" />
                        <span className="text-sm">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">{log.details}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(log.severity)}
                        <span className="text-xs uppercase">{log.severity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
