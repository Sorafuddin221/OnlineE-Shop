"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import UserProvider from "@/store/UserProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/common/ChatWidget";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        {/* We leave the head mostly empty here so UserProvider can manage dynamic metadata like Favicon and Title */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <StoreProvider>
          <UserProvider>
            {!isAdminPath && <Header />}
            <main className="min-h-screen">
              {children}
            </main>
            {!isAdminPath && <Footer />}
            {!isAdminPath && <ChatWidget />}
            <ToastContainer position="bottom-center" autoClose={3000} />
          </UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
