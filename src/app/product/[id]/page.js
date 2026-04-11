"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  Plus,
  Minus,
  MessageSquare,
  ChevronRight,
  Loader2,
  Maximize2,
  Send,
  Phone,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, createReview, clearErrors, clearSuccess } from "@/store/slices/productSlice";
import { addItemsToCart } from "@/store/slices/cartSlice";
import { toggleWishlist, getWishlist } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { product, loading, error, success, message } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated, wishlist, user } = useSelector((state) => state.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Inquiry states
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [productInquiries, setProductInquiries] = useState([]);

  useEffect(() => {
    dispatch(getProductDetails(id));
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
    fetchProductInquiries();
  }, [dispatch, id, isAuthenticated]);

  const fetchProductInquiries = async () => {
    try {
      const res = await fetch(`/api/v1/inquiry?productId=${id}`);
      const data = await res.json();
      if (data.success) {
        setProductInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Failed to fetch product inquiries");
    }
  };

  useEffect(() => {
    if (user) {
      setInquiryName(user.name || "");
      setInquiryEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success(message || "Success!");
      setUserRating(0);
      setComment("");
      dispatch(clearSuccess());
      dispatch(getProductDetails(id));
    }
  }, [dispatch, error, success, message, id]);

  const handleAddToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) return toast.error("Please login to use wishlist");
    try {
      const result = await dispatch(toggleWishlist(id)).unwrap();
      toast.success(result.message);
      dispatch(getWishlist());
    } catch (error) {
      toast.error(error.message || "Wishlist update failed");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login to submit a review");
    if (userRating === 0) return toast.error("Please select a rating");
    dispatch(createReview({ rating: userRating, comment, productId: id }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      const response = await fetch("/api/v1/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: id,
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          message: inquiryMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Your query has been sent successfully!");
        setInquiryMessage("");
        setInquiryPhone("");
        fetchProductInquiries();
        // Keep name and email if user is logged in, otherwise they might want to send another query
        if (!user) {
          setInquiryName("");
          setInquiryEmail("");
        }
      } else {
        toast.error(data.message || "Failed to send inquiry");
      }
    } catch (error) {
      toast.error("An error occurred while sending your inquiry");
      console.error(error);
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const isWishlisted = wishlist?.some(item => item._id === id);
  const discount = product.offeredPrice 
    ? Math.round(((product.price - product.offeredPrice) / product.price) * 100) 
    : null;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-blue-600 cursor-pointer transition">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-blue-600 cursor-pointer transition">Products</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div 
              className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <motion.div
                animate={{
                  scale: zoom ? 2 : 1,
                  x: zoom ? `${50 - mousePos.x}%` : 0,
                  y: zoom ? `${50 - mousePos.y}%` : 0,
                }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                className="w-full h-full relative"
              >
                <Image
                  src={product.image[selectedImage]?.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              {discount && (
                <div className="absolute top-6 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-blue-900/20 z-10">
                  Save {discount}%
                </div>
              )}

              <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md p-3 rounded-2xl text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl border border-white/20">
                <Maximize2 size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 transition-all duration-500",
                    selectedImage === index ? "border-blue-600 scale-95 shadow-xl shadow-blue-100" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  )}
                >
                  <Image src={img.url} alt={`View ${index + 1}`} fill sizes="(max-width: 1024px) 25vw, 12.5vw" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-50 text-blue-600 font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full">
                  {product.category?.name || "Premium Decor"}
                </span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-600 font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl md:text-4xl font-black text-gray-700 tracking-tight leading-[1.1] mb-8">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-8 mb-10">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={cn(
                        "transition-all duration-300",
                        i < Math.floor(product.ratings) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                      )}
                    />
                  ))}
                  <span className="text-base font-black text-gray-900 ml-2">{product.ratings.toFixed(1)}</span>
                </div>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquare size={18} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{product.numOfReviews} Reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <span className="text-2xl font-black text-blue-600 tracking-tighter">
                  ৳{product.offeredPrice && product.offeredPrice > 0 ? product.offeredPrice : product.price}
                </span>
                {(product.offeredPrice && product.offeredPrice > 0 && product.offeredPrice < product.price) && (
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-400 line-through decoration-red-400/50 decoration-2 font-bold">
                      ৳{product.price}
                    </span>
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">
                      You Save ৳{product.price - product.offeredPrice}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-500 leading-relaxed max-w-xl text-lg font-medium">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-8 pb-12 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Selector */}
                <div className="bg-gray-50/50 border border-gray-100 p-1.5 rounded-2xl flex items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:text-blue-600 hover:shadow-md transition-all active:scale-95 text-gray-400 border border-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:text-blue-600 hover:shadow-md transition-all active:scale-95 text-gray-400 border border-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {/* Buttons Group */}
                <div className="flex-1 flex gap-3 w-full">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-gray-900 hover:bg-blue-600 disabled:bg-gray-300 text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleToggleWishlist}
                    className={cn(
                      "w-14 h-14 border flex items-center justify-center rounded-2xl transition-all duration-300 group active:scale-95",
                      isWishlisted 
                        ? "bg-red-50 border-red-100 text-red-500 shadow-sm shadow-red-100" 
                        : "bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50/30"
                    )}
                  >
                    <Heart size={20} className={cn("transition-all duration-500", isWishlisted && "fill-red-500 scale-110")} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                    <Truck size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-0.5">Fast Delivery</p>
                    <p className="text-[10px] font-bold text-blue-600/60">Worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900 mb-0.5">Quality Check</p>
                    <p className="text-[10px] font-bold text-emerald-600/60">100% Original</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4 p-4 bg-purple-50/50 rounded-3xl border border-purple-100/50">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-200">
                    <RefreshCcw size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-900 mb-0.5">Easy Returns</p>
                    <p className="text-[10px] font-bold text-purple-600/60">30 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Reviews Section */}
        <div className="mt-24" id="product-tabs">
          <div className="flex gap-12 border-b border-gray-100 mb-12 overflow-x-auto pb-px">
            {["description", "reviews", "query", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative",
                  activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-900"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div className="prose prose-blue text-gray-500 leading-loose">
                <p>{product.description}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Premium quality material
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Handcrafted details
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Eco-friendly production
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Long-lasting durability
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "query" && (
              <div className="space-y-16">
                {/* Existing Inquiries (Comments Style) */}
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Recent Inquiries</h3>
                  {productInquiries.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                      {productInquiries.map((inquiry, i) => (
                        <div key={i} className="relative pl-8 border-l-2 border-gray-100 space-y-6 pb-8 last:pb-0">
                          {/* Question */}
                          <div className="relative">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center">
                               <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Question</span>
                                  <span className="text-xs font-black text-gray-900">{inquiry.name}</span>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                  {new Date(inquiry.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                {inquiry.message}
                              </p>
                            </div>
                          </div>

                          {/* Answer */}
                          {inquiry.response ? (
                            <div className="relative animate-in slide-in-from-left duration-500">
                              <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center">
                                 <CheckCircle2 size={10} className="text-white" />
                              </div>
                              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded">Answer</span>
                                  <span className="text-xs font-black text-gray-900">Store Response</span>
                                </div>
                                <p className="text-sm text-gray-700 font-bold leading-relaxed">
                                  {inquiry.response}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-orange-400 ml-2">
                               <Clock size={12} className="animate-pulse" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Waiting for response...</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold">No questions asked yet. Be the first to ask!</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Product Inquiry</h3>
                      <p className="text-gray-500 text-sm font-medium">Have questions about this product? Send us a message.</p>
                    </div>
                    <div className="flex items-center gap-4 text-blue-600">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <MessageSquare size={20} />
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Your Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            placeholder="Full Name"
                            required
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            placeholder="Email Address"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Phone Number (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Your Message</label>
                      <textarea
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[150px] font-medium"
                        placeholder="What would you like to know about this product?"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={inquiryLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition shadow-lg shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
                    >
                      {inquiryLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Send size={18} />
                      )}
                      Send Inquiry
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-16">
                {/* Review Form */}
                <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setUserRating(num)}
                            className="transition-transform active:scale-90"
                          >
                            <Star
                              size={28}
                              className={cn(
                                "transition-colors",
                                num <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Your Experience</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[150px]"
                        placeholder="Tell us what you think about this product..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition shadow-lg shadow-blue-200"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Customer Reviews</h3>
                  {product.reviews?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                      {product.reviews.map((review, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={cn(
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-6 font-medium italic">"{review.comment}"</p>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-xs uppercase">
                              {review.name[0]}
                            </div>
                            <span className="text-sm font-black text-gray-900">{review.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
