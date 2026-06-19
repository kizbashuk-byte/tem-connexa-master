const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  "apikey": supabaseKey,
  "Authorization": `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

async function trace() {
  console.log("1. Simulating page.tsx fetching Carlos Mendes from incoming_messages...");
  const convRes = await fetch(`${supabaseUrl}/rest/v1/incoming_messages?sender_id=eq.Carlos Mendes&select=id,event_id,sender_id,ai_reply,last_message,last_message_time,created_at`, { headers });
  const convData = await convRes.json();
  const conversationData = convData && convData.length > 0 ? convData[0] : null;
  console.log("conversationData:", JSON.stringify(conversationData, null, 2));

  if (!conversationData) return;

  console.log("\n2. Simulating page.tsx fetching message_logs for Carlos Mendes using exact query...");
  // The query in page.tsx:
  // .from("message_logs")
  // .select("*, events!inner ( tenant_id )")
  // .eq("event_id", conversationData.event_id)
  // .eq("sender_id", conversationData.sender_id)
  // .eq("events.tenant_id", tenantId)
  // .order("timestamp", { ascending: true })

  // Since we don't know tenantId, we'll just try without the tenantId filter first, 
  // but with the exact same structure to see if RLS blocks it.
  const qs = `select=*,events!inner(tenant_id)&event_id=eq.${conversationData.event_id}&sender_id=eq.${conversationData.sender_id}&order=timestamp.asc`;
  const messagesRes = await fetch(`${supabaseUrl}/rest/v1/message_logs?${qs}`, { headers });
  const messagesData = await messagesRes.json();
  console.log("messagesData (Returned JSON from Supabase):", JSON.stringify(messagesData, null, 2));

  const messages = Array.isArray(messagesData) ? messagesData : [];

  console.log("\n3. Mapping/transforming messages array...");
  const chatBubbles = [];
  
  messages.forEach(msg => {
    const rawTime = msg.timestamp || msg.created_at;
    const formattedTime = rawTime ? new Date(rawTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

    if (msg.message_text) {
      chatBubbles.push({
        id: `${msg.id}-user`,
        isAttendee: true,
        content: String(msg.message_text),
        time: formattedTime
      });
    }

    if (msg.ai_reply) {
      chatBubbles.push({
        id: `${msg.id}-ai`,
        isAttendee: false,
        content: String(msg.ai_reply),
        time: formattedTime
      });
    }
  });

  console.log("chatBubbles (after message_logs mapping):", JSON.stringify(chatBubbles, null, 2));

  console.log("\n4. Simulating Fallback logic in page.tsx...");
  if (chatBubbles.length === 0) {
    const fallbackTime = conversationData.last_message_time || conversationData.created_at;
    const formattedFallbackTime = fallbackTime ? new Date(fallbackTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

    if (conversationData.last_message) {
      chatBubbles.push({
        id: `${conversationData.id}-fallback-user`,
        isAttendee: true,
        content: String(conversationData.last_message),
        time: formattedFallbackTime,
      });
    }

    if (
      conversationData.ai_reply && 
      conversationData.ai_reply !== "false" && 
      conversationData.ai_reply !== "true"
    ) {
      chatBubbles.push({
        id: `${conversationData.id}-fallback-ai`,
        isAttendee: false,
        content: String(conversationData.ai_reply),
        time: formattedFallbackTime,
      });
    }
  }

  console.log("chatBubbles (FINAL):", JSON.stringify(chatBubbles, null, 2));
}

trace();
