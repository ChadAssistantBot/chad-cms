import { Link } from 'react-router-dom'
import { Cpu, FolderGit2 } from 'lucide-react'

const agents = [
  {
    id: 'main',
    name: 'Chad',
    avatar: '💵',
    role: 'Strategic AI Partner & Operator',
    status: 'active',
    model: 'ollama/qwen3.5:cloud',
    workspace: '~/.openclaw/workspace',
  },
  {
    id: 'beebot',
    name: 'BeeBot',
    avatar: '🐝',
    role: 'Specialized Assistant',
    status: 'idle',
    model: 'ollama/qwen3.5:cloud',
    workspace: '~/.openclaw/workspace-beebot',
  },
]

export default function Agents({ onLogout }) {
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
          <Link to="/agents" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">🤖 Agents</Link>
        </nav>

        <button onClick={onLogout} className="absolute bottom-4 left-4 right-4 px-4 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm">Log Out</button>
      </aside>

      <main className="ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Organization</h1>
          <p className="text-muted">Your AI workforce - configured agents and active sessions</p>
        </header>

        {/* Org Chart Header */}
        <div className="bg-gradient-to-r from-gold/10 to-blue/10 border border-line rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">💵 Chad Inc - AI Division</h2>
            <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-bold rounded-full">
              {agents.length} agents configured
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green rounded-full"></span>
              <span className="text-sm text-muted">
                {agents.filter(a => a.status === 'active').length} currently working
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue rounded-full"></span>
              <span className="text-sm text-muted">
                {agents.filter(a => a.status === 'idle').length} available
              </span>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-panel border border-line rounded-2xl p-6 hover:border-gold transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{agent.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
                  <p className="text-sm text-muted">{agent.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${agent.status === 'active' ? 'bg-green/20 text-green' : 'bg-blue/20 text-blue'}`}>
                  {agent.status === 'active' ? 'Working' : 'Available'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu className="w-4 h-4 text-muted" />
                  <span className="text-muted">Model:</span>
                  <span className="font-semibold">{agent.model}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FolderGit2 className="w-4 h-4 text-muted" />
                  <span className="text-muted">Workspace:</span>
                  <span className="font-semibold text-xs">{agent.workspace}</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-gold/10 border border-gold/30 text-gold font-bold rounded-lg hover:bg-gold/20 transition">
                ⚙️ View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
