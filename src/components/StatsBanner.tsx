import { motion } from "motion/react";

const StatsBanner = () => {
  const stats = [
    { label: "Guests Served", value: "25K+" },
    { label: "Luxury Suites", value: "45" },
    { label: "Years of Excellence", value: "15+" },
    { label: "Global Visitors", value: "110+" },
  ];

  return (
    <section className="bg-oxblood py-20 w-full overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center group"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 group-hover:text-gold transition-colors duration-500 drop-shadow-md">
                {stat.value}
              </div>
              <div className="text-[9px] md:text-xs uppercase tracking-[0.3em] text-gold/80 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
