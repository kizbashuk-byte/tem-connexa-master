import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
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

  let conversations: any[] = [];

  if (tenantId) {
    const { data: convData } = await supabase
      .from("conversations")
      .select(`
        id,
        status,
        last_message_at,
        customers ( id, name, phone, whatsapp_id, messenger_psid ),
        events ( id, event_name )
      `)
      .eq("tenant_id", tenantId)
      .order("last_message_at", { ascending: false });

    if (convData && convData.length > 0) {
      conversations = convData;
    }
  }

  // Seed a test conversation using the new schema
  async function seedConversation(formData: FormData) {
    "use server";
    const senderName = formData.get("sender") as string;
    const message = formData.get("message") as string;

    try {
      const supabaseAction = await createClient();
      const { data: actionUser } = await supabaseAction.auth.getUser();
      if (!actionUser?.user) return redirect("/inbox?error=NoUser");

      const { data: member } = await supabaseAction
        .from("tenant_members")
        .select("tenant_id")
        .eq("user_id", actionUser.user.id)
        .maybeSingle();
      if (!member?.tenant_id) return redirect("/inbox?error=NoTenantId");

      // Find the first available event for this tenant
      const { data: eventRow, error: eventError } = await supabaseAction
        .from("events")
        .select("id, event_name")
        .eq("tenant_id", member.tenant_id)
        .limit(1)
        .maybeSingle();

      if (eventError || !eventRow) {
        return redirect("/inbox?error=" + encodeURIComponent(
          eventError?.message || "No events found. Create an event first."
        ));
      }

      // Upsert customer (unique per tenant + whatsapp_id)
      const fakeWhatsappId = senderName.toLowerCase().replace(/\s+/g, "_") + "_wa";
      const { data: customer, error: customerError } = await supabaseAction
        .from("customers")
        .upsert(
          { tenant_id: member.tenant_id, name: senderName, whatsapp_id: fakeWhatsappId },
          { onConflict: "tenant_id,whatsapp_id" }
        )
        .select("id")
        .single();

      if (customerError || !customer) {
        return redirect("/inbox?error=" + encodeURIComponent(`Customer upsert error: ${customerError?.message}`));
      }

      // Upsert conversation (unique per event + customer)
      const { data: conversation, error: convError } = await supabaseAction
        .from("conversations")
        .upsert(
          {
            tenant_id: member.tenant_id,
            event_id: eventRow.id,
            customer_id: customer.id,
            status: "open",
            last_message_at: new Date().toISOString(),
          },
          { onConflict: "event_id,customer_id" }
        )
        .select("id")
        .single();

      if (convError || !conversation) {
        return redirect("/inbox?error=" + encodeURIComponent(`Conversation upsert error: ${convError?.message}`));
      }

      // Insert message
      const { error: msgError } = await supabaseAction
        .from("messages")
        .insert({
          conversation_id: conversation.id,
          tenant_id: member.tenant_id,
          sender_type: "customer",
          message_type: "text",
          content: message,
        });

      if (msgError) {
        return redirect("/inbox?error=" + encodeURIComponent(`Message insert error: ${msgError.message}`));
      }

    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_")) throw err;
      return redirect("/inbox?error=" + encodeURIComponent("Exception: " + err.message));
    }

    revalidatePath("/inbox");
    redirect("/inbox?success=1");
  }

  const seedScenarios = [
    { sender: "Maria Rodriguez", message: "What time does the event start?", label: "⏰ Event time" },
    { sender: "Carlos Mendes", message: "Where is the event?", label: "📍 Location" },
    { sender: "Sofia Laurent", message: "Who are the DJs?", label: "🎧 DJs" },
    { sender: "André Silva", message: "Who are the teachers?", label: "👩‍🏫 Teachers" },
    { sender: "Lucia Ferreira", message: "Is parking available?", label: "🅿️ Parking" },
    { sender: "David Okafor", message: "What is the dress code?", label: "👔 Dress code" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inbox</h1>
          <p className="text-gray-500 mt-1">Unified view of all attendee communications across your events.</p>
        </div>
      </div>

      {/* Dev-only seed panel */}
      <details className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
        <summary className="px-5 py-3 cursor-pointer text-sm font-bold text-amber-800 flex items-center gap-2 select-none hover:bg-amber-100 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Seed Test Conversations
          <span className="text-xs font-normal text-amber-600 ml-1">(dev only)</span>
        </summary>
        <div className="px-5 pb-4 pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {seedScenarios.map((scenario) => (
            <form key={scenario.sender} action={seedConversation}>
              <input type="hidden" name="sender" value={scenario.sender} />
              <input type="hidden" name="message" value={scenario.message} />
              <button type="submit" className="w-full px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-xs shadow-sm border border-amber-600 text-center">
                {scenario.label}
              </button>
            </form>
          ))}
        </div>
      </details>

      {/* Errors / Success */}
      {resolvedParams.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm break-words text-sm font-medium">
          <p className="font-bold mb-1">Error</p>
          <p>{resolvedParams.error}</p>
        </div>
      )}
      {resolvedParams.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl shadow-sm text-sm font-medium">
          <p className="font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Test conversation seeded successfully!
          </p>
        </div>
      )}

      {/* Inbox Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {conversations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Attendee</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {conversations.map((conv) => {
                  const customer = Array.isArray(conv.customers) ? conv.customers[0] : conv.customers;
                  const event = Array.isArray(conv.events) ? conv.events[0] : conv.events;
                  const attendeeName = customer?.name || customer?.whatsapp_id || customer?.messenger_psid || customer?.phone || "Unknown Attendee";
                  const eventName = event?.event_name || "Unknown Event";
                  const status = conv.status || "open";
                  const initials = typeof attendeeName === "string" ? attendeeName.charAt(0).toUpperCase() : "?";

                  return (
                    <tr key={conv.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-0 align-middle">
                        <Link href={`/inbox/${conv.id}`} className="flex items-center gap-3 px-6 py-4 w-full h-full min-h-[72px]">
                          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {initials}
                          </div>
                          <p className="font-bold text-gray-900">{attendeeName}</p>
                        </Link>
                      </td>
                      <td className="p-0 align-middle">
                        <Link href={`/inbox/${conv.id}`} className="flex items-center px-6 py-4 w-full h-full min-h-[72px]">
                          <span className="text-sm font-medium text-gray-900">{eventName}</span>
                        </Link>
                      </td>
                      <td className="p-0 align-middle">
                        <Link href={`/inbox/${conv.id}`} className="flex items-center px-6 py-4 w-full h-full min-h-[72px]">
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
                          {status === "ignored" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              Ignored
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="p-0 align-middle">
                        <Link href={`/inbox/${conv.id}`} className="flex items-center px-6 py-4 w-full h-full min-h-[72px]">
                          <p className="text-sm text-gray-500">
                            {conv.last_message_at
                              ? new Date(conv.last_message_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                              : "—"}
                          </p>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your Inbox is Empty</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              When attendees ask questions about your events, conversations will appear here.
            </p>
            <form action={seedConversation}>
              <input type="hidden" name="sender" value="Maria Rodriguez" />
              <input type="hidden" name="message" value="What time does the event start?" />
              <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-sm shadow-sm border border-amber-600">
                Seed Test Conversation
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
