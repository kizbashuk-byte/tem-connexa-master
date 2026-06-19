import Link from "next/link";
import React from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   BRAND TOKENS
   ═══════════════════════════════════════════════════════════════════════════════ */

const CHANNELS = [
  { name: "Instagram", color: "from-yellow-400 via-pink-500 to-purple-600",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>), label: "DMs" },
  { name: "Messenger", color: "from-blue-500 to-blue-600",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.653V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/></svg>), label: "Messages" },
  { name: "WhatsApp", color: "from-green-500 to-green-600",
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>), label: "Messages" },
  { name: "Email", color: "from-slate-500 to-slate-600",
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>), label: "Inquiries" },
  { name: "Event Page", color: "from-indigo-500 to-violet-600",
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>), label: "Questions" },
];

const CHECK_V = (<svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>);
const CHECK_EMERALD = (<svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>);

const TESTIMONIALS = [
  { name: "Sarah Jenkins", role: "Festival Director", company: "UrbanDance Fest", image: null as string | null, stars: 5,
    quote: "Connexa has completely removed the burden of answering the same questions every day. I estimate it saves my team over 15 hours a week." },
  { name: "Marcus Rivera", role: "Congress Lead", company: "Salsa Central", image: null as string | null, stars: 5,
    quote: "The Live Delay feature alone pays for itself. When our main artist ran late, one update notified 2,000 attendees instantly." },
  { name: "Elena Rostova", role: "Workshop Host", company: "Elena Dance Co", image: null as string | null, stars: 5,
    quote: "It's like having a full-time support agent who never sleeps. The peace of mind during event week is absolutely priceless." },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans text-slate-300 selection:bg-violet-500/30 antialiased bg-[#060612] overflow-x-hidden">

      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#060612]/70 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/20">
              <span className="text-white font-black text-base leading-none">C</span>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Connexa</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-slate-400">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#inbox" className="hover:text-white transition-colors">Unified Inbox</a>
            <a href="#scale" className="hover:text-white transition-colors">Scale</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="text-[13px] font-bold bg-white text-slate-900 px-5 py-2 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">

        {/* ═══════════════════════════════════════════════════════════════════════
            1 · HERO
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-24 pb-28 bg-[#060612]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"/>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"/>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0zOS0xdjM5SDFWMWgzOHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none mask-image-gradient"/>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-[11px] font-bold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-[pulse_2s_ease-in-out_infinite]"/>
              The Communication Operating System for Events
            </div>

            <h1 className="text-[3.25rem] sm:text-6xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1.05] tracking-tight mb-8 max-w-5xl mx-auto">
              Never Answer The Same<br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400"> Event Question </span>
              Twice.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop spending hours repeating yourself. Connexa centralizes Instagram, Messenger, WhatsApp, Email, and Event Page communication into one intelligent platform that answers attendee questions 24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-[#060612] font-black rounded-full hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] text-[15px]">
                Start Free Trial
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2.5 text-[15px] group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Watch Demo
              </button>
            </div>

            {/* HERO STATS */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 border-t border-white/[0.05] max-w-4xl mx-auto">
              {[
                { val: "27,368+", label: "Questions Answered" },
                { val: "143+", label: "Hours Saved" },
                { val: "32+", label: "Event Organizers" },
                { val: "99.2%", label: "Response Accuracy" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-white font-black text-2xl md:text-3xl">{stat.val}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* VISUAL IDENTITY: Flow architecture */}
            <div className="relative mt-24 max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-[#060612] via-transparent to-transparent z-20 pointer-events-none h-full" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative z-10 px-4 md:px-0">
                
                {/* Left: Channels */}
                <div className="flex flex-row md:flex-col gap-3 md:gap-4 md:w-56 w-full overflow-x-auto pb-4 md:pb-0 justify-center relative">
                  {CHANNELS.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.12] rounded-2xl px-4 py-3 shadow-[0_0_30px_rgba(139,92,246,0.2)] shrink-0 relative hover:bg-white/[0.06] transition-colors cursor-default group z-10">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0 shadow-inner`}><div className="scale-75">{c.icon}</div></div>
                      <span className="text-white text-sm font-semibold hidden md:block">{c.name}</span>
                      <div className="absolute inset-0 border border-violet-500/0 group-hover:border-violet-500/50 rounded-2xl transition-colors duration-500"/>
                    </div>
                  ))}
                </div>

                {/* Center: Intelligence Layer */}
                <div className="relative flex-1 flex justify-center py-10 md:py-0">
                  {/* Lines Left to Center */}
                  <div className="absolute hidden md:block left-0 right-1/2 top-1/2 -translate-y-1/2 h-[200px] -z-10">
                     <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                        <path d="M-50,10 C25,10 25,50 100,50" stroke="url(#gradient-violet)" strokeWidth="1.5" className="animate-[dash_2s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <path d="M-50,30 C25,30 25,50 100,50" stroke="url(#gradient-violet)" strokeWidth="1.5" className="animate-[dash_3s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <path d="M-50,50 C25,50 25,50 100,50" stroke="url(#gradient-violet)" strokeWidth="1.5" className="animate-[dash_2.5s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <path d="M-50,70 C25,70 25,50 100,50" stroke="url(#gradient-violet)" strokeWidth="1.5" className="animate-[dash_2.2s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <path d="M-50,90 C25,90 25,50 100,50" stroke="url(#gradient-violet)" strokeWidth="1.5" className="animate-[dash_3.1s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <defs>
                          <linearGradient id="gradient-violet" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(139,92,246,0)" />
                            <stop offset="100%" stopColor="rgba(139,92,246,0.8)" />
                          </linearGradient>
                        </defs>
                     </svg>
                  </div>

                  {/* Brain */}
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-[#0a0a1a] border border-violet-500/40 shadow-[0_0_80px_rgba(139,92,246,0.4)] flex items-center justify-center relative group cursor-default">
                    <div className="absolute inset-0 rounded-full bg-violet-600/10 group-hover:bg-violet-600/20 transition-all duration-700 blur-xl" />
                    <div className="absolute inset-0 rounded-full border border-violet-400/20 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-indigo-400/20 animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="relative flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-2 flex items-center justify-center shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/20 blur-md animate-[pulse_2s_ease-in-out_infinite] mix-blend-overlay"/>
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                       </div>
                       <span className="text-white font-black text-[10px] md:text-xs tracking-widest uppercase">Connexa Brain</span>
                    </div>
                  </div>

                  {/* Lines Center to Right */}
                  <div className="absolute hidden md:block left-1/2 right-0 top-1/2 -translate-y-1/2 h-[150px] -z-10">
                     <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                        <path d="M0,50 C75,50 75,15 150,15" stroke="url(#gradient-right)" strokeWidth="1.5" className="animate-[dash_2s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <path d="M0,50 C75,50 75,50 150,50" stroke="url(#gradient-right)" strokeWidth="1.5" className="animate-[dash_2.5s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <path d="M0,50 C75,50 75,85 150,85" stroke="url(#gradient-right)" strokeWidth="1.5" className="animate-[dash_3s_linear_infinite] opacity-50" strokeDasharray="4 8"/>
                        <defs>
                          <linearGradient id="gradient-right" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(139,92,246,0.8)" />
                            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                          </linearGradient>
                        </defs>
                     </svg>
                  </div>
                </div>

                {/* Right: AI Layers */}
                <div className="flex flex-row md:flex-col gap-3 md:gap-5 md:w-64 w-full overflow-x-auto pb-4 md:pb-0 justify-center">
                   <div className="bg-white/[0.03] border border-violet-500/30 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(139,92,246,0.2)] flex items-center gap-4 shrink-0 text-left hover:bg-white/[0.06] hover:border-violet-400 transition-all cursor-default group">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">💬</div>
                      <div>
                        <p className="text-white text-[13px] font-bold leading-none">Attendee AI</p>
                        <p className="text-violet-300/60 text-[11px] mt-1.5 hidden md:block">Handles 94% of questions</p>
                      </div>
                   </div>
                   <div className="bg-white/[0.03] border border-indigo-500/30 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center gap-4 shrink-0 text-left hover:bg-white/[0.06] hover:border-indigo-400 transition-all cursor-default group">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">🛠️</div>
                      <div>
                        <p className="text-white text-[13px] font-bold leading-none">Organizer AI</p>
                        <p className="text-indigo-300/60 text-[11px] mt-1.5 hidden md:block">Your platform copilot</p>
                      </div>
                   </div>
                   <div className="bg-white/[0.03] border border-slate-500/30 rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(148,163,184,0.2)] flex items-center gap-4 shrink-0 text-left hover:bg-white/[0.06] hover:border-slate-400 transition-all cursor-default group">
                      <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">⚙️</div>
                      <div>
                        <p className="text-white text-[13px] font-bold leading-none">Admin AI</p>
                        <p className="text-slate-400 text-[11px] mt-1.5 hidden md:block">System intelligence</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ═══════════════════════════════════════════════════════════════════════
            2 · THE CONNEXA ECOSYSTEM
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="platform" className="py-24 bg-[#060612] relative border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4">The Connexa Ecosystem</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Three AI Layers.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">One Intelligence Layer.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Connexa is more than a chatbot. It is a complete communication operating system built specifically for the complexities of live events.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { layer: "01", title: "Attendee AI", desc: "Resolves attendee questions instantly across all channels. Reduces your support load by over 90%.",
                  icon: "💬", accent: "hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]", 
                  features: ["Answers 24/7", "Learns event logic", "Multi-channel"] },
                { layer: "02", title: "Organizer AI", desc: "Your proactive operational copilot. Helps you manage broadcasts and analyze performance.",
                  icon: "🛠️", accent: "hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]", 
                  features: ["Platform guidance", "Data explanations", "Actionable insights"] },
                { layer: "03", title: "Admin AI", desc: "The brain running the system. Monitors performance and ensures operational stability.",
                  icon: "⚙️", accent: "hover:border-slate-400/50 hover:shadow-[0_0_40px_rgba(148,163,184,0.15)]", 
                  features: ["System oversight", "Performance monitoring", "Continuous learning"] },
              ].map((l) => (
                <div key={l.layer} className={`bg-white/[0.03] rounded-3xl p-8 border border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300 cursor-default group ${l.accent}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {l.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Layer {l.layer}</span>
                      <h3 className="text-xl font-bold text-white leading-none mt-1">{l.title}</h3>
                    </div>
                  </div>
                  <p className="text-[15px] text-slate-400 leading-relaxed mb-8 h-16">{l.desc}</p>
                  <div className="space-y-3">
                    {l.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                        {CHECK_V} {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            3 · UNIFIED INBOX
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="inbox" className="py-24 bg-[#0a0a1a] border-t border-white/[0.04] relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/2"/>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4">Unified Communication</p>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                  Every channel.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">One intelligent inbox.</span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                  Focus on your event, not your tabs. Connexa pulls Instagram, Messenger, WhatsApp, Email, and your Event Page into a single, seamless interface. Reclaim hours of lost time every week.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    "Zero tab switching", 
                    "No missed questions", 
                    "Full conversation history", 
                    "Seamless AI handoff"
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      {CHECK_EMERALD}
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realistic Inbox Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 blur-3xl -z-10 rounded-[3rem]" />
                <div className="bg-[#0c0c1e] border border-white/[0.12] rounded-3xl p-6 shadow-2xl">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.1] pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"/>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"/>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.1] px-4 py-1.5 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                      Inbox Live
                    </div>
                  </div>
                  {/* Messages list */}
                  <div className="space-y-3">
                    {[
                      { chan: CHANNELS[0], user: "Alex Chen", topic: "Where is the VIP parking entrance located?", time: "Just now", status: "AI Resolved", sc: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                      { chan: CHANNELS[2], user: "Maria Rodriguez", topic: "What time does the bachata workshop start?", time: "2m ago", status: "AI Resolved", sc: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                      { chan: CHANNELS[1], user: "David Smith", topic: "Can I show my ticket on my phone at the door?", time: "15m ago", status: "AI Resolved", sc: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                      { chan: CHANNELS[3], user: "Sarah Jenkins", topic: "Which entrance is wheelchair accessible?", time: "28m ago", status: "Needs Reply", sc: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                    ].map((m, i) => (
                      <div key={i} className="flex flex-col p-4 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.06] transition-colors cursor-default">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.chan.color} flex items-center justify-center`}><div className="scale-50">{m.chan.icon}</div></div>
                            <div>
                              <p className="text-white text-[13px] font-bold">{m.user}</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">{m.chan.name} · {m.time}</p>
                            </div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${m.sc}`}>
                            {m.status}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm ml-11 line-clamp-1">{m.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════════════════════════════════
            4 · ESCALATION
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#060612] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4">Trust & Control</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                AI handles the volume.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">You stay in control.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                When AI encounters a complex question, it doesn&apos;t guess. It seamlessly escalates the conversation to you, complete with full context.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/[0.1] -translate-y-1/2 hidden md:block"></div>
              {/* Animated pulse along line */}
              <div className="absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 hidden md:block overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-r from-transparent via-violet-500 to-transparent w-1/2 animate-[pulse-x_3s_linear_infinite]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {[
                  { step: "01", title: "Question Arrives", desc: "Attendee messages via any channel", icon: "💬", border: "border-white/[0.12]" },
                  { step: "02", title: "AI Evaluates", desc: "Checks knowledge base for answer", icon: "🧠", border: "border-violet-500/30", bg: "bg-violet-900/10" },
                  { step: "03", title: "Escalation Triggered", desc: "Flags to you if uncertain", icon: "🔔", border: "border-amber-500/30", bg: "bg-amber-900/10" },
                  { step: "04", title: "Organizer Responds", desc: "You reply with full context", icon: "✅", border: "border-emerald-500/30", bg: "bg-emerald-900/10" },
                ].map((s) => (
                  <div key={s.step} className={`bg-[#0c0c1e] rounded-2xl p-6 text-center border transition-all duration-300 ${s.border} hover:-translate-y-1 hover:shadow-xl`}>
                    <div className={`w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center mx-auto mb-5 text-xl ${s.bg || 'bg-white/[0.03]'}`}>
                      {s.icon}
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Step {s.step}</p>
                    <h3 className="font-bold text-white text-[15px] mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            5 · LIVE DELAY MANAGEMENT
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#0a0a1a] border-t border-white/[0.04] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-[#0a0a1a] to-[#0a0a1a] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  🔥 Competitive Advantage
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                  Live Delay Management.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Update once. Notify everywhere.</span>
                </h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Things go wrong at live events. Artists run late. Weather changes plans. Connexa lets you update the schedule once and instantly propagate that change across every channel. 
                </p>
                <ul className="space-y-4">
                  {[
                    "One-click schedule updates from your dashboard",
                    "Push notifications across all connected channels",
                    "Public event page updates instantly",
                    "Eliminate chaos at the door"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300 text-[15px] font-medium">
                      <svg className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Glowing Visual */}
              <div className="bg-[#060612] rounded-3xl border border-white/[0.12] shadow-[0_0_50px_rgba(0,0,0,0.6)] p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent rounded-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                  <div className="flex-1 w-full bg-red-950/20 border border-red-500/20 rounded-2xl p-5 text-center">
                    <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest mb-2">Original Time</p>
                    <p className="text-3xl font-black text-red-500/50 line-through">8:00 PM</p>
                  </div>
                  <div className="text-slate-600 shrink-0">
                    <svg className="w-6 h-6 rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </div>
                  <div className="flex-1 w-full bg-violet-900/20 border border-violet-500/40 rounded-2xl p-5 text-center shadow-[0_0_40px_rgba(139,92,246,0.2)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-violet-500/10 animate-pulse" />
                    <div className="absolute inset-0 border-2 border-violet-400/50 rounded-2xl" />
                    <p className="text-[10px] font-bold text-violet-300 uppercase tracking-widest mb-2 relative z-10">Updated Time</p>
                    <p className="text-3xl font-black text-white relative z-10">9:30 PM</p>
                    <div className="mt-3 flex justify-center relative z-10">
                      <span className="inline-block text-[9px] font-black text-white bg-violet-600 border border-violet-400 px-3 py-1 rounded-full tracking-wider shadow-lg">LIVE DELAY</span>
                    </div>
                  </div>
                </div>
                
                {/* Propagation Visual */}
                <div className="mt-8 pt-8 border-t border-white/[0.1] text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                     Propagating to all channels
                   </p>
                   <div className="flex justify-center gap-4">
                     {CHANNELS.map((c, i) => (
                       <div key={c.name} className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] relative`}>
                         <div className="absolute -inset-1 rounded-full bg-white/20 animate-ping" style={{animationDelay: `${i * 150}ms`}}/>
                         <div className="scale-[0.55] relative z-10">{c.icon}</div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            6 · SCALE
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="scale" className="py-24 bg-[#060612] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4">Uncapped Growth</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Built To Scale <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">With Your Events.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Whether you run one boutique workshop or twenty international festivals, Connexa scales with you effortlessly — without requiring you to hire a support team.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
               <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -translate-y-1/2 hidden md:block"></div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  {/* 1 Event */}
                  <div className="bg-[#0c0c1e] border border-white/[0.1] rounded-3xl p-8 text-center relative hover:bg-white/[0.03] transition-colors">
                     <div className="w-16 h-16 mx-auto rounded-full bg-[#15152a] border border-white/10 flex items-center justify-center mb-6 text-2xl font-bold text-white shadow-inner">
                        1
                     </div>
                     <h3 className="text-white font-bold text-lg mb-1">Event</h3>
                     <p className="text-slate-500 text-sm">Hundreds of attendees</p>
                  </div>
                  {/* 5 Events */}
                  <div className="bg-[#0c0c1e] border border-violet-500/20 rounded-3xl p-8 text-center relative hover:bg-violet-900/10 transition-colors shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                     <div className="w-16 h-16 mx-auto rounded-full bg-violet-900/40 border border-violet-500/40 flex items-center justify-center mb-6 text-2xl font-bold text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                        5
                     </div>
                     <h3 className="text-white font-bold text-lg mb-1">Events</h3>
                     <p className="text-violet-300/60 text-sm">Thousands of attendees</p>
                  </div>
                  {/* 25 Events */}
                  <div className="bg-gradient-to-b from-violet-900/20 to-[#0c0c1e] border border-violet-500/40 rounded-3xl p-8 text-center relative shadow-[0_0_50px_rgba(139,92,246,0.2)]">
                     <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-6 text-2xl font-black text-white shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                        25+
                     </div>
                     <h3 className="text-white font-bold text-lg mb-1">Events</h3>
                     <p className="text-violet-200 text-sm">Tens of thousands of messages</p>
                  </div>
               </div>
               <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                  <span className="text-slate-300 font-bold tracking-widest uppercase text-[11px] bg-white/[0.05] px-4 py-2 rounded-full border border-white/[0.1]">Still one inbox.</span>
                  <span className="text-slate-300 font-bold tracking-widest uppercase text-[11px] bg-white/[0.05] px-4 py-2 rounded-full border border-white/[0.1]">Still one platform.</span>
                  <span className="text-violet-300 font-bold tracking-widest uppercase text-[11px] bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/30">Still one intelligence layer.</span>
               </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            7 · OPERATIONAL INSIGHTS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#0a0a1a] relative overflow-hidden border-t border-white/[0.04]">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"/>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">Operational Insights</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Don&apos;t just automate.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Understand.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Gain unprecedented visibility into your operations. See where attendees are messaging from, track your most frequently asked questions, and measure exactly how much time AI is saving you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Channel breakdown */}
              <div className="bg-[#060612] border border-white/[0.12] rounded-3xl p-8 hover:border-white/[0.2] transition-colors shadow-lg">
                <h3 className="text-white font-bold text-[15px] mb-6">Messages by Channel</h3>
                <div className="space-y-5">
                  {[
                    { name: "Instagram", pct: 52, color: "from-pink-500 to-purple-500" },
                    { name: "Messenger", pct: 24, color: "from-blue-500 to-blue-600" },
                    { name: "WhatsApp", pct: 16, color: "from-green-500 to-green-600" },
                    { name: "Email", pct: 8, color: "from-slate-400 to-slate-500" },
                  ].map((ch) => (
                    <div key={ch.name}>
                      <div className="flex justify-between text-xs mb-2"><span className="text-slate-300 font-semibold">{ch.name}</span><span className="text-slate-400 font-bold">{ch.pct}%</span></div>
                      <div className="w-full bg-white/[0.04] rounded-full h-1.5"><div className={`bg-gradient-to-r ${ch.color} h-1.5 rounded-full transition-all`} style={{ width: `${ch.pct}%` }}/></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top questions */}
              <div className="bg-[#060612] border border-white/[0.12] rounded-3xl p-8 hover:border-white/[0.2] transition-colors shadow-lg">
                <h3 className="text-white font-bold text-[15px] mb-6">Most Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: "Where can I park?", count: "127" },
                    { q: "What time does it start?", count: "94" },
                    { q: "Is there a dress code?", count: "68" },
                    { q: "Are tickets on the door?", count: "52" },
                  ].map((item, idx) => (
                    <div key={item.q} className="flex items-center justify-between pb-4 border-b border-white/[0.04] last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-black text-xs">{idx + 1}</span>
                        <span className="text-slate-300 text-[13px] font-medium">{item.q}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-16 h-1 bg-white/[0.05] rounded-full overflow-hidden flex"><span className="bg-indigo-500 rounded-full" style={{width: `${(parseInt(item.count)/127)*100}%`}}/></span>
                        <span className="text-indigo-400 text-[10px] font-bold w-6 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Metrics */}
              <div className="bg-[#060612] border border-white/[0.12] rounded-3xl p-8 hover:border-white/[0.2] transition-colors shadow-lg">
                <h3 className="text-white font-bold text-[15px] mb-6">Platform Performance</h3>
                <div className="space-y-6">
                  {[
                    { label: "AI Resolution Rate", value: "94.2%", color: "text-emerald-400" },
                    { label: "Avg. Response Time", value: "18s", color: "text-indigo-400" },
                    { label: "Escalation Rate", value: "5.8%", color: "text-amber-400" },
                    { label: "Time Saved (30d)", value: "143 hrs", color: "text-white" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-slate-400 text-[13px] font-medium">{m.label}</span>
                      <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            8 · ROI & TESTIMONIALS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#060612] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* ROI */}
              <div className="bg-[#0c0c1e] rounded-3xl p-8 md:p-10 border border-white/[0.12] shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 relative z-10">Calculate Your ROI</p>
                <h3 className="text-2xl font-black text-white mb-8 relative z-10">How much time and money are you losing?</h3>
                
                <div className="space-y-3 relative z-10">
                  {[
                    { icon: "💬", label: "500 questions per event", value: "£30/hour value" },
                    { icon: "⏳", label: "45 seconds per answer", value: "£187.50 lost" },
                    { icon: "📉", label: "6.25 hours lost per event", value: "Connexa Growth: £79" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.1] rounded-xl px-5 py-4">
                      <div className="flex items-center gap-3"><span className="text-lg">{r.icon}</span><span className="text-slate-300 text-sm font-medium">{r.label}</span></div>
                      <span className="text-slate-400 text-xs font-bold">{r.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6 text-center relative z-10">
                  <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-widest mb-2">You save</p>
                  <p className="text-5xl font-black text-emerald-400">£108.50</p>
                  <p className="text-emerald-400/60 text-[13px] mt-2 font-semibold">every single event.</p>
                </div>
              </div>
              
              {/* Testimonials */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Trusted by Organizers</p>
                <div className="space-y-4">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-[#0c0c1e] rounded-2xl border border-white/[0.1] p-6 hover:bg-white/[0.03] transition-all">
                      <div className="flex gap-1 text-amber-400 mb-4">
                        {Array.from({ length: 5 }).map((_, si) => (<svg key={si} className={`w-3.5 h-3.5 ${si < t.stars ? "" : "opacity-25"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>))}
                      </div>
                      <p className="text-slate-300 text-[15px] leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-4">
                        {t.image ? <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700"/> : <div className="w-10 h-10 rounded-full bg-[#1a1a2e] border border-white/[0.12] flex items-center justify-center text-white font-bold text-sm">{t.name.substring(0,2)}</div>}
                        <div><p className="font-bold text-white text-sm leading-none">{t.name}</p><p className="text-xs text-slate-500 mt-1">{t.role} · {t.company}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            9 · PRICING
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 bg-[#0a0a1a] border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Transparent Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-4">Start free. Scale when ready.</h2>
            <p className="text-lg text-slate-400 text-center mb-12 max-w-xl mx-auto">No hidden fees. Pause anytime. AI top-ups available on all paid plans.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 items-stretch">
              {/* Trial */}
              <div className="bg-[#060612] rounded-3xl border border-white/[0.1] p-6 flex flex-col hover:border-white/[0.2] transition-colors shadow-lg">
                <h3 className="text-base font-bold text-white mb-2">Trial</h3>
                <div className="text-4xl font-black text-white mb-1">£0</div>
                <p className="text-[13px] text-slate-400 mb-8">Try everything risk-free</p>
                <ul className="space-y-3 mb-10 flex-1 text-[13px] text-slate-300 font-medium">
                  {["1 Event","10 AI Messages","All Channels","Attendee AI"].map((f) => <li key={f} className="flex items-center gap-2.5">{CHECK_V} {f}</li>)}
                </ul>
                <Link href="/signup" className="block w-full py-3.5 text-center font-bold text-[13px] bg-white/[0.05] border border-white/[0.1] text-white rounded-xl hover:bg-white/[0.1] transition-colors">Get Started</Link>
              </div>
              
              {/* Starter */}
              <div className="bg-[#060612] rounded-3xl border border-white/[0.1] p-6 flex flex-col hover:border-white/[0.2] transition-colors shadow-lg">
                <h3 className="text-base font-bold text-white mb-2">Starter</h3>
                <div className="text-4xl font-black text-white mb-1">£29<span className="text-base text-slate-500 font-medium">/mo</span></div>
                <p className="text-[13px] text-slate-400 mb-8">Perfect for single events</p>
                <ul className="space-y-3 mb-10 flex-1 text-[13px] text-slate-300 font-medium">
                  {["1 Event","100 AI Messages","Unified Inbox","Event Page","Delay Management"].map((f) => <li key={f} className="flex items-center gap-2.5">{CHECK_V} {f}</li>)}
                </ul>
                <button className="block w-full py-3.5 text-center font-bold text-[13px] bg-white/[0.05] border border-white/[0.1] text-white rounded-xl hover:bg-white/[0.1] transition-colors">Start Trial</button>
              </div>
              
              {/* Growth */}
              <div className="bg-gradient-to-b from-violet-600 to-indigo-700 rounded-3xl p-6 flex flex-col shadow-[0_0_40px_rgba(139,92,246,0.4)] relative xl:-translate-y-4">
                <div className="absolute -top-3 inset-x-0 flex justify-center"><span className="bg-white text-[#060612] text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Most Popular</span></div>
                <h3 className="text-base font-bold text-white mb-2">Growth</h3>
                <div className="text-4xl font-black text-white mb-1">£79<span className="text-base text-violet-300 font-medium">/mo</span></div>
                <p className="text-[13px] text-violet-200 mb-8">For growing event series</p>
                <ul className="space-y-3 mb-10 flex-1 text-[13px] text-white font-medium">
                  {["Up to 3 Events","300 AI Messages","Analytics Dashboard","Live Delay Management","Broadcast Messaging","Organizer AI"].map((f) => <li key={f} className="flex items-center gap-2.5"><svg className="w-4 h-4 text-violet-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>{f}</li>)}
                </ul>
                <Link href="/signup" className="block w-full py-3.5 text-center font-bold text-[13px] bg-white text-indigo-700 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">Start Trial</Link>
              </div>
              
              {/* Pro */}
              <div className="bg-[#060612] rounded-3xl border border-white/[0.1] p-6 flex flex-col hover:border-white/[0.2] transition-colors shadow-lg">
                <h3 className="text-base font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-black text-white mb-1">£149<span className="text-base text-slate-500 font-medium">/mo</span></div>
                <p className="text-[13px] text-slate-400 mb-8">For serious organizers</p>
                <ul className="space-y-3 mb-10 flex-1 text-[13px] text-slate-300 font-medium">
                  {["Up to 5 Events","1000 AI Messages","Audience Insights","Advanced Analytics","Admin AI","Everything in Growth"].map((f) => <li key={f} className="flex items-center gap-2.5">{CHECK_V} {f}</li>)}
                </ul>
                <button className="block w-full py-3.5 text-center font-bold text-[13px] bg-white/[0.05] border border-white/[0.1] text-white rounded-xl hover:bg-white/[0.1] transition-colors">Start Trial</button>
              </div>
              
              {/* Enterprise */}
              <div className="bg-[#0c0c1e] rounded-3xl p-6 flex flex-col border border-white/[0.04]">
                <h3 className="text-base font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-black text-white mb-1">Custom</div>
                <p className="text-[13px] text-slate-400 mb-8">For large teams & portfolios</p>
                <ul className="space-y-3 mb-10 flex-1 text-[13px] text-slate-500 font-medium">
                  {["Unlimited Events","Unlimited Messages","Custom Integrations","White Label Options","Dedicated Manager"].map((f) => <li key={f} className="flex items-center gap-2.5"><svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>{f}</li>)}
                </ul>
                <button className="block w-full py-3.5 text-center font-bold text-[13px] bg-white/[0.03] text-slate-400 border border-white/[0.05] rounded-xl hover:bg-white/[0.05] transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            10 · FINAL CTA
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 bg-[#060612] overflow-hidden border-t border-white/[0.04]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none"/>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-[11px] font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px]">C</span>
              Connexa
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
              Run Events.<br/>Not Customer Support.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12">
              <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-white text-[#060612] font-black rounded-full hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] text-lg">
                Start Free Trial
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 border border-white/[0.1] text-white font-bold rounded-full hover:bg-white/[0.05] transition-all text-lg">
                Book A Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#060612] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center"><span className="text-white font-black text-base leading-none">C</span></div>
              <span className="text-white font-bold text-lg">Connexa</span>
            </div>
            <div className="flex flex-wrap items-center gap-8 text-[13px] text-slate-500 font-medium">
              <a href="#platform" className="hover:text-white transition-colors">Platform</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/[0.04] pt-8 flex items-center justify-between">
             <div className="text-xs text-slate-600">© {new Date().getFullYear()} Connexa. All rights reserved.</div>
             <div className="text-xs text-slate-600">The AI Communication Layer for Events</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
