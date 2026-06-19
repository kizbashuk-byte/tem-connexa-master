import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const search = await searchParams;

  const showSuccess = search.success === "true";

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    redirect("/login");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <Link
            href={`/events/${id}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150 mb-8 block"
          >
            ← Back to Event
          </Link>
          <p className="text-gray-500 text-lg text-center py-12">Event not found.</p>
        </div>
      </div>
    );
  }

  async function saveEvent(formData: FormData) {
    "use server";

    const eventId = formData.get("event_id") as string;
    const eventName = formData.get("event_name") as string;
    const startsAt = formData.get("starts_at") as string;
    const endsAt = formData.get("ends_at") as string;
    const venueName = formData.get("venue_name") as string;
    const venueAddress = formData.get("venue_address") as string;
    const eventDescription = formData.get("event_description") as string;
    const bannerImageUrl = formData.get("banner_image_url") as string;
    const ticketLink = formData.get("ticket_link") as string;
    const djs = formData.get("djs") as string;
    const teachers = formData.get("teachers") as string;
    const dressCode = formData.get("dress_code") as string;
    const parkingInfo = formData.get("parking_info") as string;
    const eventNotes = formData.get("event_notes") as string;
    const frameLink = formData.get("frame_link") as string;
    const originalTime = formData.get("original_time") as string;
    const liveTime = formData.get("live_time") as string;
    const isDelayed = formData.get("is_delayed") === "on";
    const delayMessage = formData.get("delay_message") as string;
    const aiKnowledgeBase = formData.get("ai_knowledge_base") as string;
    const autoReplyEnabled = formData.get("auto_reply_enabled") === "on";

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      redirect("/login");
    }

    const { error } = await supabase
      .from("events")
      .update({ 
        event_name: eventName,
        starts_at: startsAt || null,
        ends_at: endsAt || null,
        venue_name: venueName || null,
        venue_address: venueAddress || null,
        event_description: eventDescription || null,
        banner_image_url: bannerImageUrl || null,
        ticket_link: ticketLink || null,
        djs: djs || null,
        teachers: teachers || null,
        dress_code: dressCode || null,
        parking_info: parkingInfo || null,
        event_notes: eventNotes || null,
        frame_link: frameLink || null,
        original_time: originalTime || null,
        live_time: liveTime || null,
        is_delayed: isDelayed,
        delay_message: delayMessage || null,
        ai_knowledge_base: aiKnowledgeBase || null,
        auto_reply_enabled: autoReplyEnabled
      })
      .eq("id", eventId);

    if (error) {
      console.error("[saveEvent] Update failed:", error.message);
      return;
    }

    redirect(`/events/${eventId}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">

        <div className="mb-8">
          <Link
            href={`/events/${id}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
          >
            ← Back to Event
          </Link>
        </div>

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        </div>

        {showSuccess && (
          <div className="mb-8 bg-green-50 rounded-md p-4 border border-green-200">
            <p className="text-green-800 font-medium">Changes saved successfully</p>
          </div>
        )}

        <form action={saveEvent} className="space-y-6">
          {/* Hidden field carries the event ID into the Server Action */}
          <input type="hidden" name="event_id" value={id} />

          <div>
            <label
              htmlFor="event_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Name
            </label>
            <input
              id="event_name"
              name="event_name"
              type="text"
              defaultValue={event.event_name || ""}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="banner_image_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Banner Image URL
            </label>
            <input
              id="banner_image_url"
              name="banner_image_url"
              type="text"
              defaultValue={event.banner_image_url || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="starts_at"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Start
              </label>
              <input
                id="starts_at"
                name="starts_at"
                type="datetime-local"
                defaultValue={event.starts_at ? new Date(event.starts_at).toISOString().slice(0, 16) : ""}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="ends_at"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event End
              </label>
              <input
                id="ends_at"
                name="ends_at"
                type="datetime-local"
                defaultValue={event.ends_at ? new Date(event.ends_at).toISOString().slice(0, 16) : ""}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="venue_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Venue Name
            </label>
            <input
              id="venue_name"
              name="venue_name"
              type="text"
              defaultValue={event.venue_name || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="venue_address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Venue Address
            </label>
            <input
              id="venue_address"
              name="venue_address"
              type="text"
              defaultValue={event.venue_address || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="event_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Description
            </label>
            <textarea
              id="event_description"
              name="event_description"
              rows={4}
              defaultValue={event.event_description || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="ticket_link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ticket Link
            </label>
            <input
              id="ticket_link"
              name="ticket_link"
              type="text"
              defaultValue={event.ticket_link || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="djs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              DJs
            </label>
            <textarea
              id="djs"
              name="djs"
              rows={3}
              defaultValue={event.djs || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="teachers"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teachers
            </label>
            <textarea
              id="teachers"
              name="teachers"
              rows={3}
              defaultValue={event.teachers || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="dress_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Dress Code
            </label>
            <input
              id="dress_code"
              name="dress_code"
              type="text"
              defaultValue={event.dress_code || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="parking_info"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parking Info
            </label>
            <textarea
              id="parking_info"
              name="parking_info"
              rows={3}
              defaultValue={event.parking_info || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="event_notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Notes
            </label>
            <textarea
              id="event_notes"
              name="event_notes"
              rows={3}
              defaultValue={event.event_notes || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="frame_link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Frame Link
            </label>
            <input
              id="frame_link"
              name="frame_link"
              type="text"
              defaultValue={event.frame_link || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 pt-6 border-t border-gray-200 mt-8">Live Event Management</h2>

          <div>
            <label
              htmlFor="original_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Original Time
            </label>
            <input
              id="original_time"
              name="original_time"
              type="text"
              defaultValue={event.original_time || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="live_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Live Time
            </label>
            <input
              id="live_time"
              name="live_time"
              type="text"
              defaultValue={event.live_time || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_delayed"
              name="is_delayed"
              type="checkbox"
              defaultChecked={!!event.is_delayed}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is_delayed"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Event Delayed
            </label>
          </div>

          <div>
            <label
              htmlFor="delay_message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Delay Message
            </label>
            <textarea
              id="delay_message"
              name="delay_message"
              rows={3}
              defaultValue={event.delay_message || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 pt-6 border-t border-gray-200 mt-8">AI Settings</h2>

          <div>
            <label
              htmlFor="ai_knowledge_base"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              AI Knowledge Base
            </label>
            <textarea
              id="ai_knowledge_base"
              name="ai_knowledge_base"
              rows={6}
              defaultValue={event.ai_knowledge_base || ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div className="flex items-center">
            <input
              id="auto_reply_enabled"
              name="auto_reply_enabled"
              type="checkbox"
              defaultChecked={!!event.auto_reply_enabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="auto_reply_enabled"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Auto Reply Enabled
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
