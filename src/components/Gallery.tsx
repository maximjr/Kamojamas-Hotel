import { motion } from "motion/react";

const Gallery = () => {
  const images = [
    { url: "https://i.imgur.com/gsk1niS.jpeg", span: "lg:col-span-2 lg:row-span-2" },
    { url: "https://i.imgur.com/0K1CAlq.jpeg", span: "lg:col-span-1" },
    { url: "https://i.imgur.com/zKrTKst.jpeg", span: "lg:col-span-1 lg:row-span-2" },
    { url: "https://i.imgur.com/OwFWAGI.jpeg", span: "lg:col-span-1" },
  ];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4"
          >
            Visual Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-oxblood font-serif text-4xl md:text-5xl lg:text-6xl mb-8"
          >
            Experience the <span className="italic">Luxury</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[1000px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative overflow-hidden group rounded-2xl ${img.span}`}
            >
              <img
                src={img.url}
                alt={`Gallery ${i}`}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-oxblood/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                 <span className="text-white text-xs uppercase tracking-[0.4em] font-bold border-b border-gold pb-2">View Experience</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
