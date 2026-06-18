import React, { useState, useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Download, Star, Clock, Calendar, DollarSign, MessageCircle, MoreVertical, X, User, Navigation, Tag } from "lucide-react";

export function UsersTab({ users, getDate, reservations = [] }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "reservations" | "notes">("overview");

  const [notesText, setNotesText] = useState("");
  const [prefsText, setPrefsText] = useState("");

  const guestStats = useMemo(() => {
     const stats: Record<string, { stays: number; spend: number; nights: number; lastVisit: Date | null; upcoming: number; recReservations: any[] }> = {};
     
     // Initialize for all users so they show up even if 0 stays
     users.forEach((u: any) => {
         stats[u.id] = { stays: 0, spend: 0, nights: 0, lastVisit: null, upcoming: 0, recReservations: [] };
     });

     reservations.forEach((r: any) => {
        // Some reservations might not have userId if anonymous, but we join by email or name if needed.
        // Assuming r.userId maps to u.id. If not, match by userName.
        let uid = r.userId;
        if (!uid) {
           const match = users.find((u: any) => u.name === r.userName || u.email === r.userEmail);
           if (match) uid = match.id;
        }

        if (uid && stats[uid]) {
           stats[uid].recReservations.push(r);
           if (r.status !== 'Cancelled') {
              stats[uid].stays += 1;
              stats[uid].spend += Number(r.totalPrice) || 0;
              
              const ci = r.checkIn ? getDate(r.checkIn) : null;
              const co = r.checkOut ? getDate(r.checkOut) : null;
              
              if (ci && co) {
                 const nights = differenceInDays(co, ci);
                 if (nights > 0) stats[uid].nights += nights;
              }

              if (r.status === 'Confirmed') {
                  stats[uid].upcoming += 1;
              } else if (r.status === 'Checked Out') {
                  if (!stats[uid].lastVisit || (ci && ci > stats[uid].lastVisit!)) {
                      stats[uid].lastVisit = ci;
                  }
              }
           }
        }
     });

     // Sort reservations by checkin desc
     Object.keys(stats).forEach(k => {
         stats[k].recReservations.sort((a: any, b: any) => {
            const diA = a.checkIn ? getDate(a.checkIn)?.getTime() || 0 : 0;
            const diB = b.checkIn ? getDate(b.checkIn)?.getTime() || 0 : 0;
            return diB - diA;
         });
     });

     return stats;
  }, [reservations, users, getDate]);

  const enrichedUsers = useMemo(() => {
     return users.map((u: any) => {
        const s = guestStats[u.id];
        const isVIP = u.isVIP || (s && s.stays >= 5) || (s && s.spend >= 5000);
        const isRepeat = s && s.stays > 1;
        const role = u.role || 'USER';

        return {
           ...u,
           stats: s || { stays: 0, spend: 0, nights: 0, lastVisit: null, upcoming: 0, recReservations: [] },
           isVIP,
           isRepeat,
           role
        };
     }).filter((u: any) => {
         const matchSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
         const matchFilter = filterType === "All" || 
             (filterType === "VIP" && u.isVIP) || 
             (filterType === "Repeat" && u.isRepeat) ||
             (filterType === "Admin" && (u.role === "ADMIN" || u.role === "SUPER_ADMIN")) ||
             (filterType === "New" && !u.isRepeat && !u.isVIP);
         return matchSearch && matchFilter;
     }).sort((a: any, b: any) => b.stats.spend - a.stats.spend); // Sort by spend desc
  }, [users, guestStats, searchTerm, filterType]);

  const handleVIPToggle = async (userId: string, currentVIP: boolean) => {
      try {
         await updateDoc(doc(db, "users", userId), { isVIP: !currentVIP });
      } catch (err) {
         console.error(err);
      }
  };

  const handleSaveNotes = async () => {
      if (!selectedGuest) return;
      try {
         await updateDoc(doc(db, "users", selectedGuest.id), {
            adminNotes: notesText,
            preferences: prefsText
         });
         selectedGuest.adminNotes = notesText;
         selectedGuest.preferences = prefsText;
      } catch (err) {
         console.error(err);
      }
  };

  const openGuest = (guest: any) => {
      setSelectedGuest(guest);
      setNotesText(guest.adminNotes || "");
      setPrefsText(guest.preferences || "");
      setDrawerTab("overview");
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)] animate-in fade-in duration-500">
      <div className="flex-none mb-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Guest CRM</h1>
               <p className="text-sm text-gray-500 mt-1">Manage guest profiles, view histories, and loyalties.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
               <Download size={16} /> Export Data
            </button>
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                     type="text" 
                     placeholder="Search guests by name or email..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood focus:bg-white transition-colors"
                  />
               </div>
               <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative shrink-0">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                     <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood focus:bg-white appearance-none h-[38px]"
                     >
                        <option value="All">All Guests</option>
                        <option value="VIP">VIP Guests</option>
                        <option value="Repeat">Repeat Guests</option>
                        <option value="New">New Guests</option>
                        <option value="Admin">Staff / Admins</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0 relative">
         <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
               <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                  <tr>
                     <th className="px-6 py-4">Guest Profile</th>
                     <th className="px-6 py-4">Status & Tags</th>
                     <th className="px-6 py-4 text-center">Total Stays</th>
                     <th className="px-6 py-4 text-right">Lifetime Spend</th>
                     <th className="px-6 py-4">Last Visit</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {enrichedUsers.map((u: any) => (
                     <tr key={u.id} onClick={() => openGuest(u)} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-oxblood/5 text-oxblood flex items-center justify-center font-bold text-sm">
                                 {u.name?.charAt(0) || u.email?.charAt(0) || 'G'}
                              </div>
                              <div>
                                 <p className="font-semibold text-gray-900">{u.name || 'Unnamed Guest'}</p>
                                 <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-wrap gap-2">
                              {u.isVIP && (
                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold ring-1 ring-yellow-600/20">
                                    <Star size={10} className="fill-yellow-500 text-yellow-500" /> VIP
                                 </span>
                              )}
                              {u.isRepeat && !u.isVIP && (
                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-600/20">
                                    <Clock size={10} /> Repeat
                                 </span>
                              )}
                              {u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? (
                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-oxblood text-gold text-xs font-semibold">
                                     Staff
                                 </span>
                              ) : null}
                              {!u.isRepeat && !u.isVIP && u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN' && (
                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                                    New Guest
                                 </span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="font-medium text-gray-900">{u.stats.stays}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-semibold text-gray-900">${u.stats.spend.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                           {u.stats.lastVisit ? format(u.stats.lastVisit, "MMM dd, yyyy") : "No visits yet"}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-oxblood hover:bg-oxblood/5 transition-colors border border-transparent group-hover:border-oxblood/20">
                              View Profile
                           </button>
                        </td>
                     </tr>
                  ))}
                  {enrichedUsers.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                           <div className="flex justify-center mb-3"><User className="h-8 w-8 text-gray-300" /></div>
                           <p className="font-medium text-gray-900">No guests found</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Guest Profile Drawer */}
      <AnimatePresence>
         {selectedGuest && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setSelectedGuest(null)}
               />
               <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-[100dvh] w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
               >
                  <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-oxblood text-gold flex items-center justify-center font-bold text-xl shadow-sm">
                           {selectedGuest.name?.charAt(0) || selectedGuest.email?.charAt(0) || 'G'}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-xl text-gray-900">{selectedGuest.name || 'Unnamed Guest'}</h3>
                              {selectedGuest.isVIP && <Star size={16} className="fill-yellow-500 text-yellow-500" />}
                           </div>
                           <p className="text-sm text-gray-500">{selectedGuest.email}</p>
                           <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedGuest.id}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedGuest(null)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="flex px-6 border-b border-gray-100 bg-gray-50/50 gap-6 text-sm">
                     <button 
                        onClick={() => setDrawerTab("overview")} 
                        className={`py-3 font-medium border-b-2 transition-colors ${drawerTab === 'overview' ? 'border-oxblood text-oxblood' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                     >
                        Overview
                     </button>
                     <button 
                        onClick={() => setDrawerTab("reservations")} 
                        className={`py-3 font-medium border-b-2 transition-colors ${drawerTab === 'reservations' ? 'border-oxblood text-oxblood' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                     >
                        Stays & History ({selectedGuest.stats.recReservations.length})
                     </button>
                     <button 
                        onClick={() => setDrawerTab("notes")} 
                        className={`py-3 font-medium border-b-2 transition-colors ${drawerTab === 'notes' ? 'border-oxblood text-oxblood' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                     >
                        Notes & Prefs
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                     {drawerTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                           
                           {/* Quick Stats Grid */}
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                 <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <DollarSign size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Spend</span>
                                 </div>
                                 <p className="text-2xl font-bold text-gray-900">${selectedGuest.stats.spend.toLocaleString()}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                 <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Clock size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Total Stays</span>
                                 </div>
                                 <p className="text-2xl font-bold text-gray-900">{selectedGuest.stats.stays} Stays</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                 <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Calendar size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Total Nights</span>
                                 </div>
                                 <p className="text-2xl font-bold text-gray-900">{selectedGuest.stats.nights} Nights</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                 <div className="flex items-center gap-2 text-gray-500 mb-2">
                                    <Star size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Loyalty Level</span>
                                 </div>
                                 <p className="text-xl font-bold text-gray-900">{selectedGuest.isVIP ? 'VIP Member' : selectedGuest.isRepeat ? 'Silver' : 'Standard'}</p>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">CRM Actions</h4>
                              <div className="flex gap-3">
                                 <button onClick={() => handleVIPToggle(selectedGuest.id, selectedGuest.isVIP)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${selectedGuest.isVIP ? 'border-yellow-200 bg-yellow-50 text-yellow-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                    <Star size={16} className={selectedGuest.isVIP ? "fill-yellow-500" : ""} /> 
                                    {selectedGuest.isVIP ? 'Remove VIP Status' : 'Mark as VIP'}
                                 </button>
                                 <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                                    <MessageCircle size={16} /> Send Email
                                 </button>
                              </div>
                           </div>

                           {selectedGuest.preferences && (
                              <div className="space-y-4">
                                 <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2"><Tag size={16} className="text-gray-400" /> Guest Preferences</h4>
                                 <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-gray-700 whitespace-pre-wrap">
                                    {selectedGuest.preferences}
                                 </div>
                              </div>
                           )}

                        </div>
                     )}

                     {drawerTab === 'reservations' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                           {selectedGuest.stats.recReservations.length === 0 ? (
                              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                                 <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                                 <p className="text-gray-500 font-medium">No reservations found.</p>
                              </div>
                           ) : (
                              <div className="space-y-3">
                                 {selectedGuest.stats.recReservations.map((res: any) => (
                                    <div key={res.id} className="bg-white border text-sm border-gray-200 rounded-xl p-4 shadow-sm hover:border-oxblood/30 transition-colors">
                                       <div className="flex justify-between items-start mb-3">
                                           <div>
                                              <p className="font-semibold text-gray-900">{res.roomType}</p>
                                              <p className="text-xs font-mono text-gray-500 mt-0.5">Ref: {res.id.slice(0,8)}</p>
                                           </div>
                                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                              res.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                              res.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                              res.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                                              res.status === 'Checked Out' ? 'bg-gray-100 text-gray-800' :
                                              'bg-yellow-100 text-yellow-800'
                                           }`}>
                                              {res.status}
                                           </span>
                                       </div>
                                       <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          <div className="flex items-center gap-1.5">
                                             <Navigation size={12} className="text-gray-400" /> 
                                             {res.checkIn ? format(getDate(res.checkIn), "MMM dd, yyyy") : 'N/A'} 
                                          </div>
                                          <div className="flex items-center gap-1.5 justify-end">
                                             <DollarSign size={12} className="text-gray-400" />
                                             <span className="font-medium text-gray-900">${res.totalPrice?.toLocaleString()}</span>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}

                     {drawerTab === 'notes' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                           <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">Guest Preferences & Tags</label>
                              <textarea 
                                 value={prefsText}
                                 onChange={e => setPrefsText(e.target.value)}
                                 placeholder="e.g. Feather pillows, High floor, Vegan breakfast"
                                 className="w-full text-sm border border-gray-200 rounded-xl p-4 focus:ring-oxblood focus:border-oxblood bg-gray-50 focus:bg-white transition-colors custom-scrollbar"
                                 rows={3}
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">Internal Admin Notes</label>
                              <textarea 
                                 value={notesText}
                                 onChange={e => setNotesText(e.target.value)}
                                 placeholder="Private notes for staff only..."
                                 className="w-full text-sm border border-gray-200 rounded-xl p-4 focus:ring-oxblood focus:border-oxblood bg-gray-50 focus:bg-white transition-colors h-48 custom-scrollbar"
                              />
                           </div>
                           <button onClick={handleSaveNotes} className="w-full py-3 bg-oxblood text-white rounded-xl text-sm font-semibold hover:bg-oxblood/90 transition-colors shadow-sm">
                              Save Notes
                           </button>
                        </div>
                     )}
                     
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}

