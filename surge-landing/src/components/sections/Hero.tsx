import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function Hero() {
  const [, navigate] = useLocation();

  return (
    <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left pt-10 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-primary mb-8 border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live — Shop Today
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-6 tracking-tight">
              Power Your Day with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 text-glow">SURGE</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Plant-powered protein snacks that fuel your goals. Made from premium soya chunks, zero sugar, packed with fiber. Real nutrition for real results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8" onClick={() => navigate("/shop")}>
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                15g Protein
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                0g Sugar
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                100% Vegan
              </div>
            </div>
          </motion.div>

          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl mx-auto"
          >
            {/* Glow behind */}
            <div className="absolute inset-1/4 bg-primary/20 blur-3xl animate-pulse -z-10" style={{ animationDuration: '4s' }}></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-product.png?v=6`} 
              alt="SURGE Premium Protein Chips" 
              className="w-full h-full object-contain transform hover:-translate-y-3 transition-transform duration-700 drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
