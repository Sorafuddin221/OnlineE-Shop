"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, LayoutGrid } from "lucide-react";
import { getAllCategories } from "@/services/categoryService";
import { useSelector } from "react-redux";

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { settings } = useSelector((state) => state.settings);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-50 border-b border-gray-100 hidden md:block relative z-40">
      <div className="container mx-auto px-4 flex items-center justify-between py-1">
        <div className="flex items-center gap-6 h-10 relative">
          <div 
            className="relative h-full"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 h-full font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100 rounded-t-lg mt-1">
              <LayoutGrid size={16} />
              All Categories
              <ChevronDown size={14} className={`ml-1 opacity-60 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-b-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {categories?.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${cat.name}`}
                      className="flex items-center justify-between px-6 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                    >
                      <span>{cat.name}</span>
                      <ChevronDown size={12} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                  {categories?.length === 0 && (
                    <div className="px-6 py-4 text-xs text-gray-400 font-medium">
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-8 text-xs font-bold text-gray-700 uppercase tracking-widest">
            {settings?.navbarItems?.length > 0 ? (
              settings.navbarItems
                .filter(item => item.isActive)
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <div 
                    key={index} 
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setOpenSubMenu(index)}
                    onMouseLeave={() => setOpenSubMenu(null)}
                  >
                    <Link 
                      href={item.url} 
                      className="hover:text-blue-600 transition flex items-center gap-1 group relative"
                    >
                      {item.label}
                      {item.children?.length > 0 && <ChevronDown size={10} className="opacity-40" />}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    {/* Sub-menu Dropdown */}
                    {item.children?.length > 0 && openSubMenu === index && (
                      <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-b-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-1 duration-200 z-50">
                        {item.children.map((sub, sIndex) => (
                          <Link
                            key={sIndex}
                            href={sub.url}
                            className="block px-6 py-2.5 text-[10px] font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <>
                <Link href="/" className="hover:text-blue-600 transition flex items-center gap-1 group relative">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/products" className="hover:text-blue-600 transition flex items-center gap-1 group relative">
                  Shop
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/products?trending=true" className="hover:text-blue-600 transition flex items-center gap-1.5 group relative">
                  <Sparkles size={14} className="text-orange-500 fill-orange-500" />
                  Trending
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="text-gray-400">Special Offers:</span>
          <Link href="/offers" className="bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition-colors duration-300">
            Up to 50% Off
          </Link>
        </div>
      </div>
    </div>
  );
}
