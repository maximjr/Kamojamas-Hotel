import { motion } from "motion/react";

const Experience = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://i.imgur.com/gsk1niS.jpeg"
          alt="Resort Experience"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block mb-6">Discovery</span>
          <h2 className="text-white font-serif text-4xl md:text-7xl mb-12 italic tracking-tight leading-tight">
            Immerse Yourself in <br />
            <span className="not-italic">Pure Serenity</span>
          </h2>
        </motion.div>
      </div>

      {/* Bottom stats overlay or something */}
      <div className="absolute bottom-12 left-0 w-full z-20 hidden md:block">
         <div className="container mx-auto px-12 flex justify-between items-end border-t border-white/10 pt-8">
            <div className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold">
               KAMOJAMAS Villa and Suite — THE ULTIMATE ESCAPE
            </div>
            <div className="flex space-x-12">
               <div className="text-right">
                  <div className="text-white font-serif text-2xl mb-1 italic">Private</div>
                  <div className="text-gold text-[10px] uppercase tracking-widest font-bold">Beach Access</div>
               </div>
               <div className="text-right">
                  <div className="text-white font-serif text-2xl mb-1 italic">Exclusive</div>
                  <div className="text-gold text-[10px] uppercase tracking-widest font-bold">Dining Club</div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default Experience;
