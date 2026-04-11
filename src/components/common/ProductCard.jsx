"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Eye, Star, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart } from "@/store/slices/cartSlice";
import { toggleWishlist, getWishlist } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, wishlist } = useSelector((state) => state.user);

  const isWishlisted = wishlist?.some((item) => item._id === product._id);

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return toast.error("Product is out of stock");
    dispatch(addItemsToCart({ id: product._id, quantity: 1 }));
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login to use wishlist");
    try {
      const result = await dispatch(toggleWishlist(product._id)).unwrap();
      toast.success(result.message);
      dispatch(getWishlist());
    } catch (error) {
      toast.error(error.message || "Wishlist update failed");
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product._id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: url
      }).catch(() => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const discount = product.offeredPrice && product.offeredPrice < product.price 
    ? Math.round(((product.price - product.offeredPrice) / product.price) * 100)
    : null;

  const isNew = product.createdAt ? (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) < 30 : false;

  return (
    <>
      <div className="group bg-white rounded-none overflow-hidden transition-all duration-500 relative flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border border-gray-100/50">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {isNew && (
              <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-sm">
                New
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-sm">
                -{discount}% Off
              </span>
            )}
            {product.stock <= 0 && (
              <span className="bg-gray-900 text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Product Image */}
          <Link href={`/product/${product._id}`} className="block w-full h-full">
            <Image
              src={(product.image && product.image[0]?.url) || "/placeholder.png"}
              alt={product.name || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Secondary Image on Hover (if available) */}
            {product.image && product.image[1] && (
              <Image
                src={product.image[1].url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"
              />
            )}
          </Link>
          
          {/* Right Side Actions (Claue Style) */}
          <div className="absolute top-3 -right-12 group-hover:right-3 transition-all duration-500 flex flex-col gap-2 z-20">
            <button 
              onClick={handleToggleWishlist}
              className={cn(
                "w-10 h-10 flex items-center justify-center bg-white shadow-sm hover:bg-black hover:text-white transition-colors duration-300",
                isWishlisted && "bg-black text-white"
              )}
              title="Add to Wishlist"
              aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={18} className={cn(isWishlisted && "fill-current")} />
            </button>
            <button 
              onClick={openQuickView}
              className="w-10 h-10 flex items-center justify-center bg-white shadow-sm hover:bg-black hover:text-white transition-colors duration-300"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center bg-white shadow-sm hover:bg-black hover:text-white transition-colors duration-300"
              title="Share"
              aria-label="Share Product"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Bottom Quick Add (Claue Style) */}
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
            <button
              onClick={addToCartHandler}
              disabled={product.stock <= 0}
              className="w-full bg-black/90 text-white py-3.5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Quick Add to Cart"
            >
              <ShoppingCart size={14} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1.5">
            <Link href={`/product/${product._id}`} className="block group/title max-w-[80%]">
              <h3 className="text-[#222] font-bold text-[13px] uppercase tracking-wider group-hover/title:text-[#666] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-0.5 mt-0.5">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] text-gray-400 font-bold">{product.ratings}</span>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-black text-sm">
                ৳{product.offeredPrice && product.offeredPrice > 0 ? product.offeredPrice : product.price}
              </span>
              {(product.offeredPrice && product.offeredPrice > 0 && product.offeredPrice < product.price) && (
                <span className="text-gray-400 text-[10px] line-through decoration-red-400/50">
                  ৳{product.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
}
