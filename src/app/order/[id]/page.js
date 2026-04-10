"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/services/api";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Truck,
  Loader2,
  ChevronLeft,
  Calendar,
  Smartphone,
  Hash,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await API.get(`/order/${id}`);
        setOrder(data.order);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-slip');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Hash size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-500 font-bold mb-8">We couldn't find the order you're looking for.</p>
        <Link 
          href="/orders"
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-xl shadow-blue-200"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const isDelivered = order.orderStatus === "Delivered";
  const isShipped = order.orderStatus === "Shipped";

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <Link href="/orders" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition text-[10px] font-black uppercase tracking-widest mb-4">
              <ChevronLeft size={14} />
              Back to My Orders
            </Link>
            <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
              Order Details
            </h4>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              #{order._id.substr(-8).toUpperCase()}
            </h2>
          </div>
          <button 
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition shadow-sm"
          >
            <Printer size={16} />
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-2 h-full ${isDelivered ? 'bg-emerald-500' : isShipped ? 'bg-blue-500' : 'bg-orange-500'}`} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDelivered ? 'bg-emerald-50 text-emerald-600' : isShipped ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {isDelivered ? <CheckCircle2 size={28} /> : <Package size={28} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                    <h3 className={`text-2xl font-black tracking-tight ${isDelivered ? 'text-emerald-600' : isShipped ? 'text-blue-600' : 'text-orange-600'}`}>
                      {order.orderStatus}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Date</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Items</p>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <ShoppingBag size={14} className="text-gray-400" />
                      {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <Package className="text-blue-600" size={20} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items in your package</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-50">
                    {order.orderItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm mb-1">{item.name}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">Qty: {item.quantity}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">৳{item.price} each</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-base font-black text-gray-900">৳{Math.round(item.price * item.quantity)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Info Card (Mobile Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
              <ShippingInfoCard order={order} />
              <PaymentInfoCard order={order} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="hidden lg:block">
              <ShippingInfoCard order={order} />
            </div>
            <div className="hidden lg:block">
              <PaymentInfoCard order={order} />
            </div>

            {/* Summary Card */}
            <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-200/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h3 className="text-xl font-black mb-8 tracking-tight">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">৳{Math.round(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Shipping</span>
                  <span className="text-white">৳{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Tax (5%)</span>
                  <span className="text-white">৳{Math.round(order.taxPrice)}</span>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-800 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Paid</p>
                    <p className="text-3xl font-black text-white leading-none">৳{Math.round(order.totalPrice)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400">
                    <CreditCard size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- HIDDEN INVOICE FOR PRINTING --- */}
      <div className="hidden">
        <div id="invoice-slip" className="p-10 text-gray-900 bg-white font-sans max-w-[800px] mx-auto border border-gray-200">
          <div className="flex justify-between items-start mb-10 border-b pb-10">
            <div>
              <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">INVOICE</h1>
              <p className="text-gray-500 font-bold tracking-widest text-xs">ORDER #{order._id.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black text-blue-600 uppercase tracking-tighter">ONLINE SHOP</h2>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Address:</h3>
              <p className="font-black text-base">{order.user?.name}</p>
              <p className="text-sm font-medium text-gray-600 mt-2">{order.shippingInfo.address}</p>
              <p className="text-sm font-medium text-gray-600">{order.shippingInfo.city}, {order.shippingInfo.state}</p>
              <p className="text-sm font-medium text-gray-600">{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
              <p className="text-sm font-bold text-gray-900 mt-2">{order.shippingInfo.phoneNo}</p>
            </div>
            <div className="text-right">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Payment Method:</h3>
              <p className="font-black text-sm uppercase tracking-wider">{order.paymentInfo.method}</p>
              <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase">TXID: {order.paymentInfo.id}</p>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-block">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Status</p>
                <p className="text-xs font-black text-emerald-600 uppercase">{order.paymentInfo.status}</p>
              </div>
            </div>
          </div>

          <table className="w-full mb-10">
            <thead>
              <tr className="bg-gray-50 text-left border-y border-gray-100">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Description</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">Unit Price</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-4 font-bold text-sm text-gray-800">{item.name}</td>
                  <td className="p-4 text-sm font-bold text-center text-gray-600">{item.quantity}</td>
                  <td className="p-4 text-sm font-bold text-right text-gray-600">৳{item.price}</td>
                  <td className="p-4 text-sm font-black text-right text-gray-900">৳{Math.round(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col items-end gap-3 pt-6 border-t-2 border-gray-900">
            <div className="flex justify-between w-full max-w-[250px] text-xs font-bold text-gray-500">
              <span className="uppercase tracking-widest">Subtotal:</span>
              <span>৳{Math.round(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[250px] text-xs font-bold text-gray-500">
              <span className="uppercase tracking-widest">Shipping:</span>
              <span>৳{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between w-full max-w-[250px] text-xs font-bold text-gray-500 pb-3">
              <span className="uppercase tracking-widest">Tax (5%):</span>
              <span>৳{Math.round(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[250px] pt-4 border-t border-gray-100">
              <span className="text-xl font-black uppercase tracking-tighter">Grand Total:</span>
              <span className="text-xl font-black text-blue-600">৳{Math.round(order.totalPrice)}</span>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-dashed border-gray-200 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Thank you for shopping with Online Shop!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShippingInfoCard({ order }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
          <MapPin size={24} />
        </div>
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Delivery Address</h3>
      </div>
      <div className="space-y-2 text-sm font-bold text-gray-600 leading-relaxed">
        <p className="text-gray-900 font-black mb-2">{order.user?.name}</p>
        <p>{order.shippingInfo.address}</p>
        <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
        <p className="uppercase tracking-wider">{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
        <div className="pt-4 flex items-center gap-2 text-gray-900">
          <Smartphone size={16} className="text-gray-400" />
          {order.shippingInfo.phoneNo}
        </div>
      </div>
    </div>
  );
}

function PaymentInfoCard({ order }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <CreditCard size={24} />
        </div>
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Payment Details</h3>
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Method</p>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {order.paymentInfo.method.includes("Mobile") ? <Smartphone size={18} className="text-purple-600" /> : <Truck size={18} className="text-blue-600" />}
            <span className="font-black text-gray-900 text-xs uppercase">{order.paymentInfo.method}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Reference ID</p>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 font-mono text-[10px] font-bold text-gray-500 uppercase">
            <Hash size={14} />
            {order.paymentInfo.id}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Payment Status</p>
          <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${order.paymentInfo.status === "Succeeded" || order.paymentInfo.status === "Paid" ? "text-emerald-600" : "text-orange-500"}`}>
            {order.paymentInfo.status === "Succeeded" || order.paymentInfo.status === "Paid" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
            {order.paymentInfo.status}
          </div>
        </div>
      </div>
    </div>
  );
}
