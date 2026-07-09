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
  console.log("[WEBHOOK] POST received");
  try {
    const body = await request.json();

    console.log("[WEBHOOK] body.object =", body.object);

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
        console.log("[WEBHOOK] webhook_event =", JSON.stringify(webhook_event));

        if (!webhook_event) {
          console.log("[WEBHOOK] SKIPPED: webhook_event is missing — entry =", JSON.stringify(entry));
          continue;
        }
        if (!webhook_event.message) {
          console.log("[WEBHOOK] SKIPPED: webhook_event.message is missing — webhook_event =", JSON.stringify(webhook_event));
          continue;
        }
        if (!webhook_event.message.text) {
          console.log("[WEBHOOK] SKIPPED: webhook_event.message.text is missing — message =", JSON.stringify(webhook_event.message));
          continue;
        }

        const senderId = webhook_event.sender.id;
        const recipientId = webhook_event.recipient?.id;
        const messageMid = webhook_event.message.mid;
        const messageText = webhook_event.message.text;
        const timestamp = webhook_event.timestamp;

        console.log("[WEBHOOK] senderId =", senderId);
        console.log("[WEBHOOK] recipientId =", recipientId);
        console.log("[WEBHOOK] messageMid =", messageMid);
        console.log("[WEBHOOK] messageText =", messageText);
        console.log("[WEBHOOK] timestamp =", timestamp);

        let tenantId = null;
        let eventId = null;
        let customerData: any = {};
        let conflictCol = "";

        if (body.object === "instagram") {
          // The recipient.id is the Instagram Professional Account ID
          const providerAccountId = webhook_event.recipient.id;
          console.log("[WEBHOOK] providerAccountId (instagram) =", providerAccountId);

          const { data: integration, error: intError } = await supabase
            .from("tenant_integrations")
            .select("tenant_id")
            .eq("channel", "instagram")
            .eq("provider_account_id", providerAccountId)
            .single();

          console.log("[WEBHOOK] tenant_integrations query result: data =", integration, "error =", intError);

          if (!integration?.tenant_id) {
            console.error("[WEBHOOK] EARLY CONTINUE: Unrecognized Instagram account. providerAccountId =", providerAccountId, "intError =", intError);
            continue;
          }

          tenantId = integration.tenant_id;
          conflictCol = "instagram_id";
          customerData = {
            tenant_id: tenantId,
            name: `Instagram User ${senderId}`,
            instagram_id: senderId
          };

          const { data: eventRow, error: eventErr } = await supabase
            .from("events")
            .select("id")
            .eq("tenant_id", tenantId)
            .limit(1)
            .maybeSingle();

          console.log("[WEBHOOK] events query result (instagram): data =", eventRow, "error =", eventErr);

          if (eventRow) eventId = eventRow.id;
          console.log("[WEBHOOK] eventId (instagram) =", eventId);
        } else {
          // Messenger fallback behavior (sandbox)
          const { data: eventRow, error: eventError } = await supabase
            .from("events")
            .select("id, tenant_id")
            .limit(1)
            .maybeSingle();

          console.log("[WEBHOOK] events query result (messenger): data =", eventRow, "error =", eventError);

          if (eventError || !eventRow) {
            console.error("[WEBHOOK] EARLY CONTINUE: No event found to route message to. eventError =", eventError);
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

        console.log("[WEBHOOK] tenantId =", tenantId, "| eventId =", eventId);

        if (!tenantId || !eventId) {
          console.log("[WEBHOOK] EARLY CONTINUE: tenantId or eventId is null after resolution. tenantId =", tenantId, "eventId =", eventId);
          continue;
        }

        // Upsert Customer
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .upsert(customerData, { onConflict: conflictCol })
          .select("id")
          .single();

        console.log("[WEBHOOK] customer upsert result: data =", customer, "error =", customerError);

        if (customerError || !customer) {
          console.error("[WEBHOOK] EARLY CONTINUE: Failed to upsert customer. customerError =", customerError);
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

        console.log("[WEBHOOK] conversation upsert result: data =", conversation, "error =", convError);

        if (convError || !conversation) {
          console.error("[WEBHOOK] EARLY CONTINUE: Failed to upsert conversation. convError =", convError);
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

        console.log("[WEBHOOK] message insert result: error =", msgError);

        if (msgError) {
          console.error("[WEBHOOK] Failed to insert message. msgError =", msgError);
        } else {
          console.log("[WEBHOOK] SUCCESS: Message inserted for conversation", conversation.id);
        }
      }

      // Returns a '200 OK' response to all requests
      console.log("[WEBHOOK] All entries processed. Returning EVENT_RECEIVED.");
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      console.log("[WEBHOOK] EARLY RETURN 404: body.object is not 'page' or 'instagram'. Got:", body.object);
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("[WEBHOOK] UNCAUGHT ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
