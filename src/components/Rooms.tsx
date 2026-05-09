import { motion } from "motion/react";
import { Users, Wifi, Tv, Coffee, Maximize } from "lucide-react";

const Rooms = () => {
  const roomCategories = [
    {
      name: "Deluxe Ocean Room",
      price: "350",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
      features: ["King Bed", "Ocean View", "Free WiFi", "Smart TV"],
      size: "45 sqm"
    },
    {
      name: "Executive Grand Suite",
      price: "600",
      image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800",
      features: ["King Bed", "Living Area", "Private Terrace", "Smart TV"],
      size: "85 sqm"
    },
    {
      name: "Presidential Sky Villa",
      price: "1500",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
      features: ["Private Pool", "3 Bedrooms", "Butler Service", "Gourmet Kitchen"],
      size: "240 sqm"
    },
    {
      name: "Royal Family Suite",
      price: "850",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
      features: ["2 Bedrooms", "Bunk Area", "Breakfast Inc.", "Mini Bar"],
      size: "110 sqm"
    }
  ];

  return (
    <section id="rooms" className="py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold uppercase tracking-[0.3em] text-xs font-bold block mb-4"
          >
            Accommodation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-oxblood font-serif text-4xl md:text-5xl lg:text-7xl mb-6 tracking-tight"
          >
            Our Exquisite <span className="italic font-light">Suites</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto font-light text-sm uppercase tracking-widest"
          >
            Experience timeless luxury with our curated selection of suites.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roomCategories.map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group cursor-pointer luxury-border p-4 bg-white hover:bg-paper transition-all duration-500"
            >
              <div className="relative overflow-hidden aspect-[4/5] mb-6">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-oxblood/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center p-8">
                   <button className="w-full py-4 border border-gold text-gold uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-gold hover:text-white transition-all duration-300 rounded-full">
                    Discover Suite
                   </button>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 shadow-sm text-oxblood text-xs font-bold tracking-widest">
                  ${room.price} <span className="text-[8px] opacity-40 uppercase ml-1">/ Night</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-serif text-oxblood mb-2 group-hover:text-gold transition-colors">{room.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">{room.features.slice(0, 3).join(" • ")}</p>
                <div className="h-px w-full bg-gray-100 group-hover:bg-gold/30 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
