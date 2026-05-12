import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsylvrmzfcnktslgkzkn.supabase.co';
const supabaseAnonKey = 'sb_publishable_HuWLOxFeilnyAdIeON0KVQ_seMZK-Sb'; // Using anon key for this attempt

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
