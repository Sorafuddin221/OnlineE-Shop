"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import NotificationBell from "@/components/admin/NotificationBell";
import { Search, User } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-gray-100/50">
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-2xl w-96 group focus-within:border-blue-500/50 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Search data, reports, orders..." 
              className="bg-transparent text-sm outline-none text-gray-700 w-full font-medium"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <NotificationBell />
            
            <div className="h-10 w-px bg-gray-100"></div>
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 leading-tight">Admin User</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
