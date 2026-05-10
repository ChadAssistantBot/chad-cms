import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Trophy, TrendingUp, Clock, DollarSign } from 'lucide-react'

const ventures = [
  {
    id: 'V001',
    name: 'AI Automation Services',
    rank: 1,
    score: 46,
    status: 'active',
    timeToRevenue: '3-7 days',
    startupCost: '€19',
    month12Revenue: '€8K',
  },
  {
    id: 'V002',
    name: 'Digital Products',
    rank: 2,
    score: 44,
    status: 'active',
    timeToRevenue: '7-14 days',
    startupCost: '€0-€30',
    month12Revenue: '€5K',
  },
  {
    id: 'V003',
    name: 'YouTube Automation',
    rank: 3,
    score: 36,
    status: 'backlog',
    timeToRevenue: '30-60 days',
    startupCost: '€50-€100',
    month12Revenue: '€5K',
  },
  {
    id: 'V004',
    name: 'Substack Newsletter',
    rank: 4,
    score: 37,
    status: 'backlog',
    timeToRevenue: '30-90 days',
    startupCost: '€0',
    month12Revenue: '€5K',
  },
  {
    id: 'V005',
    name: 'Stock/Crypto AI Tool',
    rank: 5,
    score: 32,
    status: 'backlog',
    timeToRevenue: '60-90 days',
    startupCost: '€100-€500',
    month12Revenue: '€5K+',
  },
]

export default function Ventures({ onLogout }) {
  const [selectedVenture, setSelectedVenture] = useState(null)

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
          <Link to="/ventures" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">🚀 Ventures</Link>
          <Link to="/agents" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🤖 Agents</Link>
        </nav>

        <button onClick={onLogout} className="absolute bottom-4 left-4 right-4 px-4 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm">Log Out</button>
      </aside>

      <main className="ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Venture Pipeline</h1>
          <p className="text-muted">Ranked opportunities scored by ROI, speed, and strategic fit</p>
        </header>

        <div className="grid gap-6">
          {ventures.map((venture) => (
            <div
              key={venture.id}
              onClick={() => setSelectedVenture(venture)}
              className="bg-panel border border-line rounded-2xl p-6 cursor-pointer hover:border-gold transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className={`w-5 h-5 ${venture.rank <= 3 ? 'text-gold' : 'text-muted'}`} />
                    <h3 className="text-xl font-bold">{venture.name}</h3>
                    {venture.rank <= 3 && (
                      <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                        #{venture.rank} Pick
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {venture.timeToRevenue}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {venture.startupCost}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${venture.score >= 40 ? 'text-green' : venture.score >= 35 ? 'text-gold' : 'text-blue'}`}>
                    {venture.score}
                  </div>
                  <div className="text-xs text-muted">Total Score</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${venture.status === 'active' ? 'bg-green/20 text-green' : 'bg-blue/20 text-blue'}`}>
                  {venture.status}
                </span>
                <button className="px-4 py-2 bg-gold text-bg font-bold rounded-lg hover:opacity-90 transition">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedVenture && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-panel-strong border border-line rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedVenture.name}</h2>
                <button onClick={() => setSelectedVenture(null)} className="text-3xl text-muted hover:text-white">×</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="text-sm text-muted mb-1">Time to First €</div>
                  <div className="text-xl font-bold">{selectedVenture.timeToRevenue}</div>
                </div>
                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="text-sm text-muted mb-1">Startup Cost</div>
                  <div className="text-xl font-bold">{selectedVenture.startupCost}</div>
                </div>
                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="text-sm text-muted mb-1">Month 12 Revenue</div>
                  <div className="text-xl font-bold text-green">{selectedVenture.month12Revenue}</div>
                </div>
                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="text-sm text-muted mb-1">Total Score</div>
                  <div className="text-xl font-bold text-gold">{selectedVenture.score}/50</div>
                </div>
              </div>

              <div className="p-4 bg-gold/10 border border-gold/30 rounded-xl">
                <h3 className="font-bold mb-2">🚀 Execution Plan</h3>
                <p className="text-sm text-muted">
                  Full 3-phase execution plan with weekly tasks, tools needed, and risk mitigation available in the original CMS data.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
