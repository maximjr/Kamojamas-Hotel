import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { 
  Search, Filter, Download, Activity as ActivityIcon, User, Calendar, Shield, Settings, 
  ChevronRight, Laptop, FileText, UserPlus, FileEdit, LogOut, CheckCircle2,
  Clock
} from "lucide-react";

export function ActivityTab({ activityLogs, getDate }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const enrichedLogs = useMemo(() => {
    return activityLogs.map((log: any) => {
      let category = "System";
      let icon = ActivityIcon;
      let color = "text-gray-500 bg-gray-100 border-gray-200";

      const type = (log.activityType || log.action || "").toUpperCase();

      if (type.includes("LOGIN") || type.includes("LOGOUT") || type.includes("VIEW")) {
         if (type.includes("ADMIN") || type.includes("DASHBOARD")) {
            category = "Admin";
            icon = Shield;
            color = "text-oxblood bg-oxblood/10 border-oxblood/20";
         } else {
            category = "Users";
            icon = User;
            color = "text-blue-600 bg-blue-50 border-blue-200";
         }
      } else if (type.includes("ROLE") || type.includes("STAFF")) {
         category = "Admin";
         icon = Shield;
         color = "text-oxblood bg-oxblood/10 border-oxblood/20";
      } else if (type.includes("RESERVATION") || type.includes("BOOKING") || type.includes("STATUS")) {
         category = "Reservations";
         icon = Calendar;
         color = "text-green-600 bg-green-50 border-green-200";
      } else if (type.includes("ROOM")) {
         category = "System";
         icon = Settings;
         color = "text-orange-600 bg-orange-50 border-orange-200";
      } else if (type.includes("SIGN_UP") || type.includes("REGISTER")) {
         category = "Users";
         icon = UserPlus;
         color = "text-indigo-600 bg-indigo-50 border-indigo-200";
      }

      return {
         ...log,
         category,
         icon,
         color,
         displayTitle: type.replace(/_/g, " "),
      };
    }).filter((log: any) => {
        const matchSearch = 
           (log.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
           (log.displayTitle).toLowerCase().includes(searchTerm.toLowerCase()) ||
           (log.pageVisited || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
           (log.targetRole || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterType === "All" || log.category === filterType;
        return matchSearch && matchFilter;
    });
  }, [activityLogs, searchTerm, filterType]);

  const handleExport = () => {
     const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,User,Action,Details,Category\n"
        + enrichedLogs.map((l: any) => {
           let details = l.pageVisited || l.targetRole || "";
           if (l.targetUserId) details += ` (Target ID: ${l.targetUserId})`;
           return `"${l.timestamp ? format(getDate(l.timestamp), "MMM dd, yyyy HH:mm:ss") : ""}","${l.userName || l.userId || 'System'}","${l.displayTitle}","${details}","${l.category}"`;
        }).join("\n");
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)] animate-in fade-in duration-500">
      <div className="flex-none mb-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Center & Audit Trail</h1>
               <p className="text-sm text-gray-500 mt-1">Centralized monitoring of all system reservations, interactions, and security events.</p>
            </div>
            <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
               <Download size={16} /> Export Audit Log
            </button>
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                     type="text" 
                     placeholder="Search events, users, or actions..." 
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
                        <option value="All">All Activities</option>
                        <option value="Reservations">Reservations</option>
                        <option value="Admin">Admin & Security</option>
                        <option value="Users">User Actions</option>
                        <option value="System">System Events</option>
                     </select>
                  </div>
               </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-medium">
               <Clock size={14} /> Tracking {enrichedLogs.length} events
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0 relative">
         <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
               <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                  <tr>
                     <th className="px-6 py-4 w-48">Timestamp</th>
                     <th className="px-6 py-4">Action / Event</th>
                     <th className="px-6 py-4">Actor</th>
                     <th className="px-6 py-4">Details / Target</th>
                     <th className="px-6 py-4 text-right">Category</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {enrichedLogs.map((log: any) => {
                     const Icon = log.icon;
                     return (
                        <motion.tr key={log.id} initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                              {log.timestamp ? format(getDate(log.timestamp), "MMM dd, yyyy HH:mm:ss") : "Just now"}
                           </td>
                           <td className="px-6 py-4 font-semibold text-gray-900 border-l-[3px] border-transparent">
                              <div className="flex items-center gap-3">
                                 <div className={`p-1.5 rounded-lg border ${log.color} shadow-sm shrink-0`}>
                                    <Icon size={14} />
                                 </div>
                                 <span className="capitalize">{log.displayTitle.toLowerCase()}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                                    {(log.userName || log.userId || "S")?.charAt(0)}
                                 </div>
                                 <span className="font-medium text-gray-700">{log.userName || "System User"}</span>
                              </div>
                              {log.userId && <p className="text-[10px] text-gray-400 font-mono mt-0.5 ml-8">{log.userId.slice(0,12)}...</p>}
                           </td>
                           <td className="px-6 py-4">
                              {log.pageVisited ? (
                                 <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit text-xs border border-blue-100">
                                    <Laptop size={12}/> {log.pageVisited}
                                 </div>
                              ) : log.targetRole ? (
                                 <div className="flex flex-col gap-1">
                                    <span className="font-mono text-[10px] text-gray-500">Target ID: {log.targetUserId}</span>
                                    <span className="text-xs font-semibold text-oxblood bg-oxblood/10 px-2 py-0.5 rounded w-fit">Role ➔ {log.targetRole}</span>
                                 </div>
                              ) : log.activityType === "UPDATE_STATUS" && log.reservationId ? (
                                 <div className="flex items-center gap-1.5 text-gray-600 text-xs font-mono">
                                    <FileText size={12} /> Ref: {log.reservationId.slice(0,8)} ➔ <span className="font-bold text-gray-900">{log.status}</span>
                                 </div>
                              ) : (
                                 <span className="text-gray-400 italic text-xs">No additional details</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                                 {log.category}
                              </span>
                           </td>
                        </motion.tr>
                     );
                  })}
                  {enrichedLogs.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                           <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-4">
                              <ActivityIcon className="h-6 w-6 text-gray-400" />
                           </div>
                           <p className="font-semibold text-gray-900 text-lg">No activity logs found</p>
                           <p className="text-sm mt-1 mb-6 text-gray-500 max-w-sm mx-auto text-center">We couldn't find any activities matching your current filters or search term.</p>
                           <button onClick={() => {setSearchTerm(""); setFilterType("All")}} className="text-sm font-medium text-oxblood bg-oxblood/10 px-4 py-2 rounded-lg hover:bg-oxblood/20 transition-colors">
                              Clear Filters
                           </button>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
