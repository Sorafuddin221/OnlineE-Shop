"use client";

import { Phone, Mail, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-gray-900 text-gray-300 text-xs py-2 hidden md:block">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-blue-400" />
            <span>01516143876</span>
          </div>
          <div className="flex items-center gap-1 border-l border-gray-700 pl-4">
            <Mail size={14} className="text-blue-400" />
            <span>mdsorafuddin@gmail.com</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-1 hover:text-white transition">
            English <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1 hover:text-white transition border-l border-gray-700 pl-4">
            BDT <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
