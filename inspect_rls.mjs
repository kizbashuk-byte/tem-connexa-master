import fs from 'fs';

// Read from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function test() {
  console.log("URL:", SUPABASE_URL);
  
  // Try to query pg_policies using REST API
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pg_policies`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  
  const data = await res.json();
  console.log("RLS Policies Response:", JSON.stringify(data));
}

test();
