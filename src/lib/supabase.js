import { createClient } from '@supabase/supabase-js'

// Vercel environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.Supa_Publishable_key || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
