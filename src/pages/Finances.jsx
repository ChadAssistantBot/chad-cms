import { Link } from 'react-router-dom'
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react'

export default function Finances({ onLogout }) {
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
          <Link to="/finances" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">💰 Finances</Link>
          <Link to="/ventures" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🚀 Ventures</Link>
          <Link to="/agents" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🤖 Agents</Link>
          <Link to="/kanban" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">✅ Kanban</Link>
        </nav>

        <button onClick={onLogout} className="absolute bottom-4 left-4 right-4 px-4 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm">Log Out</button>
      </aside>

      <main className="ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Finances</h1>
          <p className="text-muted">Track revenue, expenses, and venture P&L</p>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-panel border border-line rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ArrowUpCircle className="w-8 h-8 text-green" />
              <div className="text-sm text-muted">Total Revenue</div>
            </div>
            <div className="text-3xl font-bold text-green">€0</div>
          </div>

          <div className="bg-panel border border-line rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ArrowDownCircle className="w-8 h-8 text-red" />
              <div className="text-sm text-muted">Total Expenses</div>
            </div>
            <div className="text-3xl font-bold text-red">€0</div>
          </div>

          <div className="bg-panel border border-line rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-gold" />
              <div className="text-sm text-muted">Net Profit</div>
            </div>
            <div className="text-3xl font-bold text-gold">€0</div>
          </div>
        </div>

        <div className="bg-panel border border-line rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Getting Started</h2>
          <p className="text-muted mb-4">
            Connect Supabase to start tracking your finances. This will sync with your venture data automatically.
          </p>
          <div className="p-4 bg-panel-strong rounded-xl border border-line">
            <code className="text-sm text-gold">
              1. Set up Supabase project<br/>
              2. Run migration scripts<br/>
              3. Add transactions via UI or API
            </code>
          </div>
        </div>
      </main>
    </div>
  )
}
