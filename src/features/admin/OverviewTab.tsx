import { useMemo } from "react";
import { motion } from "motion/react";
import { Globe, Calendar, TrendingUp, Users, LogIn, LogOut, CheckCircle, Clock, AlertCircle, ArrowUpRight, BedDouble, Target, ArrowRight } from "lucide-react";
import { format, isSameDay, startOfDay } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "../../utils";

export function OverviewTab({ activeVisitors, activeBookings, totalRevenue, reservations, getDate, rooms, activityLogs, chartData, setActiveTab }: any) {
  const today = startOfDay(new Date());

  const { todaysCheckIns, todaysCheckOuts, pendingReservations, activeGuests } = useMemo(() => {
    let checkIns = 0;
    let checkOuts = 0;
    let pending = 0;
    let guests = 0;

    reservations.forEach((res: any) => {
      const checkInDate = startOfDay(getDate(res.checkIn));
      const checkOutDate = startOfDay(getDate(res.checkOut));
      
      if (isSameDay(checkInDate, today)) checkIns++;
      if (isSameDay(checkOutDate, today)) checkOuts++;
      if (res.status === "Pending") pending++;
      
      if (res.status === "Confirmed" && checkInDate <= today && checkOutDate >= today) {
         guests += (res.guests || 2);
      }
    });

    return { todaysCheckIns: checkIns, todaysCheckOuts: checkOuts, pendingReservations: pending, activeGuests: guests };
  }, [reservations, getDate, today]);

  const totalRooms = rooms?.length || 1;
  // Currently occupied rooms
  const occupiedRooms = useMemo(() => {
    let occupied = 0;
    reservations.forEach((res: any) => {
       if (res.status === "Confirmed") {
          const checkIn = startOfDay(getDate(res.checkIn));
          const checkOut = startOfDay(getDate(res.checkOut));
          if (checkIn <= today && checkOut > today) {
             occupied++;
          }
       }
    });
    return occupied;
  }, [reservations, getDate, today]);

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const availableRooms = totalRooms > occupiedRooms ? totalRooms - occupiedRooms : 0;

  const occupancyData = [
     { name: "Occupied", value: occupiedRooms },
     { name: "Available", value: availableRooms }
  ];
  const COLORS = ["#4A0404", "#f3f4f6"];

  return (
    <div className="space-y-6">
       {/* Primary KPIs */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between" whileHover={{ y: -2 }}>
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                   <Calendar size={20} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
             </div>
             <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Reservations</p>
                <h3 className="text-2xl font-bold text-gray-900">{reservations.length}</h3>
             </div>
          </motion.div>

          <motion.div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between" whileHover={{ y: -2 }}>
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                   <TrendingUp size={20} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span>
             </div>
             <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Revenue Summary</p>
                <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
             </div>
          </motion.div>

          <motion.div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between" whileHover={{ y: -2 }}>
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-oxblood/10 text-oxblood flex items-center justify-center">
                   <Users size={20} />
                </div>
             </div>
             <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Active Guests</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl font-bold text-gray-900">{activeGuests}</h3>
                   <span className="text-xs text-gray-400">currently on-site</span>
                </div>
             </div>
          </motion.div>

          <motion.div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between" whileHover={{ y: -2 }}>
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                   <Target size={20} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${occupancyRate > 80 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{occupancyRate}%</span>
             </div>
             <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Occupancy Rate</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                   <div className="bg-oxblood h-2 rounded-full" style={{ width: `${occupancyRate}%` }}></div>
                </div>
             </div>
          </motion.div>
       </div>

       {/* Secondary KPIs (Today's metrics) */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><LogIn size={16} /></div>
             <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Check-ins</p>
                <p className="text-lg font-bold text-gray-900">{todaysCheckIns}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><LogOut size={16} /></div>
             <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Check-outs</p>
                <p className="text-lg font-bold text-gray-900">{todaysCheckOuts}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center"><BedDouble size={16} /></div>
             <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Available Rooms</p>
                <p className="text-lg font-bold text-gray-900">{availableRooms}</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><AlertCircle size={16} /></div>
             <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-lg font-bold text-gray-900">{pendingReservations}</p>
             </div>
          </div>
       </div>

       {/* Charts & Graphs Row */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Revenue Trends</h3>
                <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-oxblood focus:border-oxblood">
                   <option>This Week</option>
                   <option>This Month</option>
                   <option>This Year</option>
                </select>
             </div>
             <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4A0404" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4A0404" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => formatCurrency(value)} dx={-10} width={80} />
                     <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#4A0404" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
             <h3 className="font-semibold text-gray-900 mb-6">Room Utilization</h3>
             <div className="flex-1 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                   <PieChart>
                      <Pie
                         data={occupancyData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={2}
                         dataKey="value"
                         stroke="none"
                      >
                         {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <RechartsTooltip 
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-bold text-gray-900">{occupancyRate}%</span>
                   <span className="text-xs text-gray-500">Occupied</span>
                </div>
             </div>
             <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-oxblood"></div>
                   <span className="text-sm text-gray-600">Occupied ({occupiedRooms})</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div>
                   <span className="text-sm text-gray-600">Available ({availableRooms})</span>
                </div>
             </div>
          </div>
       </div>

       {/* Bottom Row: Recent Activity & Quick Actions */}
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-semibold text-gray-900">Recent Reservations</h3>
               <button onClick={() => setActiveTab('reservations')} className="text-sm text-oxblood font-medium flex items-center gap-1 hover:underline">
                  View All <ArrowRight size={14} />
               </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-gray-50 text-gray-500">
                   <tr>
                     <th className="px-6 py-3 font-medium">Guest</th>
                     <th className="px-6 py-3 font-medium">Room</th>
                     <th className="px-6 py-3 font-medium">Dates</th>
                     <th className="px-6 py-3 font-medium">Total</th>
                     <th className="px-6 py-3 font-medium text-right">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {reservations.slice(0, 5).map((res: any) => (
                     <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4 font-medium text-gray-900">{res.userName || 'Guest User'}</td>
                       <td className="px-6 py-4 text-gray-600">{res.roomType}</td>
                       <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {res.checkIn ? format(getDate(res.checkIn), "MMM dd") : ""} - {res.checkOut ? format(getDate(res.checkOut), "MMM dd") : ""}
                       </td>
                       <td className="px-6 py-4 font-medium text-gray-900">${res.totalPrice?.toLocaleString()}</td>
                       <td className="px-6 py-4 text-right">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                           res.status === 'Confirmed' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                           res.status === 'Cancelled' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' : 
                           'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                         }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                               res.status === 'Confirmed' ? 'bg-green-500' :
                               res.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></span>
                            {res.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                   {reservations.length === 0 && (
                      <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent reservations found.</td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="space-y-6 flex flex-col">
             {/* Urgent Alerts / Live Pulse */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 border-t-4 border-t-oxblood">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   <h3 className="font-semibold text-gray-900">Live Pulse</h3>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                         <AlertCircle size={16} />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-gray-900">{pendingReservations} Pending Actions</p>
                         <p className="text-xs text-gray-500 mt-1">Reservations require approval or confirmation today.</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                         <Globe size={16} />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-gray-900">{activeVisitors.length} Active Visitors</p>
                         <p className="text-xs text-gray-500 mt-1">Users currently browsing the public site.</p>
                      </div>
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                   <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setActiveTab('rooms')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black gap-2">
                         <BedDouble size={18} />
                         <span className="text-xs font-medium">Manage Rooms</span>
                      </button>
                      <button onClick={() => setActiveTab('reservations')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black gap-2">
                         <Calendar size={18} />
                         <span className="text-xs font-medium">Bookings</span>
                      </button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
