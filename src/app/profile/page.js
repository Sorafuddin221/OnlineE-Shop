"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/userSlice";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Package,
  Heart
} from "lucide-react";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated === false && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Profile Card */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-blue-600 -z-0 opacity-5"></div>
                
                <div className="relative z-10">
                   <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl mx-auto mb-6">
                      <img 
                        src={user.avatar?.url || "/placeholder.png"} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{user.name}</h2>
                   <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">{user.role}</p>
                   
                   <div className="space-y-4">
                      <Link 
                        href="/me/update"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2"
                      >
                        <Settings size={14} />
                        Edit Profile
                      </Link>
                      <button 
                        onClick={logoutHandler}
                        className="w-full bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition flex items-center justify-center gap-2"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-10 tracking-tight border-b border-gray-50 pb-6">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                         <Mail size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Email Address</span>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">{user.email}</p>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                         <Calendar size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Joined On</span>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">{String(user.createdAt).substr(0, 10)}</p>
                   </div>
                   {user.role === 'admin' && (
                     <div className="space-y-1 col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                           <ShieldCheck size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Administrative Access</span>
                        </div>
                        <Link 
                          href="/admin/dashboard"
                          className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 hover:text-white transition shadow-sm shadow-emerald-100"
                        >
                          Go to Admin Panel
                          <ChevronRight size={14} />
                        </Link>
                     </div>
                   )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link 
                  href="/orders"
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                >
                   <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                         <Package size={28} />
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                   </div>
                   <h4 className="text-lg font-black text-gray-900 tracking-tight">My Orders</h4>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Track & View History</p>
                </Link>

                <Link 
                  href="/wishlist"
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                >
                   <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                         <Heart size={28} />
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-red-600 transition-colors" />
                   </div>
                   <h4 className="text-lg font-black text-gray-900 tracking-tight">Wishlist</h4>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Your Favorite Items</p>
                </Link>

                <Link 
                  href="/password/update"
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                >
                   <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                         <Settings size={28} />
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
                   </div>
                   <h4 className="text-lg font-black text-gray-900 tracking-tight">Security</h4>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Change Your Password</p>
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
