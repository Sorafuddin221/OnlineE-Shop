"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCategories } from "@/services/categoryService";
import { ArrowRight, ChevronRight, LayoutGrid, Sparkles } from "lucide-react";
import { nestCategories } from "@/utils/categoryHelper";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        const nested = nestCategories(data);
        // Take first 4-6 main categories for home page
        setNestedCategories(nested.slice(0, 6));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16 space-y-4">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[1.2/1] bg-white rounded-[3rem] shadow-sm border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-blue-600"></div>
              <h4 className="text-blue-600 font-bold uppercase tracking-[0.4em] text-[10px]">
                Top Collections
              </h4>
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Explore Our <span className="text-blue-600 italic font-serif">Trending</span> <br/> 
              Design Categories
            </h2>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100"
          >
            All Collections
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {nestedCategories.map((category) => (
            <div 
              key={category._id} 
              className="group relative bg-white rounded-[3rem] p-4 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-700 h-full"
              onMouseEnter={() => setActiveCategory(category._id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-[1.4/1] overflow-hidden rounded-[2.2rem] bg-gray-100 mb-8">
                <img 
                  src={category.image?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                   <Sparkles size={12} className="text-orange-500 fill-orange-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                     {category.children?.length || 0} Sub-categories
                   </span>
                </div>

                {/* Glassy Overlay for Subcategories */}
                <div className={cn(
                  "absolute inset-0 bg-blue-600/90 backdrop-blur-md flex flex-col items-center justify-center p-8 transition-all duration-500",
                  activeCategory === category._id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                )}>
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-6">Popular In {category.name}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {category.children?.slice(0, 6).map((sub) => (
                      <Link 
                        key={sub._id}
                        href={`/products?category=${sub.name}`}
                        className="bg-white/20 hover:bg-white text-white hover:text-blue-600 px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all border border-white/20"
                      >
                        {sub.name}
                      </Link>
                    ))}
                    {category.children?.length === 0 && (
                      <span className="text-white/60 text-xs italic">More collections coming soon</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Area */}
              <div className="px-6 pb-6">
                 <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-xs font-medium mt-1">Premium Event Decoration & Rentals</p>
                    </div>
                    <Link 
                      href={`/products?category=${category.name}`}
                      className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500 hover:rotate-45"
                    >
                      <ArrowRight size={20} />
                    </Link>
                 </div>

                 {/* Visible Subcategories List */}
                 <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-50 pt-6">
                    {category.children?.slice(0, 3).map((sub) => (
                       <Link 
                         key={sub._id}
                         href={`/products?category=${sub.name}`}
                         className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition"
                       >
                         <ChevronRight size={12} className="text-blue-600" />
                         {sub.name}
                       </Link>
                    ))}
                    {category.children?.length > 3 && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                        +{category.children.length - 3} More
                      </span>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100/50 rounded-full blur-[100px] -z-10"></div>
      </div>
    </section>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
