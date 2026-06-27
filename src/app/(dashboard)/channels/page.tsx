import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const channels = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect your Twilio number to chat with attendees on WhatsApp.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: "bg-green-500",
    hoverColor: "hover:bg-green-50",
    status: "connected",
    identifier: "+1 (555) 123-4567"
  },
  {
    id: "instagram",
    name: "Instagram Direct",
    description: "Receive and reply to DMs from your linked Instagram Professional account.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: "bg-pink-600",
    hoverColor: "hover:bg-pink-50",
    status: "not_connected"
  },
  {
    id: "messenger",
    name: "Facebook Messenger",
    description: "Connect your Facebook Page to handle attendee messages directly.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.056-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.889-3.26-6.559 6.963z" />
      </svg>
    ),
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-50",
    status: "not_connected"
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    description: "Create a Telegram Bot to interact with your community and attendees.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color: "bg-sky-500",
    hoverColor: "hover:bg-sky-50",
    status: "not_connected"
  },
  {
    id: "website",
    name: "Website Widget",
    description: "Embed a live chat widget directly onto your event or ticketing website.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: "bg-violet-600",
    hoverColor: "hover:bg-violet-50",
    status: "not_connected"
  }
];

export default async function ChannelsPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  const tenantId = member?.tenant_id;
  
  // Fetch connected channels
  const { data: integrations } = await supabase
    .from("tenant_integrations")
    .select("channel, provider_account_id")
    .eq("tenant_id", tenantId);

  const connectedChannels = integrations?.reduce((acc: any, int: any) => {
    acc[int.channel] = int.provider_account_id;
    return acc;
  }, {}) || {};

  // Clone channels array to inject dynamic status
  const dynamicChannels = channels.map(channel => {
    if (channel.id === "instagram") {
      const isConnected = !!connectedChannels["instagram"];
      return {
        ...channel,
        status: isConnected ? "connected" : "not_connected",
        identifier: isConnected ? `IG ID: ${connectedChannels["instagram"]}` : undefined,
        actionUrl: isConnected ? "#" : "/api/auth/instagram"
      };
    }
    return { ...channel, actionUrl: "#" };
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Channels</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Connect the messaging platforms where your attendees already are. All messages route directly into your unified Inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dynamicChannels.map((channel) => (
          <div 
            key={channel.id} 
            className={`flex flex-col bg-white border ${channel.status === 'connected' ? 'border-green-200 shadow-md ring-1 ring-green-100' : 'border-gray-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-200 ${channel.hoverColor}`}
          >
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${channel.color} shadow-sm`}>
                  {channel.icon}
                </div>
                {channel.status === "connected" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Not Connected
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">{channel.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {channel.description}
              </p>

              {channel.status === "connected" && channel.identifier && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Active Identifier</span>
                  <span className="text-sm font-medium text-gray-900">{channel.identifier}</span>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              {channel.status === "connected" ? (
                <button className="w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Manage Settings
                </button>
              ) : (
                <Link href={channel.actionUrl || "#"} className={`block text-center w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-colors text-white ${channel.color} hover:opacity-90 shadow-sm`}>
                  Connect {channel.name}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer info block */}
      <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-indigo-900 mb-1">Need a custom integration?</h3>
          <p className="text-indigo-700 text-sm">Enterprise plans support custom endpoints and proprietary app integrations.</p>
        </div>
        <button className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
