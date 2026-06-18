import { useEffect, useState } from "react";
import { AnimatedPage } from "../components/AnimatedPage";
import SEO from "../components/SEO";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy, updateDoc, doc, limit } from "firebase/firestore";
import { Calendar, User, Settings, LogOut, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "../utils";

export default function Dashboard() {
  const { user, userData, signOut } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "reservations"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          // Prevent infinite loops/memory leaks for extreme edge cases
          limit(50)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReservations(data);
      } catch (e: any) {
        console.warn("Could not fetch reservations. Please verify Firestore rules.", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user?.uid]);

  const handleCancelClick = (id: string) => {
     setCancellingId(id);
  };

  const confirmCancel = async () => {
    if (!cancellingId) return;
    try {
      await updateDoc(doc(db, "reservations", cancellingId), { status: "Cancelled" });
      setReservations(prev => prev.map(r => r.id === cancellingId ? { ...r, status: "Cancelled" } : r));
    } catch (e) {
      // We log instead of alert due to iframe behavior
    } finally {
      setCancellingId(null);
    }
  };

  const getDate = (val: any) => {
    if (!val) return new Date();
    return val.toDate ? val.toDate() : new Date(val);
  };

  const upcomingReservations = reservations.filter(r => getDate(r.checkIn) >= new Date());
  const pastReservations = reservations.filter(r => getDate(r.checkIn) < new Date());

  const displayReservations = activeTab === "upcoming" ? upcomingReservations : pastReservations;

  return (
    <AnimatedPage className="min-h-[100dvh] pt-24 pb-20 bg-paper">
      <SEO 
        title="My Dashboard"
        description="View and manage your reservations at Kamojamas."
        url="https://kamojamas.com/dashboard"
      />
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-6 shadow-xl border border-gray-100 mb-8">
              <div className="w-20 h-20 rounded-full bg-oxblood/5 flex items-center justify-center mb-6 text-oxblood">
                <User size={32} />
              </div>
              <h2 className="font-serif text-2xl text-oxblood mb-2">{userData?.name || user?.displayName || user?.email}</h2>
              <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">{user?.email}</p>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("upcoming")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${activeTab === "upcoming" ? "bg-oxblood text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Upcoming Stays
                </button>
                <button 
                  onClick={() => setActiveTab("past")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${activeTab === "past" ? "bg-oxblood text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Past Reservations
                </button>
                <button 
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
             <div className="mb-8 flex justify-between items-end">
                <h1 className="text-3xl font-serif text-oxblood">
                   {activeTab === "upcoming" ? "Upcoming Stays" : "Past Reservations"}
                </h1>
                <span className="text-gray-500 text-sm">{displayReservations.length} reservations</span>
             </div>

             {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
             ) : displayReservations.length === 0 ? (
                <div className="bg-white p-12 text-center shadow-xl border border-gray-100">
                   <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                   <h3 className="text-xl font-serif text-oxblood mb-2">No reservations found</h3>
                   <p className="text-gray-500 text-sm">You do not have any {activeTab} reservations.</p>
                </div>
             ) : (
                <div className="grid gap-6">
                   {displayReservations.map(res => (
                      <div key={res.id} className="bg-white p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-6 justify-between group hover:border-gold transition-colors duration-500">
                         <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                               <div className={`flex items-center gap-2.5 px-3 py-1.5 border shadow-sm rounded-full text-[10px] uppercase tracking-wider font-bold ${
                                  res.status === 'Confirmed' ? 'bg-green-50 border-green-100' :
                                  res.status === 'Cancelled' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
                               }`}>
                                  <span className="relative flex h-2 w-2">
                                     {res.status === 'Pending' && (
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                     )}
                                     {res.status === 'Confirmed' && (
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                     )}
                                     <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                        res.status === 'Confirmed' ? 'bg-green-500' :
                                        res.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                     }`}></span>
                                  </span>
                                  <span className={
                                     res.status === 'Confirmed' ? 'text-green-700' :
                                     res.status === 'Cancelled' ? 'text-red-700' : 'text-yellow-700'
                                  }>
                                     {res.status}
                                  </span>
                               </div>
                               <span className="text-xs text-gray-400 font-mono">ID: {res.id.slice(0, 8)}</span>
                            </div>
                            <h3 className="text-xl font-serif text-oxblood mb-4">{res.roomType}</h3>
                            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-600">
                               <div>
                                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Check-in</span>
                                  <span className="font-medium">{format(getDate(res.checkIn), "MMM dd, yyyy")}</span>
                               </div>
                               <div>
                                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Check-out</span>
                                  <span className="font-medium">{format(getDate(res.checkOut), "MMM dd, yyyy")}</span>
                               </div>
                               <div>
                                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Guests</span>
                                  <span className="font-medium">{res.guests} Guests</span>
                               </div>
                               <div>
                                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total</span>
                                  <span className="font-serif text-gold font-medium">{formatCurrency(res.totalPrice)}</span>
                               </div>
                            </div>
                         </div>
                         
                         {res.status !== 'Cancelled' && activeTab === "upcoming" && (
                            <div className="flex justify-end gap-3 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                               <button onClick={() => handleCancelClick(res.id)} className="px-6 py-2 border border-red-200 text-red-600 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-red-50 hover:border-red-300 transition-colors h-fit">
                                  Cancel Reservation
                               </button>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             )}
          </main>
        </div>
      </div>

      {cancellingId && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 max-w-sm w-full shadow-2xl">
               <h3 className="text-xl font-serif text-oxblood mb-4">Cancel Reservation</h3>
               <p className="text-sm text-gray-600 mb-8">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
               <div className="flex gap-4">
                  <button onClick={() => setCancellingId(null)} className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Abort</button>
                  <button onClick={confirmCancel} className="flex-1 py-3 text-xs uppercase tracking-widest font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">Confirm</button>
               </div>
            </div>
         </div>
      )}
    </AnimatedPage>
  );
}
