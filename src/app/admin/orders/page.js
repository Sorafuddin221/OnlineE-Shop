"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/adminService";
import { 
  ShoppingCart, 
  Eye, 
  Trash2, 
  Loader2,
  Search,
  CheckCircle2,
  Clock,
  Truck
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "@/services/api";
import { cn } from "@/utils/cn";

export default function AdminOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrderHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const { data } = await API.delete(`/admin/order/${id}`);
      if (data.success) {
        toast.success("Order Deleted Successfully");
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "Shipped": return <Truck size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-orange-500" />;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            Sales
          </h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Customer Orders
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by order ID or customer..." 
                className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-12 pr-6 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
              />
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total: {orders.length} Orders</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Items Qty</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                  </td>
                </tr>
              ) : orders.map((item) => (
                <tr key={item._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 tracking-tight">#{item._id.substr(-8).toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      item.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-600" : 
                      item.orderStatus === "Shipped" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {getStatusIcon(item.orderStatus)}
                      {item.orderStatus}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-500">
                    {item.orderItems.length} Products
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">
                    ৳{item.totalPrice}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/order/${item._id}`}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-lg hover:shadow-blue-100 rounded-xl transition group"
                        title="Edit Order"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        onClick={() => deleteOrderHandler(item._id)}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-lg hover:shadow-red-100 rounded-xl transition group"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
