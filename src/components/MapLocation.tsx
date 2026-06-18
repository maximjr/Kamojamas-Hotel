import { motion } from "motion/react";

const MapLocation = () => {
  return (
    <section className="py-24 md:py-32 bg-paper border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
             <div className="w-8 h-px bg-gold/50" />
             <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Location</span>
             <div className="w-8 h-px bg-gold/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-oxblood font-serif text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight"
          >
            Find <span className="italic font-light text-oxblood/80">Us</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 font-light max-w-2xl text-sm md:text-base leading-relaxed"
          >
            Nestled in exclusivity, KAMOJAMAS Villa offers a private escape just moments from the city's highest points of interest. 
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[450px] md:h-[600px] border-[8px] border-white shadow-2xl relative bg-gray-100"
        >
          {/* Using a pseudo-grayscale trick over iframe if possible by having an overlay? We'll just load the standard map */}
          <iframe
            src="https://maps.google.com/maps?q=No.%20187%20Ogoja%20Road,%20Onu%20Ebonyi%20Junction,%20Abakaliki%20Ebonyi%20State&t=&z=17&ie=UTF8&iwloc=&output=embed"
            className="absolute top-0 left-0 w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-[2s]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default MapLocation;
