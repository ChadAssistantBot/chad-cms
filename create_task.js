import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsylvrmzfcnktslgkzkn.supabase.co';
// Using the SUPABASE_LEGACY_SERVICE_KEY, which is a full JWT
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeWx2cm16ZmNua3RzbGdremtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ0MTE3NSwiZXhwIjoyMDk0MDE3MTc1fQ.vDljOgWyhSw3Ik5kypZowd6MFnMM8cri3CsB7N64brM'; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: 'Sync Chad Runtime with CMS',
        description: 'Supabase schema verified. Integrating live task tracking and agent status.',
        status: 'in-progress',
        priority: 'P1',
        owner: 'Chad',
        tags: ['orchestration', 'ready']
      }])
      .select();

    if (error) throw error;
    console.log('✅ Task created successfully:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error creating task:', error.message);
  }
}

main();
