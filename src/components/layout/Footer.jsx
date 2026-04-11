"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, Send as SendIcon, Camera, Video, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function Footer() {
  const { settings } = useSelector((state) => state.settings);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const response = await fetch("/api/v1/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Us */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteTitle} className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-black text-white tracking-tighter uppercase">
                  {settings?.logoText ? (
                    <>
                      {settings.logoText.split(' ')[0]}
                      <span className="text-blue-500">
                        {settings.logoText.split(' ').slice(1).join(' ')}
                      </span>
                    </>
                  ) : (
                    <>
                      ONLINE<span className="text-blue-500">SHOP</span>
                    </>
                  )}
                </span>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              We provide the best quality products for your needs at affordable prices. Shopping has never
              been easier with our modern platform.
            </p>
            <div className="flex gap-4">
              {settings?.socialLinks?.facebook && (
                <Link href={settings.socialLinks.facebook} aria-label="Follow us on Facebook" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition group">
                  <Share2 size={18} className="group-hover:text-white" />
                </Link>
              )}
              {settings?.socialLinks?.twitter && (
                <Link href={settings.socialLinks.twitter} aria-label="Follow us on Twitter" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition group">
                  <SendIcon size={18} className="group-hover:text-white" />
                </Link>
              )}
              {settings?.socialLinks?.instagram && (
                <Link href={settings.socialLinks.instagram} aria-label="Follow us on Instagram" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition group">
                  <Camera size={18} className="group-hover:text-white" />
                </Link>
              )}
              {settings?.socialLinks?.youtube && (
                <Link href={settings.socialLinks.youtube} aria-label="Subscribe to our YouTube channel" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition group">
                  <Video size={18} className="group-hover:text-white" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 border-l-4 border-blue-600 pl-4">
              Customer Service
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/about" className="hover:text-blue-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-500 transition-colors">How to Order</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-500 transition-colors">Return and Refund</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-500 transition-colors">Decoration Collection</Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 border-l-4 border-blue-600 pl-4">
              Contact Info
            </h4>
            <ul className="space-y-6 text-sm font-medium text-gray-400">
              <li className="flex gap-4">
                <MapPin size={24} className="text-blue-500 shrink-0" />
                <span>{settings?.address || "House 12, Road 4, Sector 7, Uttara, Dhaka-1230, Bangladesh"}</span>
              </li>
              <li className="flex gap-4">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>{settings?.contactPhone || "+880 1516 143876"}</span>
              </li>
              <li className="flex gap-4">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>{settings?.contactEmail || "mdsorafuddin@gmail.com"}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 border-l-4 border-blue-600 pl-4">
              Newsletter
            </h4>
            <p className="text-sm mb-6 text-gray-400">Subscribe to get latest updates and special offers.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border-none rounded-full py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white w-12 flex items-center justify-center rounded-full hover:bg-blue-700 transition disabled:bg-gray-700"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 font-medium">
            {settings?.footerText ? (
              <span>{settings.footerText}</span>
            ) : (
              <>© 2026 <span className="text-white">ONLINE SHOP</span>. All Rights Reserved. Designed by Jibon Decoretor.</>
            )}
          </p>
          <div className="flex gap-4 grayscale opacity-50">
            {/* Payment Icons Placeholder */}
            <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
            <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
            <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold">BKASH</div>
            <div className="h-8 w-12 bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold">NAGAD</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
