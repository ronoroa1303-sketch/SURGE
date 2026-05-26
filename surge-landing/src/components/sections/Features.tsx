import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BicepsFlexed, Ban, Leaf, Sparkles, Vegan } from "lucide-react";

const features = [
  {
    icon: BicepsFlexed,
    title: "Plant-Based Protein",
    description: "15g protein per serving from pure soya chunks to fuel muscle recovery and growth.",
    colSpan: "md:col-span-2 lg:col-span-1"
  },
  {
    icon: Ban,
    title: "Zero Sugar",
    description: "No artificial sweeteners, no crash. Just clean, sustained energy throughout your day.",
    colSpan: "col-span-1"
  },
  {
    icon: Leaf,
    title: "High Fiber",
    description: "6g fiber for optimal digestive health and lasting fullness between meals.",
    colSpan: "col-span-1"
  },
  {
    icon: Sparkles,
    title: "Low Fat",
    description: "Less than 5g fat per serving. Lean nutrition designed to keep your macros on point.",
    colSpan: "md:col-span-1 lg:col-span-2"
  },
  {
    icon: Vegan,
    title: "Vegan-Friendly",
    description: "100% plant-based, cruelty-free nutrition. Good for your body, great for the planet.",
    colSpan: "col-span-1 lg:col-span-1"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-black/50 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">The Advantage</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Why SURGE?</h3>
          <p className="text-lg text-muted-foreground">
            We stripped away the junk to deliver exactly what your body needs. No compromises.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants} className={feature.colSpan}>
                <Card className="h-full group hover:bg-white/[0.08] transition-colors duration-500">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-white/60 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
