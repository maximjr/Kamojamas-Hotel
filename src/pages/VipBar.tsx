import { AnimatedPage } from "../components/AnimatedPage";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const VipBar = () => {
  return (
    <AnimatedPage>
      <SEO 
        title="VIP Bar & Luxury Lounge"
        description="Experience exclusive access to ultra-premium spirits, signature mixology, and refined elegance at Kamojamas VIP Bar in Abakaliki."
        url="https://kamojamas.com/vip-bar"
        breadcrumbs={[
          { name: "Home", item: "https://kamojamas.com/" },
          { name: "VIP Bar", item: "https://kamojamas.com/vip-bar" }
        ]}
      />
      {/* Mini Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-black">
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1549447477-d5ab7dff75b7?auto=format&fit=crop&q=80&w=2000"
               alt="Ultra-premium luxury VIP Bar and lounge interior at Kamojamas Abakaliki"
               className="w-full h-full object-cover opacity-30 blur-[2px]"
               referrerPolicy="no-referrer"
               fetchPriority="high"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-oxblood via-oxblood/50 to-transparent" />
         </div>
         <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="flex items-center justify-center gap-4 mb-6"
            >
               <div className="w-12 h-px bg-gold" />
               <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Lounge</span>
               <div className="w-12 h-px bg-gold" />
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-xl"
            >
               VIP <span className="italic font-light">Bar</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-white/70 max-w-2xl mx-auto leading-relaxed font-light text-sm tracking-wide"
            >
               Exclusive access to ultra-premium spirits, signature mixology, and an atmosphere of refined, uncompromising elegance.
            </motion.p>
         </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="aspect-[4/5] bg-black relative overflow-hidden shadow-2xl p-2 border border-white/10"
             >
                <img 
                   src="https://i.imgur.com/gsk1niS.jpeg" 
                   alt="Cozy upscale seating and gold-styled furniture in the Kamojamas VIP lounge room" 
                   className="w-full h-full object-cover hover:scale-105 transition-all duration-1000" 
                   referrerPolicy="no-referrer"
                   loading="lazy"
                />
             </motion.div>
             <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
             >
                <h2 className="text-white font-serif text-4xl mb-6">Exclusive <span className="italic text-gold font-light">Experience</span></h2>
                <div className="h-px w-24 bg-gold/50 mb-8" />
                <p className="text-white/60 leading-relaxed font-light mb-6">
                  A sanctuary for connoisseurs. Our master mixologists craft personalized beverages tailored precisely to your palate, using only the rarest, most sought-after ingredients from around the globe.
                </p>
                <Link to="/contact">
                   <button className="px-8 py-4 bg-transparent border border-gold text-gold text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-oxblood transition-colors duration-500 rounded-full mt-6">
                      Request Access
                   </button>
                </Link>
             </motion.div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default VipBar;
