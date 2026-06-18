import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { Search, Shield, Activity as ActivityIcon, UserPlus, X, Edit, Lock, CheckCircle2, User, Key, UserCheck, Check, Info } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ROLES = [
  { id: "SUPER_ADMIN", label: "Super Admin", color: "bg-red-100 text-red-800 border-red-200" },
  { id: "ADMIN", label: "Admin", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { id: "MANAGER", label: "Manager", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { id: "RECEPTIONIST", label: "Receptionist", color: "bg-green-100 text-green-800 border-green-200" },
  { id: "ACCOUNTANT", label: "Accountant", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "STAFF", label: "Staff", color: "bg-gray-100 text-gray-800 border-gray-200" },
];

const PERMISSIONS = [
  { module: "Dashboard", actions: ["View Dashboard"] },
  { module: "Reservations", actions: ["View", "Create", "Edit/Cancel"] },
  { module: "Rooms", actions: ["View", "Manage Inventory"] },
  { module: "Guest CRM", actions: ["View Profiles", "Edit Notes", "Manage VIP"] },
  { module: "Financials", actions: ["View Revenue", "Export Reports"] },
  { module: "Staff", actions: ["View Staff", "Manage Roles"] },
  { module: "System Logs", actions: ["View Activity Logs"] },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "SUPER_ADMIN": ["View Dashboard", "View", "Create", "Edit/Cancel", "View Profiles", "Edit Notes", "Manage VIP", "View Revenue", "Export Reports", "View Staff", "Manage Roles", "View Activity Logs", "View", "Manage Inventory"],
  "ADMIN": ["View Dashboard", "View", "Create", "Edit/Cancel", "View Profiles", "Edit Notes", "Manage VIP", "View Revenue", "Export Reports", "View Staff", "Manage Roles", "View Activity Logs", "View", "Manage Inventory"],
  "MANAGER": ["View Dashboard", "View", "Create", "Edit/Cancel", "View Profiles", "Edit Notes", "Manage VIP", "View Revenue", "Export Reports", "View Staff", "View", "Manage Inventory"],
  "RECEPTIONIST": ["View Dashboard", "View", "Create", "Edit/Cancel", "View Profiles", "Edit Notes", "View"],
  "ACCOUNTANT": ["View Dashboard", "View Revenue", "Export Reports", "View Profiles"],
  "STAFF": ["View Dashboard", "View Profiles"],
};

export function StaffTab({ users, activityLogs, getDate }: { users: any[], activityLogs: any[], getDate: any }) {
  const { userData } = useAuth();
  const [activeView, setActiveView] = useState<"directory" | "permissions">("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  
  const staffMembers = useMemo(() => {
     return users.filter(u => u.role && u.role !== 'USER').sort((a,b) => {
        return ROLES.findIndex(r => r.id === a.role) - ROLES.findIndex(r => r.id === b.role);
     });
  }, [users]);
  
  const filteredStaff = staffMembers.filter(s => 
     s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageRoles = userData?.role === "SUPER_ADMIN" || userData?.role === "ADMIN";

  const handleRoleChange = async (userId: string, newRole: string) => {
     if (!canManageRoles) return;
     try {
        await updateDoc(doc(db, "users", userId), { role: newRole });
        // Log activity
        await addDoc(collection(db, "userActivityLogs"), {
            userId: userData?.uid,
            userName: userData?.name,
            action: "UPDATE_ROLE",
            targetUserId: userId,
            targetRole: newRole,
            timestamp: serverTimestamp()
        });
        setIsAssigningRole(false);
     } catch (err) {
        console.error(err);
     }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)] animate-in fade-in duration-500">
      <div className="flex-none mb-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff & Roles</h1>
               <p className="text-sm text-gray-500 mt-1">Manage personnel, assign roles, and configure system permissions.</p>
            </div>
            {canManageRoles && (
              <button 
                onClick={() => setActiveView("permissions")}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${activeView === 'permissions' ? 'bg-oxblood text-white border-oxblood' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <Shield size={16} /> Permission Matrix
              </button>
            )}
         </div>

         {activeView === "directory" && (
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search staff members..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-oxblood focus:border-oxblood focus:bg-white transition-colors"
                 />
              </div>
           </div>
         )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0 relative">
        {activeView === "directory" ? (
         <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
               <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                  <tr>
                     <th className="px-6 py-4">Staff Member</th>
                     <th className="px-6 py-4">System Role</th>
                     <th className="px-6 py-4">Account Status</th>
                     <th className="px-6 py-4">Joined Date</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map((staff: any) => {
                     const roleDef = ROLES.find(r => r.id === staff.role) || ROLES[ROLES.length-1];
                     
                     return (
                     <tr key={staff.id} onClick={() => setSelectedStaff(staff)} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-oxblood text-white flex items-center justify-center font-bold text-sm shadow-sm border border-oxblood/20">
                                 {staff.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                 <p className="font-semibold text-gray-900">{staff.name}</p>
                                 <p className="text-xs text-gray-500">{staff.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${roleDef.color}`}>
                              <Shield size={12} /> {roleDef.label}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-gray-700 font-medium text-xs">Active</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                           {staff.createdAt ? format(getDate(staff.createdAt), "MMM dd, yyyy") : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                           {canManageRoles ? (
                             <button 
                               onClick={(e) => { e.stopPropagation(); setSelectedStaff(staff); setIsAssigningRole(true); }}
                               className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors inline-flex items-center gap-1.5"
                             >
                                <Lock size={12} /> Manage Access
                             </button>
                           ) : (
                             <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-oxblood hover:bg-oxblood/5 transition-colors border border-transparent group-hover:border-oxblood/20">
                                View Profile
                             </button>
                           )}
                        </td>
                     </tr>
                  )})}
               </tbody>
            </table>
         </div>
         ) : (
           <div className="flex-1 overflow-auto custom-scrollbar p-6">
              <div className="mb-6 flex items-center gap-2 text-oxblood bg-oxblood/5 p-4 rounded-xl border border-oxblood/10">
                 <Info size={20} />
                 <p className="text-sm font-medium">This matrix outlines the baseline capabilities for each role. Only Super Admins and Admins can alter roles.</p>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                       <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                             <th className="px-6 py-4 font-semibold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-10 w-48">Feature Module</th>
                             {ROLES.map(role => (
                                <th key={role.id} className="px-4 py-4 font-semibold text-center border-r border-gray-200">
                                   <div className={`mx-auto inline-flex items-center px-2 py-0.5 rounded text-xs border ${role.color}`}>
                                      {role.label}
                                   </div>
                                </th>
                             ))}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 bg-white">
                          {PERMISSIONS.map(mod => (
                             <React.Fragment key={mod.module}>
                                <tr>
                                   <td colSpan={ROLES.length + 1} className="px-6 py-2 bg-gray-100/50 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0">
                                      {mod.module}
                                   </td>
                                </tr>
                                {mod.actions.map(action => (
                                   <tr key={action} className="hover:bg-gray-50/30">
                                      <td className="px-6 py-3 text-gray-700 font-medium border-r border-gray-100 sticky left-0 bg-white shadow-[1px_0_0_0_#f3f4f6]">
                                         {action}
                                      </td>
                                      {ROLES.map(role => {
                                         const hasPerm = ROLE_PERMISSIONS[role.id]?.includes(action);
                                         return (
                                            <td key={role.id} className="px-4 py-3 text-center border-r border-gray-100">
                                               {hasPerm ? (
                                                  <Check className="mx-auto text-green-500" size={16} />
                                               ) : (
                                                  <span className="text-gray-300">-</span>
                                               )}
                                            </td>
                                         )
                                      })}
                                   </tr>
                                ))}
                             </React.Fragment>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
              <div className="mt-8 flex justify-end">
                 <button onClick={() => setActiveView("directory")} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Back to Directory
                 </button>
              </div>
           </div>
         )}
      </div>

      {/* Staff Profile / Role Drawer */}
      <AnimatePresence>
         {selectedStaff && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setSelectedStaff(null)}
               />
               <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
               >
                  <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-oxblood text-white flex items-center justify-center font-bold text-xl shadow-sm border-2 border-white ring-2 ring-oxblood/10">
                           {selectedStaff.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                           <h3 className="font-bold text-xl text-gray-900">{selectedStaff.name}</h3>
                           <p className="text-sm text-gray-500">{selectedStaff.email}</p>
                           <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${ROLES.find(r => r.id === selectedStaff.role)?.color || ROLES[ROLES.length-1].color}`}>
                                 {selectedStaff.role}
                              </span>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => { setSelectedStaff(null); setIsAssigningRole(false); }} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar space-y-8">

                     {isAssigningRole ? (
                        <div className="space-y-4 animate-in fade-in">
                           <h4 className="font-semibold text-gray-900 flex items-center gap-2"><Lock size={16} /> Assign System Role</h4>
                           <p className="text-xs text-gray-500 mb-4">Select the appropriate access level for this staff member based on the permission matrix.</p>
                           
                           <div className="space-y-3">
                              {ROLES.map(role => {
                                 const isSelected = selectedStaff.role === role.id;
                                 return (
                                    <button 
                                       key={role.id}
                                       onClick={() => handleRoleChange(selectedStaff.id, role.id)}
                                       className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'border-oxblood bg-oxblood/5 ring-1 ring-oxblood' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                    >
                                       <div>
                                          <p className="font-semibold text-gray-900">{role.label}</p>
                                          <p className="text-xs text-gray-500 mt-0.5">Overrides current system capabilities.</p>
                                       </div>
                                       {isSelected && <CheckCircle2 className="text-oxblood" size={20} />}
                                    </button>
                                 )
                              })}
                           </div>

                           <div className="mt-6">
                              <button onClick={() => setIsAssigningRole(false)} className="w-full py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                 Cancel
                              </button>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-8 animate-in fade-in">
                           {/* Activity Preview section could go here */}
                           <div>
                              <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                 <ActivityIcon size={16} className="text-gray-400" /> Recent Activity Log
                              </h4>
                              <div className="space-y-3">
                                 {activityLogs
                                    ?.filter(log => log.userId === selectedStaff.id)
                                    .slice(0,5)
                                    .map(log => (
                                       <div key={log.id} className="text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                                          <p className="font-medium text-gray-800">{log.activityType}</p>
                                          <p className="text-xs text-gray-400 mt-1">{log.timestamp ? format(getDate(log.timestamp), "MMM dd h:mm a") : 'Just now'}</p>
                                       </div>
                                    ))}
                                 {!activityLogs?.filter(log => log.userId === selectedStaff.id).length && (
                                    <p className="text-sm text-gray-500 italic px-2">No recent activity detected.</p>
                                 )}
                              </div>
                           </div>

                           {canManageRoles && (
                              <button onClick={() => setIsAssigningRole(true)} className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                                 <Lock size={16} /> Manage Role & Access
                              </button>
                           )}
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
