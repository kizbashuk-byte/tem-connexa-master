import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function verify() {
  const columnsToCheck = ['id', 'event_id', 'sender_id', 'message_text', 'ai_reply', 'timestamp', 'tenant_id', 'created_at'];
  const existing = [];
  const missing = [];

  for (const col of columnsToCheck) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/message_logs?select=${col}&limit=1`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    
    if (res.ok) {
      existing.push(col);
    } else {
      missing.push(col);
    }
  }

  console.log("Existing columns:", existing);
  console.log("Missing columns:", missing);
}
verify();
