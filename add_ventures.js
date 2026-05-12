import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsylvrmzfcnktslgkzkn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeWx2cm16ZmNua3RzbGdremtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ0MTE3NSwiZXhwIjoyMDk0MDE3MTc1fQ.vDljOgWyhSw3Ik5kypZowd6MFnMM8cri3CsB7N64brM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addVentures() {
  const venturesData = [
    {
      name: 'AI Niche News Curator',
      description: 'Automated curation and translation of industry-specific news for English-speaking professionals.',
      status: 'active',
      rank: 1,
      score: 45,
      target_market: 'Finance professionals, insurance adjusters, asset managers',
      value_proposition: 'Hyper-targeted intelligence at a fraction of the cost of traditional analyst services.',
      time_to_revenue: '14-30 days',
      month12_revenue: '€5K+',
      automation_level: 'High',
      tools_needed: ['Web Search API', 'LLM Summarization', 'Translation API', 'Newsletter Engine']
    },
    {
      name: 'Market Intelligence AI Video',
      description: 'Generate faceless AI-driven videos for stock and crypto market updates.',
      status: 'active',
      rank: 2,
      score: 40,
      target_market: 'Retail investors, crypto enthusiasts',
      value_proposition: 'Data-driven market insights at scale with consistent, high-quality video content.',
      time_to_revenue: '30-60 days',
      month12_revenue: '€3K+',
      automation_level: 'Very High',
      tools_needed: ['Market Data API', 'LLM Scripting', 'AI Video Generation', 'Social Media Scheduling']
    }
  ];

  try {
    const { data, error } = await supabase
      .from('ventures')
      .insert(venturesData)
      .select();
    
    if (error) throw error;
    console.log('✅ Ventures added successfully:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error adding ventures:', error.message);
  }
}

addVentures();
