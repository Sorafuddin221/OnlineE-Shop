"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, ExternalLink, Clock, User as UserIcon, Check, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getInquiries, updateInquiryStatus, deleteInquiry } from "@/services/adminService";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { toast } from "react-toastify";

export default function NotificationBell() {
  const [inquiries, setInquiries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const fetchInquiries = async () => {
    try {
      const data = await getInquiries();
      // Keep all inquiries but sort them by Pending first, then by date
      const sorted = [...data].sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setInquiries(sorted.slice(0, 10)); // Only show last 10
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateInquiryStatus(id, "Responded");
      toast.success("Marked as read");
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const removeInquiry = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this notification?")) return;
    try {
      await deleteInquiry(id);
      toast.success("Notification removed");
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const pendingCount = inquiries.filter(i => i.status === "Pending").length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-2xl transition-all duration-300 group",
          isOpen 
            ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105" 
            : "bg-gray-50 text-gray-500 hover:bg-white hover:text-blue-600 border border-gray-100 hover:border-blue-500/30"
        )}
      >
        <Bell size={22} className={cn("transition-transform duration-500", isOpen && "rotate-12")} />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce shadow-lg shadow-red-200">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 mt-6 w-[420px] bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 transition-all duration-500 origin-top-right z-50 overflow-hidden",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">Notifications</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/80">
                {pendingCount} New Inquiries Today
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <MessageSquare size={18} className="text-blue-300" />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Updating Feed...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 border-2 border-dashed border-gray-100">
                <Bell size={32} />
              </div>
              <p className="text-gray-900 font-black text-base mb-2">No active inquiries</p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Check back later for updates</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {inquiries.map((inquiry) => (
                <Link
                  key={inquiry._id}
                  href={`/product/${inquiry.product?._id || ""}`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex gap-5 p-6 transition-all relative overflow-hidden",
                    inquiry.status === "Pending" ? "bg-blue-50/30 hover:bg-blue-50/60" : "hover:bg-gray-50/80"
                  )}
                >
                  {inquiry.status === "Pending" && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                  )}

                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-gray-100 shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {inquiry.product?.image?.[0]?.url ? (
                      <Image
                        src={inquiry.product.image[0].url}
                        alt={inquiry.product.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <MessageSquare size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5 truncate">
                          {inquiry.product?.name || "Product Deleted"}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900 truncate">
                            {inquiry.name}
                          </span>
                          {inquiry.status === "Pending" && (
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-4 italic">
                      "{inquiry.message}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => markAsRead(inquiry._id, e)}
                          disabled={inquiry.status !== "Pending"}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            inquiry.status === "Pending" 
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" 
                              : "bg-gray-50 text-gray-300 cursor-not-allowed"
                          )}
                          title="Mark as Responded"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => removeInquiry(inquiry._id, e)}
                          className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        View Product <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <Link
          href="/admin/inquiries"
          onClick={() => setIsOpen(false)}
          className="block p-5 bg-gray-50 hover:bg-white text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-blue-600 transition-all border-t border-gray-100"
        >
          Manage All Inquiries
        </Link>
      </div>
    </div>
  );
}

