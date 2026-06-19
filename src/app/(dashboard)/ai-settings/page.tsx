import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AISettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full pb-24">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          AI Settings
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Connexa Engine
          </span>
        </h1>
        <p className="text-gray-500 mt-2">Configure how the AI interacts with your attendees and what knowledge it possesses.</p>
      </div>

      <form className="space-y-8">
        
        {/* Core Settings Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Core Configuration</h2>
            <p className="text-sm text-gray-500 mt-1">Manage global AI behavior and operating modes.</p>
          </div>
          <div className="p-6 space-y-8">
            
            {/* AI Assistant Status */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">AI Assistant Status</h3>
                <p className="text-sm text-gray-500 mt-1">Turn the Connexa AI engine on or off for your organization.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                <span className="ml-3 text-sm font-bold text-gray-900">Enabled</span>
              </label>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Approval Mode */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-3">Approval Mode</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm focus:outline-none hover:border-violet-300 transition-colors">
                  <input type="radio" name="approval_mode" value="manual" className="sr-only peer" defaultChecked />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-bold text-gray-900">Manual Approval</p>
                        <p className="text-gray-500 mt-1">Review AI drafts before sending.</p>
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center peer-checked:border-violet-600 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-violet-600 pointer-events-none transition-all"></div>
                </label>
                
                <label className="relative flex cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm focus:outline-none hover:border-violet-300 transition-colors">
                  <input type="radio" name="approval_mode" value="auto" className="sr-only peer" />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-bold text-gray-900">Auto Reply</p>
                        <p className="text-gray-500 mt-1">AI responds instantly to attendees.</p>
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center peer-checked:border-violet-600 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-violet-600 pointer-events-none transition-all"></div>
                </label>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* AI Tone */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-3">AI Tone</h3>
              <select className="w-full sm:w-1/2 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" defaultValue="friendly">
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">Adjusts the communication style used across all platforms.</p>
            </div>
          </div>
        </div>

        {/* System Instructions & Guardrails */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">System Instructions & Guardrails</h2>
            <p className="text-sm text-gray-500 mt-1">Define specific rules and boundaries for the AI.</p>
          </div>
          <div className="p-6 space-y-8">
            
            {/* Organizer Instructions */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Organizer Instructions</h3>
              <p className="text-sm text-gray-500 mb-4">Provide context about your company and specific behavioral instructions.</p>
              <textarea 
                rows={4} 
                className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-y"
                placeholder="We are a Kizomba event company based in London. Be friendly and concise. Never invent ticket prices. If unsure, tell attendees a team member will reply shortly."
                defaultValue="We are a Kizomba event company based in London. Be friendly and concise. Never invent ticket prices. If unsure, tell attendees a team member will reply shortly."
              ></textarea>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Restricted Topics */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Restricted Topics</h3>
              <p className="text-sm text-gray-500 mb-4">If an attendee asks about these topics, the AI will defer to human support rather than attempting to answer.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "refunds", label: "Ticket Refunds", checked: true },
                  { id: "cancellations", label: "Artist Cancellations", checked: true },
                  { id: "complaints", label: "Complaints", checked: true },
                  { id: "vip", label: "VIP Upgrades", checked: false },
                ].map((topic) => (
                  <label key={topic.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      defaultChecked={topic.checked}
                      className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-900">{topic.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Event Knowledge Base */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-violet-50/30 flex items-center gap-3">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Event Knowledge Base</h2>
              <p className="text-sm text-gray-500 mt-0.5">The core information Connexa will use to generate accurate responses.</p>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="font-bold text-gray-900 text-sm">Event Information</label>
              <textarea 
                rows={3} 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
                defaultValue="Neon Nights 2026 is an outdoor electronic music festival taking place on August 15-17 in Victoria Park."
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-900 text-sm">Schedule Details</label>
              <textarea 
                rows={3} 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
                defaultValue="Gates open at 12:00 PM. Main stage performances start at 2:00 PM and curfew is at 11:00 PM daily."
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-900 text-sm">Venue Information</label>
              <textarea 
                rows={3} 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
                defaultValue="Victoria Park, Grove Road, London E3 5TB. Bag searches will be conducted at all entrances. Clear bag policy enforced."
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-900 text-sm">Parking Information</label>
              <textarea 
                rows={3} 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
                defaultValue="No on-site parking available. Attendees are strongly encouraged to use public transit (Mile End or Bow Road tube stations)."
              ></textarea>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-gray-900 text-sm">FAQ Content</label>
              <textarea 
                rows={4} 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
                defaultValue="- Age Restriction: 18+ only, valid ID required.&#10;- Prohibited Items: Outside food/drink, large umbrellas, professional cameras.&#10;- Accessibility: Viewing platforms available at Main and Tent stages."
              ></textarea>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-gray-900 text-sm">Additional Notes</label>
              <textarea 
                rows={3} 
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-y"
                defaultValue="In case of rain, the event will proceed. No umbrellas allowed, please wear ponchos."
              ></textarea>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4">
          <button 
            type="button"
            className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            Save Settings
          </button>
        </div>

      </form>
    </div>
  );
}
