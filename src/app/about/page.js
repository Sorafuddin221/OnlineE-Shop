import { Users, Target, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Our Story
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">
            Crafting Unforgettable Moments Since 2018
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
                 src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
                 alt="Our Team" 
                 className="rounded-[3rem] shadow-2xl shadow-gray-200"
               />
               <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-4 rounded-2xl text-white">
                      <Award size={32} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900 leading-none">8+</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Years Experience</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-xs">About Us</h4>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  We Bring Your Events to Life With Premium Decoration
                </h2>
              </div>
              <p className="text-gray-500 leading-loose text-lg">
                Jibon Decoretor started with a simple vision: to make high-quality event decoration accessible to everyone. 
                What began as a small rental shop has grown into a leading provider of aesthetic event props, 
                wedding stages, and luxury furniture.
              </p>
              <p className="text-gray-500 leading-loose text-lg">
                Our mission is to provide not just products, but the atmosphere that turns a simple gathering into a 
                lifelong memory. Every piece in our collection is handpicked for its quality and design.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                     <Target size={24} />
                   </div>
                   <h5 className="font-black text-gray-900 uppercase tracking-widest text-xs">Our Mission</h5>
                   <p className="text-gray-400 text-xs leading-relaxed">To set new standards in the event rental industry through innovation.</p>
                </div>
                <div className="space-y-3">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <Heart size={24} />
                   </div>
                   <h5 className="font-black text-gray-900 uppercase tracking-widest text-xs">Our Values</h5>
                   <p className="text-gray-400 text-xs leading-relaxed">Integrity, creativity, and customer satisfaction guide everything we do.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">500+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Events Decorated</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">10k+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Products in Stock</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">2k+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Happy Customers</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-5xl font-black text-blue-500 tracking-tighter">15+</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Award Wins</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
