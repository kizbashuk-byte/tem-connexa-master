import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

async function fetchOpenAPI() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_KEY}`);
  if (res.ok) {
    const data = await res.json();
    // Look at definitions -> customers -> properties
    console.log(JSON.stringify(data.definitions.customers, null, 2));
  } else {
    console.log(`Failed:`, res.status, await res.text());
  }
}
fetchOpenAPI();
