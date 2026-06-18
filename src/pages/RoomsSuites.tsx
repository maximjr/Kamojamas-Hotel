import { AnimatedPage } from "../components/AnimatedPage";
import { motion } from "motion/react";
import Rooms from "../components/Rooms";
import SEO from "../components/SEO";

const RoomsSuites = () => {
  return (
    <AnimatedPage>
      <SEO 
        title="Premium Rooms & Suites"
        description="Experience unparalleled luxury in our meticulously designed rooms and suites in Abakaliki. Book your stay with Kamojamas today."
        url="https://kamojamas.com/rooms"
        breadcrumbs={[
          { name: "Home", item: "https://kamojamas.com/" },
          { name: "Rooms & Suites", item: "https://kamojamas.com/rooms" }
        ]}
      />
      {/* Mini Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-oxblood">
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=2000"
               alt="Premium luxury rooms and suites at Kamojamas Abakaliki"
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
               <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">Accommodation</span>
               <div className="w-12 h-px bg-gold" />
            </motion.div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.1 }}
               className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-xl"
            >
               Rooms & <span className="italic font-light">Suites</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-white/80 max-w-2xl mx-auto leading-relaxed font-light text-sm tracking-wide"
            >
               Experience unparalleled luxury in our meticulously designed spaces, each offering an oasis of comfort and breathtaking views.
            </motion.p>
         </div>
      </section>

      <Rooms />
    </AnimatedPage>
  );
};

export default RoomsSuites;
