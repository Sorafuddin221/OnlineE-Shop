"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Calendar, 
  Trash2,
  Search,
  Loader2,
  Users
} from "lucide-react";
import { getNewsletterSubscribers, deleteSubscriber } from "@/services/adminService";
import { toast } from "react-toastify";

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchSubscribers = async () => {
    try {
      const data = await getNewsletterSubscribers();
      setSubscribers(data || []);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) return;
    
    setDeletingId(id);
    try {
      const response = await deleteSubscriber(id);
      if (response.success) {
        toast.success("Subscriber removed successfully");
        fetchSubscribers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove subscriber");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Newsletter Subscribers</h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Manage your email marketing list</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subscribed On</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="3" className="px-8 py-6 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                   <td colSpan="3" className="px-8 py-12 text-center text-gray-400 font-bold text-sm">No subscribers found</td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Mail size={18} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-300" />
                          {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDelete(sub._id)}
                        disabled={deletingId === sub._id}
                        className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition shadow-sm bg-white border border-gray-50 disabled:opacity-50"
                      >
                        {deletingId === sub._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Stats Summary */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Subscribers</p>
              <h4 className="text-2xl font-black text-gray-900">{subscribers.length}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
