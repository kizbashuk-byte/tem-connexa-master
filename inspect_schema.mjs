import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function checkTable(tableName) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?limit=1`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  if (res.ok) {
    console.log(`[OK] Table ${tableName} exists.`);
  } else {
    console.log(`[ERROR] Table ${tableName} check failed: ${res.statusText}`);
  }
}

async function test() {
  await checkTable('tenants');
  await checkTable('tenant_members');
  await checkTable('events');
}
test();
