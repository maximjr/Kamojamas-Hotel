import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section id="home" className="relative h-screen bg-white flex flex-col md:flex-row overflow-hidden pt-24">
      {/* Left Content Section (55%) */}
      <div className="w-full md:w-[55%] bg-oxblood relative flex flex-col justify-end px-12 lg:px-24 pt-32 pb-4 lg:pb-6 text-white overflow-hidden">
        {/* Animated Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-oxblood/60 z-10" />
          <motion.img
            src="https://i.imgur.com/zKrTKst.jpg"
            alt="Luxury Villa"
            className="w-full h-full object-cover scale-[1.15] animate-slow-zoom"
            referrerPolicy="no-referrer"
            style={{ y }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
          className="relative z-20 mb-6"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-gold text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 block font-bold"
          >
            Established 2008
          </motion.span>
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="font-serif text-5xl lg:text-7xl xl:text-8xl leading-[1.1] mb-8 tracking-tight"
          >
            Experience <br />
            <span className="italic font-light">Premium Luxury</span>
          </motion.h1>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="max-w-md text-sm md:text-base leading-relaxed opacity-70 font-light mb-10"
          >
            A sanctuary of elegance, comfort, and unforgettable hospitality nestled within the world's most breathtaking horizons.
          </motion.p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="flex space-x-6"
          >
             <Link to="/contact">
               <button className="px-8 py-4 bg-gold text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold-dark transition-colors luxury-border rounded-full">
                  Book Now
               </button>
             </Link>
             <Link to="/rooms">
               <button className="px-8 py-4 border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white/10 transition-colors rounded-full">
                  View Suites
               </button>
             </Link>
          </motion.div>
        </motion.div>

      </div>

      {/* Right Visual/Preview Section (45%) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[45%] bg-paper flex flex-col overflow-hidden relative"
      >
        <div className="flex-1 flex flex-col p-12 lg:p-20">
           <motion.h3 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8, duration: 0.8 }}
             className="text-[10px] uppercase tracking-[0.4em] text-gold mb-10 font-bold"
           >
             Selected Suites
           </motion.h3>
           
           <div className="space-y-12 mb-12">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                className="flex gap-8 group cursor-pointer"
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 overflow-hidden rounded-sm flex-shrink-0">
                   <img 
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=300" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt="Suite"
                      referrerPolicy="no-referrer"
                   />
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-widest">From $1,200 / night</p>
                   <h4 className="font-serif text-xl lg:text-2xl mb-1 text-oxblood">The Presidential Villa</h4>
                   <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-medium">Ocean View • King Bed • Private Pool</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                className="flex gap-8 group cursor-pointer"
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 overflow-hidden rounded-sm flex-shrink-0">
                   <img 
                      src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=300" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt="Suite"
                      referrerPolicy="no-referrer"
                   />
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-widest">From $850 / night</p>
                   <h4 className="font-serif text-xl lg:text-2xl mb-1 text-oxblood">Executive Garden Suite</h4>
                   <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-medium">Garden Access • Smart Tech • Spa Tub</p>
                </div>
              </motion.div>
           </div>

           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-auto flex justify-between items-center pt-8 border-t border-gray-100"
           >
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Discover More Collections</p>
              <div className="flex gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              </div>
           </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 1.5, duration: 1 }}
           className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4"
        >
           <div className="h-20 w-px bg-gold/30 relative overflow-hidden">
              <motion.div 
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 bg-gold h-1/2"
              />
           </div>
           <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-gold [writing-mode:vertical-rl]">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
