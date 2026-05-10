import { Link } from 'react-router-dom'
import { CheckSquare, TrendingUp, Rocket, Users } from 'lucide-react'

export default function Dashboard({ onLogout }) {
  const stats = [
    { label: 'Total Tasks', value: '11', icon: CheckSquare, color: 'text-blue' },
    { label: 'Active Ventures', value: '5', icon: Rocket, color: 'text-green' },
    { label: 'Monthly Revenue', value: '€0', icon: TrendingUp, color: 'text-gold' },
    { label: 'AI Agents', value: '2', icon: Users, color: 'text-muted' },
  ]

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-bg/80 backdrop-blur-xl border-r border-line p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-3xl">💵</div>
          <div>
            <div className="font-bold">Chad OS</div>
            <div className="text-xs text-muted">Management System</div>
          </div>
        </div>

        <nav className="space-y-1">
          <Link to="/" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">
            📋 Dashboard
          </Link>
          <Link to="/finances" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">
            💰 Finances
          </Link>
          <Link to="/ventures" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">
            🚀 Ventures
          </Link>
          <Link to="/agents" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">
            🤖 Agents
          </Link>
        </nav>

        <button
          onClick={onLogout}
          className="absolute bottom-4 left-4 right-4 px-4 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm"
        >
        Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, Boss!</h1>
          <p className="text-muted">Here's what's happening at Chad Inc.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-panel border border-line rounded-2xl p-6">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-panel border border-line rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <Link
              to="/ventures"
              className="p-4 bg-panel-strong rounded-xl border border-line hover:border-gold transition"
            >
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold">View Ventures</div>
              <div className="text-sm text-muted">5 opportunities</div>
            </Link>
            <Link
              to="/finances"
              className="p-4 bg-panel-strong rounded-xl border border-line hover:border-gold transition"
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold">Check Finances</div>
              <div className="text-sm text-muted">Track revenue</div>
            </Link>
            <Link
              to="/agents"
              className="p-4 bg-panel-strong rounded-xl border border-line hover:border-gold transition"
            >
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold">AI Team</div>
              <div className="text-sm text-muted">2 agents active</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
