import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  // --- MOCK BILLING DATA ---
  const currentPlan = {
    name: "Growth Plan",
    price: "$149",
    billingPeriod: "per month",
    status: "Active",
    renewsOn: "July 2, 2026",
    paymentMethod: {
      type: "Visa",
      last4: "4242",
      expiry: "12/28"
    }
  };

  const usage = {
    messages: {
      used: 14239,
      limit: 20000,
      percent: Math.round((14239 / 20000) * 100),
      remaining: 20000 - 14239,
      label: "AI Messages Processed"
    },
    events: {
      used: 4,
      limit: 10,
      percent: Math.round((4 / 10) * 100),
      remaining: 10 - 4,
      label: "Active Events Managed"
    }
  };

  const invoices = [
    { id: "INV-2026-06", date: "Jun 2, 2026", amount: "$149.00", status: "Paid" },
    { id: "INV-2026-05", date: "May 2, 2026", amount: "$149.00", status: "Paid" },
    { id: "INV-2026-04", date: "Apr 2, 2026", amount: "$149.00", status: "Paid" },
    { id: "INV-2026-03", date: "Mar 2, 2026", amount: "$0.00", status: "Paid", note: "Trial" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Usage</h1>
          <p className="text-gray-500 mt-1">Manage your subscription, view your plan limits, and update billing details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan & Usage */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Current Plan Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
            {/* Top accent border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
            
            <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{currentPlan.name}</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {currentPlan.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  You are currently on the Growth plan. Your next charge of <strong className="text-gray-900">{currentPlan.price}</strong> will be on <strong className="text-gray-900">{currentPlan.renewsOn}</strong>.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-colors text-sm text-center shadow-sm">
                  Upgrade to Pro
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors text-sm text-center shadow-sm">
                  Cancel Plan
                </button>
              </div>
            </div>

            {/* Usage Section inside Plan Card */}
            <div className="p-6 sm:p-8 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 mb-6">Current Billing Cycle Usage</h3>
              
              <div className="space-y-6">
                {/* Messages Usage */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">{usage.messages.label}</span>
                    <span className="text-gray-900">{usage.messages.used.toLocaleString()} <span className="text-gray-400 font-medium">/ {usage.messages.limit.toLocaleString()}</span></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-2">
                    <div className={`h-2.5 rounded-full ${usage.messages.percent > 90 ? 'bg-red-500' : 'bg-violet-500'}`} style={{ width: `${usage.messages.percent}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">{usage.messages.percent}% used</span>
                    <span className="font-bold text-gray-700">{usage.messages.remaining.toLocaleString()} messages remaining</span>
                  </div>
                </div>

                {/* Events Usage */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">{usage.events.label}</span>
                    <span className="text-gray-900">{usage.events.used} <span className="text-gray-400 font-medium">/ {usage.events.limit}</span></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-2">
                    <div className="h-2.5 rounded-full bg-indigo-500" style={{ width: `${usage.events.percent}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">{usage.events.percent}% used</span>
                    <span className="font-bold text-gray-700">{usage.events.remaining} event slots remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Billing History</h3>
              <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">Download All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((invoice, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{invoice.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-violet-600 hover:text-violet-700 font-semibold text-sm">PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method & Contact */}
        <div className="space-y-6">
          {/* Payment Method Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4">
              <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center font-black text-[10px] text-blue-800 tracking-tighter italic shadow-sm">
                VISA
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">•••• •••• •••• {currentPlan.paymentMethod.last4}</p>
                <p className="text-xs text-gray-500 font-medium">Expires {currentPlan.paymentMethod.expiry}</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors text-sm shadow-sm">
              Update Payment Method
            </button>
          </div>

          {/* Contact Sales / Enterprise Card */}
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600 opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
            <h3 className="font-bold text-xl mb-2 relative z-10">Need Enterprise Scale?</h3>
            <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
              Managing massive events with huge messaging volume? Contact us for custom limits, dedicated infrastructure, and SLA guarantees on our Pro plan.
            </p>
            <button className="w-full py-2.5 bg-white text-black hover:bg-gray-100 font-bold rounded-lg transition-colors text-sm shadow-sm relative z-10">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
