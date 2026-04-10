"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWishlist, toggleWishlist } from "@/store/slices/userSlice";
import { addItemsToCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ChevronRight, 
  Loader2,
  ShoppingBag,
  ArrowLeft,
  Star
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { wishlist, loading, isAuthenticated } = useSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = (id) => {
    dispatch(toggleWishlist(id)).then(() => {
      dispatch(getWishlist());
    });
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (id) => {
    dispatch(addItemsToCart({ id, quantity: 1 }));
    toast.success("Added to cart!");
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
          <Heart size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Login Required</h1>
        <p className="text-gray-500 font-bold mb-10 max-w-md uppercase tracking-widest text-xs">Please login to view and manage your wishlist.</p>
        <Link 
          href="/login"
          className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-2xl shadow-blue-200"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-600 opacity-20 transform translate-x-1/2 -skew-x-12"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/profile" className="flex items-center gap-2 text-blue-400 hover:text-white transition text-[10px] font-black uppercase tracking-widest mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 flex items-center gap-6">
            My Wishlist
            <span className="bg-white/10 text-blue-400 text-lg px-6 py-2 rounded-full border border-white/10">
              {wishlist?.length || 0}
            </span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Your favorite items saved for later
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {loading ? (
          <div className="bg-white rounded-[3rem] p-32 flex items-center justify-center shadow-sm border border-gray-100">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : wishlist?.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Your wishlist is empty</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Looks like you haven't added anything yet</p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-2xl shadow-blue-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img 
                    src={product.image[0]?.url || "/placeholder.png"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-300 shadow-xl"
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>
                    <Link 
                      href={`/product/${product._id}`}
                      className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-75 shadow-xl"
                      title="View"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={cn(
                          i < Math.floor(product.ratings) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                        )}
                      />
                    ))}
                    <span className="text-[10px] font-bold text-gray-400 ml-1">({product.numOfReviews})</span>
                  </div>
                  
                  <Link href={`/product/${product._id}`}>
                    <h4 className="text-gray-900 font-black text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h4>
                  </Link>
                  
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">
                    {product.category?.name || "Premium Decor"}
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">
                        ৳{product.offeredPrice || product.price}
                      </span>
                      {product.offeredPrice && (
                        <span className="text-xs text-gray-400 line-through font-bold">৳{product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
