import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function fetchColumns(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  if (res.ok) {
    const data = await res.json();
    if (data.length > 0) {
      console.log(`Table: ${table}`);
      console.log(Object.keys(data[0]));
    } else {
      console.log(`Table: ${table} is empty. Trying to fetch schema via OPTIONS.`);
      const optRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'OPTIONS',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      console.log(`Table: ${table} OPTIONS status:`, optRes.status);
    }
  } else {
    console.log(`Failed to fetch ${table}:`, res.status, await res.text());
  }
}

async function run() {
  await fetchColumns('customers');
  await fetchColumns('conversations');
  await fetchColumns('messages');
}
run();
