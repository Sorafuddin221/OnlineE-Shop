import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 opacity-10 skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">
            We're Here to Help You Plan Your Next Big Event
          </p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
               <div className="space-y-2">
                 <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-xs">Get in Touch</h4>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Visit Our Showroom</h2>
               </div>

               <div className="space-y-8">
                  <div className="flex gap-6 group">
                     <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-1">Our Location</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">House 12, Road 4, Sector 7, Uttara, Dhaka-1230, Bangladesh</p>
                     </div>
                  </div>

                  <div className="flex gap-6 group">
                     <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <Phone size={24} />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-1">Call Us</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">+880 1516 143876</p>
                        <p className="text-gray-400 text-xs">Mon - Fri, 9am - 6pm</p>
                     </div>
                  </div>

                  <div className="flex gap-6 group">
                     <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <Mail size={24} />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-1">Email Support</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">mdsorafuddin@gmail.com</p>
                        <p className="text-gray-400 text-xs">We usually respond within 24h</p>
                     </div>
                  </div>

                  <div className="flex gap-6 group">
                     <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                        <Clock size={24} />
                     </div>
                     <div>
                        <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-1">Working Hours</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">Sat - Thu: 10:00 - 20:00</p>
                        <p className="text-gray-400 text-xs">Friday: Closed</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
               <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                  <form className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                           <input 
                             type="text" 
                             placeholder="John Doe" 
                             className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                           <input 
                             type="email" 
                             placeholder="john@example.com" 
                             className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                           />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                           <input 
                             type="text" 
                             placeholder="How can we help?" 
                             className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                           />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                           <textarea 
                             placeholder="Write your message here..." 
                             className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all min-h-[150px]"
                           ></textarea>
                        </div>
                     </div>
                     <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group">
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[500px] bg-gray-100 grayscale opacity-50 relative overflow-hidden flex items-center justify-center">
         <div className="text-center space-y-4">
            <MapPin size={40} className="mx-auto text-gray-400" />
            <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Uttara Showroom Location</p>
         </div>
         {/* In a real scenario, embed an iframe or Google Maps component here */}
      </section>
    </div>
  );
}
