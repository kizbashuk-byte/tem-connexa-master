import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("FACEBOOK WEBHOOK VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Bad Request", { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify this is a webhook from a Facebook Page or Instagram
    if (body.object === "page" || body.object === "instagram") {
      // Initialize Supabase service client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Iterate over each entry. There may be multiple if batched.
      for (const entry of body.entry || []) {
        // Gets the body of the webhook event
        const webhook_event = entry.messaging?.[0];
        if (!webhook_event || !webhook_event.message || !webhook_event.message.text) continue;

        const senderId = webhook_event.sender.id;
        const messageMid = webhook_event.message.mid;
        const messageText = webhook_event.message.text;
        const timestamp = webhook_event.timestamp;

        let tenantId = null;
        let eventId = null;
        let customerData: any = {};
        let conflictCol = "";

        if (body.object === "instagram") {
          // The recipient.id is the Instagram Professional Account ID
          const providerAccountId = webhook_event.recipient.id;

          const { data: integration } = await supabase
            .from("tenant_integrations")
            .select("tenant_id")
            .eq("channel", "instagram")
            .eq("provider_account_id", providerAccountId)
            .single();

          if (!integration?.tenant_id) {
            console.error("Webhook Error: Unrecognized Instagram account", providerAccountId);
            continue;
          }

          tenantId = integration.tenant_id;
          conflictCol = "instagram_id";
          customerData = {
            tenant_id: tenantId,
            name: `Instagram User ${senderId}`,
            instagram_id: senderId
          };

          const { data: eventRow } = await supabase
            .from("events")
            .select("id")
            .eq("tenant_id", tenantId)
            .limit(1)
            .maybeSingle();

          if (eventRow) eventId = eventRow.id;
        } else {
          // Messenger fallback behavior (sandbox)
          const { data: eventRow, error: eventError } = await supabase
            .from("events")
            .select("id, tenant_id")
            .limit(1)
            .maybeSingle();

          if (eventError || !eventRow) {
            console.error("Webhook Error: No event found to route message to.");
            continue;
          }

          tenantId = eventRow.tenant_id;
          eventId = eventRow.id;
          conflictCol = "messenger_psid";
          customerData = {
            tenant_id: tenantId,
            name: `Messenger User ${senderId}`,
            messenger_psid: senderId
          };
        }

        if (!tenantId || !eventId) continue;

        // Upsert Customer
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .upsert(customerData, { onConflict: conflictCol })
          .select("id")
          .single();

        if (customerError || !customer) {
          console.error("Webhook Error: Failed to upsert customer", customerError);
          continue;
        }

        // Upsert Conversation
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .upsert(
            {
              tenant_id: tenantId,
              event_id: eventId,
              customer_id: customer.id,
              status: "open",
              last_message_at: new Date(timestamp).toISOString(),
            },
            { onConflict: "event_id,customer_id" }
          )
          .select("id")
          .single();

        if (convError || !conversation) {
          console.error("Webhook Error: Failed to upsert conversation", convError);
          continue;
        }

        // Insert Message
        const { error: msgError } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversation.id,
            tenant_id: tenantId,
            sender_type: "customer",
            message_type: "text",
            content: messageText,
            provider_message_id: messageMid
          });

        if (msgError) {
          console.error("Webhook Error: Failed to insert message", msgError);
        }
      }

      // Returns a '200 OK' response to all requests
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("FACEBOOK WEBHOOK ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
