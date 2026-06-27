import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) console.log(`Error reading ${tableName}:`, error.message);
  else if (data.length > 0) console.log(`Table ${tableName}:`, Object.keys(data[0]).sort());
  else console.log(`Table ${tableName} is empty.`);
}

async function run() {
  await inspectTable('events');
  await inspectTable('customers');
  await inspectTable('conversations');
  await inspectTable('messages');
  await inspectTable('tenant_members');
  await inspectTable('tenants');
}
run();
