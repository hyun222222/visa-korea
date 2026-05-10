import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://amqnssakcqsdeeunrtfz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcW5zc2FrY3FzZGVldW5ydGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzMzMDMsImV4cCI6MjA4MDIwOTMwM30.2WZCTxl_L6R8UxEdYXXwy1k578ckkmwdAvnBYB2Nflw'
);

// Check ALL campaigns regardless of status
const { data, error } = await supabase.from('campaigns').select('id, title, category, status, created_at');
if (error) {
  console.log('❌ ERROR:', error.message);
} else {
  console.log(`✅ Total campaigns: ${data.length}`);
  data.forEach(c => console.log(`  - [${c.status}] ${c.title} (${c.category}) ${c.id}`));
}
