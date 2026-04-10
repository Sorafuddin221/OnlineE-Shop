"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage({ params }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Password updated successfully");
      router.push("/login");
    }
  }, [dispatch, error, success, router]);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ token, passwords: { password, confirmPassword } }));
  };

  return (
    <div className="bg-gray-50/50 min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200 mb-6">
              <ShieldCheck size={32} />
           </div>
           <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Reset Password</h2>
           <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Create a new secure password</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
          <form onSubmit={resetPasswordSubmit} className="space-y-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">New Password</label>
               <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                     <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm New Password</label>
               <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                     <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
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
                  Reset Password
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
