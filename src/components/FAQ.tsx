import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="py-24 md:py-32 bg-paper overflow-hidden h-full relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
             <div className="flex items-center gap-4 mb-6">
                 <div className="w-8 h-px bg-gold/50" />
                 <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">Concierge Desk</span>
             </div>
             <h2 className="text-oxblood font-serif text-4xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] tracking-tight">
               Common <br />
               <span className="italic font-light text-oxblood/80">Inquiries</span>
             </h2>
             <p className="text-gray-500 font-light mb-12 text-sm md:text-base leading-relaxed">
               Find answers to the most common queries our guests have. For any other questions or personalized requests, our digital concierge is available 24/7.
             </p>
             <div className="relative overflow-hidden aspect-[4/3] shadow-lg group">
                <img 
                   src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" 
                   alt="Elegant 24/7 guest service and front desk lobby concierge at Kamojamas Villa Hotel & Suite" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                   referrerPolicy="no-referrer"
                   loading="lazy"
                   decoding="async"
                />
                
                {/* Overlay shadow for image */}
                <div className="absolute inset-0 bg-oxblood/20 group-hover:bg-oxblood/0 transition-colors duration-700" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-oxblood/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <Link to="/contact">
                       <button className="bg-gold px-8 py-4 text-oxblood font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                          Contact Us
                       </button>
                    </Link>
                </div>
             </div>
          </motion.div>

          {/* Accordion Questions */}
          <div className="space-y-0 mt-8 lg:mt-0">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`border-b border-gray-200 overflow-hidden transition-colors duration-500 hover:border-gold/50 ${
                  activeIndex === index ? "border-gold" : ""
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full py-8 flex justify-between items-center text-left group"
                >
                  <span className={`text-lg md:text-xl font-serif pr-8 transition-colors duration-300 ${activeIndex === index ? "text-gold italic" : "text-oxblood group-hover:text-gold"}`}>
                    {faq.question}
                  </span>
                  <div className={`transition-transform duration-500 ease-[0.16,1,0.3,1] ${activeIndex === index ? "rotate-90 scale-110" : ""}`}>
                     {activeIndex === index ? <Minus size={20} className="text-gold" /> : <Plus size={20} className="text-gray-300 group-hover:text-gold transition-colors duration-300" />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="pb-10 pr-12 text-gray-500 font-light leading-relaxed text-sm">
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
