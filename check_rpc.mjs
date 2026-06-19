import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function test() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { 'apikey': SUPABASE_KEY }
  });
  const data = await res.json();
  console.log("Paths:", Object.keys(data.paths).filter(p => p.includes('policy') || p.includes('rls')));
}
test();
