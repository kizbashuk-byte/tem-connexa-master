import React from "react";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <SidebarNav />
      {/* On mobile, add padding top for the fixed header. On desktop, add padding left for the fixed sidebar. */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen w-full">
        {children}
      </main>
    </div>
  );
}
