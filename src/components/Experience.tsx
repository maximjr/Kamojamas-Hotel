import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const Experience = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[90dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
           style={{ y, scale }}
           className="w-full h-[130%]"
        >
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury spa massage therapy and wellness treatments at Kamojamas Resort & Spa, Abakaliki"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </motion.div>
        
        {/* Luxury Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-oxblood/30 via-oxblood/10 to-oxblood/80 z-10" />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-px bg-gold/70" />
             <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block drop-shadow-md">Discovery</span>
             <div className="w-12 h-px bg-gold/70" />
          </div>
          <h2 className="text-white font-serif text-4xl md:text-6xl lg:text-8xl mb-8 leading-[1.1] tracking-tight drop-shadow-xl">
            Immerse Yourself in <br />
            <span className="italic font-light">Pure Serenity</span>
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base font-light mb-12">
            Escape the ordinary and experience unrivaled luxury where every detail is meticulously crafted to perfection.
          </p>

           <Link to="/about">
             <button className="px-10 py-5 bg-transparent border border-white/40 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-oxblood hover:border-white transition-all duration-500 rounded-full backdrop-blur-sm">
                Discover Our Heritage
             </button>
           </Link>
        </motion.div>
      </div>

      {/* Bottom stats overlay */}
      <motion.div 
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ delay: 0.5, duration: 1 }}
         viewport={{ once: true }}
         className="absolute bottom-12 left-0 w-full z-20 hidden md:block"
      >
         <div className="container mx-auto px-12 flex justify-between items-end border-t border-white/20 pt-8 relative">
            <div className="absolute top-0 left-12 w-32 h-px bg-gold" />
            <div className="text-white/60 text-[10px] uppercase tracking-[0.4em] font-medium">
               KAMOJAMAS Villa Hotel & Suite<br/>
               <span className="text-gold">THE ULTIMATE ESCAPE</span>
            </div>
            <div className="flex space-x-16">
               <div className="text-right group cursor-pointer">
                  <div className="text-white font-serif text-3xl mb-1 italic group-hover:text-gold transition-colors duration-300">Private</div>
                  <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Beach Access</div>
               </div>
               <div className="text-right group cursor-pointer">
                  <div className="text-white font-serif text-3xl mb-1 italic group-hover:text-gold transition-colors duration-300">Exclusive</div>
                  <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Dining Club</div>
               </div>
            </div>
         </div>
      </motion.div>
    </section>
  );
});

export default Experience;
