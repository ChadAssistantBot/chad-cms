import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsylvrmzfcnktslgkzkn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeWx2cm16ZmNua3RzbGdremtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ0MTE3NSwiZXhwIjoyMDk0MDE3MTc1fQ.vDljOgWyhSw3Ik5kypZowd6MFnMM8cri3CsB7N64brM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAgents() {
  const agentsData = [
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
  ];

  try {
    const { data: existingAgents, error: fetchError } = await supabase.from('agents').select('id');
    if (fetchError) throw fetchError;

    const existingAgentIds = existingAgents.map(agent => agent.id);
    const agentsToInsert = agentsData.filter(agent => !existingAgentIds.includes(agent.id));

    if (agentsToInsert.length > 0) {
      const { data, error } = await supabase
        .from('agents')
        .insert(agentsToInsert)
        .select();
      
      if (error) throw error;
      console.log('✅ Agents added successfully:', JSON.stringify(data, null, 2));
    } else {
      console.log('ℹ️ Agents already exist, no new agents to insert.');
    }
  } catch (error) {
    console.error('❌ Error adding agents:', error.message);
  }
}

addAgents();
