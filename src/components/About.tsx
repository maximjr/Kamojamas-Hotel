import { motion } from "motion/react";

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4">Our Story</span>
            <h2 className="text-oxblood font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              A Legacy of <br />
              <span className="italic luxury-text-gradient">Pure Luxury & Elegance</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light italic border-l-2 border-gold pl-6">
              "Since 2008, KAMOJAMS Villa has been a beacon of sophisticated hospitality, offering a unique blend of modern luxury and traditional warmth."
            </p>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Nestled in the heart of the world's most beautiful landscapes, our villa offers more than just a stay. We provide a tailored experience where every detail is meticulously crafted to ensure your comfort. From our world-class architecture to our personalized concierge service, we redefine what it means to travel en vogue.
            </p>
          </motion.div>

          {/* Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl scale-95 hover:scale-100 transition-transform duration-700">
              <img
                src="https://i.imgur.com/0K1CAlq.jpeg"
                alt="Luxury Lifestyle"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-oxblood/5 rounded-full blur-3xl z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gold/20 rounded-full pointer-events-none z-0 rotate-12" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
