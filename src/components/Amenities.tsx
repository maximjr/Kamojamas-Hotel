import { motion } from "motion/react";
import { Waves, Sparkles, Utensils, Dumbbell, Calendar, Bike, Wine, Plane } from "lucide-react";

const Amenities = () => {
  const amenities = [
    { name: "Infinity Pool", icon: Waves, desc: "Breathtaking views of the horizon." },
    { name: "Spa & Wellness", icon: Sparkles, desc: "Holistic treatments for body and soul." },
    { name: "Fine Dining", icon: Utensils, desc: "Award-winning gourmet experiences." },
    { name: "Gym Center", icon: Dumbbell, desc: "State-of-the-art fitness equipment." },
    { name: "Conference Hall", icon: Calendar, desc: "Modern venues for executive meetings." },
    { name: "Bicycle Rental", icon: Bike, desc: "Explore the surrounding nature in style." },
    { name: "Luxury Bar", icon: Wine, desc: "Handcrafted cocktails and fine wines." },
    { name: "Airport Pickup", icon: Plane, desc: "Complimentary luxury chauffeur service." },
  ];

  return (
    <section id="amenities" className="py-24 md:py-32 bg-oxblood text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-3 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4">Elite Services</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-tight">
              Curated <br />
              <span className="luxury-text-gradient italic font-normal">Experiences</span>
            </h2>
            <p className="text-white/60 font-light mb-12 leading-relaxed">
              Experience a world of privilege and comfort with our meticulously selected amenities designed to cater to your every desire. We believe luxury is in the details.
            </p>
            <button className="px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold rounded-full">
              View All Amenities
            </button>
          </motion.div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {amenities.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-start gap-6 pt-8 border-t border-white/10"
              >
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0 group-hover:bg-gold group-hover:text-oxblood transition-all duration-300">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                   <h3 className="text-xl font-serif mb-2 group-hover:text-gold transition-colors uppercase tracking-widest">{item.name}</h3>
                   <p className="text-white/40 font-light text-xs group-hover:text-white/60 transition-colors uppercase tracking-[0.1em]">
                    {item.desc}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Amenities;
