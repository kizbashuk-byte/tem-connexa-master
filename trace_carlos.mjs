const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  "apikey": supabaseKey,
  "Authorization": `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

async function fetchDb(endpoint, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });
  
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch(e) {
      error = await res.text();
    }
    return { error, data: null };
  }
  
  return { data: await res.json(), error: null };
}

async function trace() {
  console.log("1. Fetching Carlos Mendes from incoming_messages...");
  const convRes = await fetchDb(`incoming_messages?sender_id=eq.Carlos Mendes&select=id,event_id,sender_id,ai_reply`);
  console.log("Result:", JSON.stringify(convRes.data, null, 2));
  if (convRes.error) console.log("Error:", convRes.error);

  if (!convRes.data || convRes.data.length === 0) {
    console.log("No Carlos Mendes conversation found.");
    return;
  }
  
  const conversationId = convRes.data[0].id;
  const event_id = convRes.data[0].event_id;
  const sender_id = convRes.data[0].sender_id;

  console.log("\n2. Executing update on incoming_messages (mimicking actions.ts)...");
  const updateConvRes = await fetchDb(`incoming_messages?id=eq.${conversationId}&select=event_id,sender_id`, {
    method: "PATCH",
    body: JSON.stringify({ processed: true, ai_reply: "Test AI Reply" })
  });
  console.log("Update incoming_messages returned data:", JSON.stringify(updateConvRes.data, null, 2));
  if (updateConvRes.error) console.log("Update incoming_messages returned error:", updateConvRes.error);

  console.log("\n3. Executing update on message_logs (mimicking actions.ts)...");
  const updateLogRes = await fetchDb(`message_logs?event_id=eq.${event_id}&sender_id=eq.${sender_id}`, {
    method: "PATCH",
    body: JSON.stringify({ ai_reply: "Test AI Reply" }),
    headers: { "Prefer": "return=minimal" } // this is what supabase .update() without .select() uses
  });
  // Supabase update without select returns 204 No Content
  console.log("Update message_logs HTTP Status/Response:", updateLogRes.data === null ? "Success (No Content)" : updateLogRes.data);
  if (updateLogRes.error) console.log("Update message_logs returned error:", updateLogRes.error);
  
  console.log("\n4. Checking if Carlos Mendes exists in message_logs...");
  const checkRes = await fetchDb(`message_logs?sender_id=eq.Carlos Mendes&select=id,sender_id,ai_reply`);
  console.log("Check message_logs returned data:", JSON.stringify(checkRes.data, null, 2));
  if (checkRes.error) console.log("Check error:", checkRes.error);
}

trace();
