"use client";

import { useSelector } from "react-redux";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Phone, MapPin } from "lucide-react";

export default function ConfirmOrderPage() {
  const router = useRouter();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { settings } = useSelector((state) => state.settings);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  
  // Calculate shipping based on zone and settings
  const insideDhakaRate = settings?.shippingInsideDhaka || 60;
  const outsideDhakaRate = settings?.shippingOutsideDhaka || 120;
  
  const shippingCharges = shippingInfo.shippingZone === "Inside Dhaka" ? insideDhakaRate : outsideDhakaRate;
  
  const taxRate = settings?.taxRate || 5;
  const tax = subtotal * (taxRate / 100);
  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = { subtotal, shippingCharges, tax, totalPrice };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    router.push("/payment");
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4">
        <CheckoutSteps activeStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Name</p>
                    <p className="font-bold text-gray-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                    <p className="font-bold text-gray-900">{shippingInfo?.phoneNo}</p>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Address</p>
                    <p className="font-bold text-gray-900 leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Your Cart Items</h3>
              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <div key={item.product} className="py-6 flex items-center justify-between gap-6 group">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <Link href={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-blue-600 transition truncate block max-w-md">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {item.quantity} x ৳{item.price}
                      </p>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Shipping Charges</span>
                  <span>৳{shippingCharges}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>GST ({taxRate}%)</span>
                  <span>৳{Math.round(tax)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mb-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Grand Total</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">৳{Math.round(totalPrice)}</h2>
                  </div>
                </div>
              </div>

              <button
                onClick={proceedToPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
              >
                Proceed to Payment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
