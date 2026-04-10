"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, User, Mail, Phone, Smile, Paperclip } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
    // Load local history first
    const savedChat = localStorage.getItem("chat_history");
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }
  }, [user]);

  // Sync with Database to get real Admin replies
  useEffect(() => {
    let interval;
    if (isOpen && (isAuthenticated || formData.email)) {
      const syncWithDB = async () => {
        try {
          // We use the same GET endpoint we created for the profile page
          const res = await fetch("/api/v1/inquiry");
          const data = await res.json();
          
          if (data.success) {
            // Filter only chat widget messages
            const chatMsgs = data.inquiries.filter(iq => iq.message.startsWith("[CHAT WIDGET]"));
            
            // Map DB inquiries to chat message format
            const formattedMsgs = [];
            chatMsgs.forEach(iq => {
              // Add the original user message
              formattedMsgs.push({
                id: iq._id + "_user",
                sender: "user",
                text: iq.message.replace("[CHAT WIDGET] ", ""),
                timestamp: new Date(iq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                dbId: iq._id,
                rawTime: new Date(iq.createdAt).getTime()
              });
              
              // Add the admin response if it exists
              if (iq.response) {
                formattedMsgs.push({
                  id: iq._id + "_support",
                  sender: "support",
                  text: iq.response,
                  timestamp: new Date(iq.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  dbId: iq._id,
                  rawTime: new Date(iq.respondedAt).getTime()
                });
              }
            });

            // Sort by rawTime and update history
            setChatHistory(formattedMsgs.sort((a, b) => a.rawTime - b.rawTime));
          }
        } catch (error) {
          console.error("Sync error:", error);
        }
      };

      syncWithDB();
      interval = setInterval(syncWithDB, 10000); // Sync every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isOpen, isAuthenticated, formData.email]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/v1/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "65f1a2b3c4d5e6f7a8b9c0d1", // General inquiry placeholder
          ...formData,
          message: `[CHAT WIDGET] ${formData.message}`
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, message: "" }));
        // The useEffect polling will pick up the new message and any future replies
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="w-[350px] sm:w-[380px] h-[550px] max-h-[calc(100vh-160px)] bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border border-gray-100 flex flex-col overflow-hidden mb-6"
          >
            {/* Chat Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight uppercase">Support Chat</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar"
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Smile size={32} />
                  </div>
                  <h4 className="text-gray-900 font-black text-sm mb-1">Hi there! 👋</h4>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed">
                    How can we help you today? Send us a message and we'll reply as soon as possible.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "p-4 rounded-[1.5rem] text-sm font-medium shadow-sm",
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-1.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-blue-600 ml-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
              {!isAuthenticated && chatHistory.length === 0 && (
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-medium outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-medium outline-none"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 focus-within:border-blue-500/30 transition-all">
                <button type="button" className="text-gray-400 hover:text-blue-600 transition">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-gray-700 font-medium"
                />
                <button
                  type="submit"
                  disabled={!formData.message.trim() || loading}
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-lg shadow-blue-200"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative",
          isOpen ? "bg-gray-900 text-white rotate-90" : "bg-blue-600 text-white"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-bounce shadow-lg" />
        )}
      </motion.button>
    </div>
  );
}
