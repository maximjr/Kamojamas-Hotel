import { motion } from "motion/react";

const StatsBanner = () => {
  const stats = [
    { label: "Satisfaction", value: "98%" },
    { label: "Years of Excellence", value: "15+" },
    { label: "Happy Guests", value: "25K+" },
  ];

  return (
    <section className="bg-oxblood py-16 w-full overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center gap-12 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col items-center group"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2 group-hover:text-gold transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold font-bold">
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
