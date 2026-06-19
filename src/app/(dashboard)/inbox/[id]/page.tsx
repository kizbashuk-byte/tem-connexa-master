import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ApproveButton from "./ApproveButton";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const user = data.user;

  const { data: memberData } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const tenantId = memberData?.tenant_id;
  if (!tenantId) redirect("/login");

  // 1. Fetch the conversation with customer and event details
  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .select(`
      id,
      status,
      last_message_at,
      customers ( id, name, phone, whatsapp_id, email ),
      events ( id, event_name, starts_at, venue_name, djs, teachers, dress_code, parking_info, ai_knowledge_base )
    `)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (!conv || convError) redirect("/inbox");

  const customer = Array.isArray(conv.customers) ? conv.customers[0] : conv.customers;
  const eventsObj = Array.isArray(conv.events) ? conv.events[0] : conv.events;

  const attendeeName = customer?.name || customer?.whatsapp_id || customer?.phone || "Unknown Attendee";
  const attendeeEmail = customer?.email || "No email provided";
  const attendeePhone = customer?.phone || "No phone provided";
  const eventName = eventsObj?.event_name || "Unknown Event";
  const status = conv.status || "open";
  const initials = typeof attendeeName === "string" ? attendeeName.charAt(0).toUpperCase() : "?";

  // 2. Fetch all messages for this conversation
  const { data: messagesData } = await supabase
    .from("messages")
    .select("id, sender_type, content, created_at, message_type")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const messages = messagesData || [];

  // 3. Build chat bubbles from the unified messages table
  const chatBubbles: { id: string; isAttendee: boolean; content: string; time: string }[] = messages.map((msg) => ({
    id: msg.id,
    isAttendee: msg.sender_type === "customer",
    content: msg.content || "",
    time: msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
  }));

  // 4. Generate AI draft from the last customer message + event context
  function generateAIDraft(): string {
    const lastCustomerMsg = [...messages].reverse().find((m) => m.sender_type === "customer");
    const attendeeMessage = lastCustomerMsg?.content || "";
    const knowledgeBase = eventsObj?.ai_knowledge_base || "";
    const venueName = eventsObj?.venue_name || null;

    const eventDateStr = eventsObj?.starts_at
      ? new Date(eventsObj.starts_at).toLocaleDateString(undefined, {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })
      : null;
    const eventTimeStr = eventsObj?.starts_at
      ? new Date(eventsObj.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;

    if (!attendeeMessage.trim()) return "No attendee message to draft a response for.";

    const contextParts: string[] = [];
    if (eventName && eventName !== "Unknown Event") contextParts.push(`Event: ${eventName}`);
    if (eventDateStr) contextParts.push(`Date: ${eventDateStr}`);
    if (eventTimeStr) contextParts.push(`Time: ${eventTimeStr}`);
    if (venueName) contextParts.push(`Venue: ${venueName}`);
    const eventContext = contextParts.join(" · ");

    const lowerMsg = attendeeMessage.toLowerCase();

    if (lowerMsg.includes("time") || lowerMsg.includes("when") || lowerMsg.includes("start")) {
      const timeInfo = eventTimeStr
        ? `The event starts at ${eventTimeStr}${eventDateStr ? ` on ${eventDateStr}` : ""}.`
        : eventDateStr
          ? `The event is scheduled for ${eventDateStr}. We'll share the exact start time soon.`
          : "We'll confirm the exact timing shortly and get back to you.";
      return `Hi ${attendeeName}! 👋\n\n${timeInfo}${venueName ? ` It's being held at ${venueName}.` : ""}\n\nLet me know if you have any other questions!`;
    }
    if (lowerMsg.includes("where") || lowerMsg.includes("location") || lowerMsg.includes("venue") || lowerMsg.includes("address")) {
      const venueInfo = venueName ? `The event will be held at ${venueName}.` : "We'll confirm the exact venue details shortly.";
      return `Hi ${attendeeName}! 👋\n\n${venueInfo}\n\nLet me know if you need directions or have any other questions!`;
    }
    if (lowerMsg.includes("ticket") || lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("buy")) {
      return `Hi ${attendeeName}! 👋\n\nThanks for your interest${eventName !== "Unknown Event" ? ` in ${eventName}` : ""}! A team member will get back to you shortly with ticket information.\n\nIs there anything else I can help with?`;
    }
    if (lowerMsg.includes("dj") || lowerMsg.includes("music") || lowerMsg.includes("lineup")) {
      const djInfo = eventsObj?.djs ? `Here's the DJ lineup:\n\n🎧 ${eventsObj.djs}` : "The full DJ lineup hasn't been announced yet — stay tuned!";
      return `Hi ${attendeeName}! 👋\n\n${djInfo}\n\nLet me know if you have any other questions!`;
    }
    if (lowerMsg.includes("teacher") || lowerMsg.includes("instructor") || lowerMsg.includes("workshop")) {
      const teacherInfo = eventsObj?.teachers ? `Here are the teachers:\n\n👩‍🏫 ${eventsObj.teachers}` : "Teacher details haven't been confirmed yet — we'll share them soon!";
      return `Hi ${attendeeName}! 👋\n\n${teacherInfo}\n\nLet me know if you have any other questions!`;
    }
    if (lowerMsg.includes("parking") || lowerMsg.includes("park") || lowerMsg.includes("car")) {
      const parkingInfo = eventsObj?.parking_info ? `Here's the parking info:\n\n🅿️ ${eventsObj.parking_info}` : "We're still confirming parking arrangements — we'll update you soon!";
      return `Hi ${attendeeName}! 👋\n\n${parkingInfo}\n\nLet me know if you have any other questions!`;
    }
    if (lowerMsg.includes("dress") || lowerMsg.includes("wear") || lowerMsg.includes("outfit") || lowerMsg.includes("attire")) {
      const dressInfo = eventsObj?.dress_code ? `The dress code is:\n\n👔 ${eventsObj.dress_code}` : "There's no specific dress code — just come as you feel comfortable!";
      return `Hi ${attendeeName}! 👋\n\n${dressInfo}\n\nLet me know if you have any other questions!`;
    }
    if (knowledgeBase) {
      return `Hi ${attendeeName}! 👋\n\nThanks for reaching out${eventName !== "Unknown Event" ? ` about ${eventName}` : ""}!${eventContext ? `\n\n📍 ${eventContext}` : ""}\n\nBased on the event details, I'd be happy to help. Could you share a bit more detail so I can give you the most accurate information?\n\nLooking forward to seeing you there!`;
    }
    return `Hi ${attendeeName}! 👋\n\nThanks for your message${eventName !== "Unknown Event" ? ` about ${eventName}` : ""}!${eventContext ? `\n\n📍 ${eventContext}` : ""}\n\nI've noted your question and will get back to you with the details shortly. Feel free to ask anything else in the meantime!`;
  }

  const aiDraft = generateAIDraft();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full h-full min-h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/inbox"
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Conversation
              {status === "open" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Open
                </span>
              )}
              {status === "resolved" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Resolved
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full">
        {/* LEFT: Chat thread */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-[700px] lg:h-auto">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{attendeeName}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {eventName}
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 flex flex-col gap-6">
            {chatBubbles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <p className="text-gray-500 text-sm">No messages yet in this conversation.</p>
              </div>
            ) : (
              chatBubbles.map((bubble) => (
                <div key={bubble.id} className={`flex flex-col ${bubble.isAttendee ? "items-start" : "items-end"}`}>
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {bubble.isAttendee && (
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center shrink-0 text-xs mb-1">
                        {initials}
                      </div>
                    )}
                    <div className={`px-5 py-3.5 rounded-2xl ${
                      bubble.isAttendee
                        ? "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                        : "bg-violet-600 text-white rounded-br-none shadow-sm"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{bubble.content}</p>
                    </div>
                  </div>
                  <span className={`text-xs text-gray-400 mt-2 font-medium ${bubble.isAttendee ? "ml-10" : "mr-2"}`}>
                    {bubble.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: AI Panel + Attendee Details */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          {/* AI Panel */}
          <div className="bg-white border border-violet-200 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.08)] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">AI Draft Response</h3>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiDraft}</p>
              </div>

              <div className="flex flex-col gap-3">
                <ApproveButton
                  conversationId={id}
                  messageLogId={messages.length > 0 ? messages[messages.length - 1].id : undefined}
                  aiDraft={aiDraft}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit
                  </button>
                  <button className="py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Send Custom
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Details */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-5 text-lg">Attendee Details</h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Event</p>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p className="text-sm font-bold text-gray-900">{eventName}</p>
                </div>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Contact</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p className="text-sm font-medium text-gray-900">{attendeeEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <p className="text-sm font-medium text-gray-900">{attendeePhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
