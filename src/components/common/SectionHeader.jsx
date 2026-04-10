"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, viewAllLink }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div className="space-y-2">
        <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
          {subtitle}
        </h4>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
          {title}
        </h2>
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition duration-300"
        >
          View All Products
          <div className="p-1 bg-gray-100 group-hover:bg-blue-600 group-hover:text-white rounded-full transition-all duration-300">
            <ChevronRight size={14} />
          </div>
        </Link>
      )}
    </div>
  );
}
