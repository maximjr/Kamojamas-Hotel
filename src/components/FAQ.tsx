import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is your check-in and check-out policy?",
      answer: "Check-in time starts at 3:00 PM and check-out is strictly at 11:00 AM. We offer early check-in and late check-out subject to availability and a nominal fee."
    },
    {
      question: "Is breakfast included in my stay?",
      answer: "Yes, our Royal Breakfast Experience is included for all 'Executive' and 'Presidential' category bookings. For standard bookings, it can be added for $45 per person."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Standard bookings can be cancelled free of charge up to 48 hours before arrival. For Peak Season and Presidential Villa bookings, a 14-day notice is required."
    },
    {
      question: "Do you offer airport transportation?",
      answer: "Absolutely. We provide luxury chauffeur service from the international airport. This service is complimentary for all 'Sky Villa' and 'Family Suite' guests."
    },
    {
      question: "Are pets allowed in the villa?",
      answer: "We are a pet-friendly resort in designated wings. A cleaning fee of $75 applies, and we provide luxury pet amenities including a designer bed and gourmet treats."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
             <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4">Concierge Desk</span>
             <h2 className="text-oxblood font-serif text-4xl md:text-5xl mb-8 leading-tight">
               Frequently Asked <br />
               <span className="italic luxury-text-gradient">Questions</span>
             </h2>
             <p className="text-gray-500 font-light mb-12">
               Find answers to the most common inquiries our guests have. For any other questions, our digital concierge is available 24/7 via the KAMOJAMAS app.
             </p>
             <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl group cursor-pointer">
                <img 
                   src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" 
                   alt="Lobby Desk" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-oxblood/10 group-hover:bg-oxblood/0 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-full shadow-xl">
                       <span className="text-oxblood font-serif text-xl italic">Ask Anything</span>
                    </div>
                </div>
             </div>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "bg-gray-50 border-gold/30 shadow-lg" : "hover:bg-gray-50"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left"
                >
                  <span className={`text-lg font-serif transition-colors ${activeIndex === index ? "text-gold" : "text-oxblood"}`}>
                    {faq.question}
                  </span>
                  <div className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}>
                     {activeIndex === index ? <Minus size={20} className="text-gold" /> : <Plus size={20} className="text-gray-400" />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 text-gray-500 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
