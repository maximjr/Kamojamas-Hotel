import { motion } from "motion/react";
import { Link } from "react-router-dom";

const VipSection = () => {
  return (
    <section id="home-vip" className="py-24 md:py-36 bg-black overflow-hidden relative">
      <div className="absolute left-1/4 top-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pr-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-gold/50" />
              <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Elite Lounge</span>
            </div>

            <h2 className="text-white font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.15] tracking-tight">
              The Lounge & <br />
              <span className="italic font-light text-gold">VIP Clubroom</span>
            </h2>

            <div className="h-px w-24 bg-gold/50 mb-8" />

            <p className="text-white/60 mb-8 leading-relaxed font-light text-sm md:text-base">
              Step into Ebonyi State's premier evening escape. Our VIP Lounge is an ultra-premium, intimate sanctuary designed tailored for dignitaries, connoisseurs, and tastemakers. It is a space where business matches with leisure, surrounded by luxurious custom furnishings and select world-class architecture.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="border border-white/10 p-5 bg-white/5 rounded-lg">
                <p className="text-gold font-serif text-lg font-medium mb-1">Elite Spirits</p>
                <p className="text-white/40 text-xs">Exquisite single-malts, fine cognacs, and vintage champagnes.</p>
              </div>
              <div className="border border-white/10 p-5 bg-white/5 rounded-lg">
                <p className="text-gold font-serif text-lg font-medium mb-1">True Discretion</p>
                <p className="text-white/40 text-xs">Secure private access points and completely soundproof meeting salons.</p>
              </div>
            </div>

            <Link to="/vip-bar">
              <button aria-label="Enter VIP Lounge" className="px-10 py-5 bg-transparent border border-gold text-gold text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-black transition-all duration-500 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_rgba(212,175,55,0.3)]">
                Request VIP Access
              </button>
            </Link>
          </motion.div>

          {/* Animated Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:pl-6"
          >
            <div className="aspect-[4/5] bg-black relative overflow-hidden shadow-2xl p-2 border border-white/15">
              <img 
                src="https://i.imgur.com/QRO3cDt.jpeg" 
                alt="Cozy upscale seating and gold-styled furniture in the Kamojamas VIP lounge room" 
                className="w-full h-full object-cover hover:scale-105 transition-all duration-1000" 
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-1000" />
            </div>
            {/* Ambient gold glow decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/15 blur-[60px] rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default VipSection;
