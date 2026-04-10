"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, clearErrors, updateProfileReset } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { User, Mail, Camera, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function UpdateProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error, isUpdated } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile updated successfully");
      dispatch(updateProfileReset());
      router.push("/profile");
    }
  }, [dispatch, user, error, isUpdated, router]);

  const updateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    if (avatar) myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  const updateDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/profile" 
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition font-black uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft size={14} />
            Back to Profile
          </Link>
        </div>

        <div className="text-center mb-12">
           <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Update Profile</h2>
           <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Customize your account information</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
          <form onSubmit={updateSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 mb-10">
               <div className="relative group">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center transition-all group-hover:border-blue-500/50">
                     {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        <User size={32} className="text-gray-300" />
                     )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-200 hover:scale-110 transition-transform">
                     <Camera size={16} />
                     <input 
                       type="file" 
                       name="avatar" 
                       accept="image/*" 
                       onChange={updateDataChange} 
                       className="hidden" 
                     />
                  </label>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Profile Picture</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <div className="relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <User size={18} />
                     </div>
                     <input 
                       type="text" 
                       required
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="John Doe" 
                       className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                     />
                  </div>
               </div>

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
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Update Profile
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
