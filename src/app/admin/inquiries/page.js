"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Trash2, 
  Loader2,
  Search,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  Package,
  Send,
  X,
  Reply
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "@/services/api";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminInquiriesList() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchInquiries = async () => {
    try {
      const { data } = await API.get("/admin/inquiry");
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatusHandler = async (id, status) => {
    try {
      const { data } = await API.patch("/admin/inquiry", { id, status });
      if (data.success) {
        toast.success("Status Updated");
        fetchInquiries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const { data } = await API.patch("/admin/inquiry", { 
        id: replyingTo._id, 
        response: replyMessage 
      });
      if (data.success) {
        toast.success("Response Saved Successfully");
        setReplyingTo(null);
        setReplyMessage("");
        fetchInquiries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save response");
    } finally {
      setSendingReply(false);
    }
  };

  const deleteInquiryHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const { data } = await API.delete(`/admin/inquiry?id=${id}`);
      if (data.success) {
        toast.success("Inquiry Deleted");
        fetchInquiries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredInquiries = inquiries.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            Communications
          </h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Customer Inquiries
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-gray-50/50 to-white">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-all duration-300" size={18} />
              <input 
                type="text" 
                placeholder="Search inquiries..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 transition-all"
              />
           </div>
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {filteredInquiries.slice(0, 5).map((item, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 ring-1 ring-gray-100">
                    {item.name[0]}
                  </div>
                ))}
                {filteredInquiries.length > 5 && (
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-gray-900 flex items-center justify-center text-[10px] font-black text-white ring-1 ring-gray-100">
                    +{filteredInquiries.length - 5}
                  </div>
                )}
              </div>
              <div className="h-10 w-px bg-gray-100"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredInquiries.length} Total Messages</span>
           </div>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Communications...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                <MessageSquare size={40} />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No inquiries matching your search</p>
            </div>
          ) : filteredInquiries.map((item) => (
            <div key={item._id} className={cn(
              "p-10 transition-all group relative",
              item.status === "Pending" ? "bg-blue-50/20" : "hover:bg-gray-50/50"
            )}>
              {item.status === "Pending" && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.2)]"></div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Customer Info */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg uppercase shadow-lg shadow-blue-200">
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg tracking-tight leading-tight mb-1">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.status === "Pending" && (
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded-md animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer group/link">
                      <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center group-hover/link:bg-blue-50 transition-colors">
                        <Mail size={14} className="text-gray-400 group-hover/link:text-blue-600" />
                      </div>
                      {item.email}
                    </div>
                    {item.phone && (
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer group/link">
                        <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center group-hover/link:bg-blue-50 transition-colors">
                          <Phone size={14} className="text-gray-400 group-hover/link:text-blue-600" />
                        </div>
                        {item.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Content & Reply */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="relative">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2">
                      <MessageSquare size={12} />
                      Customer Message
                    </p>
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm group-hover:shadow-md transition-shadow relative">
                      <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-[-45deg]"></div>
                      <p className="text-sm text-gray-700 font-medium leading-relaxed italic relative z-10">
                        "{item.message}"
                      </p>
                    </div>
                  </div>

                  {item.response && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 p-8 rounded-[2rem] border border-emerald-100/50 relative overflow-hidden group/resp">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover/resp:scale-150 transition-transform duration-700"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        Our Response
                      </p>
                      <p className="text-sm text-emerald-900/80 font-bold leading-relaxed relative z-10">
                        {item.response}
                      </p>
                      <div className="mt-4 flex items-center justify-end gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                        <Clock size={10} />
                        Responded on {new Date(item.respondedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product & Actions */}
                <div className="lg:col-span-3 flex flex-col justify-between items-end gap-8">
                  <div className="w-full">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 text-right">Inquired Product</p>
                    <Link 
                      href={`/product/${item.product?._id}`}
                      className="group/prod flex items-center gap-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-500/30 p-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/5"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0 group-hover/prod:scale-110 transition-transform">
                        {item.product?.image?.[0]?.url ? (
                          <Image src={item.product.image[0].url} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate group-hover/prod:text-blue-600 transition-colors">
                          {item.product?.name || "Product Deleted"}
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">View Live Page</p>
                      </div>
                    </Link>
                  </div>

                  <div className="flex flex-col items-end gap-4 w-full">
                    <select 
                      value={item.status}
                      onChange={(e) => updateStatusHandler(item._id, e.target.value)}
                      className={cn(
                        "w-full text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl outline-none border transition-all cursor-pointer text-center appearance-none",
                        item.status === "Closed" ? "bg-gray-100 border-gray-200 text-gray-500" : 
                        item.status === "Responded" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"
                      )}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Responded">Responded</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <div className="flex items-center gap-2 w-full">
                      <button 
                        onClick={() => {
                          setReplyingTo(item);
                          setReplyMessage(item.response || "");
                        }}
                        className="flex-1 p-3.5 bg-gray-900 text-white hover:bg-blue-600 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-200 hover:shadow-blue-200"
                        title="Reply"
                      >
                        <Reply size={16} />
                        Reply
                      </button>
                      <button 
                        onClick={() => deleteInquiryHandler(item._id)}
                        className="p-3.5 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReplyingTo(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Answer Customer</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">To: {replyingTo.name}</p>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleReplySubmit} className="p-8 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Original Message</p>
                  <p className="text-sm text-gray-600 font-medium italic">"{replyingTo.message}"</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Your Answer</label>
                  <textarea 
                    autoFocus
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all min-h-[150px] resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="flex-1 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-gray-500 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={sendingReply}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    {sendingReply ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    Send Answer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
