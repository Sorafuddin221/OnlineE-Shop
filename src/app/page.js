import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import Benefits from "@/components/home/Benefits";
import TrendingProducts from "@/components/home/TrendingProducts";
import HotProducts from "@/components/home/HotProducts";

export const metadata = {
  title: "Online Shop - Best Decoration & Event Rentals in Bangladesh",
  description: "Transform your special events with our premium decoration sets and wedding rentals. High-quality products at affordable rates.",
  keywords: ["decoration", "event rentals", "wedding decor", "Dhaka", "Bangladesh", "Online Shop"],
};

export default function Home() {
  return (
    <div>
      <Hero />
      <CategorySection />      
      <TrendingProducts />
      <HotProducts />
      <Benefits />
    </div>  );
}
