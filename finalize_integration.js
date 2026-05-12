import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsylvrmzfcnktslgkzkn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeWx2cm16ZmNua3RzbGdremtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ0MTE3NSwiZXhwIjoyMDk0MDE3MTc1fQ.vDljOgWyhSw3Ik5kypZowd6MFnMM8cri3CsB7N64brM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalizeIntegration() {
  try {
    // Update existing "Sync Chad Runtime with CMS" task to "done"
    const { data: existingTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('title', 'Sync Chad Runtime with CMS');

    if (fetchError) throw fetchError;

    if (existingTasks && existingTasks.length > 0) {
      const taskId = existingTasks[0].id;
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ status: 'done', updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (updateError) throw updateError;
      console.log('✅ Task "Sync Chad Runtime with CMS" marked as done.');
    }

    // Create a new task summarizing the integration
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: 'CMS Integration Complete',
        description: 'Supabase connected. Kanban, Agents, Ventures, and Finances integrated. Local models pulled. Daily newsletters scheduled.',
        status: 'done',
        priority: 'P1',
        owner: 'Chad',
        tags: ['milestone', 'integration', 'complete']
      }])
      .select();

    if (error) throw error;
    console.log('✅ Integration summary task created:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error finalizing integration:', error.message);
  }
}

finalizeIntegration();
