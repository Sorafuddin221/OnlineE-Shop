"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ShoppingCart, Heart, Minus, Plus, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import Link from "next/link";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = () => {
    if (product.stock <= 0) return toast.error("Product is out of stock");
    dispatch(addItemsToCart({ id: product._id, quantity }));
    toast.success("Added to cart!");
    onClose();
  };

  const discount = product.offeredPrice && product.offeredPrice < product.price 
    ? Math.round(((product.price - product.offeredPrice) / product.price) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-none flex flex-col md:flex-row">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto bg-gray-50">
          <Image
            src={(product.image && product.image[0]?.url) || "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {discount && (
            <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-widest shadow-lg">
              -{discount}% Off
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.round(product.ratings) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
              />
            ))}
            <span className="text-[11px] text-gray-400 font-bold ml-1 uppercase tracking-widest">
              ({product.numOfReviews} Reviews)
            </span>
          </div>

          <h2 className="text-2xl font-bold text-black uppercase tracking-wider mb-4 leading-tight">
            {product.name}
          </h2>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-black text-blue-600">
              ৳{product.offeredPrice && product.offeredPrice > 0 ? product.offeredPrice : product.price}
            </span>
            {(product.offeredPrice && product.offeredPrice > 0 && product.offeredPrice < product.price) && (
              <span className="text-lg text-gray-400 line-through decoration-red-400/50">
                ৳{product.price}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-4">
            {product.description}
          </p>

          <div className="mt-auto space-y-6">
            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center border-2 border-gray-100 px-2 py-1">
                <button 
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="number" 
                  readOnly 
                  value={quantity}
                  className="w-12 text-center font-bold text-sm bg-transparent outline-none"
                />
                <button 
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={addToCartHandler}
                disabled={product.stock <= 0}
                className="flex-1 bg-black text-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link 
                href={`/product/${product._id}`}
                onClick={onClose}
                className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-8"
              >
                View Full Details
              </Link>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-widest">Share:</span>
                {/* Share icons would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
