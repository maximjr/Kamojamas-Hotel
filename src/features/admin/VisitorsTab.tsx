import { motion } from "motion/react";

export function VisitorsTab({ activeVisitors }: any) {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-serif text-oxblood mb-2 flex items-center gap-3">
         Live Visitors Panel
         <span className="relative flex h-3 w-3">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
         </span>
      </h1>
      <p className="text-gray-500 mb-8">Real-time tracking of users currently browsing the website.</p>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-serif text-oxblood font-medium">Active Sessions</h3>
            <div className="text-xs font-medium bg-oxblood text-white px-3 py-1 rounded-full">
               {activeVisitors.length} Online Now
            </div>
         </div>
         <div className="overflow-x-auto h-[600px] overflow-y-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-10 w-full">
                  <tr>
                     <th className="px-6 py-4 font-medium">User Name</th>
                     <th className="px-6 py-4 font-medium">Page</th>
                     <th className="px-6 py-4 font-medium">Time On Page</th>
                     <th className="px-6 py-4 font-medium">Device</th>
                     <th className="px-6 py-4 font-medium">Country</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {activeVisitors.length === 0 ? (
                     <tr><td colSpan={5} className="p-8 text-center text-gray-400">No active visitors currently.</td></tr>
                  ) : activeVisitors.map((v: any) => (
                     <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-oxblood flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           {v.userName}
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-mono text-xs">{v.page}</td>
                        <td className="px-6 py-4 text-gray-500">
                           {v.entryTime ? `${Math.floor((Date.now() - v.entryTime) / 1000)}s` : 'Just now'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{v.device}</td>
                        <td className="px-6 py-4 text-gray-600">{v.country}</td>
                     </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
