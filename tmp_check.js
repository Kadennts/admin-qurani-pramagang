const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('admin_users').select('*').limit(1);
  console.log('admin_users:', error ? error.message : 'exists, count: ' + data.length);
  
  const { data: q2, error: e2 } = await supabase.from('users').select('*').limit(1);
  console.log('users:', e2 ? e2.message : 'exists, count: ' + q2.length);
}
run();
