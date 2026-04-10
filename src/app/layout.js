import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import UserProvider from "@/store/UserProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/common/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OnlineShop | Modern E-commerce",
  description: "High-quality products at your fingertips",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <StoreProvider>
          <UserProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <ChatWidget />
            <ToastContainer position="bottom-center" autoClose={3000} />
          </UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
