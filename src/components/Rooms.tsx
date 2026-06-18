import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import React, { useRef } from "react";
import { useRooms, formatRoomPrice } from "../hooks/useRooms";

const RoomCard = React.memo(({ room, i, scrollYProgress }: { room: any, i: number, scrollYProgress: any, key?: any }) => {
  const yOffset = useTransform(scrollYProgress, [0, 1], [`${(room.offset || 0) * 20}px`, `${(room.offset || 0) * -20}px`]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      style={{ y: yOffset, willChange: 'transform' }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-gray-100 flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[4/5] mb-6 rounded-sm shadow-inner">
        <img
          src={room.image}
          alt={`${room.name} luxury guest suite at Kamojamas Villa Hotel & Suite in Abakaliki`}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.15]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-oxblood/90 via-oxblood/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
        
        {/* Floating Price */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-5 py-2 shadow-sm text-oxblood text-xs font-bold tracking-widest rounded-full z-10 transition-transform duration-500 group-hover:-translate-y-1">
          {formatRoomPrice(room.price)} <span className="text-[8px] opacity-60 uppercase ml-1">/ Night</span>
        </div>

        {/* Limited Availability Badge */}
        {i % 3 === 0 && (
           <div className="absolute top-4 left-4 bg-oxblood/90 backdrop-blur-md px-4 py-1.5 shadow-sm text-gold text-[9px] uppercase font-bold tracking-widest rounded-full z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              High Demand
           </div>
        )}
        
        {/* Hover Reveal Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
           <Link to="/booking">
             <button className="w-full py-4 bg-gold text-oxblood uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-white transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Reserve Now
             </button>
           </Link>
        </div>
      </div>

      <div className="px-4 pb-4 mt-auto">
        <h3 className="text-xl font-serif text-oxblood mb-2 group-hover:text-gold transition-colors duration-300">{room.name}</h3>
        <p className="text-[9px] text-gray-500 uppercase tracking-[0.25em] font-medium mb-4">{room.features.slice(0, 3).join(" • ")}</p>
        <div className="h-px w-full bg-gray-100 group-hover:bg-gold transition-all duration-500" />
      </div>
    </motion.div>
  );
});

const Rooms = () => {
  const { rooms: roomCategories, loading } = useRooms();
  
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={ref} id="rooms" className="py-24 md:py-32 bg-paper overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-3xl rounded-full" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-gold/50" />
            <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold block">
              Accommodation
            </span>
            <div className="w-8 h-px bg-gold/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-oxblood font-serif text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight drop-shadow-sm"
          >
            Our Exquisite <span className="italic font-light text-oxblood/80">Suites</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto font-light text-sm uppercase tracking-widest leading-relaxed"
          >
            Experience timeless luxury with our curated selection of suites, designed for absolute comfort.
          </motion.p>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-24">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roomCategories.map((room, i) => (
              <RoomCard key={room.id || room.name} room={room} i={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        )}
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="mt-16 flex justify-center"
        >
          <Link to="/rooms">
             <button className="px-10 py-5 border border-oxblood/20 text-oxblood text-xs uppercase tracking-[0.3em] font-bold hover:bg-oxblood hover:text-white transition-colors duration-500 rounded-full flex items-center gap-3 group">
                View All Suites
                <span className="w-8 h-px bg-oxblood group-hover:bg-white group-hover:w-12 transition-all duration-300" />
             </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Rooms;
