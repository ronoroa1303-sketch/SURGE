import { motion } from "framer-motion";
import { PreOrderModal } from "@/components/PreOrderModal";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "15g", label: "Plant Protein" },
  { value: "0g", label: "Added Sugar" },
  { value: "160", label: "Calories" },
  { value: "<5g", label: "Total Fat" },
];

const statsContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const statItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Nutrition() {
  return (
    <section id="nutrition" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Visual */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img 
                src={`${import.meta.env.BASE_URL}images/nutrition-product.png?v=4`} 
                alt="SURGE Nutrition Details" 
                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Bonus Stat</span>
                  <span className="text-primary font-bold text-xl">6g Fiber</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-3/4 shadow-[0_0_10px_hsl(var(--primary))]"></div>
                </div>
              </div>
            </div>
            
          </motion.div>

          {/* Right Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div>
              <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">The Formula</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Real Plant Nutrition,<br/>Real Results
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                SURGE is engineered for people who don't compromise. Whether you're vegan, building muscle, managing weight, or just want a smarter snack—we've got you covered. Made from premium soya chunks, no fillers, no mystery ingredients. Just clean power.
              </p>
            </div>

            <motion.div
              variants={statsContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div key={i} variants={statItem} className="glass-panel rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                  <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-primary">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="pt-6">
              <PreOrderModal>
                <Button size="lg" className="w-full sm:w-auto px-10">
                  Shop SURGE
                </Button>
              </PreOrderModal>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
