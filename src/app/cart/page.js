"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemFromCart, saveShippingInfo } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export default function CartPage() {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { settings } = useSelector((state) => state.settings);
  const [shippingZone, setShippingZone] = useState(shippingInfo.shippingZone || "Inside Dhaka");
  
  const dispatch = useDispatch();
  const router = useRouter();

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemsToCart({ id, quantity: newQty }));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) return;
    dispatch(addItemsToCart({ id, quantity: newQty }));
  };

  const deleteCartItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    // Save selected zone to redux before moving to shipping page
    dispatch(saveShippingInfo({ ...shippingInfo, shippingZone }));
    router.push("/shipping");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  
  const insideDhakaRate = settings?.shippingInsideDhaka || 60;
  const outsideDhakaRate = settings?.shippingOutsideDhaka || 120;
  const shippingCharge = shippingZone === "Inside Dhaka" ? insideDhakaRate : outsideDhakaRate;
  const totalWithShipping = subtotal + shippingCharge;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-10 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          href="/products"
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Shopping Cart</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            {cartItems.length} Items in your cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-6 p-6 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="col-span-3">Product Details</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <div key={item.product} className="p-6 grid grid-cols-1 md:grid-cols-6 items-center gap-6 group">
                    <div className="col-span-3 flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/product/${item.product}`} className="font-black text-gray-900 hover:text-blue-600 transition truncate block">
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => deleteCartItem(item.product)}
                          className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-center font-bold text-gray-500">
                      ৳{item.price}
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-xl flex items-center gap-3">
                        <button 
                          onClick={() => decreaseQty(item.product, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:text-blue-600 transition shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQty(item.product, item.quantity, item.stock)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:text-blue-600 transition shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-black text-blue-600 text-lg">
                      ৳{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition">
              <ChevronLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-8 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Order Summary</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>৳{subtotal}</span>
                </div>

                {/* Shipping Zone Selector */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping Zone</p>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Bangladesh</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setShippingZone("Inside Dhaka")}
                      className={cn(
                        "py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all",
                        shippingZone === "Inside Dhaka" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-400 border border-gray-100 hover:text-gray-600"
                      )}
                    >
                      Inside Dhaka
                    </button>
                    <button 
                      onClick={() => setShippingZone("Outside Dhaka")}
                      className={cn(
                        "py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all",
                        shippingZone === "Outside Dhaka" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-400 border border-gray-100 hover:text-gray-600"
                      )}
                    >
                      Outside Dhaka
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Estimated Shipping</span>
                  <span className="text-blue-600 font-black">৳{shippingCharge}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mb-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Estimated Total</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">৳{totalWithShipping}</h2>
                  </div>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
              >
                Proceed to Shipping
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-4 opacity-40 grayscale">
                <div className="h-6 w-10 bg-gray-100 rounded text-[6px] font-bold flex items-center justify-center">VISA</div>
                <div className="h-6 w-10 bg-gray-100 rounded text-[6px] font-bold flex items-center justify-center">MC</div>
                <div className="h-6 w-10 bg-gray-100 rounded text-[6px] font-bold flex items-center justify-center">BKASH</div>
                <div className="h-6 w-10 bg-gray-100 rounded text-[6px] font-bold flex items-center justify-center">ROCKET</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
