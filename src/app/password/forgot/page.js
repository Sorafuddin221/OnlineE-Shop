"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors, clearSuccess } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { Mail, ArrowRight, Loader2, KeyRound, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearSuccess());
    }
  }, [dispatch, error, message]);

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="bg-gray-50/50 min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition font-black uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft size={14} />
            Back to Login
          </Link>
        </div>

        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200 mb-6">
              <KeyRound size={32} />
           </div>
           <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Forgot Password?</h2>
           <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Enter your email to reset password</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
          <form onSubmit={forgotPasswordSubmit} className="space-y-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
               <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                     <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com" 
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                  />
               </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
