import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('events').select('*').limit(1);
  if (error) console.error(error);
  else {
    if (data.length > 0) {
      console.log(Object.keys(data[0]).sort());
    } else {
      console.log("No rows found. Cannot infer columns from data.");
    }
  }
}
inspect();
