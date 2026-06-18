import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Gallery = () => {
  const images = [
    { url: "https://i.imgur.com/gsk1niS.jpeg", span: "lg:col-span-2 lg:row-span-2", direction: -1, alt: "Kamojamas Villa luxury bedroom interior" },
    { url: "https://i.imgur.com/0K1CAlq.jpeg", span: "lg:col-span-1 lg:row-span-1", direction: 1, alt: "Kamojamas Villa outdoor lounge area" },
    { url: "https://i.imgur.com/OwFWAGI.jpeg", span: "lg:col-span-1 lg:row-span-2", direction: -0.5, alt: "Kamojamas dining spread and restaurant ambiance" },
    { url: "https://i.imgur.com/zKrTKst.jpeg", span: "lg:col-span-1 lg:row-span-1", direction: 0.8, alt: "Kamojamas premium bathroom amenities" },
  ];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={ref} id="gallery" className="py-24 md:py-32 bg-paper overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-gold/50" />
            <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">
              Visual Journey
            </span>
            <div className="w-8 h-px bg-gold/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-oxblood font-serif text-4xl md:text-6xl lg:text-7xl mb-8 tracking-tight drop-shadow-sm"
          >
            Experience the <span className="italic font-light text-oxblood/80">Luxury</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-[800px] lg:grid-rows-2">
          {images.map((img, i) => {
             // Create individual parallax shift based on image index direction
             const yOffset = useTransform(scrollYProgress, [0, 1], [`${img.direction * 30}%`, `${img.direction * -30}%`]);
             
             return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden group shadow-lg aspect-square lg:aspect-auto min-h-[300px] ${img.span}`}
              >
                <motion.img
                  style={{ y: yOffset, scale: 1.15, willChange: 'transform' }} // scale slightly up to allow vertical shifting without showing edges
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.25]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-oxblood/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-sm cursor-pointer z-10">
                   <Link to="#" className="text-white text-xs uppercase tracking-[0.4em] font-bold border-b border-transparent group-hover:border-gold transition-colors duration-500 pb-2">
                      View Gallery
                   </Link>
                </div>
              </motion.div>
             )
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
