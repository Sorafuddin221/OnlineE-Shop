"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, Loader2, Search, X, ChevronRight, CornerDownRight } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import SectionHeader from "@/components/common/SectionHeader";
import { getProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { cn } from "@/utils/cn";
import { nestCategories } from "@/utils/categoryHelper";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const initialCategoryName = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeCategoryName, setActiveCategoryName] = useState(initialCategoryName);
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
        setNestedCategories(nestCategories(cats));
        
        // Find ID for initial category name from URL
        if (initialCategoryName) {
          const found = cats.find(c => c.name === initialCategoryName);
          if (found) {
            setActiveCategory(found._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchInitialData();
  }, [initialCategoryName]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          keyword,
          category: activeCategory,
          sort: sortBy,
          price: { lte: priceRange } // This will be handled by productService or API
        });
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce price/category changes

    return () => clearTimeout(timeoutId);
  }, [keyword, activeCategory, sortBy, priceRange]);

  const handleCategorySelect = (id, name) => {
    setActiveCategory(id);
    setActiveCategoryName(name);
  };

  const renderCategory = (cat, depth = 0) => (
    <div key={cat._id} className="space-y-1">
      <button
        onClick={() => handleCategorySelect(cat._id, cat.name)}
        className={cn(
          "w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between",
          activeCategory === cat._id ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        )}
        style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
      >
        <span className="flex items-center gap-2">
          {depth > 0 && <CornerDownRight size={12} className="opacity-40" />}
          {cat.name}
        </span>
        {cat.children?.length > 0 && (
          <ChevronRight size={12} className={cn("opacity-40 transition-transform", activeCategory === cat._id && "rotate-90")} />
        )}
      </button>
      {cat.children?.length > 0 && (
        <div className="space-y-1">
          {cat.children.map(child => renderCategory(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-600 opacity-20 transform translate-x-1/2 -skew-x-12"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            {keyword ? `Search Results: "${keyword}"` : activeCategoryName || "Our Collection"}
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Browse our premium decoration items
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters - Sidebar */}
          <aside className={cn(
            "lg:w-72 space-y-10 fixed lg:static inset-0 bg-white z-50 lg:z-0 p-8 lg:p-0 transition-transform duration-500 overflow-y-auto",
            showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
            <div className="flex items-center justify-between lg:hidden mb-10">
              <h3 className="text-2xl font-black text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-xl">
                <X size={20} />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 border-b border-gray-100 pb-4">
                Categories
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect("", "")}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all",
                    activeCategory === "" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  All Products
                </button>
                {nestedCategories.map((cat) => renderCategory(cat))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 border-b border-gray-100 pb-4">
                Price Filter
              </h4>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>৳0</span>
                  <span className="text-blue-600">Up to ৳{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <button 
              onClick={() => { setActiveCategory(""); setPriceRange(10000); }}
              className="w-full py-4 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-blue-600 hover:text-blue-600 transition duration-300"
            >
              Reset Filters
            </button>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-8 flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <span className="text-xs font-bold text-gray-500">{products.length} Products Found</span>
              <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border border-gray-100"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>

            <div className="flex items-center justify-between mb-10 hidden lg:flex">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Filter size={18} />
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Showing <span className="text-gray-900">{products.length}</span> Results
                 </p>
               </div>
               
               <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border-none rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none hover:bg-gray-100 transition cursor-pointer"
               >
                  <option value="-createdAt">Latest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratings">Best Rated</option>
               </select>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
                {products.length === 0 && (
                  <div className="col-span-full h-96 flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 px-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                      <Search size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-400 text-sm max-w-xs">We couldn't find any products matching your criteria. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
