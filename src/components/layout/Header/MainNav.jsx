"use client";

import Link from "next/link";
import { User, ShoppingCart, Heart, Menu, X, ChevronRight, LayoutGrid, Sparkles } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Search from "./Search";
import { useState, useEffect } from "react";
import { getWishlist, logout } from "@/store/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function MainNav() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated, wishlist } = useSelector((state) => state.user);
  const { settings } = useSelector((state) => state.settings);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const logoutHandler = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  const Logo = () => (
    <Link href="/" className="flex items-center gap-2 group">
      {settings?.logoUrl ? (
        <img src={settings.logoUrl} alt={settings.siteTitle} className="h-10 w-auto object-contain" />
      ) : (
        <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-md shadow-blue-200 text-white">
          <ShoppingCart size={24} />
        </div>
      )}
      <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
        {settings?.logoText ? (
          <>
            {settings.logoText.split(' ')[0]}
            <span className="text-blue-600">
              {settings.logoText.split(' ').slice(1).join(' ')}
            </span>
          </>
        ) : (
          <>
            ONLINE<span className="text-blue-600">SHOP</span>
          </>
        )}
      </span>
    </Link>
  );

  return (
    <div className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 space-y-4 lg:space-y-0">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          {/* Logo */}
          <Logo />

          {/* Search - Desktop */}
          <div className="hidden lg:block flex-1 mx-8">
            <Search />
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/wishlist"
              className="hidden sm:flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition group relative"
            >
              <Heart size={22} className={cn("group-hover:fill-blue-600 group-hover:text-blue-600 transition", mounted && wishlist?.length > 0 && "fill-blue-600 text-blue-600")} />
              <span className="text-[10px] font-medium mt-0.5 uppercase tracking-wide">Wishlist</span>
              {mounted && wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in duration-300">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href={mounted && isAuthenticated ? "/profile" : "/login"}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition group"
            >
              <User size={22} className="group-hover:scale-110 transition" />
              <span className="text-[10px] font-medium mt-0.5 uppercase tracking-wide">
                {mounted && isAuthenticated ? "Profile" : "Login"}
              </span>
            </Link>

            <Link
              href="/cart"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition group relative"
            >
              <div className="relative">
                <ShoppingCart size={22} className="group-hover:scale-110 transition" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {mounted ? (cartItems?.length || 0) : 0}
                </span>
              </div>
              <span className="text-[10px] font-medium mt-0.5 uppercase tracking-wide">Cart</span>
            </Link>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="lg:hidden w-full px-2 pb-2">
          <Search />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            {/* Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[101] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <Logo />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-2">Navigation</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-600 hover:text-white transition-all">
                      <div className="flex items-center gap-3">
                        <LayoutGrid size={20} className="text-gray-400 group-hover:text-white" />
                        <span className="text-sm font-black uppercase tracking-widest">All Products</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-white" />
                    </Link>
                    <Link href="/products?sort=-ratings" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-600 hover:text-white transition-all">
                      <div className="flex items-center gap-3">
                        <Sparkles size={20} className="text-gray-400 group-hover:text-white" />
                        <span className="text-sm font-black uppercase tracking-widest">Trending</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-white" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-2">My Account</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Profile</span>
                    </Link>
                    <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all">
                      <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                        <Heart size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Wishlist</span>
                    </Link>
                    <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <ShoppingCart size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Cart ({cartItems.length})</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                {isAuthenticated ? (
                  <button 
                    onClick={logoutHandler}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gray-200"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link 
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-4 bg-blue-600 text-white text-center rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
