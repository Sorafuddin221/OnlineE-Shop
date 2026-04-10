import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import Benefits from "@/components/home/Benefits";
import TrendingProducts from "@/components/home/TrendingProducts";
import HotProducts from "@/components/home/HotProducts";

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
