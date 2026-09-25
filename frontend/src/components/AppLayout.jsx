import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopHeader from "./TopHeader.jsx";

export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Fixed Full-Height Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Shell — automatically shifts right on desktop without overlap */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px] transition-all duration-300">
        {/* Minimal Top Header */}
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
