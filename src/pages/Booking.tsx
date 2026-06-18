import { motion } from "motion/react";
import { AnimatedPage } from "../components/AnimatedPage";
import BookingForm from "../features/booking/BookingForm";
import SEO from "../components/SEO";

export default function Booking() {
  return (
    <AnimatedPage className="min-h-[100dvh] bg-paper flex flex-col pt-32 pb-16">
      <SEO 
        title="Book Your Stay"
        description="Secure your luxury experience at Kamojamas Villa Hotel. Reserve premium suites and boutique accommodations seamlessly."
        url="https://kamojamas.com/booking"
        breadcrumbs={[
          { name: "Home", item: "https://kamojamas.com/" },
          { name: "Booking", item: "https://kamojamas.com/booking" }
        ]}
      />
      <div className="container mx-auto px-6 md:px-12 flex-grow flex flex-col">
          <div className="text-center mb-16">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="flex items-center justify-center gap-4 mb-6"
            >
               <div className="w-12 h-px bg-gold" />
               <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Reservations</span>
               <div className="w-12 h-px bg-gold" />
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl md:text-6xl lg:text-7xl font-serif text-oxblood mb-6 tracking-tight drop-shadow-sm"
            >
               Plan Your <span className="italic font-light">Stay</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-oxblood/60 max-w-2xl mx-auto leading-relaxed font-light text-sm tracking-wide"
            >
               Secure your luxury experience. Select your dates and discover our exclusive collection of suites and villas.
            </motion.p>
          </div>
          
          <BookingForm />
      </div>
    </AnimatedPage>
  );
}
