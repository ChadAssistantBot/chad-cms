import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, MoreHorizontal, Calendar, User } from 'lucide-react'

const COLUMNS = [
  { id: 'intake', label: '📨 Intake', color: 'bg-gray-500' },
  { id: 'triage', label: '🔎 Triage', color: 'bg-blue-500' },
  { id: 'backlog', label: '📋 Backlog', color: 'bg-purple-500' },
  { id: 'ready', label: '🎯 Ready', color: 'bg-indigo-500' },
  { id: 'in-progress', label: '🚧 In Progress', color: 'bg-yellow-500' },
  { id: 'waiting', label: '⏳ Waiting', color: 'bg-orange-500' },
  { id: 'review', label: '✅ Review', color: 'bg-pink-500' },
  { id: 'done', label: '🏁 Done', color: 'bg-green-500' },
]

const PRIORITY_COLORS = {
  P0: 'bg-red-500/20 text-red-400 border-red-500/30',
  P1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  P2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  P3: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export default function Kanban({ onLogout }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'P2',
    status: 'intake',
    owner: 'Chad',
    due_date: '',
    tags: '',
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      // Fallback to sample data
      setTasks([
        { id: '1', title: 'Set up Supabase', description: 'Create project and run schema', priority: 'P0', status: 'done', owner: 'Chad', due_date: '2026-05-11' },
        { id: '2', title: 'Deploy to Vercel', description: 'Connect GitHub and deploy', priority: 'P0', status: 'done', owner: 'Chad', due_date: '2026-05-11' },
        { id: '3', title: 'Add Kanban Board', description: 'Full drag-and-drop board', priority: 'P1', status: 'in-progress', owner: 'Chad', due_date: '2026-05-11' },
        { id: '4', title: 'Test All Features', description: 'QA pass on all pages', priority: 'P2', status: 'backlog', owner: 'Chad', due_date: '2026-05-12' },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function createTask(e) {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean),
          approval_required: newTask.priority === 'P0',
        }])
        .select()
        .single()
      
      if (error) throw error
      
      setTasks([data, ...tasks])
      setShowNewTask(false)
      setNewTask({ title: '', description: '', priority: 'P2', status: 'intake', owner: 'Chad', due_date: '', tags: '' })
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task. Make sure Supabase is connected.')
    }
  }

  async function updateTaskStatus(taskId, newStatus) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
      
      if (error) throw error
      
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  function moveTask(taskId, direction) {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    const currentIndex = COLUMNS.findIndex(c => c.id === task.status)
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex >= 0 && newIndex < COLUMNS.length) {
      updateTaskStatus(taskId, COLUMNS[newIndex].id)
    }
  }

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
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">📋 Dashboard</Link>
          <Link to="/finances" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">💰 Finances</Link>
          <Link to="/ventures" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🚀 Ventures</Link>
          <Link to="/agents" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🤖 Agents</Link>
          <Link to="/kanban" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">✅ Kanban</Link>
        </nav>

        <button onClick={onLogout} className="absolute bottom-4 left-4 right-4 px-4 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm">Log Out</button>
      </aside>

      {/* Main Content */}
      <main className="ml-56 p-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Kanban Board</h1>
            <p className="text-muted">Track tasks from intake to completion</p>
          </div>
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-bg font-bold rounded-lg hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </header>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter(t => t.status === column.id)
            
            return (
              <div
                key={column.id}
                className="flex-shrink-0 w-80 bg-panel border border-line rounded-2xl"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-line flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <span className="font-bold">{column.label}</span>
                  </div>
                  <span className="text-xs text-muted bg-panel-strong px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="p-3 space-y-3 min-h-[400px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-panel-strong border border-line rounded-xl p-4 hover:border-gold/50 transition cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded border ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 text-muted hover:text-white transition">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-semibold mb-2">{task.title}</h3>
                      
                      {task.description && (
                        <p className="text-sm text-muted mb-3 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-muted mb-3">
                        {task.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.owner}
                        </div>
                      </div>

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Move Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-line/50">
                        <button
                          onClick={() => moveTask(task.id, 'left')}
                          disabled={COLUMNS.findIndex(c => c.id === task.status) === 0}
                          className="flex-1 px-2 py-1 text-xs bg-panel border border-line rounded hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => moveTask(task.id, 'right')}
                          disabled={COLUMNS.findIndex(c => c.id === task.status) === COLUMNS.length - 1}
                          className="flex-1 px-2 py-1 text-xs bg-panel border border-line rounded hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          Forward →
                        </button>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-panel-strong border border-line rounded-3xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
            
            <form onSubmit={createTask} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
                  rows="3"
                  placeholder="Add details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full bg-panel border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
                  >
                    <option value="P0">P0 - Critical</option>
                    <option value="P1">P1 - High</option>
                    <option value="P2">P2 - Medium</option>
                    <option value="P3">P3 - Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Owner</label>
                  <input
                    type="text"
                    value={newTask.owner}
                    onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
                    className="w-full bg-panel border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
                    placeholder="Chad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tags</label>
                <input
                  type="text"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
                  placeholder="comma-separated (e.g., urgent, feature, bug)"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTask(false)}
                  className="flex-1 px-4 py-3 border border-line rounded-lg hover:bg-line/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gold text-bg font-bold rounded-lg hover:opacity-90 transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
