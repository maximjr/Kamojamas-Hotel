import { AnimatedPage } from "../components/AnimatedPage";
import { motion } from "motion/react";
import SEO from "../components/SEO";

const Restaurant = () => {
  return (
    <AnimatedPage>
      <SEO 
        title="Fine Dining & Culinary Arts"
        description="Discover world-class dining at Kamojamas. Experience curated gastronomy, local ingredients, and exceptional flavors in Abakaliki."
        url="https://kamojamas.com/restaurant"
        breadcrumbs={[
          { name: "Home", item: "https://kamojamas.com/" },
          { name: "Restaurant & Dining", item: "https://kamojamas.com/restaurant" }
        ]}
      />
      {/* Mini Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-oxblood">
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=2000"
               alt="Fine dining and exquisite restaurant at Kamojamas Abakaliki"
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
               <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Culinary Arts</span>
               <div className="w-12 h-px bg-gold" />
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-xl"
            >
               Fine <span className="italic font-light">Dining</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-white/80 max-w-2xl mx-auto leading-relaxed font-light text-sm tracking-wide"
            >
               Discover a culinary journey crafted by world-class chefs, featuring locally sourced ingredients and exquisite global flavors.
            </motion.p>
         </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
             >
                <h2 className="text-oxblood font-serif text-4xl mb-6">A Symphony of <span className="italic text-oxblood/80 font-light">Flavors</span></h2>
                <div className="h-px w-24 bg-gold/50 mb-8" />
                <p className="text-oxblood/60 leading-relaxed font-light mb-6">
                  Our award-winning Michelin-starred chefs bring a passion for gastronomy that transcends the ordinary. Every plate is a carefully curated masterpiece.
                </p>
                <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold hover:text-oxblood transition-colors flex items-center gap-2 group">
                   Explore Menu
                   <div className="w-8 h-px bg-gold group-hover:bg-oxblood transition-all duration-300" />
                </button>
             </motion.div>
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="aspect-[4/5] bg-oxblood relative overflow-hidden shadow-2xl p-2 border border-gray-100 bg-white"
             >
                <img 
                   src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800" 
                   alt="Gourmet culinary presentation and gastronomy plating at Kamojamas Restaurant, Abakaliki" 
                   className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-1000" 
                   referrerPolicy="no-referrer"
                   loading="lazy"
                />
             </motion.div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default Restaurant;
