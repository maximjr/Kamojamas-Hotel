import { motion } from "motion/react";
import { Utensils, Calendar, Wine, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Amenities = () => {
  const amenities = [
    { name: "Fine Dining", icon: Utensils, desc: "Award-winning gourmet experiences." },
    { name: "Conference Hall", icon: Calendar, desc: "Modern venues for executive meetings." },
    { name: "VIP Lounge", icon: Wine, desc: "Handcrafted cocktails and fine wines." },
    { name: "Fun & Outdoor Games", icon: Target, desc: "Exhilarating lawn games, archery, and recreation." },
  ];

  return (
    <section id="amenities" className="py-32 md:py-40 bg-oxblood text-white overflow-hidden relative">
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-36 lg:col-span-4"
          >
            <div className="flex items-center gap-4 mb-6">
               <div className="w-8 h-px bg-gold/50" />
               <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Elite Services</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-[1.1] tracking-tight drop-shadow-lg">
              Curated <br />
              <span className="text-white/90 italic font-light">Experiences</span>
            </h2>
            <p className="text-white/60 font-light mb-12 leading-relaxed text-sm md:text-base">
              Experience a world of privilege and comfort with our meticulously selected amenities designed to cater to your every desire. We believe luxury is in the uncompromising details.
            </p>
            <Link to="/about">
              <button className="group px-10 py-5 bg-transparent border border-white/20 text-white hover:bg-white hover:text-oxblood hover:border-white transition-all duration-500 uppercase tracking-widest text-xs font-bold rounded-full flex items-center gap-3">
                Discover More
                <span className="w-6 h-px bg-white group-hover:bg-oxblood transition-all duration-300" />
              </button>
            </Link>
          </motion.div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {amenities.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-start gap-8"
                >
                  <div className="w-16 h-16 rounded-full border border-gold/20 flex flex-col items-center justify-center text-gold bg-gold/5 shadow-inner flex-shrink-0 group-hover:bg-gold group-hover:text-oxblood group-hover:scale-110 transition-all duration-500">
                    <Icon strokeWidth={1} size={28} />
                  </div>
                  <div className="pt-2">
                     <h3 className="text-xl font-serif mb-3 text-white group-hover:text-gold transition-colors tracking-wide">{item.name}</h3>
                     <p className="text-white/50 font-light text-xs leading-relaxed group-hover:text-white/70 transition-colors">
                      {item.desc}
                     </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Amenities;
