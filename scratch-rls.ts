import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching RLS policies...");
  const { data: policies, error: polError } = await supabase.from('pg_policies').select('*');
  console.log("Policies:", policies, "Error:", polError);

  console.log("Fetching test user and events...");
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Current user:", user);
}

main();
