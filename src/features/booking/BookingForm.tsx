import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format, differenceInDays } from "date-fns";
import { Calendar, Users, ChevronDown, Check, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { db, functions } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, query, where, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { useRooms, formatRoomPrice } from "../../hooks/useRooms";

export default function BookingForm() {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notification, setNotification] = useState<{type: 'error' | 'success', message: string} | null>(null);

  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { rooms: availableRooms, loading: roomsLoading } = useRooms();

  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [botField, setBotField] = useState("");

  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 0;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const nights = differenceInDays(d2, d1);
    return nights > 0 ? nights : 0;
  };

  const nights = useMemo(() => calculateNights(checkIn, checkOut), [checkIn, checkOut]);
  
  const selectedRoomData = useMemo(() => availableRooms.find(r => r.id === selectedRoom || r.name === selectedRoom), [selectedRoom, availableRooms]);

  const subtotal = (Number(String(selectedRoomData?.price || '').replace(/[^0-9.]/g, '')) || 0) * nights;
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const isNaira = useMemo(() => {
    const rawPrice = Number(String(selectedRoomData?.price || '').replace(/[^0-9.]/g, '')) || 0;
    return rawPrice >= 3000;
  }, [selectedRoomData]);

  const formatCurrency = (value: number) => {
    return isNaira ? `₦${value.toLocaleString()}` : `$${value.toLocaleString()}`;
  };

  const handleBooking = async () => {
    setHasAttemptedSubmit(true);
    setNotification(null);

    // Spam defense honeypot
    if (botField) return;

    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/booking' } } });
      return;
    }

    // Input sanitization
    const sanitizedPhone = phone.trim();
    const sanitizedRequests = specialRequests.trim();
    
    // Validate length constraints to prevent buffer overflow/spam
    if (sanitizedPhone.length > 20 || sanitizedRequests.length > 1000) {
      setNotification({ type: 'error', message: 'Input exceeds maximum allowed length.'});
      return;
    }

    // Rate Limiter / Anti-Spam (1 minute cooldown)
    const lastBooking = localStorage.getItem('kamojamas_last_booking');
    if (lastBooking && Date.now() - Number(lastBooking) < 60000) {
       setNotification({ type: 'error', message: 'Rate limit exceeded. Please wait a moment before booking again.'});
       return;
    }

    if (!selectedRoomData) {
       setNotification({ type: 'error', message: 'Please select a suite.'});
       return;
    }

    if (!checkIn || !checkOut || nights <= 0) {
       setNotification({ type: 'error', message: 'Please select valid check-in and check-out dates.'});
       return;
    }

    if (!sanitizedPhone || sanitizedPhone.length < 10) {
       setNotification({ type: 'error', message: 'Please enter a valid phone number.'});
       return;
    }

    setIsSubmitting(true);
    try {
      const createReservation = httpsCallable(functions, 'createReservation');
      await createReservation({
        roomId: selectedRoomData.id || selectedRoomData.name,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
        phone: sanitizedPhone,
        specialRequests: sanitizedRequests,
        userName: userData?.name || user.displayName || user.email || 'Guest',
        email: user.email || '',
        roomType: selectedRoomData.name,
      });

      localStorage.setItem('kamojamas_last_booking', Date.now().toString());

      setNotification({ type: 'success', message: 'Reservation confirmed! Your booking is secured. Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.message || "Error processing reservation. Please try again.";
      setNotification({ type: 'error', message: errorMsg });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start relative pb-20">
      
      {/* Left Column: Form & Room Select */}
      <div className="lg:col-span-2 space-y-12">
        {/* Spam Defense Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="booking-bot" tabIndex={-1} value={botField} onChange={e => setBotField(e.target.value)} />
        </div>
        {/* Booking Details */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100"
        >
           <h3 className="text-2xl font-serif text-oxblood mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-gold"></span> Travel Dates
           </h3>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3 relative group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold flex items-center gap-2 group-hover:text-gold transition-colors">
                   <Calendar size={12} /> Check-In
                </label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={checkIn}
                  onChange={(e) => {
                     setCheckIn(e.target.value);
                     // If checkOut is now before checkIn, reset it
                     if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
                        setCheckOut("");
                     }
                  }}
                  className={`w-full border-b py-2 focus:outline-none transition-colors font-serif text-lg bg-transparent
                    ${hasAttemptedSubmit && !checkIn ? 'border-red-400 focus:border-red-600' : 'border-gray-200 focus:border-oxblood'}`} 
                />
                {hasAttemptedSubmit && !checkIn && <span className="text-xs text-red-500 font-medium">Required</span>}
              </div>
              <div className="space-y-3 relative group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold flex items-center gap-2 group-hover:text-gold transition-colors">
                   <Calendar size={12} /> Check-Out
                </label>
                <input 
                  type="date" 
                  min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`w-full border-b py-2 focus:outline-none transition-colors font-serif text-lg bg-transparent
                    ${hasAttemptedSubmit && !checkOut ? 'border-red-400 focus:border-red-600' : 'border-gray-200 focus:border-oxblood'}`} 
                />
                {hasAttemptedSubmit && !checkOut && <span className="text-xs text-red-500 font-medium">Required</span>}
              </div>
              <div className="space-y-3 relative group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold flex items-center gap-2 group-hover:text-gold transition-colors">
                   <Users size={12} /> Guests
                </label>
                <select 
                   value={guests}
                   onChange={e => setGuests(Number(e.target.value))}
                   className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent cursor-pointer"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
           </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100"
        >
           <h3 className="text-2xl font-serif text-oxblood mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-gold"></span> Guest Details
           </h3>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3 relative group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold flex items-center gap-2 group-hover:text-gold transition-colors">
                   Phone Number *
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full border-b py-2 focus:outline-none transition-colors font-serif text-lg bg-transparent
                    ${hasAttemptedSubmit && (!phone || phone.length < 10) ? 'border-red-400 focus:border-red-600' : 'border-gray-200 focus:border-oxblood'}`} 
                />
                {hasAttemptedSubmit && (!phone || phone.length < 10) && (
                  <span className="text-xs text-red-500 font-medium">Valid phone required</span>
                )}
              </div>
              <div className="space-y-3 relative group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-oxblood/40 font-bold flex items-center gap-2 group-hover:text-gold transition-colors">
                   Special Requests (Optional)
                </label>
                <input 
                  type="text" 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Anniversary, early check-in, etc."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-oxblood transition-colors font-serif text-lg bg-transparent" 
                />
              </div>
           </div>
        </motion.div>

        {/* Room Selection */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
        >
            <h3 className="text-2xl font-serif text-oxblood mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-gold"></span> Available Suites
              {hasAttemptedSubmit && !selectedRoom && <span className="text-xs text-red-500 font-medium ml-2 bg-red-50 px-2 py-1 rounded">Please select a suite</span>}
            </h3>
            
            <div className="space-y-6">
              {roomsLoading ? (
                 <div className="flex justify-center items-center py-20 text-gold">
                    <Loader2 size={32} className="animate-spin" />
                 </div>
              ) : availableRooms.map((room) => (
                 <div 
                   key={room.id || room.name}
                   onClick={() => setSelectedRoom(room.id || room.name)}
                   className={`relative border bg-white cursor-pointer transition-all duration-500 overflow-hidden group
                    ${selectedRoom === (room.id || room.name) ? "border-gold shadow-2xl shadow-gold/10" : "border-gray-100 shadow-md hover:shadow-xl hover:border-oxblood/30"}`}
                 >
                    {selectedRoom === (room.id || room.name) && (
                       <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gold text-oxblood flex items-center justify-center scale-up shadow-lg">
                          <Check size={16} strokeWidth={3} />
                       </div>
                    )}
                    <div className="grid md:grid-cols-3 gap-0">
                       <div className="h-48 md:h-full relative overflow-hidden">
                           <img 
                              src={room.image} 
                              alt={room.name} 
                              className={`w-full h-full object-cover transition-transform duration-[1.5s] ${selectedRoom === (room.id || room.name) ? "scale-105" : "group-hover:scale-105"}`} 
                              referrerPolicy="no-referrer"
                              loading="lazy"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-oxblood/60 to-transparent md:hidden" />
                       </div>
                       <div className="col-span-2 p-6 md:p-8 flex flex-col justify-between">
                          <div>
                             <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-serif text-2xl transition-colors duration-300 ${selectedRoom === (room.id || room.name) ? "text-gold" : "text-oxblood group-hover:text-gold"}`}>{room.name}</h4>
                                <div className="text-right">
                                   <span className="text-xl font-serif text-oxblood">{formatRoomPrice(room.price)}</span>
                                   <span className="text-[10px] text-gray-500 uppercase tracking-widest block">/ Night</span>
                                </div>
                             </div>
                             <p className="text-gray-500 font-light text-sm mb-6">{room.size}</p>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap">
                             {room.features.slice(0, 4).map(item => (
                                <span key={item} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] uppercase tracking-widest">
                                   {item}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
        </motion.div>
      </div>

      {/* Right Column: Summary Panel */}
      <motion.div
         initial={{ opacity: 0, x: 30 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.8, delay: 0.6 }}
         className="lg:sticky lg:top-32"
      >
         <div className="bg-oxblood text-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 blur-[60px] rounded-full pointer-events-none" />
            
            <h3 className="text-2xl font-serif text-gold mb-8 italic">Booking Summary</h3>
            
            <div className="space-y-6 mb-8 font-light text-sm border-b border-white/10 pb-8">
               <div className="flex justify-between items-center group">
                  <span className="text-white/60">Check-in</span>
                  <span className="font-serif">{checkIn ? format(new Date(checkIn), "MMM dd, yyyy") : "—"}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-white/60">Check-out</span>
                  <span className="font-serif">{checkOut ? format(new Date(checkOut), "MMM dd, yyyy") : "—"}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-white/60">Guests</span>
                  <span className="font-serif">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-white/60">Nights</span>
                  <span className="font-serif">{nights}</span>
               </div>
            </div>

            <div className="space-y-6 mb-8 border-b border-white/10 pb-8">
               <div className="flex justify-between items-start">
                  <span className="text-white/60 text-sm">Room</span>
                  <span className="font-serif text-right text-gold">{selectedRoomData ? selectedRoomData.name : "Select a room"}</span>
               </div>
               
               <AnimatePresence>
                  {nights > 0 && selectedRoomData && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 text-sm"
                     >
                        <div className="flex justify-between items-center text-white/60">
                           <span>{formatRoomPrice(selectedRoomData.price)} × {nights} nights</span>
                           <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-white/60">
                           <span>Taxes & Fees (15%)</span>
                           <span>{formatCurrency(tax)}</span>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="flex justify-between items-end mb-4">
               <span className="text-white uppercase tracking-[0.2em] text-[10px] font-bold">Total</span>
               <span className="font-serif text-3xl text-gold">{formatCurrency(total)}</span>
            </div>

            <div className="flex items-center gap-2 text-green-400 mb-10 text-[9px] uppercase tracking-widest font-bold">
               <Check size={12} strokeWidth={3} />
               Free Cancellation up to 48 hours
            </div>

            {notification && (
               <div className={`mb-6 p-4 border text-sm font-medium flex items-center justify-center text-center
                  ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-200' : 'bg-green-500/10 border-green-500/50 text-green-200'}
               `}>
                 {notification.message}
               </div>
            )}

            <button 
               onClick={handleBooking}
               disabled={isSubmitting}
               className={`w-full py-5 uppercase tracking-[0.3em] font-bold text-xs transition-all duration-500 flex justify-center items-center gap-2 mb-6
                  ${!isSubmitting
                     ? "bg-gold text-oxblood hover:bg-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]" 
                     : "bg-white/5 text-white/30 cursor-not-allowed"}`}
            >
               {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Processing...</>
               ) : user ? "Confirm Reservation" : "Sign In to Book"}
            </button>

            <div className="flex items-center justify-center gap-2 text-white/40 text-[9px] uppercase tracking-widest font-bold">
               <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
               Secure & Encrypted 
               <span className="mx-1">•</span>
               Best Rate Guarantee
            </div>
         </div>
      </motion.div>
    </div>
  );
}
