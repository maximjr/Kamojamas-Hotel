import { motion } from "motion/react";
import { Link } from "react-router-dom";

const RestaurantSection = () => {
  return (
    <section id="home-restaurant" className="py-24 md:py-36 bg-paper overflow-hidden relative">
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Animated Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/5] bg-oxblood relative overflow-hidden shadow-2xl p-2 border border-gray-100 bg-white group">
              <img 
                src="https://i.imgur.com/GSbdhWp.jpeg" 
                alt="Gourmet dining culinary presentation at Kamojamas Restaurant" 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" 
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-oxblood/5 group-hover:bg-oxblood/0 transition-colors duration-1000" />
            </div>
            {/* Decorative Gold Accent Badge */}
            <div className="absolute -bottom-6 -right-6 bg-gold text-oxblood p-6 md:p-8 shadow-xl hidden md:block">
              <p className="font-serif text-2xl font-bold tracking-tight">100%</p>
              <p className="text-[10px] uppercase tracking-widest font-black text-oxblood/60 leading-none mt-1">Exquisite Taste</p>
            </div>
          </motion.div>

          {/* Text Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 lg:pl-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold/50" />
              <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Gastronomy</span>
            </div>

            <h2 className="text-oxblood font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.15] tracking-tight">
              Culinary Artistry <br />
              <span className="italic font-light text-oxblood/80">& Masterful Plating</span>
            </h2>

            <div className="h-px w-24 bg-gold/50 mb-8" />

            <p className="text-gray-500 mb-8 leading-relaxed font-light text-sm md:text-base">
              At Kamojamas Villa Hotel, dining is an exceptional journey. Our restaurant brings a symphony of global cuisines and local Ebby State / Abakaliki culinary heritage to life. Every ingredient is sourced with care, transformed into culinary masterworks, and paired with extraordinary service in a mesmerizing setting.
            </p>

            <ul className="space-y-4 mb-10 text-oxblood/80 font-serif italic text-sm md:text-base">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-gold rotate-45" /> Curated Seasonal Tasting Menus
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-gold rotate-45" /> Hand-crafted Pastries & Local Delicacies
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-gold rotate-45" /> Exquisite Intimate Private Dining Spaces
              </li>
            </ul>

            <Link to="/restaurant">
              <button aria-label="Explore Restaurant" className="px-10 py-5 bg-oxblood text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-white transition-colors duration-500 shadow-xl">
                Explore the Restaurant
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
