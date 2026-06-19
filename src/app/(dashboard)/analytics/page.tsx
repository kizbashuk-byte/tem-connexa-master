import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  // --- MOCK DATA FOR ANALYTICS ---
  const kpis = [
    { name: "Total Messages", value: "14,239", trend: "+12.5%", isPositive: true },
    { name: "AI Resolution Rate", value: "94.2%", trend: "+1.1%", isPositive: true },
    { name: "Avg Response Time", value: "1.2s", trend: "-0.4s", isPositive: true, subtext: "vs human 4.5h" },
    { name: "Support Hours Saved", value: "340 hrs", trend: "+45 hrs", isPositive: true },
  ];

  const categories = [
    { name: "Ticket Enquiries", count: 6407, percent: 45, color: "bg-violet-500" },
    { name: "Set Times & Lineup", count: 4271, percent: 30, color: "bg-indigo-500" },
    { name: "Venue Information", count: 2135, percent: 15, color: "bg-blue-500" },
    { name: "Lost & Found", count: 1426, percent: 10, color: "bg-emerald-500" },
  ];

  const channels = [
    { name: "WhatsApp", count: 9255, percent: 65, color: "bg-green-500", icon: "whatsapp" },
    { name: "Instagram", count: 3559, percent: 25, color: "bg-pink-500", icon: "instagram" },
    { name: "Email", count: 1425, percent: 10, color: "bg-blue-400", icon: "email" },
  ];

  const eventPerformance = [
    { name: "Neon Nights 2026", total: 5230, aiResolved: 5010, escalated: 220, rate: 95.8 },
    { name: "Tech Summit London", total: 4100, aiResolved: 3900, escalated: 200, rate: 95.1 },
    { name: "Food & Wine Fest", total: 3000, aiResolved: 2750, escalated: 250, rate: 91.6 },
    { name: "Summer Solstice Run", total: 1909, aiResolved: 1705, escalated: 204, rate: 89.3 },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-500 mt-1">AI performance and attendee insights across all your events.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Timeframe:</span>
          <select className="bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 font-bold shadow-sm outline-none focus:border-violet-500">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">{kpi.name}</h3>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-black text-gray-900 tracking-tight">{kpi.value}</span>
              <div className={`flex flex-col items-end`}>
                <span className={`inline-flex items-center gap-1 text-sm font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.isPositive ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  )}
                  {kpi.trend}
                </span>
                {kpi.subtext && <span className="text-xs text-gray-400 font-medium mt-0.5">{kpi.subtext}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Question Categories Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">Top Question Categories</h3>
          <div className="space-y-6">
            {categories.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-gray-700">{cat.name}</span>
                  <span className="text-gray-900">{cat.percent}% <span className="text-gray-400 font-medium ml-1">({cat.count})</span></span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Breakdown Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">Channel Breakdown</h3>
          <div className="space-y-6">
            {channels.map((ch, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <div className="flex items-center gap-2">
                    {ch.icon === 'whatsapp' && (
                      <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      </span>
                    )}
                    {ch.icon === 'instagram' && (
                      <span className="w-6 h-6 rounded bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </span>
                    )}
                    {ch.icon === 'email' && (
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M0 4v16h24V4H0zm20.89 2L12 11.233 3.11 6h17.78zm-18.89 12V7.472l9.043 8.136c.551.496 1.363.496 1.914 0L22 7.472V18H2z"/></svg>
                      </span>
                    )}
                    <span className="text-gray-700">{ch.name}</span>
                  </div>
                  <span className="text-gray-900">{ch.percent}% <span className="text-gray-400 font-medium ml-1">({ch.count})</span></span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${ch.color}`} style={{ width: `${ch.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages by Event Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">AI Performance by Event</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Total Messages</th>
                <th className="px-6 py-4">AI Resolved</th>
                <th className="px-6 py-4">Human Escapations</th>
                <th className="px-6 py-4">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eventPerformance.map((ev, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{ev.name}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {ev.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {ev.aiResolved.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {ev.escalated.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900">{ev.rate}%</span>
                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden hidden sm:block">
                        <div className={`h-2 rounded-full ${ev.rate >= 95 ? 'bg-emerald-500' : ev.rate >= 90 ? 'bg-violet-500' : 'bg-amber-500'}`} style={{ width: `${ev.rate}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
