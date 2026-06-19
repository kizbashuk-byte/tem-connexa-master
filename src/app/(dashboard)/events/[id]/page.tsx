import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">

        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {!event ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Event not found.</p>
          </div>
        ) : (
          <>
            {event.banner_image_url?.trim() && (
              <div className="mb-8 w-full rounded-lg overflow-hidden bg-gray-100 shadow-sm flex justify-center">
                <img 
                  src={event.banner_image_url} 
                  alt={`${event.event_name || "Event"} Banner`}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            <div className="mb-8 border-b border-gray-200 pb-6 flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.event_name || "Unnamed Event"}
              </h1>
              <Link
                href={`/events/${id}/edit`}
                className="shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150"
              >
                Edit Event
              </Link>
            </div>

            <div className="space-y-6">

              {event.is_delayed && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Live Event Status</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500 font-medium block mb-1">Original Time</span>
                        <span className="text-base text-gray-900 font-medium">
                          {event.original_time || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 font-medium block mb-1">Live Time</span>
                        <span className="text-base text-gray-900 font-medium">
                          {event.live_time || "Not specified"}
                        </span>
                      </div>
                    </div>
                    {event.delay_message?.trim() && (
                      <div className="pt-2 border-t border-gray-200 mt-4">
                        <span className="text-sm text-gray-500 font-medium block mb-1 mt-3">Delay Message</span>
                        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {event.delay_message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">When</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 font-medium block mb-1">Event Date</span>
                    <span className="text-base text-gray-900 font-medium">
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 font-medium block mb-1">Event Time</span>
                    <span className="text-base text-gray-900 font-medium">
                      {event.event_time || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Where</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 font-medium block mb-1">Venue Name</span>
                    <span className="text-base text-gray-900 font-medium">
                      {event.venue_name || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 font-medium block mb-1">Venue Address</span>
                    <div className="flex flex-col items-start">
                      <span className="text-base text-gray-900 font-medium">
                        {event.venue_address || "Not specified"}
                      </span>
                      {event.venue_address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue_address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150 mt-1"
                        >
                          View on Map <span className="ml-1 text-xs">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {event.event_description?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">About this event</h2>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {event.event_description}
                  </p>
                </div>
              )}

              {event.ticket_link?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Tickets</h2>
                  <a
                    href={event.ticket_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                  >
                    Buy Tickets <span className="ml-1 text-xs">↗</span>
                  </a>
                </div>
              )}

              {event.djs?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">DJs</h2>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {event.djs}
                  </p>
                </div>
              )}

              {event.teachers?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Teachers</h2>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {event.teachers}
                  </p>
                </div>
              )}

              {event.dress_code?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Dress Code</h2>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {event.dress_code}
                  </p>
                </div>
              )}

              {event.parking_info?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Parking</h2>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {event.parking_info}
                  </p>
                </div>
              )}

              {event.event_notes?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Event Notes</h2>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {event.event_notes}
                  </p>
                </div>
              )}

              {event.frame_link?.trim() && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Photo Frame</h2>
                  <a
                    href={event.frame_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                  >
                    Add Event Frame to Your Photo <span className="ml-1 text-xs">↗</span>
                  </a>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
