import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative h-[100dvh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image/Video (using high quality image as placeholder for video) */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          style={{ y: bgY, willChange: 'transform' }}
          className="absolute inset-0"
        >
          <img
            src="https://i.imgur.com/zKrTKst.jpeg"
            alt="Kamojamas Villa Hotel & Suite luxury facade in Abakaliki"
            className="w-full h-full object-cover origin-top"
            referrerPolicy="no-referrer"
            fetchPriority="high"
          />
        </motion.div>
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-oxblood/30 via-oxblood/50 to-oxblood/80 z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* Floating Elements (Dust/Light particles could go here) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{ y: textY, opacity: textOpacity, willChange: 'transform, opacity' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.5,
            },
          },
        }}
        className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-12"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-px bg-gold" />
          <span className="text-gold text-xs md:text-sm uppercase tracking-[0.4em] font-medium">World Class Experience</span>
          <div className="w-12 h-px bg-gold" />
        </motion.div>

        <motion.h1 
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-[1.1] mb-6 sm:mb-8 tracking-tight drop-shadow-lg"
        >
          Kamojamas <br />
          <span className="italic font-light text-white/90">Villa Hotel & Suite</span>
        </motion.h1>

        <motion.p 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="text-white/80 text-xs sm:text-sm md:text-lg max-w-xs sm:max-w-2xl font-light leading-relaxed mb-8 sm:mb-12"
        >
          A sanctuary of elegance, comfort, and breathtaking hospitality nestled within the most pristine horizons. Discover the art of luxury living.
        </motion.p>
      </motion.div>




    </section>
  );
};

export default Hero;
