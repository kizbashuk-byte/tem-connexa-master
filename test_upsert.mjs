import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function test() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?on_conflict=messenger_id`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      tenant_id: '00000000-0000-0000-0000-000000000000',
      name: 'test',
      messenger_id: 'test'
    })
  });
  
  if (!res.ok) {
    const error = await res.json();
    console.log("ERROR on messenger_id:", JSON.stringify(error, null, 2));
  } else {
    console.log("SUCCESS on messenger_id!");
    await fetch(`${SUPABASE_URL}/rest/v1/customers?messenger_id=eq.test`, {
      method: 'DELETE',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
  }
}
test();
