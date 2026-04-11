"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/services/api";
import { clearCart } from "@/store/slices/cartSlice";
import { 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Smartphone,
  ShieldCheck,
  Loader2,
  Phone,
  Hash
} from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { settings } = useSelector((state) => state.settings);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  
  // Mobile Payment States
  const [accountNo, setAccountNo] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const info = JSON.parse(sessionStorage.getItem("orderInfo"));
    if (info) {
      setOrderInfo(info);
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (paymentMethod === "Mobile" && (!accountNo || !transactionId)) {
      toast.error("Please provide account number and transaction ID");
      return;
    }

    setLoading(true);

    try {
      const order = {
        shippingInfo,
        orderItems: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item.product,
        })),
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
        paymentInfo: {
          id: paymentMethod === "COD" ? "COD-" + Date.now() : transactionId,
          status: paymentMethod === "COD" ? "Processing" : "Verification Pending",
          method: paymentMethod === "COD" ? "Cash on Delivery" : `Mobile (${accountNo})`,
        }
      };

      const { data } = await API.post("/order/new", order);

      if (data.success) {
        dispatch(clearCart());
        sessionStorage.removeItem("orderInfo");
        toast.success("Order Placed Successfully!");
        router.push("/order/success");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!orderInfo) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 pt-12 font-sans">
      <div className="container mx-auto px-4">
        <CheckoutSteps activeStep={2} />

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Payment Method Selection */}
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40">
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Payment Method</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">How would you like to pay?</p>
                </div>

                <div className="space-y-4">
                  {/* COD Option */}
                  <div className="relative group">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      className="peer hidden"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <label
                      htmlFor="cod"
                      className="flex items-center justify-between p-6 bg-gray-50 border-2 border-transparent rounded-2xl cursor-pointer group-hover:bg-white group-hover:border-blue-500/30 peer-checked:border-blue-600 peer-checked:bg-white peer-checked:shadow-lg peer-checked:shadow-blue-100 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Truck size={24} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight text-sm">Cash on Delivery</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pay at your doorstep</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-full flex items-center justify-center peer-checked:border-blue-600 after:w-3 after:h-3 after:bg-blue-600 after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform"></div>
                    </label>
                  </div>

                  {/* Manual Mobile Payment Option */}
                  <div className="relative group">
                    <input
                      type="radio"
                      id="mobile"
                      name="payment"
                      className="peer hidden"
                      checked={paymentMethod === "Mobile"}
                      onChange={() => setPaymentMethod("Mobile")}
                    />
                    <label
                      htmlFor="mobile"
                      className="flex items-center justify-between p-6 bg-gray-50 border-2 border-transparent rounded-2xl cursor-pointer group-hover:bg-white group-hover:border-blue-500/30 peer-checked:border-blue-600 peer-checked:bg-white peer-checked:shadow-lg peer-checked:shadow-blue-100 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight text-sm">bKash / Nagad / Rocket</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manual Transaction</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-full flex items-center justify-center peer-checked:border-blue-600 after:w-3 after:h-3 after:bg-blue-600 after:rounded-full after:scale-0 peer-checked:after:scale-100 after:transition-transform"></div>
                    </label>
                  </div>

                  {/* Mobile Payment Details (Conditional) */}
                  {paymentMethod === "Mobile" && (
                    <div className="mt-4 p-8 bg-purple-50/50 border border-purple-100 rounded-3xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                       <div className="space-y-2">
                          <p className="text-xs font-black text-purple-900 uppercase tracking-widest">Our Payment Numbers:</p>
                          <div className="flex flex-wrap gap-4">
                             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100">
                                <span className="text-[10px] font-black text-pink-500 uppercase">bKash:</span>
                                <span className="ml-2 font-bold text-gray-900 text-xs">01516143876</span>
                             </div>
                             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100">
                                <span className="text-[10px] font-black text-orange-500 uppercase">Nagad:</span>
                                <span className="ml-2 font-bold text-gray-900 text-xs">01516143876</span>
                             </div>
                             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100">
                                <span className="text-[10px] font-black text-blue-500 uppercase">Rocket:</span>
                                <span className="ml-2 font-bold text-gray-900 text-xs">01516143876</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4 pt-4 border-t border-purple-100">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 ml-4">Your Account Number</label>
                             <div className="relative group">
                                <Phone size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300" />
                                <input 
                                  type="text" 
                                  placeholder="017XXXXXXXX"
                                  value={accountNo}
                                  onChange={(e) => setAccountNo(e.target.value)}
                                  className="w-full bg-white border-none rounded-xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none ring-2 ring-purple-100 focus:ring-purple-400 transition-all"
                                />
                             </div>
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 ml-4">Transaction ID</label>
                             <div className="relative group">
                                <Hash size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300" />
                                <input 
                                  type="text" 
                                  placeholder="TRX12345678"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  className="w-full bg-white border-none rounded-xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none ring-2 ring-purple-100 focus:ring-purple-400 transition-all"
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 p-6 bg-blue-50 rounded-2xl flex items-start gap-4">
                  <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                  <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                    Orders will be verified by our team. Please ensure the transaction details are correct.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary & Final Action */}
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40">
                <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-6">Payment Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span>৳{orderInfo.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Shipping</span>
                    <span>৳{orderInfo.shippingCharges}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Tax ({settings?.taxRate || 5}%)</span>
                    <span>৳{Math.round(orderInfo.tax)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mb-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Payable</p>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">৳{Math.round(orderInfo.totalPrice)}</h2>
                    </div>
                  </div>
                </div>

                <button
                  onClick={submitHandler}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Confirm & Place Order
                      <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
