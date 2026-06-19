import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // No auth required for public page
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 text-center py-16">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-500 text-lg">This event may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans selection:bg-blue-200">
      
      {/* Hero Section */}
      <div className="relative w-full h-[45vh] min-h-[400px] max-h-[600px] bg-gray-900 overflow-hidden">
        {event.banner_image_url?.trim() ? (
          <img 
            src={event.banner_image_url} 
            alt={`${event.event_name || "Event"} Banner`}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900" />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-8 lg:px-12 pb-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-wrap gap-3 mb-5 items-center">
            {/* Status Badge */}
            {event.is_delayed ? (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white tracking-widest uppercase shadow-lg shadow-red-900/50 border border-red-500/30">
                Delayed
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white tracking-widest uppercase shadow-lg shadow-emerald-900/50 border border-emerald-400/30">
                On Schedule
              </span>
            )}
            
            {/* Date Badge */}
            {event.event_date && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md tracking-widest uppercase border border-white/20">
                {new Date(event.event_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl max-w-4xl">
            {event.event_name || "Unnamed Event"}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative -mt-8 z-10">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* Delay Alert Container */}
          {event.is_delayed && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-red-100 shadow-xl shadow-red-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <svg className="w-32 h-32 text-red-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-red-900 uppercase tracking-wide">Event Update: Delayed</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <div className="bg-red-50/50 rounded-2xl p-5 border border-red-50">
                  <span className="text-sm text-red-500 font-bold tracking-wide uppercase block mb-1">Original Time</span>
                  <span className="text-xl text-red-900/60 line-through decoration-red-400 font-medium">
                    {event.original_time || "Not specified"}
                  </span>
                </div>
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100 shadow-inner">
                  <span className="text-sm text-red-600 font-bold tracking-wide uppercase block mb-1">Live Time</span>
                  <span className="text-2xl text-red-700 font-black">
                    {event.live_time || "Not specified"}
                  </span>
                </div>
              </div>
              
              {event.delay_message?.trim() && (
                <div className="mt-6 pt-6 border-t border-red-100 relative z-10">
                  <span className="text-sm text-red-500 font-bold tracking-wide uppercase block mb-3">Message from Organizer</span>
                  <p className="text-lg text-red-900 leading-relaxed whitespace-pre-wrap font-medium">
                    {event.delay_message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* About Section */}
          {event.event_description?.trim() && (
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">About this event</h2>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                {event.event_description}
              </p>
            </div>
          )}

          {/* DJs & Teachers */}
          {(event.djs?.trim() || event.teachers?.trim()) && (
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">Lineup & Instructors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {event.djs?.trim() && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Music / DJs</h3>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm shrink-0 flex items-center justify-center text-gray-300 border border-gray-200">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <p className="text-lg font-bold text-gray-800 leading-tight whitespace-pre-wrap">
                        {event.djs}
                      </p>
                    </div>
                  </div>
                )}
                
                {event.teachers?.trim() && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Instructors</h3>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm shrink-0 flex items-center justify-center text-gray-300 border border-gray-200">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-bold text-gray-800 leading-tight whitespace-pre-wrap">
                        {event.teachers}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(event.dress_code?.trim() || event.parking_info?.trim() || event.event_notes?.trim() || event.frame_link?.trim()) && (
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">Additional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {event.dress_code?.trim() && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Dress Code</h3>
                    <p className="text-base font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">{event.dress_code}</p>
                  </div>
                )}
                
                {event.parking_info?.trim() && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Parking Options</h3>
                    <p className="text-base font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">{event.parking_info}</p>
                  </div>
                )}

                {event.event_notes?.trim() && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sm:col-span-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Organizer Notes</h3>
                    <p className="text-base font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">{event.event_notes}</p>
                  </div>
                )}

                {event.frame_link?.trim() && (
                  <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="text-xs font-black text-indigo-800 uppercase tracking-widest mb-2">Social Frame</h3>
                      <p className="text-base font-medium text-indigo-900/80">Add our custom frame to your event photos!</p>
                    </div>
                    <a
                      href={event.frame_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 transform transition-all"
                    >
                      Use Photo Frame <span className="ml-2 text-lg">↗</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Ticket Box & Info */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-8 space-y-6">
            
            {/* Ticket CTA Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-blue-600"></div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Tickets</h3>
              <p className="text-base font-medium text-gray-500 mb-8">Secure your spot for this event</p>
              
              {event.ticket_link?.trim() ? (
                <a
                  href={event.ticket_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-8 py-5 text-lg font-black text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transform focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
                >
                  Get Tickets Now
                </a>
              ) : (
                <button disabled className="w-full px-8 py-5 text-lg font-black text-gray-400 bg-gray-100 rounded-2xl cursor-not-allowed">
                  Tickets Unavailable
                </button>
              )}
            </div>

            {/* When & Where Details Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 p-8 space-y-8">
              
              {/* When */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">When</h3>
                <div className="flex items-start gap-5">
                  <div className="mt-0.5 p-3 bg-blue-50/50 rounded-2xl text-blue-600 border border-blue-100/50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "long", day: "numeric" }) : "Date TBD"}
                    </div>
                    <div className="text-base font-medium text-gray-500 mt-1">
                      {event.event_time || "Time TBD"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Where */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Where</h3>
                <div className="flex items-start gap-5">
                  <div className="mt-0.5 p-3 bg-blue-50/50 rounded-2xl text-blue-600 border border-blue-100/50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900">
                      {event.venue_name || "Location TBD"}
                    </div>
                    <div className="text-base font-medium text-gray-500 mt-1 leading-relaxed">
                      {event.venue_address || "Address not provided"}
                    </div>
                    {event.venue_address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue_address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mt-4"
                      >
                        Open in Google Maps <span className="ml-1 text-lg leading-none">↗</span>
                      </a>
                    )}
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
