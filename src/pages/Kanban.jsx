import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, X, Calendar, User, Tag, AlertCircle, CheckCircle2, Clock, Loader2, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import toast from 'react-hot-toast'

const COLUMNS = [
  { id: 'intake', label: 'Intake', color: 'bg-gray-500', emoji: '📨' },
  { id: 'triage', label: 'Triage', color: 'bg-blue-500', emoji: '🔎' },
  { id: 'backlog', label: 'Backlog', color: 'bg-purple-500', emoji: '📋' },
  { id: 'ready', label: 'Ready', color: 'bg-indigo-500', emoji: '🎯' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-yellow-500', emoji: '🚧' },
  { id: 'waiting', label: 'Waiting', color: 'bg-orange-500', emoji: '⏳' },
  { id: 'review', label: 'Review', color: 'bg-pink-500', emoji: '✅' },
  { id: 'done', label: 'Done', color: 'bg-green-500', emoji: '🏁' },
]

const PRIORITY_COLORS = {
  P0: 'bg-red-500/20 text-red border-red-500/30',
  P1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  P2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  P3: 'bg-green-500/20 text-green-400 border-green-500/30',
}

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
      className="bg-panel-strong border border-line rounded-lg p-2 hover:border-gold/50 transition mb-2 shrink-0"
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        {task.approval_required && (
          <AlertCircle className="w-3 h-3 text-gold" />
        )}
      </div>

      <h4 className="font-semibold text-sm mb-1 leading-tight line-clamp-2">{task.title}</h4>
      
      {task.description && (
        <p className="text-xs text-muted mb-1 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 text-[10px] text-muted mb-1">
        {task.due_date && (
          <span className="flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5" />
            {new Date(task.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        )}
        {task.owner && (
          <span className="flex items-center gap-0.5">
            <User className="w-2.5 h-2.5" />
            {task.owner}
          </span>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-0.5">
          {task.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Kanban({}) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewTask, setShowNewTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTask, setActiveTask] = useState(null)
  const [scale, setScale] = useState(1)
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
      const newColumnId = over.id
      
      if (task && task.status !== newColumnId) {
        updateTaskStatus(active.id, newColumnId)
      }
    }
  }

  function getTasksByColumn(columnId) {
    return tasks.filter(t => t.status === columnId)
  }

  const totalTasks = tasks.length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const waiting = tasks.filter(t => t.status === 'waiting').length
  const done = tasks.filter(t => t.status === 'done').length

  return (
    <div className="h-screen flex flex-col">
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-panel-strong border-b border-line">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">Kanban</h1>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted">Total: <span className="text-white font-semibold">{totalTasks}</span></span>
            <span className="text-muted">🚧 <span className="text-yellow-400 font-semibold">{inProgress}</span></span>
            <span className="text-muted">⏳ <span className="text-orange-400 font-semibold">{waiting}</span></span>
            <span className="text-muted">🏁 <span className="text-green-400 font-semibold">{done}</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="p-1.5 rounded hover:bg-line/20 transition text-muted"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(1.5, scale + 0.1))}
              className="p-1.5 rounded hover:bg-line/20 transition text-muted"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale(1)}
              className="p-1.5 rounded hover:bg-line/20 transition text-muted"
              title="Fit to screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-bg font-bold text-sm rounded-lg hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div 
          className="flex-1 overflow-x-auto overflow-y-auto"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          <div className="flex gap-2 p-2 min-w-max">
            {COLUMNS.map((column) => {
              const columnTasks = getTasksByColumn(column.id)
              
              return (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-44 bg-panel border border-line rounded-xl flex flex-col"
                >
                  {/* Compact Column Header */}
                  <div className="p-1.5 border-b border-line flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${column.color}`}></div>
                      <span className="font-semibold text-[11px]">{column.emoji} {column.label}</span>
                    </div>
                    <span className="text-[9px] text-muted bg-panel-strong px-1 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Task List */}
                  <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
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
                      <div className="text-center py-4 text-muted text-[10px] border-2 border-dashed border-line/50 rounded-lg">
                        Drop here
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
              <div className="bg-panel-strong border-2 border-gold rounded-lg p-3 shadow-2xl rotate-3 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${PRIORITY_COLORS[activeTask.priority]}`}>
                    {activeTask.priority}
                  </span>
                </div>
                <h4 className="font-semibold text-sm">{activeTask.title}</h4>
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </div>

      {/* New Task Modal - Compact */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-panel-strong border border-line rounded-2xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">New Task</h2>
              <button onClick={() => setShowNewTask(false)} className="text-2xl text-muted hover:text-white">×</button>
            </div>
            
            <form onSubmit={createTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none"
                  rows="2"
                  placeholder="Add details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="P0">P0 - Critical</option>
                    <option value="P1">P1 - High</option>
                    <option value="P2">P2 - Medium</option>
                    <option value="P3">P3 - Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Owner</label>
                  <input
                    type="text"
                    value={newTask.owner}
                    onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
                    className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    placeholder="Chad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tags</label>
                <input
                  type="text"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  placeholder="comma-separated"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTask(false)}
                  className="flex-1 px-3 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-gold text-bg font-bold rounded-lg hover:opacity-90 transition text-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal - Compact */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-panel-strong border border-line rounded-2xl p-5 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${PRIORITY_COLORS[selectedTask.priority]}`}>
                    {selectedTask.priority}
                  </span>
                  {selectedTask.approval_required && (
                    <span className="text-xs text-gold flex items-center gap-1 px-2 py-0.5 bg-gold/10 rounded">
                      <AlertCircle className="w-3 h-3" />
                      Approval
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-2xl text-muted hover:text-white">×</button>
            </div>

            <div className="space-y-4">
              {selectedTask.description && (
                <div>
                  <h3 className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    Description
                  </h3>
                  <p className="text-sm text-muted">{selectedTask.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs font-semibold mb-1">Status</h3>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value)}
                    className="w-full bg-panel border border-line rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-gold"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="text-xs font-semibold mb-1">Owner</h3>
                  <p className="text-sm">{selectedTask.owner}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedTask.tags && selectedTask.tags.length > 0 ? (
                  selectedTask.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">No tags</span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-3 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm"
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
