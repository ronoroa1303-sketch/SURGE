import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Nutrition } from "@/components/sections/Nutrition";
import { About } from "@/components/sections/About";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Nutrition />
        <About />
      </main>
      <Footer />
    </div>
  );
}
