"use client";

import { useEffect, useState } from "react";
import { getTrendingProducts } from "@/services/productService";
import ProductCard from "../common/ProductCard";
import SectionHeader from "../common/SectionHeader";
import { Loader2 } from "lucide-react";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch trending products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Trending Decoration"
          subtitle="Top Rated Products"
          viewAllLink="/products"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-10 font-medium">
              No trending products found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
