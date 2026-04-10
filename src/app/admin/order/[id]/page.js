"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/services/api";
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Printer, 
  FileText,
  Truck,
  Loader2,
  ChevronLeft,
  Calendar,
  Smartphone,
  Hash
} from "lucide-react";
import Link from "next/link";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [status, setStatus] = useState("");

  const fetchOrderDetails = async () => {
    try {
      const { data } = await API.get(`/admin/order/${id}`);
      setOrder(data.order);
      setStatus(data.order.orderStatus);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const updateOrderStatusHandler = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const { data } = await API.put(`/admin/order/${id}`, { status });
      if (data.success) {
        toast.success("Order Status Updated");
        fetchOrderDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePrint = (type) => {
    const printContent = document.getElementById(type === 'invoice' ? 'invoice-slip' : 'shipping-slip');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore event listeners
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Link href="/admin/orders" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition text-[10px] font-black uppercase tracking-widest mb-4">
             <ChevronLeft size={14} />
             Back to Orders
          </Link>
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            Management
          </h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Order #{order._id.substr(-8).toUpperCase()}
          </h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handlePrint('shipping')}
            className="bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
          >
            <Truck size={18} />
            Shipping Slip
          </button>
          <button 
            onClick={() => handlePrint('invoice')}
            className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center gap-2"
          >
            <Printer size={18} />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <User size={24} />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Customer</h3>
                </div>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Name</p>
                      <p className="font-bold text-gray-900">{order.user?.name}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                      <p className="font-bold text-gray-900">{order.user?.email}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                      <p className="font-bold text-gray-900">{order.shippingInfo.phoneNo}</p>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <MapPin size={24} />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Shipping Address</h3>
                </div>
                <div className="space-y-2 text-sm font-bold text-gray-600 leading-relaxed">
                   <p>{order.shippingInfo.address}</p>
                   <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                   <p>{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
                </div>
             </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <Package className="text-blue-600" size={20} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Items</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                   <tbody className="divide-y divide-gray-50">
                      {order.orderItems.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                 <div>
                                    <p className="font-black text-gray-900 text-sm">{item.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <p className="text-sm font-black text-gray-900">৳{item.price * item.quantity}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">৳{item.price} per unit</p>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="bg-gray-50/50 p-8 flex flex-col items-end gap-3">
                <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-500">
                   <span>Subtotal:</span>
                   <span>৳{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-500">
                   <span>Shipping:</span>
                   <span>৳{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-500">
                   <span>Tax:</span>
                   <span>৳{Math.round(order.taxPrice)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[200px] pt-3 border-t border-gray-200">
                   <span className="text-sm font-black text-gray-900 uppercase">Total:</span>
                   <span className="text-sm font-black text-blue-600">৳{Math.round(order.totalPrice)}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar: Status & Payment */}
        <div className="space-y-10">
           {/* Order Status Update */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Update Status</h3>
              <form onSubmit={updateOrderStatusHandler} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Current Status</label>
                    <div className="relative group">
                       <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                       <select
                         value={status}
                         onChange={(e) => setStatus(e.target.value)}
                         className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all appearance-none cursor-pointer"
                       >
                         <option value="Processing">Processing</option>
                         <option value="Shipped">Shipped</option>
                         <option value="Delivered">Delivered</option>
                       </select>
                    </div>
                 </div>
                 <button 
                   type="submit"
                   disabled={updateLoading || order.orderStatus === "Delivered"}
                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                 >
                   {updateLoading ? <Loader2 className="animate-spin" size={20} /> : "Process Order"}
                 </button>
              </form>
           </div>

           {/* Payment Status */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Payment</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Method</p>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                       {order.paymentInfo.method.includes("Mobile") ? <Smartphone size={20} className="text-purple-600" /> : <Truck size={20} className="text-blue-600" />}
                       <span className="font-black text-gray-900 text-sm">{order.paymentInfo.method}</span>
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Transaction/Order ID</p>
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 font-mono text-[10px] font-bold text-gray-600 uppercase">
                       <Hash size={14} />
                       {order.paymentInfo.id}
                    </div>
                 </div>
                 <div className={order.paymentInfo.status === "Succeeded" || order.paymentInfo.status === "Processing" ? "text-emerald-600" : "text-orange-500"}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Status</p>
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                       <CheckCircle2 size={16} />
                       {order.paymentInfo.status}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- HIDDEN SLIPS FOR PRINTING --- */}
      <div className="hidden">
         {/* Invoice Slip */}
         <div id="invoice-slip" className="p-10 text-gray-900 bg-white font-sans max-w-[800px] mx-auto border border-gray-200">
            <div className="flex justify-between items-start mb-10 border-b pb-10">
               <div>
                  <h1 className="text-3xl font-black mb-2">INVOICE</h1>
                  <p className="text-gray-500 font-bold">#{order._id.toUpperCase()}</p>
               </div>
               <div className="text-right">
                  <h2 className="text-xl font-black text-blue-600">ONLINE SHOP</h2>
                  <p className="text-sm font-bold text-gray-500">Event Decoration & Rental</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10">
               <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Billed To:</h3>
                  <p className="font-black text-lg">{order.user?.name}</p>
                  <p className="text-sm font-medium text-gray-600 mt-2">{order.shippingInfo.address}</p>
                  <p className="text-sm font-medium text-gray-600">{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                  <p className="text-sm font-medium text-gray-600">{order.shippingInfo.phoneNo}</p>
               </div>
               <div className="text-right">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Payment Method:</h3>
                  <p className="font-black text-sm uppercase">{order.paymentInfo.method}</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">TXID: {order.paymentInfo.id}</p>
               </div>
            </div>

            <table className="w-full mb-10">
               <thead>
                  <tr className="bg-gray-50 text-left">
                     <th className="p-4 text-[10px] font-black uppercase">Item Description</th>
                     <th className="p-4 text-[10px] font-black uppercase text-center">Qty</th>
                     <th className="p-4 text-[10px] font-black uppercase text-right">Price</th>
                     <th className="p-4 text-[10px] font-black uppercase text-right">Total</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {order.orderItems.map((item) => (
                    <tr key={item._id}>
                       <td className="p-4 font-bold text-sm">{item.name}</td>
                       <td className="p-4 text-sm font-bold text-center">{item.quantity}</td>
                       <td className="p-4 text-sm font-bold text-right">৳{item.price}</td>
                       <td className="p-4 text-sm font-black text-right">৳{item.price * item.quantity}</td>
                    </tr>
                  ))}
               </tbody>
            </table>

            <div className="flex flex-col items-end gap-3 pt-6 border-t">
               <div className="flex justify-between w-full max-w-[250px] text-sm font-bold text-gray-500">
                  <span>Subtotal:</span>
                  <span>৳{order.itemsPrice}</span>
               </div>
               <div className="flex justify-between w-full max-w-[250px] text-sm font-bold text-gray-500">
                  <span>Shipping:</span>
                  <span>৳{order.shippingPrice}</span>
               </div>
               <div className="flex justify-between w-full max-w-[250px] text-sm font-bold text-gray-500 border-b pb-3">
                  <span>Tax (5%):</span>
                  <span>৳{Math.round(order.taxPrice)}</span>
               </div>
               <div className="flex justify-between w-full max-w-[250px] pt-2">
                  <span className="text-lg font-black uppercase">Grand Total:</span>
                  <span className="text-lg font-black text-blue-600">৳{Math.round(order.totalPrice)}</span>
               </div>
            </div>

            <div className="mt-20 pt-10 border-t border-dashed border-gray-200 text-center">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thank you for choosing Online Shop!</p>
            </div>
         </div>

         {/* Shipping Slip */}
         <div id="shipping-slip" className="p-16 text-gray-900 bg-white font-sans max-w-[600px] mx-auto border-2 border-black">
            <div className="text-center mb-12 border-b-2 border-black pb-8">
               <h1 className="text-4xl font-black mb-2 tracking-tighter">SHIPPING LABEL</h1>
               <p className="text-lg font-bold">Order ID: {order._id.toUpperCase()}</p>
            </div>

            <div className="mb-12 space-y-8">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">SHIP TO:</h3>
                  <div className="space-y-1">
                     <p className="text-3xl font-black">{order.user?.name}</p>
                     <p className="text-xl font-bold">{order.shippingInfo.address}</p>
                     <p className="text-xl font-bold">{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                     <p className="text-xl font-bold uppercase tracking-wider">{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">CONTACT:</h3>
                  <p className="text-2xl font-black">{order.shippingInfo.phoneNo}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 items-center pt-8 border-t-2 border-black">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">RETURN ADDRESS:</h3>
                  <p className="font-bold text-sm">ONLINE SHOP</p>
                  <p className="text-xs font-medium text-gray-600">Your Business Address, Dhaka</p>
                  <p className="text-xs font-medium text-gray-600">01516143876</p>
               </div>
               <div className="flex justify-end">
                  <div className="w-32 h-32 bg-gray-100 border-2 border-black flex items-center justify-center">
                     <p className="text-[10px] font-black rotate-[-45deg] opacity-20 text-center uppercase">Scan for<br/>Verification</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
