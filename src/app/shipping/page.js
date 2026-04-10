"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { 
  MapPin, 
  City, 
  Phone, 
  Globe, 
  Hash,
  ArrowRight
} from "lucide-react";

export default function ShippingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "Bangladesh");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  const districts = [
    "Dhaka City", "Dhaka (Outside City)", "Gazipur", "Narayanganj", "Tangail", "Faridpur", "Madaripur", "Manikganj", "Munshiganj", "Rajbari", "Shariatpur", "Gopalganj", "Kishoreganj", "Narsingdi",
    "Chittagong", "Cox's Bazar", "Brahmanbaria", "Chandpur", "Comilla", "Cumilla", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati",
    "Rajshahi", "Bogra", "Joypurhat", "Naogaon", "Natore", "Nawabganj", "Pabna", "Sirajganj",
    "Khulna", "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
    "Barisal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",
    "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj",
    "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon",
    "Mymensingh", "Jamalpur", "Netrokona", "Sherpur"
  ].sort();

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNo.toString().length !== 11) {
      return alert("Phone Number should be 11 digits long");
    }
    
    // Logic to determine zone: Inside Dhaka is only "Dhaka City"
    const shippingZone = city === "Dhaka City" ? "Inside Dhaka" : "Outside Dhaka";
    
    dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo, shippingZone }));
    router.push("/order/confirm");
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 pt-12">
      <div className="container mx-auto px-4">
        <CheckoutSteps activeStep={0} />

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Shipping Details</h2>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Where should we send your items?</p>
            </div>

            <form onSubmit={shippingSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Country</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Globe size={18} />
                    </div>
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all appearance-none"
                    >
                      <option value="Bangladesh">Bangladesh</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="number"
                      placeholder="01XXXXXXXXX"
                      required
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Address</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-5 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <textarea
                      placeholder="House No, Road No, Area"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">District / City</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all appearance-none"
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Postal Code</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Hash size={18} />
                    </div>
                    <input
                      type="number"
                      placeholder="Postal Code"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group mt-10"
              >
                Continue to Confirm
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
