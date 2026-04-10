"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import ProductCard from "../common/ProductCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function HotProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allCats = await getAllCategories();
        // Filter for main categories only (no parent)
        const mainCats = allCats.filter(cat => !cat.parent);
        setCategories(mainCats || []);
        
        // Fetch products for the first category or all if none
        const data = await getProducts({ category: "" });
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch hot products data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    if (activeCategory === categoryId) return;
    
    setActiveCategory(categoryId);
    setFetchingProducts(true);
    try {
      const data = await getProducts({ category: categoryId });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products for category:", error);
    } finally {
      setFetchingProducts(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Category Tabs (Claue Style - Above Title) */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <button
            onClick={() => handleCategoryChange("")}
            className={`text-[13px] font-bold uppercase tracking-widest transition-all duration-300 pb-1 border-b-2 ${
              activeCategory === "" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            All Products
          </button>
          {categories.slice(0, 5).map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category._id)}
              className={`text-[13px] font-bold uppercase tracking-widest transition-all duration-300 pb-1 border-b-2 ${
                activeCategory === category._id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Section Header (Claue Style - Centered) */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-black tracking-[0.1em] uppercase">
            Hot Products
          </h2>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
          <p className="text-gray-500 text-sm font-medium italic">
            Top view in this week
          </p>
        </div>
        
        {/* Products Grid */}
        <div className={`relative transition-opacity duration-300 ${fetchingProducts ? "opacity-50" : "opacity-100"}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {fetchingProducts && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-black" size={30} />
            </div>
          )}

          {products.length === 0 && !fetchingProducts && (
            <p className="col-span-full text-center text-gray-400 py-10 font-medium italic">
              No products found in this category.
            </p>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/products"
            className="inline-block border-2 border-black text-black px-10 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
