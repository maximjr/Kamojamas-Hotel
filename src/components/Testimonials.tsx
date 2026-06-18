import { motion } from "motion/react";
import { Star } from "lucide-react";

const Testimonials = () => {
  const reviews = [
    {
      name: "Sophia Montgomery",
      role: "Luxury Travel Editor",
      text: "The architectural brilliance is only matched by the warmth of their staff. KAMOJAMAS Villa isn't just a place to stay; it's a profound experience of luxury and timeless tranquility.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      rating: 5
    },
    {
      name: "Alexander Rossi",
      role: "Tech Executive",
      text: "From the seamless airport chauffeur to the exquisite private dining in our villa, every moment was perfection. The sky villa ocean view is simply unparalleled.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
      rating: 5
    },
    {
      name: "Isabella Chen",
      role: "Global Designer",
      text: "As someone who lives for aesthetics, I was moved by the meticulous attention to detail. The integration of organic textures with modern luxury is masterfully executed.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
      rating: 5
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-gold/50" />
            <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">
              Voices of Distinction
            </span>
            <div className="w-8 h-px bg-gold/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-oxblood font-serif text-4xl md:text-6xl lg:text-7xl mb-8 tracking-tight"
          >
            What Our <span className="italic font-light text-oxblood/80">Guests Say</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-10 bg-paper hover:bg-oxblood hover:text-white transition-all duration-700 shadow-sm hover:shadow-2xl group flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold group-hover:via-white group-hover:to-gold transition-all duration-700 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-8">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-current" />
                  ))}
                </div>
                
                <p className="text-oxblood/70 group-hover:text-white/80 transition-colors duration-700 mb-12 leading-relaxed font-serif text-lg lg:text-xl italic">
                   "{review.text}"
                </p>
                
                <div className="h-px w-full bg-oxblood/10 group-hover:bg-white/10 transition-colors duration-700 mb-8" />

                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={review.image}
                      alt={`${review.name}, verified guest review for Kamojamas Villa Hotel & Suite`}
                      className="w-14 h-14 object-cover ring-2 ring-transparent group-hover:ring-gold/30 transition-all duration-500 rounded-full grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 border border-oxblood/10 group-hover:border-gold/30 rounded-full scale-[1.15] transition-colors duration-700" />
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-oxblood font-serif font-bold text-lg group-hover:text-white transition-colors duration-700">
                       {review.name}
                       <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                    </h4>
                    <p className="text-gold text-[9px] uppercase tracking-widest font-bold mt-1">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
