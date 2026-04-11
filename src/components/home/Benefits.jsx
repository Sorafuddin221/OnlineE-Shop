"use client";

import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Quick and safe transport for all your decoration items.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    desc: "We ensure all items are in perfect condition before rental.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    desc: "Our dedicated team is ready to help you with your event.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    desc: "Multiple secure payment options including bKash, Nagad & Rocket.",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function Benefits() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-gray-900 font-black text-lg mb-3 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
