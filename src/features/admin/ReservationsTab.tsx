import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { CheckCircle, XCircle, Search, Filter, Download, MoreVertical, Calendar as CalendarIcon, User, Bed as BedIcon, AlignLeft, LayoutGrid, Clock, X, ChevronRight } from "lucide-react";
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ReservationsTab({ reservations, getDate, handleStatusUpdate }: any) {
  const parentRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  const filteredReservations = useMemo(() => {
    return reservations.filter((res: any) => {
      const matchSearch = 
        res.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        res.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.id.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchStatus = statusFilter === "All" || res.status === statusFilter;
      
      let matchDate = true;
      if (dateFilter) {
         try {
             // simplified date matching
             const d = parseISO(dateFilter);
             const start = startOfDay(d);
             const end = endOfDay(d);
             const checkIn = getDate(res.checkIn);
             const checkOut = getDate(res.checkOut);
             if (checkIn && checkOut) {
                 matchDate = isWithinInterval(startOfDay(checkIn), { start, end }) || 
                             isWithinInterval(startOfDay(checkOut), { start, end }) ||
                             (startOfDay(checkIn) <= start && startOfDay(checkOut) >= end);
             }
         } catch(e) {
         }
      }
      
      return matchSearch && matchStatus && matchDate;
    });
  }, [reservations, searchTerm, statusFilter, dateFilter, getDate]);

  const virtualizer = useVirtualizer({
    count: filteredReservations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // row height approximation
    overscan: 10,
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.checked) {
        setSelectedIds(new Set(filteredReservations.map((r: any) => r.id)));
     } else {
        setSelectedIds(new Set());
     }
  };

  const handleSelectRow = (id: string) => {
     const newSet = new Set(selectedIds);
     if (newSet.has(id)) {
        newSet.delete(id);
     } else {
        newSet.add(id);
     }
     setSelectedIds(newSet);
  };

  const handleExport = () => {
      const headers = ["ID", "Guest", "Room", "Check In", "Check Out", "Amount", "Status"];
      const csvData = filteredReservations.map((r: any) => [
          r.id,
          r.userName,
          r.roomType,
          r.checkIn ? format(getDate(r.checkIn), "yyyy-MM-dd") : "",
          r.checkOut ? format(getDate(r.checkOut), "yyyy-MM-dd") : "",
          r.totalPrice,
          r.status
      ]);
      const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reservations_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleBulkAction = (actionStatus: string) => {
      selectedIds.forEach(id => {
         handleStatusUpdate(id, actionStatus);
      });
      setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)] animate-in fade-in duration-500">
      <div className="flex-none mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
           <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reservation Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage bookings, view schedules, and process updates.</p>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                 <Download size={16} /> Export CSV
              </button>
              <div className="bg-gray-100 p-1 rounded-lg flex items-center border border-gray-200">
                 <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`} title="List View"><AlignLeft size={16} /></button>
                 <button onClick={() => setViewMode("timeline")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`} title="Timeline View"><CalendarIcon size={16} /></button>
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
                    placeholder="Search guest, room, or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood focus:bg-white transition-colors"
                 />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
                 <div className="relative shrink-0">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select 
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value)}
                       className="pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood focus:bg-white appearance-none h-[38px]"
                    >
                       <option value="All">All Statuses</option>
                       <option value="Pending">Pending</option>
                       <option value="Confirmed">Confirmed</option>
                       <option value="Checked In">Checked In</option>
                       <option value="Checked Out">Checked Out</option>
                       <option value="Cancelled">Cancelled</option>
                    </select>
                 </div>
                 <div className="relative shrink-0">
                    <input 
                       type="date" 
                       value={dateFilter}
                       onChange={(e) => setDateFilter(e.target.value)}
                       className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood focus:bg-white h-[38px] text-gray-600"
                    />
                 </div>
              </div>
           </div>
           
           {selectedIds.size > 0 && (
             <div className="flex items-center gap-2 bg-oxblood/5 px-4 py-2 rounded-lg border border-oxblood/10 w-full md:w-auto shrink-0">
                <span className="text-sm font-medium text-oxblood">{selectedIds.size} selected</span>
                <div className="h-4 w-px bg-oxblood/20 mx-2"></div>
                <button onClick={() => handleBulkAction("Confirmed")} className="text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 px-2 py-1 rounded transition-colors">Confirm</button>
                <button onClick={() => handleBulkAction("Cancelled")} className="text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition-colors">Cancel</button>
             </div>
           )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0 relative">
         {viewMode === 'list' ? (
             <div className="overflow-x-auto flex-1 relative" ref={parentRef}>
                <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                   <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-20 w-full">
                      <tr>
                         <th className="px-4 py-3 w-12 text-center">
                             <input type="checkbox" checked={selectedIds.size === filteredReservations.length && filteredReservations.length > 0} onChange={handleSelectAll} className="rounded text-oxblood focus:ring-oxblood border-gray-300" />
                         </th>
                         <th className="px-4 py-3 font-medium">Guest</th>
                         <th className="px-4 py-3 font-medium">Room</th>
                         <th className="px-4 py-3 font-medium">Dates</th>
                         <th className="px-4 py-3 font-medium">Total</th>
                         <th className="px-4 py-3 font-medium">Status</th>
                         <th className="px-4 py-3 w-12 text-center"></th>
                      </tr>
                   </thead>
                   <tbody>
                      {filteredReservations.length === 0 ? (
                         <tr>
                            <td colSpan={7} className="px-6 py-16 text-center text-gray-500 flex flex-col items-center justify-center">
                               <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center mb-4">
                                  <Search size={24} className="text-gray-400" />
                               </div>
                               <p className="font-semibold text-gray-900 text-lg">No reservations found</p>
                               <p className="text-sm mt-1 mb-6 text-gray-500 max-w-sm text-center">We couldn't find any reservations matching your current filters or search term.</p>
                               <button onClick={() => {setSearchTerm(""); setStatusFilter("All"); setDateFilter("")}} className="text-sm font-medium text-oxblood bg-oxblood/10 px-4 py-2 rounded-lg hover:bg-oxblood/20 transition-colors">
                                  Clear Filters
                               </button>
                            </td>
                         </tr>
                      ) : (
                      <tr>
                         <td colSpan={7} className="p-0 align-top">
                            <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                               {virtualizer.getVirtualItems().map((virtualRow) => {
                                  const res = filteredReservations[virtualRow.index];
                                  const isSelected = selectedIds.has(res.id);
                                  return (
                                     <div key={res.id} onClick={(e) => {
                                         if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                                             setSelectedReservation(res);
                                         }
                                     }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }} className={`flex items-center border-b border-gray-50 transition-colors cursor-pointer group ${isSelected ? 'bg-oxblood/5 hover:bg-oxblood/10' : 'bg-white hover:bg-gray-50'}`}>
                                        <div className="px-4 py-4 w-12 shrink-0 text-center flex items-center justify-center">
                                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(res.id)} onClick={(e) => e.stopPropagation()} className="rounded text-oxblood focus:ring-oxblood border-gray-300" />
                                        </div>
                                        <div className="px-4 py-4 w-64 shrink-0 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs">
                                                {res.userName?.charAt(0) || 'G'}
                                            </div>
                                            <div className="truncate">
                                               <p className="font-semibold text-gray-900 truncate">{res.userName}</p>
                                               <p className="text-xs text-gray-500 font-mono mt-0.5">{res.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-4 w-48 shrink-0 flex items-center gap-2">
                                            <BedIcon size={14} className="text-gray-400" />
                                            <span className="text-gray-700 truncate">{res.roomType}</span>
                                        </div>
                                        <div className="px-4 py-4 w-56 shrink-0 flex items-center gap-2 text-gray-600">
                                            <CalendarIcon size={14} className="text-gray-400" />
                                            <span className="text-sm">
                                                {res.checkIn ? format(getDate(res.checkIn), "MMM dd, yy") : ""} - {res.checkOut ? format(getDate(res.checkOut), "MMM dd, yy") : ""}
                                            </span>
                                        </div>
                                        <div className="px-4 py-4 font-medium text-gray-900 w-32 shrink-0">${res.totalPrice?.toLocaleString()}</div>
                                        <div className="px-4 py-4 w-40 shrink-0">
                                           <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                                              res.status === 'Confirmed' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                                              res.status === 'Cancelled' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' :
                                              res.status === 'Checked In' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' :
                                              res.status === 'Checked Out' ? 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20' :
                                              'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                                           }`}>
                                              <span className={`w-1.5 h-1.5 rounded-full ${
                                                res.status === 'Confirmed' ? 'bg-green-500' :
                                                res.status === 'Cancelled' ? 'bg-red-500' :
                                                res.status === 'Checked In' ? 'bg-blue-500' :
                                                res.status === 'Checked Out' ? 'bg-gray-500' :
                                                'bg-yellow-500'
                                              }`}></span>
                                              {res.status}
                                           </span>
                                        </div>
                                        <div className="px-4 py-4 w-12 shrink-0 flex justify-end">
                                            <button className="p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 hover:text-black rounded-md">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                     </div>
                                  )
                               })}
                            </div>
                         </td>
                      </tr>
                      )}
                   </tbody>
                </table>
             </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-50/50">
               <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-oxblood">
                  <Clock size={28} />
               </div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservation Timeline</h3>
               <p className="text-gray-500 max-w-md mx-auto text-sm">
                  The visual timeline planner is currently under construction. Please use the list view for managing current reservations.
               </p>
               <button onClick={() => setViewMode('list')} className="mt-6 px-4 py-2 bg-oxblood text-white rounded-lg text-sm font-medium hover:bg-oxblood/90 transition-colors">
                  Return to List View
               </button>
            </div>
         )}
      </div>

      {/* Reservation Details Drawer */}
      <AnimatePresence>
         {selectedReservation && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setSelectedReservation(null)}
               />
               <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
               >
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                     <div>
                        <h3 className="font-semibold text-gray-900">Reservation Details</h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedReservation.id}</p>
                     </div>
                     <button onClick={() => setSelectedReservation(null)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     {/* Status Banner */}
                     <div className={`p-4 rounded-xl flex items-center justify-between ${
                        selectedReservation.status === 'Confirmed' ? 'bg-green-50 border border-green-100' :
                        selectedReservation.status === 'Cancelled' ? 'bg-red-50 border border-red-100' :
                        selectedReservation.status === 'Checked In' ? 'bg-blue-50 border border-blue-100' :
                        selectedReservation.status === 'Checked Out' ? 'bg-gray-100 border border-gray-200' :
                        'bg-yellow-50 border border-yellow-100'
                     }`}>
                        <div>
                           <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Status</p>
                           <p className="text-lg font-bold text-gray-900">{selectedReservation.status}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                           <select 
                              value={selectedReservation.status}
                              onChange={(e) => {
                                 handleStatusUpdate(selectedReservation.id, e.target.value);
                                 setSelectedReservation({...selectedReservation, status: e.target.value});
                              }}
                              className="text-sm border-gray-300 rounded-lg py-1.5 focus:ring-oxblood focus:border-oxblood shadow-sm"
                           >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Checked In">Checked In</option>
                              <option value="Checked Out">Checked Out</option>
                              <option value="Cancelled">Cancelled</option>
                           </select>
                        </div>
                     </div>

                     {/* Guest Info */}
                     <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                           <User size={16} className="text-gray-400" /> Guest Information
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4">
                           <div>
                              <p className="text-sm font-medium text-gray-900">{selectedReservation.userName}</p>
                              <p className="text-xs text-gray-500">Full Name</p>
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-900">{selectedReservation.guests || 2}</p>
                              <p className="text-xs text-gray-500">Number of Guests</p>
                           </div>
                        </div>
                     </div>

                     {/* Stay Details */}
                     <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                           <BedIcon size={16} className="text-gray-400" /> Stay Details
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                           <div>
                              <p className="text-sm font-medium text-gray-900">{selectedReservation.roomType}</p>
                              <p className="text-xs text-gray-500">Room Name</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                              <div>
                                 <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                     {selectedReservation.checkIn ? format(getDate(selectedReservation.checkIn), "EEE, MMM d, yyyy") : "N/A"}
                                 </p>
                                 <p className="text-xs text-gray-500">Check-in (3:00 PM)</p>
                              </div>
                              <div>
                                 <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                     {selectedReservation.checkOut ? format(getDate(selectedReservation.checkOut), "EEE, MMM d, yyyy") : "N/A"}
                                 </p>
                                 <p className="text-xs text-gray-500">Check-out (11:00 AM)</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Billing */}
                     <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                           Payment Details
                        </h4>
                        <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl shadow-inner">
                           <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                              <p className="text-2xl font-bold">${selectedReservation.totalPrice?.toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">Paid Online</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                     <button className="flex-1 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        Print Invoice
                     </button>
                     <button className="flex-1 py-2.5 bg-oxblood text-white rounded-lg text-sm font-medium hover:bg-oxblood/90 transition-colors shadow-sm">
                        Message Guest
                     </button>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}

