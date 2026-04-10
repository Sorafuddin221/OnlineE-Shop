"use client";

import { Truck, CheckCircle2, CreditCard } from "lucide-react";
import { cn } from "@/utils/cn";

export default function CheckoutSteps({ activeStep }) {
  const steps = [
    { label: "Shipping Details", icon: Truck },
    { label: "Confirm Order", icon: CheckCircle2 },
    { label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-12 mb-16">
      {steps.map((step, index) => {
        const isActive = activeStep >= index;
        const isCurrent = activeStep === index;
        
        return (
          <div key={index} className="flex items-center gap-4 group">
            <div className="flex flex-col items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-400",
                isCurrent && "scale-110 ring-4 ring-blue-50"
              )}>
                <step.icon size={20} />
              </div>
              <span className={cn(
                "hidden md:block text-[10px] font-black uppercase tracking-widest",
                isActive ? "text-gray-900" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "hidden md:block w-20 h-0.5 rounded-full",
                activeStep > index ? "bg-blue-600" : "bg-gray-100"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
