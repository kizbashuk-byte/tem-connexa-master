import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const SUPABASE_URL = urlMatch ? urlMatch[1].trim() : '';
const SUPABASE_KEY = keyMatch ? keyMatch[1].trim() : '';

const TABLES = ['customers', 'conversations', 'messages'];

async function introspect() {
  for (const table of TABLES) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/pg_catalog.information_schema`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );

    // Use PostgREST column introspection via OPTIONS
    const opt = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
        'Range-Unit': 'items',
        Range: '0-0',
        Prefer: 'count=exact',
      },
    });
    console.log(`\n=== ${table} (status ${opt.status}) ===`);
    const txt = await opt.text();
    console.log(txt.slice(0, 500));
  }
}

introspect().catch(console.error);
