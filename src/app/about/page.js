"use client";

import { Users, Target, Heart, Award, ShoppingBag, ShieldCheck, Truck, Headphones } from "lucide-react";
import { useSelector } from "react-redux";

export default function AboutPage() {
  const { settings } = useSelector((state) => state.settings);
  const siteName = settings?.siteTitle || "Our Online Shop";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Our Story
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">
            Delivering Quality Products to Your Doorstep
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-3xl -z-10 opacity-10"></div>
               <img 
                 src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1974&auto=format&fit=crop" 
                 alt="Our Store" 
                 className="rounded-[3rem] shadow-2xl shadow-gray-200"
               />
               <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-4 rounded-2xl text-white">
                      <ShoppingBag size={32} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900 leading-none">5k+</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Premium Products</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-xs">About {siteName}</h4>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  Your One-Stop Destination for Premium Shopping
                </h2>
              </div>
              <p className="text-gray-500 leading-loose text-lg">
                Welcome to {siteName}, where quality meets convenience. We started with a simple mission: to provide our customers with an exceptional shopping experience and access to the world's best products from the comfort of their homes.
              </p>
              <p className="text-gray-500 leading-loose text-lg">
                Over the years, we have grown into a trusted e-commerce platform, serving thousands of happy customers. We pride ourselves on our curated collection, competitive pricing, and dedicated customer service.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                     <Target size={24} />
                   </div>
                   <h5 className="font-black text-gray-900 uppercase tracking-widest text-xs">Our Mission</h5>
                   <p className="text-gray-400 text-xs leading-relaxed">To become the most customer-centric online store where people can find anything they want to buy.</p>
                </div>
                <div className="space-y-3">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <Heart size={24} />
                   </div>
                   <h5 className="font-black text-gray-900 uppercase tracking-widest text-xs">Our Values</h5>
                   <p className="text-gray-400 text-xs leading-relaxed">Quality, Transparency, and Customer Satisfaction are the pillars of our business.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-xs">Why Choose Us</h4>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Experience Excellence in Every Order</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-6">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Truck size={32} />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Fast Shipping</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">Reliable and quick delivery services to ensure your products reach you on time, every time.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-6">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldCheck size={32} />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Secure Payments</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">Your security is our priority. We use industry-leading encryption for all your transactions.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-6">
                 <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Headphones size={32} />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">24/7 Support</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">Our dedicated support team is available around the clock to assist you with any queries.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">10k+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Orders Completed</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">5k+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Products in Stock</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">8k+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Happy Customers</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">99%</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Positive Feedback</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
