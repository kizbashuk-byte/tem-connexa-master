import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 1. Parse Twilio's application/x-www-form-urlencoded payload
    const formData = await request.formData();
    console.log("Twilio Webhook received:", Object.fromEntries(formData.entries()));
    const from = formData.get("From") as string; // e.g., "whatsapp:+14155238886"
    const to = formData.get("To") as string;
    const body = formData.get("Body") as string;
    const messageSid = formData.get("MessageSid") as string;

    if (!from || !body) {
      return new NextResponse("Missing required Twilio fields", { status: 400 });
    }

    // Since webhooks hit an unauthenticated route, we must use the Service Role key
    // to bypass RLS and insert the incoming message.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Find a default tenant/event to route to (for dev sandbox purposes)
    const { data: eventRow, error: eventError } = await supabase
      .from("events")
      .select("id, tenant_id")
      .limit(1)
      .maybeSingle();

    if (eventError || !eventRow) {
      console.error("Webhook Error: No event found to route message to.");
      return new NextResponse("No active event", { status: 400 });
    }

    const tenantId = eventRow.tenant_id;
    const eventId = eventRow.id;

    // 3. Upsert Customer (unique by tenant_id + whatsapp_id)
    // Use the phone number as a fallback name for new customers
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          tenant_id: tenantId,
          name: from.replace("whatsapp:", ""),
          whatsapp_id: from
        },
        { onConflict: "tenant_id,whatsapp_id" }
      )
      .select("id")
      .single();

    if (customerError || !customer) {
      console.error("Webhook Error: Failed to upsert customer", customerError);
      return new NextResponse("Customer error", { status: 500 });
    }

    // 4. Upsert Conversation (unique by event_id + customer_id)
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .upsert(
        {
          tenant_id: tenantId,
          event_id: eventId,
          customer_id: customer.id,
          status: "open",
          last_message_at: new Date().toISOString(),
        },
        { onConflict: "event_id,customer_id" }
      )
      .select("id")
      .single();

    if (convError || !conversation) {
      console.error("Webhook Error: Failed to upsert conversation", convError);
      return new NextResponse("Conversation error", { status: 500 });
    }

    // 5. Insert Message
    const { error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        tenant_id: tenantId,
        sender_type: "customer",
        message_type: "text",
        content: body,
        provider_message_id: messageSid
      });

    if (msgError) {
      console.error("Webhook Error: Failed to insert message", msgError);
      return new NextResponse("Message error", { status: 500 });
    }

    // Twilio requires a 200 OK response with TwiML (or empty XML) to acknowledge receipt
    return new NextResponse("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error: any) {
    console.error("Twilio Webhook Exception:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
