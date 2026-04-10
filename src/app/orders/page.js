"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "@/services/api";
import { 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Package,
  Eye,
  Loader2,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/me");
        setOrders(data.orders || []);
      } catch (error) {
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-1">
            <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
              Customer Portal
            </h4>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              My Orders
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                {orders.length} Total Orders
             </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/40">
             <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-8">
                <ShoppingBag size={48} />
             </div>
             <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Yet</h3>
             <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto mb-10">You haven't placed any orders with us yet. Start planning your dream event!</p>
             <Link 
               href="/products"
               className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-xl shadow-blue-200"
             >
               Start Shopping
               <ChevronRight size={18} />
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group">
                 <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                       <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0">
                          <Package size={32} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID: #{order._id.substr(-8).toUpperCase()}</p>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                             <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm">
                                <Calendar size={14} className="text-gray-300" />
                                {new Date(order.createdAt).toLocaleDateString()}
                             </div>
                             <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                order.orderStatus === 'Delivered' ? "bg-emerald-50 text-emerald-600" :
                                order.orderStatus === 'Shipped' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                             }`}>
                                {order.orderStatus === 'Delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {order.orderStatus}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-10">
                       <div className="text-center md:text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Amount Paid</p>
                          <p className="text-xl font-black text-gray-900">৳{Math.round(order.totalPrice)}</p>
                       </div>
                       <Link 
                         href={`/order/${order._id}`}
                         className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition shadow-xl group-hover:scale-105"
                       >
                         Order Details
                         <Eye size={16} />
                       </Link>
                    </div>
                 </div>
                 
                 {/* Mini Items Preview */}
                 <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center gap-4 overflow-x-auto scrollbar-hide">
                    {order.orderItems.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[10px] font-bold text-gray-600 truncate max-w-[100px]">{item.name}</span>
                          <span className="text-[10px] font-black text-blue-600">x{item.quantity}</span>
                       </div>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
