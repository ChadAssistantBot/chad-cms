import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_ANON_KEY

console.log(`Starting task-bridge.js (Action: ${process.argv[2]})`)

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and either SUPABASE_SECRET_KEY or VITE_SUPABASE_ANON_KEY are set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const args = process.argv.slice(2)
const action = args[0]

if (action === 'create') {
  const [title, description, priority, status, tags, owner, due_date] = args.slice(1)
  
  createTask({ 
    title, 
    description, 
    priority: priority || 'P2', 
    status: status || 'intake', 
    tags: tags ? tags.split(',').map(t => t.trim()) : [], 
    owner: owner || 'Chad', 
    due_date: due_date || null,
    approval_required: (priority === 'P0')
  })
} else if (action === 'update') {
  const [id, status] = args.slice(1)
  updateTask(id, { status })
} else if (action === 'list') {
  listTasks()
} else {
  console.log('Usage: node task-bridge.js <action> [args]')
  console.log('Actions: create, list')
}

async function createTask(task) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
    
    if (error) throw error
    console.log('Task created successfully:', data[0].id)
  } catch (error) {
    console.error('Error creating task:', error.message)
  }
}

async function updateTask(id, patch) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(patch)
      .eq('id', id)
      .select()
    
    if (error) throw error
    console.log('Task updated successfully:', data[0].id)
  } catch (error) {
    console.error('Error updating task:', error.message)
  }
}

async function listTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error listing tasks:', error.message)
  }
}
