import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { DeleteEventButton } from "./DeleteEventButton";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const user = data.user;

  // Fetch tenant membership
  const { data: memberData } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const tenantId = memberData?.tenant_id;

  let events: any[] = [];
  if (tenantId) {
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("starts_at", { ascending: true });

    if (eventsData) {
      events = eventsData;
    }
  }

  // Server action to delete event securely
  async function deleteEvent(formData: FormData) {
    "use server";
    const eventId = formData.get("eventId")?.toString();
    if (!eventId || !tenantId) return;

    const supabase = await createClient();
    // Only delete if the event belongs to the user's tenant
    await supabase.from("events").delete().eq("id", eventId).eq("tenant_id", tenantId);
    revalidatePath("/events");
    revalidatePath("/dashboard");
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Events</h1>
          <p className="text-gray-500 mt-1">Manage and track all your events across your organization.</p>
        </div>
        <Link 
          href="/events/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </Link>
      </div>

      {/* Events Table / List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Venue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => {
                  const eventDate = event.starts_at ? new Date(event.starts_at) : null;
                  const isPast = eventDate ? eventDate < now : false;
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                            {event.banner_image_url ? (
                              <img src={event.banner_image_url} alt={event.event_name} className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{event.event_name || "Unnamed Event"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{event.id.substring(0,8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {event.starts_at ? new Date(event.starts_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "No date"}
                        </p>
                        {event.starts_at && <p className="text-sm text-gray-500 mt-0.5">{new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]" title={event.venue_name || "TBD"}>
                          {event.venue_name || "TBD"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {event.is_delayed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Delayed
                          </span>
                        ) : isPast ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                            Past Event
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/events/${event.id}`}
                            className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                            title="View Event"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link 
                            href={`/events/${event.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Event"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <form action={deleteEvent}>
                            <input type="hidden" name="eventId" value={event.id} />
                            <DeleteEventButton />
                          </form>
                        </div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              You haven&apos;t created any events yet. Get started by creating your first event to connect with attendees.
            </p>
            <Link 
              href="/events/new" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
