import { AnimatedPage } from "../components/AnimatedPage";
import { motion } from "motion/react";
import About from "../components/About";
import SEO from "../components/SEO";

const AboutUs = () => {
  return (
    <AnimatedPage>
      <SEO 
        title="About Our Heritage"
        description="Discover the history, heritage, and values that make Kamojamas Villa Hotel & Suite the premier luxury destination in Abakaliki."
        url="https://kamojamas.com/about"
        breadcrumbs={[
          { name: "Home", item: "https://kamojamas.com/" },
          { name: "About Us", item: "https://kamojamas.com/about" }
        ]}
      />
      {/* Mini Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-oxblood">
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1542314831-c6a4d142104d?auto=format&fit=crop&q=80&w=2000"
               alt="Kamojamas Villa Hotel history and premium architecture"
               className="w-full h-full object-cover opacity-40 blur-[2px]"
               referrerPolicy="no-referrer"
               fetchPriority="high"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-paper via-oxblood/50 to-transparent" />
         </div>
         <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="flex items-center justify-center gap-4 mb-6"
            >
               <div className="w-12 h-px bg-gold" />
               <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Discover</span>
               <div className="w-12 h-px bg-gold" />
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-xl"
            >
               Our <span className="italic font-light">Heritage</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-white/80 max-w-2xl mx-auto leading-relaxed font-light text-sm tracking-wide"
            >
               A legacy of uncompromising luxury, exceptional architecture, and bespoke hospitality designed for the world's most discerning guests.
            </motion.p>
         </div>
      </section>

      <About />
    </AnimatedPage>
  );
};

export default AboutUs;
