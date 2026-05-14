import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Cpu, FolderGit2, Loader2, Trash2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import toast from 'react-hot-toast'
import { getCurrentUser, canDelete } from '../lib/rbac'

export default function Agents({}) {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = getCurrentUser()

  useEffect(() => {
    fetchAgents()
  }, [])

  async function fetchAgents() {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Failed to load agents, using fallback data')
      // Fallback to locally defined agents if Supabase fails
      setAgents([
        {
          id: 'main',
          name: 'Chad',
          avatar: '💵',
          role: 'Strategic AI Partner & Operator',
          status: 'active',
          model: 'ollama/llama3:8b',
          workspace: '~/.openclaw/workspace',
        },
        {
          id: 'beebot',
          name: 'BeeBot',
          avatar: '🐝',
          role: 'Specialized Assistant',
          status: 'idle',
          model: 'ollama/qwen2.5-coder:7b',
          workspace: '~/.openclaw/workspace-beebot',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
<div className="min-h-screen p-8 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Organization</h1>
          <p className="text-muted">Your AI workforce - configured agents and active sessions</p>
        </header>

        {/* Org Chart Header */}
        <Card className="bg-gradient-to-r from-gold/10 to-blue/10 border border-line mb-8">
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
                {loading ? '...' : agents.filter(a => a.status === 'active').length} currently working
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue rounded-full"></span>
              <span className="text-sm text-muted">
                {loading ? '...' : agents.filter(a => a.status === 'idle').length} available
              </span>
            </div>
          </div>
        </Card>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : agents.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-muted">No agents configured.</div>
          ) : (
            agents.map((agent) => (
              <Card key={agent.id} className="bg-panel border border-line hover:border-gold transition">
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

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gold/10 border border-gold/30 text-gold font-bold hover:bg-gold/20 transition">
                    ⚙️ View Details
                  </Button>
                  {canDelete(currentUser.role) && (
                    <Button className="bg-red/10 border border-red/30 text-red font-bold hover:bg-red/20 transition">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
</div>
    </div>
  )
}
