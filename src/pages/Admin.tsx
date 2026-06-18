import { useEffect, useState, useRef, useMemo } from "react";
import { AnimatedPage } from "../components/AnimatedPage";
import SEO from "../components/SEO";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { format, isSameDay } from "date-fns";
import { Users, Calendar, TrendingUp, Activity as ActivityIcon, Home, Menu, LogOut, Globe, Bell, Bed, X, Search, ChevronRight, ChevronsLeft, ChevronsRight, User, Plus, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { useRooms } from "../hooks/useRooms";
import { Link } from "react-router-dom";

import { OverviewTab } from "../features/admin/OverviewTab";
import { VisitorsTab } from "../features/admin/VisitorsTab";
import { ReservationsTab } from "../features/admin/ReservationsTab";
import { ActivityTab } from "../features/admin/ActivityTab";
import { UsersTab } from "../features/admin/UsersTab";
import { StaffTab } from "../features/admin/StaffTab";
import { AnalyticsTab } from "../features/admin/AnalyticsTab";
import { RoomsTab } from "../features/admin/RoomsTab";

export default function Admin() {
  const { signOut, userData } = useAuth();
  
  const getDate = (val: any) => {
    if (!val) return new Date();
    return val.toDate ? val.toDate() : new Date(val);
  };
  
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [reservations, setReservations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<{id: string, message: string, time: Date}[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);
  
  const { rooms } = useRooms();

  useEffect(() => {
    // Prevent notifications on initial load spam
    setTimeout(() => { isInitialMount.current = false; }, 3000);

    const resQuery = query(collection(db, "reservations"), orderBy("createdAt", "desc"), limit(100));
    const unsubRes = onSnapshot(resQuery, (snapshot) => {
        if (!isInitialMount.current) {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    addNotification(`New reservation made for ${data.roomType}`);
                }
            });
        }
        setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    });

    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
        if (!isInitialMount.current) {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    addNotification(`New user registered: ${change.doc.data().name}`);
                }
            });
        }
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const logsQuery = query(collection(db, "userActivityLogs"), orderBy("timestamp", "desc"), limit(200));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
        setActivityLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const visitorsQuery = query(collection(db, "activeVisitors"), orderBy("lastActive", "desc"));
    const unsubVisitors = onSnapshot(visitorsQuery, (snapshot) => {
        const now = Date.now();
        const active = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
           .filter((v: any) => v.lastActive && (now - v.lastActive.toMillis()) < 40000); 
        setActiveVisitors(active);
    });

    return () => {
       unsubRes();
       unsubUsers();
       unsubLogs();
       unsubVisitors();
    };
  }, []);

  const addNotification = (message: string) => {
      const newNotif = { id: Math.random().toString(), message, time: new Date() };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const { totalRevenue, activeBookings } = useMemo(() => {
    return {
      totalRevenue: reservations.filter(r => r.status !== 'Cancelled').reduce((acc, curr) => acc + curr.totalPrice, 0),
      activeBookings: reservations.filter(r => r.status === 'Confirmed' || r.status === 'Pending').length
    };
  }, [reservations]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
     try {
        await updateDoc(doc(db, "reservations", id), { status: newStatus });
     } catch (e) {
        // Silently catch
     }
  };

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "reservations", label: "Reservations", icon: Calendar },
    { id: "rooms", label: "Rooms", icon: Bed },
    { id: "users", label: "Guests CRM", icon: Users },
    { id: "staff", label: "Staff & Roles", icon: Shield },
    { id: "visitors", label: "Visitors", icon: Globe },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "activity", label: "Activity Logs", icon: ActivityIcon },
  ];

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    // Generate data for the last 7 days, ending today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const name = format(d, 'EEE'); // Mon, Tue, etc.
      
      let dayRevenue = 0;
      reservations.forEach((res: any) => {
         if (res.status === 'Confirmed' || res.status === 'Checked-Out') {
            const resDate = getDate(res.createdAt);
            if (resDate && isSameDay(resDate, d)) {
               const price = typeof res.totalPrice === 'string' ? parseFloat(res.totalPrice.replace(/[^0-9.-]+/g, "")) : (res.totalPrice || 0);
               dayRevenue += price;
            }
         }
      });
      
      data.push({ name, revenue: dayRevenue });
    }
    return data;
  }, [reservations, getDate]);

  const activeTabLabel = menuItems.find(m => m.id === activeTab)?.label || "Dashboard";

  return (
    <AnimatedPage className="min-h-[100dvh] bg-gray-50 flex pt-[72px]">
      <SEO 
        title="Admin Control Center"
        description="Kamojamas admin dashboard."
        url="https://kamojamas.com/admin"
      />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-[72px] left-0 h-[calc(100dvh-72px)] ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 z-50 transform transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">
          {!sidebarCollapsed && <h2 className="font-serif text-lg tracking-wider text-oxblood font-bold truncate">Kamojamas</h2>}
          <button 
            className="hidden lg:flex p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors ml-auto"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
          <button 
             className="flex lg:hidden p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md ml-auto"
             onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${isActive ? "bg-oxblood text-white shadow-md shadow-oxblood/20" : "text-gray-600 hover:bg-gray-100 hover:text-black"}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className={isActive ? "text-gold" : "text-gray-500"} /> 
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
           {!sidebarCollapsed ? (
             <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-oxblood text-white flex items-center justify-center font-bold text-xs uppercase">
                  {userData?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-gray-900 truncate">{userData?.name || 'Admin User'}</p>
                   <p className="text-xs text-gray-500 truncate">{userData?.role || 'Administrator'}</p>
                </div>
             </div>
           ) : (
             <div className="flex justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-oxblood text-white flex items-center justify-center font-bold text-xs uppercase" title={userData?.name || 'Admin User'}>
                  {userData?.name?.charAt(0) || 'A'}
                </div>
             </div>
           )}
          <button onClick={() => signOut()} className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors`}>
            <LogOut size={18} /> {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[calc(100dvh-72px)] bg-gray-50/50">
        
        {/* Sticky Header */}
        <header className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-black p-1">
                 <Menu size={22} />
              </button>
              
              {/* Breadcrumbs */}
              <div className="hidden sm:flex items-center text-sm text-gray-500">
                 <span className="hover:text-oxblood cursor-pointer transition-colors font-medium">Platform</span>
                 <ChevronRight size={14} className="mx-2 text-gray-400" />
                 <span className="font-semibold text-gray-900">{activeTabLabel}</span>
              </div>
           </div>

           <div className="flex items-center gap-3 sm:gap-6">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-oxblood focus-within:bg-white transition-all w-64">
                 <Search size={16} className="text-gray-400 mr-2" />
                 <input type="text" placeholder="Search anything..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
              </div>

              {/* Mobile Search Icon */}
              <button className="md:hidden text-gray-500 hover:text-black p-1">
                 <Search size={20} />
              </button>

              {/* Notification Center */}
              <div className="relative">
                 <button onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }} className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                 </button>

                 <AnimatePresence>
                    {notificationsOpen && (
                       <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                       >
                          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                             <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                             <button onClick={() => setNotifications([])} className="text-xs text-oxblood hover:underline font-medium">Clear All</button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                             {notifications.length === 0 ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">No new notifications</div>
                             ) : (
                                notifications.map(notif => (
                                   <div key={notif.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors group flex gap-3 relative">
                                      <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-gold"></div></div>
                                      <div className="flex-1 min-w-0">
                                         <p className="text-sm text-gray-800 line-clamp-2">{notif.message}</p>
                                         <p className="text-xs text-gray-400 mt-1">{notif.time.toLocaleTimeString()}</p>
                                      </div>
                                      <button onClick={() => removeNotification(notif.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all absolute right-2 top-2">
                                         <X size={14} />
                                      </button>
                                   </div>
                                ))
                             )}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                 <button onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }} className="flex items-center gap-2 hover:bg-gray-100 p-1 pr-2 rounded-full transition-colors border border-transparent focus:border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-oxblood text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {userData?.name?.charAt(0) || 'A'}
                    </div>
                 </button>

                 <AnimatePresence>
                    {profileOpen && (
                       <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1"
                       >
                          <div className="px-4 py-3 border-b border-gray-100">
                             <p className="text-sm font-semibold text-gray-900 truncate">{userData?.name || 'Admin User'}</p>
                             <p className="text-xs text-gray-500 truncate">{userData?.email || 'admin@example.com'}</p>
                          </div>
                          <div className="py-1">
                             <Link to="/dashboard" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><User size={16} /> My Account</Link>
                          </div>
                          <div className="py-1 border-t border-gray-100">
                             <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <LogOut size={16} /> Sign out
                             </button>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">{activeTabLabel}</h1>
               <p className="text-sm text-gray-500 mt-1">Manage and oversee your property data.</p>
             </div>
             
             {/* Quick Actions Placeholder */}
             {activeTab === 'reservations' && (
               <button onClick={() => setActiveTab('rooms')} className="hidden sm:flex text-sm bg-oxblood text-white px-4 py-2 rounded-lg shadow hover:bg-oxblood/90 transition-colors items-center gap-2 font-medium">
                  <Plus size={16} /> New Booking
               </button>
             )}
          </div>

          {loading ? (
              <div className="space-y-6 animate-pulse">
                 {/* Top KPIs skeleton */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                       <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                          <div className="flex justify-between items-start mb-4">
                             <div className="w-10 h-10 rounded-full bg-gray-200" />
                             <div className="w-12 h-5 rounded-full bg-gray-200" />
                          </div>
                          <div className="space-y-2">
                             <div className="w-24 h-3 bg-gray-200 rounded" />
                             <div className="w-16 h-6 bg-gray-200 rounded" />
                          </div>
                       </div>
                    ))}
                 </div>
                 {/* Charts area skeleton */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-80">
                       <div className="w-1/3 h-5 bg-gray-200 rounded mb-6" />
                       <div className="w-full h-full bg-gray-100 rounded-lg" />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-80 flex flex-col items-center justify-center">
                       <div className="w-40 h-40 rounded-full bg-gray-200" />
                    </div>
                 </div>
              </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "overview" && <OverviewTab activeVisitors={activeVisitors} activeBookings={activeBookings} totalRevenue={totalRevenue} reservations={reservations} getDate={getDate} rooms={rooms} activityLogs={activityLogs} chartData={chartData} setActiveTab={setActiveTab} />}
              {activeTab === "visitors" && <VisitorsTab activeVisitors={activeVisitors} />}
              {activeTab === "reservations" && <ReservationsTab reservations={reservations} getDate={getDate} handleStatusUpdate={handleStatusUpdate} />}
              {activeTab === "rooms" && <RoomsTab rooms={rooms} reservations={reservations} getDate={getDate} />}
              {activeTab === "activity" && <ActivityTab activityLogs={activityLogs} getDate={getDate} />}
              {activeTab === "users" && <UsersTab users={users} getDate={getDate} reservations={reservations} />}
              {activeTab === "staff" && <StaffTab users={users} activityLogs={activityLogs} getDate={getDate} />}
              {activeTab === "analytics" && <AnalyticsTab chartData={chartData} reservations={reservations} />}
            </div>
          )}
        </main>
      </div>
    </AnimatedPage>
  );
}

