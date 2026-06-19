import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const user = data.user;

  // Fetch tenant membership and join tenants
  const { data: memberData } = await supabase
    .from("tenant_members")
    .select(`
      tenant_id,
      role,
      tenants (
        name,
        slug,
        plan
      )
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  const tenant = memberData?.tenants as any;
  const role = memberData?.role;
  const tenantId = memberData?.tenant_id;

  // Fetch upcoming events for the tenant
  let events: any[] = [];
  let totalEvents = 0;
  let upcomingEventsCount = 0;
  let messagesCount = 0;

  if (tenantId) {
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("starts_at", { ascending: true });

    if (eventsData) {
      events = eventsData;
      totalEvents = events.length;
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      upcomingEventsCount = events.filter((e) => {
        if (!e.starts_at) return false;
        return new Date(e.starts_at) >= now;
      }).length;
    }

    const { count: msgCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);
    messagesCount = msgCount || 0;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your secure area.</p>
        </div>

        <div className="bg-blue-50 rounded-md p-6 mb-8 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Tenant Information</h2>
          {tenant ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-blue-700 font-medium block mb-1">Tenant Name</span>
                <span className="text-base text-gray-900 font-medium">{tenant.name || "N/A"}</span>
              </div>
              <div>
                <span className="text-sm text-blue-700 font-medium block mb-1">Tenant Slug</span>
                <span className="text-base text-gray-900 font-medium">{tenant.slug || "N/A"}</span>
              </div>
              <div>
                <span className="text-sm text-blue-700 font-medium block mb-1">Role</span>
                <span className="text-base text-gray-900 font-medium capitalize">{role || "Unknown"}</span>
              </div>
            </div>
          ) : (
            <p className="text-blue-800">You are not assigned to a tenant.</p>
          )}
        </div>

        {tenantId && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-gray-500 mb-1">Total Events</span>
                <span className="text-2xl font-bold text-gray-900">{totalEvents}</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-gray-500 mb-1">Upcoming Events</span>
                <span className="text-2xl font-bold text-emerald-600">{upcomingEventsCount}</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-gray-500 mb-1">Messages</span>
                <span className="text-2xl font-bold text-blue-600">{messagesCount}</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow justify-center">
                <span className="text-sm font-medium text-gray-500 mb-1">Current Plan</span>
                <span className="text-xl font-bold text-violet-600 capitalize">{tenant?.plan || "Starter"}</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-md p-6 mb-8 border border-emerald-200">
              <h2 className="text-lg font-semibold text-emerald-900 mb-4">Upcoming Events</h2>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Banner Image */}
                    <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-100 shrink-0 relative">
                      {event.banner_image_url ? (
                        <img 
                          src={event.banner_image_url} 
                          alt={event.event_name || "Event Banner"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="font-bold text-lg text-gray-900">{event.event_name || "Unnamed Event"}</h3>
                          {event.is_delayed ? (
                            <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              DELAYED
                            </span>
                          ) : (
                            <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ON SCHEDULE
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {event.starts_at ? new Date(event.starts_at).toLocaleDateString() : "No date"}
                            {event.starts_at && ` • ${new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.venue_name || "Venue TBD"}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md shadow-sm hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150"
                        >
                          View Event
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-emerald-800">No events found.</p>
            )}
          </div>
          </>
        )}

        <div className="bg-gray-50 rounded-md p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile Details</h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500 font-medium block mb-1">Email Address</span>
              <span className="text-base text-gray-900 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 font-medium block mb-1">User ID</span>
              <span className="text-sm font-mono text-gray-700 break-all bg-gray-100 p-2 rounded-md inline-block">{user.id}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
