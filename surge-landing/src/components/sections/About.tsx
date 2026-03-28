import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function About() {
  const pillars = [
    "Complete amino acid profile",
    "Environmentally sustainable",
    "Uncompromisingly delicious"
  ];

  return (
    <section id="about" className="py-24 bg-black relative">
      {/* Background Texture Image */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-luminosity">
        <img 
          src={`${import.meta.env.BASE_URL}images/soya-texture.png`} 
          alt="Soya texture background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 box-glow">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
            Why Soya?
          </h2>
          
          <p className="text-xl text-white/80 leading-relaxed mb-12">
            We chose soya because it's nature's perfect plant protein. Made purely from premium soya chunks, it provides a complete amino acid profile while remaining exceptionally sustainable. No whey, no isolates, no mystery ingredients. Just clean, plant-powered nutrition crafted for modern performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {pillars.map((pillar, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span className="text-white font-medium">{pillar}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
