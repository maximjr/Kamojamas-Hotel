import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const reviews = [
    {
      name: "Sophia Montgomery",
      role: "Travel Journalist",
      text: "The architectural brilliance is only matched by the warmth of their staff. KAMOJAMS Villa isn't just a place to stay; it's a profound experience of luxury and tranquility.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      rating: 5
    },
    {
      name: "Alexander Rossi",
      role: "Tech Executive",
      text: "From the seamless airport pickup to the exquisite private dining in our villa, every moment was perfection. The sky villa view is simply unparalleled.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
      rating: 5
    },
    {
      name: "Isabella Chen",
      role: "Interior Designer",
      text: "As someone who lives for aesthetics, I was blown away by the attention to detail. The integration of local textures with modern luxury is masterfully executed.",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
      rating: 5
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center mb-20">
             <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4"
              >
                Voices of Distinction
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-oxblood font-serif text-4xl md:text-5xl lg:text-6xl mb-8"
              >
                What Our <span className="italic">Guests Say</span>
              </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative p-10 border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-2xl group"
            >
              <div className="absolute top-8 right-8 text-gold/10 group-hover:text-gold/20 transition-colors">
                 <Quote size={80} fill="currentColor" />
              </div>

              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-10 leading-relaxed italic text-lg font-light">
                   "{review.text}"
                </p>

                <div className="flex items-center">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-gold/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-oxblood font-serif font-bold text-lg">{review.name}</h4>
                    <p className="text-gold text-[10px] uppercase tracking-widest font-bold">{review.role}</p>
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
