import { AnimatedPage } from "../components/AnimatedPage";
import { motion } from "motion/react";
import Contact from "../components/Contact";
import MapLocation from "../components/MapLocation";
import SEO from "../components/SEO";

const ContactUs = () => {
  return (
    <AnimatedPage>
      <SEO 
        title="Contact Us & Concierge"
        description="Reach out to Kamojamas Villa Hotel concierge. We are here to assist with reservations and ensuring your stay in Abakaliki is exceptional."
        url="https://kamojamas.com/contact"
        breadcrumbs={[
          { name: "Home", item: "https://kamojamas.com/" },
          { name: "Contact Us", item: "https://kamojamas.com/contact" }
        ]}
      />
      {/* Mini Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-oxblood">
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000"
               alt="Contact KAMOJAMAS"
               className="w-full h-full object-cover opacity-40 blur-[2px]"
               referrerPolicy="no-referrer"
               fetchPriority="high"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-paper via-oxblood/50 to-transparent" />
         </div>
         <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="flex items-center justify-center gap-4 mb-6"
            >
               <div className="w-12 h-px bg-gold" />
               <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Concierge</span>
               <div className="w-12 h-px bg-gold" />
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-xl"
            >
               Get in <span className="italic font-light">Touch</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-white/80 max-w-2xl mx-auto leading-relaxed font-light text-sm tracking-wide"
            >
               We are here to assist you with bespoke requests, reservations, and ensuring your stay is nothing short of exceptional.
            </motion.p>
         </div>
      </section>

      <Contact />
      <MapLocation />
    </AnimatedPage>
  );
};

export default ContactUs;
