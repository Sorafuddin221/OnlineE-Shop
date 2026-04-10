"use client";

import { Search as SearchIcon, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import Link from "next/link";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "All Categories" });
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowCatDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const data = await getProducts({ 
          keyword: keyword.trim(), 
          category: selectedCategory.id 
        });
        setSuggestions(data.products?.slice(0, 5) || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [keyword, selectedCategory]);

  const searchHandler = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    let url = "/products";
    const params = [];
    if (keyword.trim()) params.push(`keyword=${keyword.trim()}`);
    if (selectedCategory.id) params.push(`category=${selectedCategory.id}`);
    
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    router.push(url);
  };

  return (
    <div ref={searchRef} className="flex-1 max-w-2xl lg:mx-4 relative group z-50">
      <form onSubmit={searchHandler} className="flex items-center w-full bg-gray-100 rounded-full border-2 border-transparent group-focus-within:border-blue-500 transition-all relative">
        <div className="relative h-full shrink-0 hidden sm:block">
          <button
            type="button"
            onClick={() => setShowCatDropdown(!showCatDropdown)}
            className="flex items-center gap-2 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 bg-gray-200 h-12 border-r border-gray-300 transition-colors rounded-l-full min-w-[160px] justify-between"
          >
            <span className="truncate max-w-[100px]">{selectedCategory.name}</span>
            <ChevronDown size={14} className={`shrink-0 transition-transform ${showCatDropdown ? "rotate-180" : ""}`} />
          </button>

          {showCatDropdown && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                type="button"
                onClick={() => { setSelectedCategory({ id: "", name: "All Categories" }); setShowCatDropdown(false); }}
                className="w-full text-left px-6 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                All Categories
              </button>
              <div className="max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => { setSelectedCategory({ id: cat._id, name: cat.name }); setShowCatDropdown(false); }}
                    className="w-full text-left px-6 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-t border-gray-50"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 relative h-full">
          <input
            type="text"
            placeholder="Search premium products..."
            className="w-full bg-transparent h-12 px-6 text-xs font-bold outline-none text-gray-700 placeholder:text-gray-400"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setShowSuggestions(true); }}
            onFocus={() => keyword.length >= 2 && setShowSuggestions(true)}
          />
          {loadingSuggestions && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 size={16} className="animate-spin text-blue-500" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 h-12 transition flex items-center justify-center rounded-full sm:rounded-l-none sm:rounded-r-full shadow-lg shadow-blue-200"
        >
          <SearchIcon size={18} />
        </button>
      </form>

      {/* Suggestions Box */}
      {showSuggestions && (suggestions.length > 0 || (keyword.length >= 2 && !loadingSuggestions)) && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] overflow-hidden z-[55] animate-in fade-in slide-in-from-top-4 duration-300">
          {suggestions.length > 0 ? (
            <>
              <div className="p-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recommended Products</span>
                <span className="text-[10px] font-bold text-blue-600">{suggestions.length} items found</span>
              </div>
              <div className="p-3">
                {suggestions.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-2xl transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img 
                        src={product.image[0]?.url || "/placeholder.png"} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{product.category?.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-blue-600 font-black text-sm">৳{product.offeredPrice || product.price}</span>
                        {product.offeredPrice && product.offeredPrice < product.price && (
                          <span className="text-gray-400 text-xs line-through">৳{product.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronDown size={14} className="-rotate-90" />
                    </div>
                  </Link>
                ))}
              </div>
              <button 
                onClick={searchHandler}
                className="w-full p-5 text-[10px] font-black uppercase tracking-[0.2em] text-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all border-t border-gray-50"
              >
                View All Results for "{keyword}"
              </button>
            </>
          ) : keyword.length >= 2 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                <SearchIcon size={32} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No products found for "{keyword}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

