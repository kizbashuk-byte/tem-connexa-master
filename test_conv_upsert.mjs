import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function test() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/conversations?on_conflict=event_id,customer_id`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      tenant_id: '00000000-0000-0000-0000-000000000000',
      event_id: '00000000-0000-0000-0000-000000000000',
      customer_id: '00000000-0000-0000-0000-000000000000'
    })
  });
  
  if (!res.ok) {
    const error = await res.json();
    console.log("ERROR on event_id,customer_id:", JSON.stringify(error, null, 2));
  } else {
    console.log("SUCCESS: Constraint exists and upsert worked!");
    // Cleanup
    await fetch(`${SUPABASE_URL}/rest/v1/conversations?event_id=eq.00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
  }
}
test();
