import { motion } from "motion/react";

const TrustBanner = () => {
  const logos = [
    "Condé Nast Traveler",
    "Forbes Travel Guide",
    "Michelin Keys",
    "Travel + Leisure",
    "World Travel Awards",
  ];

  return (
    <section className="bg-paper border-b border-gray-100 py-12 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-8 font-bold text-center">
          Internationally Recognized For Excellence
        </span>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {logos.map((logo, i) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="text-sm md:text-base font-serif text-oxblood font-medium hover:text-gold transition-colors duration-500 cursor-default"
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;
