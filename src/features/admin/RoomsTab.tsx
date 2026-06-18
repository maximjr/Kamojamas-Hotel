import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Wrench, MoreVertical, LayoutGrid, AlignLeft, CheckCircle, XCircle, BarChart3, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight, Image as ImageIcon } from "lucide-react";
import { formatRoomPrice } from "../../hooks/useRooms";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { startOfDay, isWithinInterval, subDays } from "date-fns";

export function RoomsTab({ rooms, reservations = [], getDate }: { rooms: any[], reservations?: any[], getDate?: any }) {
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const today = startOfDay(new Date());
  const thirtyDaysAgo = subDays(today, 30);

  // Filter out soft-deleted rooms unless we explicitly want to see them
  const activeRooms = rooms.filter(r => !r.isArchived);

  // Compute room statuses based on reservations and maintenance flag
  const roomsWithStatus = useMemo(() => {
    return activeRooms.map(room => {
      let status = "Available";
      if (room.isMaintenance) {
         status = "Maintenance";
      } else {
         const isOccupied = reservations.some(res => {
            if (res.status !== "Confirmed" && res.status !== "Checked In") return false;
            if (res.roomType !== room.name && res.roomType !== room.category && res.roomId !== room.id) return false;
            // Simplified check based on names/types
            
            const checkIn = getDate ? startOfDay(getDate(res.checkIn)) : today;
            const checkOut = getDate ? startOfDay(getDate(res.checkOut)) : today;
            return checkIn <= today && checkOut > today;
         });
         if (isOccupied) status = "Occupied";
      }

      // Calculate 30-day occupancy
      let occupiedDays = 0;
      reservations.forEach(res => {
         if (res.status === "Cancelled") return;
         if (res.roomType === room.name || res.roomType === room.category || res.roomId === room.id) {
             const checkIn = getDate ? startOfDay(getDate(res.checkIn)) : today;
             const checkOut = getDate ? startOfDay(getDate(res.checkOut)) : today;
             if (checkIn <= today && checkOut >= thirtyDaysAgo) {
                 // Simplified days calculation
                 const overlapStart = checkIn > thirtyDaysAgo ? checkIn : thirtyDaysAgo;
                 const overlapEnd = checkOut < today ? checkOut : today;
                 const diffTime = Math.abs(overlapEnd.getTime() - overlapStart.getTime());
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                 occupiedDays += diffDays;
             }
         }
      });
      const occupancyRate = Math.min(Math.round((occupiedDays / 30) * 100), 100);

      return {
         ...room,
         computedStatus: status,
         occupancyRate
      };
    });
  }, [activeRooms, reservations, getDate, today, thirtyDaysAgo]);

  const categories = ["All", ...Array.from(new Set(activeRooms.map((r: any) => r.category || "Standard").filter(Boolean)))];

  const filteredRooms = roomsWithStatus.filter(room => {
     const matchSearch = room.name?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchCategory = categoryFilter === "All" || (room.category || "Standard") === categoryFilter;
     const matchStatus = statusFilter === "All" || room.computedStatus === statusFilter;
     return matchSearch && matchCategory && matchStatus;
  });

  const handleSave = async (e: React.FormEvent) => {
     e.preventDefault();
     const form = e.target as HTMLFormElement;
     const data = new FormData(form);
     
     const roomData = {
        name: data.get("name") as string,
        category: data.get("category") as string || "Standard",
        price: data.get("price") as string,
        size: data.get("size") as string,
        image: data.get("image") as string,
        features: (data.get("features") as string).split(',').map((s: string) => s.trim()).filter(Boolean),
        isMaintenance: editingRoom ? editingRoom.isMaintenance : false,
        isArchived: editingRoom ? editingRoom.isArchived : false,
     };

     try {
        const roomId = editingRoom?.id || `room_${Date.now()}`;
        await setDoc(doc(db, "rooms", roomId), { ...editingRoom, ...roomData });
        setIsFormOpen(false);
        setEditingRoom(null);
     } catch (err) {
        console.error("Failed to save room", err);
        alert("Failed to save room. Are you an admin?");
     }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
     setRoomToDelete(id);
     setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
     if (!roomToDelete) return;
     try {
        await updateDoc(doc(db, "rooms", roomToDelete), { isArchived: true });
        setIsDeleteModalOpen(false);
        setRoomToDelete(null);
     } catch (err) {
        console.error("Failed to delete room", err);
     }
  };

  const toggleMaintenance = async (id: string, currentStatus: boolean) => {
     try {
        await updateDoc(doc(db, "rooms", id), { isMaintenance: !currentStatus });
     } catch (err) {
        console.error("Failed to update status", err);
     }
  };

  const stats = {
     total: activeRooms.length,
     available: roomsWithStatus.filter(r => r.computedStatus === "Available").length,
     occupied: roomsWithStatus.filter(r => r.computedStatus === "Occupied").length,
     maintenance: roomsWithStatus.filter(r => r.computedStatus === "Maintenance").length,
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)] animate-in fade-in duration-500">
      <div className="flex-none mb-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Room Inventory</h1>
               <p className="text-sm text-gray-500 mt-1">Manage room types, availability, and pricing.</p>
            </div>
            <button 
               onClick={() => { setEditingRoom(null); setIsFormOpen(true); }}
               className="bg-oxblood text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-oxblood/90 transition shadow-sm text-sm font-medium"
            >
               <Plus size={16} /> Add Room
            </button>
         </div>

         {/* Metrics */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LayoutGrid size={20} />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium">Total Rooms</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <CheckCircle size={20} />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium">Available</p>
                  <p className="text-xl font-bold text-gray-900">{stats.available}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-oxblood/10 text-oxblood flex items-center justify-center">
                  <BarChart3 size={20} />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium">Occupied</p>
                  <p className="text-xl font-bold text-gray-900">{stats.occupied}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Wrench size={20} />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium">Maintenance</p>
                  <p className="text-xl font-bold text-gray-900">{stats.maintenance}</p>
               </div>
            </div>
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                     type="text" 
                     placeholder="Search rooms..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood transition-colors"
                  />
               </div>
               <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative shrink-0">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                     <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood appearance-none h-[38px]"
                     >
                        {categories.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                     </select>
                  </div>
                  <div className="relative shrink-0">
                     <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood appearance-none h-[38px]"
                     >
                        <option value="All">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                     </select>
                  </div>
               </div>
            </div>
            
            <div className="bg-gray-100 p-1 rounded-lg flex items-center border border-gray-200 shrink-0">
               <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`} title="List View"><AlignLeft size={16} /></button>
               <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`} title="Grid View"><LayoutGrid size={16} /></button>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
         {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
               {filteredRooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group relative">
                     <div className="h-48 overflow-hidden relative bg-gray-100 flex items-center justify-center">
                        {room.image ? (
                           <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                           <ImageIcon className="text-gray-300" size={32} />
                        )}
                        <div className="absolute top-3 left-3">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur shadow-sm flex items-center gap-1.5 ${
                              room.computedStatus === 'Available' ? 'text-green-700' :
                              room.computedStatus === 'Occupied' ? 'text-oxblood' : 'text-orange-700'
                           }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                 room.computedStatus === 'Available' ? 'bg-green-500' :
                                 room.computedStatus === 'Occupied' ? 'bg-oxblood' : 'bg-orange-500'
                              }`}></span>
                              {room.computedStatus}
                           </span>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg shadow-sm">
                           <button onClick={() => { setEditingRoom(room); setIsFormOpen(true); }} className="p-2 hover:text-oxblood transition-colors"><Edit2 size={16} /></button>
                        </div>
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="font-semibold text-gray-900 truncate pr-2">{room.name}</h3>
                           <span className="font-bold text-gray-900">{formatRoomPrice(room.price)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{room.category || 'Standard'} • {room.size}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                           <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${room.occupancyRate > 70 ? 'bg-green-500' : room.occupancyRate > 40 ? 'bg-yellow-500' : 'bg-oxblood'}`} style={{ width: `${room.occupancyRate}%` }}></div>
                           </div>
                           <span className="text-xs text-gray-500 font-medium w-10 text-right">{room.occupancyRate}%</span>
                        </div>

                        <div className="mt-auto flex justify-between items-center gap-2 pt-4 border-t border-gray-50">
                           <button onClick={() => toggleMaintenance(room.id, !!room.isMaintenance)} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-gray-50 transition-colors ${room.isMaintenance ? 'text-orange-600 hover:bg-orange-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                              <Wrench size={14} /> {room.isMaintenance ? 'Finish Maint.' : 'Set Maint.'}
                           </button>
                           <button onClick={() => handleDeleteClick(room.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
               {filteredRooms.length === 0 && (
                   <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm border-dashed">
                       <LayoutGrid className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                       <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
                       <p className="mt-1 text-sm text-gray-500">Get started by creating a new room.</p>
                       <button onClick={() => { setEditingRoom(null); setIsFormOpen(true); }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-oxblood text-white rounded-lg shadow-sm hover:bg-oxblood/90 text-sm font-medium">
                          <Plus size={16} /> Add Room
                       </button>
                   </div>
               )}
            </div>
         ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                     <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                           <th className="px-6 py-4">Room Details</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Price</th>
                           <th className="px-6 py-4">30d Occupancy</th>
                           <th className="px-6 py-4">Features</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {filteredRooms.map((room) => (
                           <tr key={room.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                       {room.image ? <img src={room.image} alt={room.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-gray-300" />}
                                    </div>
                                    <div>
                                       <p className="font-semibold text-gray-900">{room.name}</p>
                                       <p className="text-xs text-gray-500">{room.category || 'Standard'} • {room.size}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                                    room.computedStatus === 'Available' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                                    room.computedStatus === 'Occupied' ? 'bg-oxblood/5 text-oxblood ring-1 ring-oxblood/20' :
                                    'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20'
                                 }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                       room.computedStatus === 'Available' ? 'bg-green-500' :
                                       room.computedStatus === 'Occupied' ? 'bg-oxblood' : 'bg-orange-500'
                                    }`}></span>
                                    {room.computedStatus}
                                 </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">{formatRoomPrice(room.price)}</td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                       <div className={`h-full rounded-full ${room.occupancyRate > 70 ? 'bg-green-500' : room.occupancyRate > 40 ? 'bg-yellow-500' : 'bg-oxblood'}`} style={{ width: `${room.occupancyRate}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{room.occupancyRate}%</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                 {room.features?.slice(0, 2).join(", ")}
                                 {room.features?.length > 2 && <span className="text-gray-400"> +{room.features.length - 2}</span>}
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => toggleMaintenance(room.id, !!room.isMaintenance)} className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${room.isMaintenance ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`} title={room.isMaintenance ? 'Finish Maintenance' : 'Set to Maintenance'}>
                                       <Wrench size={16} />
                                    </button>
                                    <button onClick={() => { setEditingRoom(room); setIsFormOpen(true); }} className="p-1.5 text-gray-400 hover:text-oxblood hover:bg-gray-100 rounded transition-colors" title="Edit">
                                       <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(room.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                        {filteredRooms.length === 0 && (
                            <tr>
                               <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                   <div className="flex justify-center mb-4"><LayoutGrid className="h-10 w-10 text-gray-300" /></div>
                                   <p className="font-semibold text-gray-900 text-lg">No rooms found</p>
                                   <p className="mt-1 text-sm text-gray-500 mb-6">You don't have any rooms matching your criteria.</p>
                                   <button onClick={() => { setEditingRoom(null); setIsFormOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-oxblood text-white rounded-lg shadow-sm hover:bg-oxblood/90 text-sm font-medium">
                                      <Plus size={16} /> Add First Room
                                   </button>
                               </td>
                            </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>

      <AnimatePresence>
         {isDeleteModalOpen && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
               >
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                     animate={{ opacity: 1, scale: 1, y: 0 }} 
                     exit={{ opacity: 0, scale: 0.95, y: 10 }}
                     className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
                  >
                      <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                  <AlertCircle className="text-red-500" size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900">Archive Room</h3>
                                  <p className="text-sm text-gray-500 mt-1">This will hide the room from active inventory. It won't delete past reservations.</p>
                              </div>
                          </div>
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                          <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                              Cancel
                          </button>
                          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                              Archive Room
                          </button>
                      </div>
                  </motion.div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {isFormOpen && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setIsFormOpen(false)}
               />
               <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
               >
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                     <h3 className="font-bold text-lg text-gray-900">{editingRoom ? "Edit Room" : "Add New Room"}</h3>
                     <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                        <XCircle size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                     <form id="room-form" onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                              <input required name="name" defaultValue={editingRoom?.name} placeholder="e.g. Deluxe Ocean View" className="w-full border-gray-300 rounded-lg focus:border-oxblood focus:ring-oxblood sm:text-sm" />
                           </div>
                           <div className="col-span-2 sm:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <select name="category" defaultValue={editingRoom?.category || "Standard"} className="w-full border-gray-300 rounded-lg focus:border-oxblood focus:ring-oxblood sm:text-sm">
                                 <option>Standard</option>
                                 <option>Deluxe</option>
                                 <option>Suite</option>
                                 <option>Villa</option>
                                 <option>Penthouse</option>
                              </select>
                           </div>
                           <div className="col-span-2 sm:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
                              <div className="relative">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <span className="text-gray-500 sm:text-sm">$</span>
                                 </div>
                                 <input required name="price" defaultValue={editingRoom?.price} type="number" placeholder="0.00" className="w-full pl-7 border-gray-300 rounded-lg focus:border-oxblood focus:ring-oxblood sm:text-sm" />
                              </div>
                           </div>
                           <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Room Size</label>
                              <input required name="size" defaultValue={editingRoom?.size} placeholder="e.g. 45 sqm" className="w-full border-gray-300 rounded-lg focus:border-oxblood focus:ring-oxblood sm:text-sm" />
                           </div>
                           <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                              <input required name="image" defaultValue={editingRoom?.image} placeholder="https://..." className="w-full border-gray-300 rounded-lg focus:border-oxblood focus:ring-oxblood sm:text-sm" />
                           </div>
                           <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                              <textarea required name="features" defaultValue={editingRoom?.features?.join(", ")} rows={3} placeholder="Ocean View, King Bed, Minibar (comma separated)" className="w-full border-gray-300 rounded-lg focus:border-oxblood focus:ring-oxblood sm:text-sm custom-scrollbar" />
                              <p className="mt-1 text-xs text-gray-500">Separate multiple features with commas.</p>
                           </div>
                        </div>
                     </form>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                     <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        Cancel
                     </button>
                     <button type="submit" form="room-form" className="flex-1 py-2 bg-oxblood text-white rounded-lg text-sm font-medium hover:bg-oxblood/90 transition-colors shadow-sm">
                        {editingRoom ? "Update Room" : "Save Room"}
                     </button>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}
