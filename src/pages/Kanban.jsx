import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, X, Calendar, User, Tag, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

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

// Sortable Task Card Component
function SortableTask({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-panel-strong border border-line rounded-xl p-4 hover:border-gold/50 transition group mb-3"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-0.5 text-xs font-bold rounded border ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        {task.approval_required && (
          <span className="text-xs text-gold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Approval
          </span>
        )}
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
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Kanban({ onLogout }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewTask, setShowNewTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTask, setActiveTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'P2',
    status: 'intake',
    owner: 'Chad',
    due_date: '',
    tags: '',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchTasks()

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new, ...prev])
            toast.success('New task added')
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) => prev.map((t) => (t.id === payload.new.id ? payload.new : t)))
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id === payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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
        { id: '1', title: 'Set up Supabase', description: 'Create project and run migration schema', priority: 'P0', status: 'done', owner: 'Chad', due_date: '2026-05-11', tags: ['infrastructure', 'database'], approval_required: false },
        { id: '2', title: 'Deploy to Vercel', description: 'Connect GitHub repository and configure environment variables', priority: 'P0', status: 'done', owner: 'Chad', due_date: '2026-05-11', tags: ['deployment', 'infrastructure'], approval_required: false },
        { id: '3', title: 'Add Kanban Board', description: 'Full drag-and-drop Kanban board with 8 columns and task management', priority: 'P1', status: 'in-progress', owner: 'Chad', due_date: '2026-05-11', tags: ['feature', 'ui'], approval_required: false },
        { id: '4', title: 'Test All Features', description: 'Complete QA pass on all pages before launch', priority: 'P2', status: 'backlog', owner: 'Chad', due_date: '2026-05-12', tags: ['testing', 'qa'], approval_required: false },
        { id: '5', title: 'Fix Mobile Responsive', description: 'Ensure all pages work on mobile devices', priority: 'P2', status: 'intake', owner: 'Chad', due_date: '2026-05-13', tags: ['bug', 'mobile'], approval_required: false },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function createTask(e) {
    e.preventDefault()
    const loadingToast = toast.loading('Creating task...')
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
      
      toast.success('Task created!', { id: loadingToast })
      setShowNewTask(false)
      setNewTask({ title: '', description: '', priority: 'P2', status: 'intake', owner: 'Chad', due_date: '', tags: '' })
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task', { id: loadingToast })
      // For demo, add locally even if Supabase fails
      const localTask = {
        id: Date.now().toString(),
        ...newTask,
        tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean),
        approval_required: newTask.priority === 'P0',
        created_at: new Date().toISOString(),
      }
      setTasks([localTask, ...tasks])
      setShowNewTask(false)
      setNewTask({ title: '', description: '', priority: 'P2', status: 'intake', owner: 'Chad', due_date: '', tags: '' })
    }
  }

  async function updateTaskStatus(taskId, newStatus) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
      
      if (error) throw error
      
      toast.success(`Task moved to ${newStatus}`)
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
      // Update locally even if Supabase fails
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    }
  }

  function handleDragStart(event) {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)

    if (over && active.id !== over.id) {
      const task = tasks.find(t => t.id === active.id)
      const newColumnId = over.id // over.id is the column id
      
      if (task && task.status !== newColumnId) {
        updateTaskStatus(active.id, newColumnId)
      }
    }
  }

  function getTasksByColumn(columnId) {
    return tasks.filter(t => t.status === columnId)
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
            <p className="text-muted">Drag and drop tasks across workflow stages</p>
          </div>
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-bg font-bold rounded-lg hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-panel border border-line rounded-xl p-4">
            <div className="text-sm text-muted mb-1">Total Tasks</div>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <div className="text-sm text-muted mb-1">In Progress</div>
            <div className="text-2xl font-bold text-yellow-400">{tasks.filter(t => t.status === 'in-progress').length}</div>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <div className="text-sm text-muted mb-1">Waiting</div>
            <div className="text-2xl font-bold text-orange-400">{tasks.filter(t => t.status === 'waiting').length}</div>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <div className="text-sm text-muted mb-1">Done</div>
            <div className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'done').length}</div>
          </div>
        </div>

        {/* Kanban Board with Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column) => {
              const columnTasks = getTasksByColumn(column.id)
              
              return (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-96 bg-panel border border-line rounded-2xl"
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-line flex items-center justify-between sticky top-0 bg-panel rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <span className="font-bold">{column.label}</span>
                    </div>
                    <span className="text-xs text-muted bg-panel-strong px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Drop Zone */}
                  <div className="p-3 min-h-[500px]">
                    <SortableContext
                      items={columnTasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onClick={setSelectedTask}
                        />
                      ))}
                    </SortableContext>

                    {columnTasks.length === 0 && (
                      <div className="text-center py-12 text-muted text-sm border-2 border-dashed border-line/50 rounded-xl">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="bg-panel-strong border-2 border-gold rounded-xl p-4 shadow-2xl rotate-3 max-w-xs">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${PRIORITY_COLORS[activeTask.priority]}`}>
                    {activeTask.priority}
                  </span>
                </div>
                <h3 className="font-semibold">{activeTask.title}</h3>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-panel-strong border border-line rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Task</h2>
              <button onClick={() => setShowNewTask(false)} className="text-3xl text-muted hover:text-white">×</button>
            </div>
            
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

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-panel-strong border border-line rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-sm font-bold rounded border ${PRIORITY_COLORS[selectedTask.priority]}`}>
                    {selectedTask.priority}
                  </span>
                  {selectedTask.approval_required && (
                    <span className="text-xs text-gold flex items-center gap-1 px-2 py-1 bg-gold/10 rounded">
                      <AlertCircle className="w-3 h-3" />
                      Requires Approval
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-3xl text-muted hover:text-white">×</button>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Description
                </h3>
                <p className="text-muted leading-relaxed">
                  {selectedTask.description || 'No description provided.'}
                </p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => updateTaskStatus(selectedTask.id, col.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedTask.status === col.id
                          ? 'bg-gold text-bg'
                          : 'bg-panel border border-line hover:border-gold/50'
                      }`}
                    >
                      {col.label.split(' ').slice(1).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="flex items-center gap-2 text-sm text-muted mb-1">
                    <User className="w-4 h-4" />
                    Owner
                  </div>
                  <div className="font-semibold">{selectedTask.owner}</div>
                </div>

                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="flex items-center gap-2 text-sm text-muted mb-1">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </div>
                  <div className="font-semibold">
                    {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : 'Not set'}
                  </div>
                </div>

                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="flex items-center gap-2 text-sm text-muted mb-1">
                    <Clock className="w-4 h-4" />
                    Created
                  </div>
                  <div className="font-semibold">
                    {selectedTask.created_at ? new Date(selectedTask.created_at).toLocaleDateString() : 'Recently'}
                  </div>
                </div>

                <div className="bg-panel rounded-xl p-4 border border-line">
                  <div className="flex items-center gap-2 text-sm text-muted mb-1">
                    <Tag className="w-4 h-4" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTask.tags && selectedTask.tags.length > 0 ? (
                      selectedTask.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No tags</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-line">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-4 py-3 border border-line rounded-lg hover:bg-line/20 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
