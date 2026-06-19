import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const API_KEY = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function test() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/message_logs`, {
    method: 'OPTIONS',
    headers: { 'apikey': API_KEY }
  });
  console.log(await res.text());
}
test();
