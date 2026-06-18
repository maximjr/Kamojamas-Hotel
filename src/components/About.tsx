import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { OptimizedImage } from "./OptimizedImage";

const About = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);

  return (
    <section ref={ref} id="about" className="py-24 md:py-40 bg-paper overflow-hidden relative">
      <div className="absolute -left-40 top-40 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-8 h-px bg-gold/50" />
               <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Our Story</span>
            </div>
            
            <h2 className="text-oxblood font-serif text-4xl md:text-6xl lg:text-7xl mb-12 leading-[1.1] tracking-tight">
              A Legacy of <br />
              <span className="italic font-light text-oxblood/80">Pure Elegance</span>
            </h2>
            
            <div className="pl-8 border-l border-gold/50 mb-10 relative">
               <div className="absolute -left-1.5 top-0 w-3 h-3 bg-gold rotate-45" />
               <p className="text-oxblood/70 text-lg md:text-xl leading-relaxed font-serif italic mb-0">
                 "Since 2008, KAMOJAMAS Villa has been a beacon of sophisticated hospitality, offering an unprecedented blend of modern architectural mastery and timeless warmth."
               </p>
            </div>
            
            <p className="text-gray-500 mb-12 leading-relaxed font-light text-sm md:text-base">
              Nestled in the heart of the world's most breathtaking landscapes, our estate offers more than a temporary residence. We provide a curated lifestyle where uncompromising quality meets personalized service. From world-class amenities to our discreet concierge, we continuously redefine what it means to travel en vogue.
            </p>
            
            <Link to="/contact">
              <button className="px-10 py-5 bg-oxblood text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold transition-colors duration-500 shadow-xl">
                 Discover Privileges
              </button>
            </Link>
          </motion.div>

          {/* Cinematic Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:ml-10"
          >
            {/* Primary Image */}
            <motion.div style={{ y: y1 }} className="relative z-20 aspect-[3/4] md:aspect-square lg:aspect-[4/5] overflow-hidden shadow-2xl group border-[8px] border-white">
              <OptimizedImage
                src="https://i.imgur.com/kS6DiOQ.jpeg"
                alt="Kamojamas Villa outdoor patio lounge area with premium garden views in Abakaliki"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-oxblood/10 group-hover:bg-oxblood/0 transition-colors duration-1000" />
            </motion.div>
            
            {/* Secondary Floating Image */}
            <motion.div 
               style={{ y: y2 }}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="absolute -bottom-16 -left-16 w-3/5 aspect-square z-30 shadow-2xl border-[8px] border-white overflow-hidden hidden md:block group"
            >
               <OptimizedImage
                  src="https://i.imgur.com/fKenxrQ.jpeg"
                  alt="Elegant suite interior view with pristine bed styling and premium amenities at Kamojamas Villa Hotel"
                  className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-110"
                  referrerPolicy="no-referrer"
               />
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] aspect-square border border-gold/20 rounded-full pointer-events-none z-10 rotate-12" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
