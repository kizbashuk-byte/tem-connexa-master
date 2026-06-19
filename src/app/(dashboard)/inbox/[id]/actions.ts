"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import twilio from "twilio";

export async function approveAndSendMessage(conversationId: string, _messageLogId: string | undefined, aiReply: string) {
  const supabase = await createClient();

  try {
    // 1. Verify the caller is an authenticated tenant member
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { success: false, error: "Unauthenticated" };

    const { data: member } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (!member?.tenant_id) return { success: false, error: "No tenant membership found" };

    // 2. Fetch the conversation to get the customer's whatsapp_id
    const { data: convData, error: fetchConvError } = await supabase
      .from("conversations")
      .select("customers ( whatsapp_id )")
      .eq("id", conversationId)
      .eq("tenant_id", member.tenant_id)
      .single();

    if (fetchConvError || !convData) throw new Error("Conversation not found");

    const customerObj = Array.isArray(convData.customers) ? convData.customers[0] : convData.customers;
    const toWhatsappId = customerObj?.whatsapp_id;

    // 3. Update the conversation status to resolved
    const { error: convError } = await supabase
      .from("conversations")
      .update({ status: "resolved" })
      .eq("id", conversationId)
      .eq("tenant_id", member.tenant_id);

    if (convError) throw convError;

    // 3. Insert the AI reply as a new message row
    const { error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        tenant_id: member.tenant_id,
        sender_type: "ai",
        message_type: "text",
        content: aiReply,
      });

    if (msgError) throw msgError;

    // 5. Transmit the message via Twilio WhatsApp API
    if (toWhatsappId && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      try {
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: toWhatsappId,
          body: aiReply,
        });
      } catch (twilioErr: any) {
        console.error("Twilio transmission failed:", twilioErr);
        // We log the error but don't fail the DB update since the message was already saved locally
      }
    }



    revalidatePath(`/inbox/${conversationId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to approve and send message:", error);
    return { success: false, error: error.message };
  }
}
