"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  Users, 
  Star, 
  Settings, 
  LogOut,
  ChevronRight,
  Image as ImageIcon,
  MessageSquare,
  Mail
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/userSlice";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ImageIcon, label: "Hero Section", href: "/admin/hero" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Tags, label: "Categories", href: "/admin/categories" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: MessageSquare, label: "Inquiries", href: "/admin/inquiries" },
  { icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="w-72 bg-gray-900 h-screen sticky top-0 flex flex-col border-r border-gray-800 shadow-2xl shrink-0">
      <div className="p-8 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-300">
            <Settings size={22} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            ADMIN<span className="text-blue-500">PANEL</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn(isActive ? "text-white" : "text-gray-500 group-hover:text-blue-500 transition-colors")} />
                <span className="text-sm font-bold tracking-wide">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
