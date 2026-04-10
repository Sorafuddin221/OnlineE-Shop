"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50/50">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-emerald-200"
      >
        <CheckCircle size={60} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Thank you for your order. We've received your request and will start processing it right away.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/orders"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition flex items-center justify-center gap-3"
          >
            <ShoppingBag size={18} />
            View My Orders
          </Link>
          <Link 
            href="/products"
            className="w-full sm:w-auto bg-white border border-gray-100 hover:border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-sm transition flex items-center justify-center gap-3 group"
          >
            Continue Shopping
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
