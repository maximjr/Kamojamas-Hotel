import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, CalendarDays, Bed, DollarSign, Activity as ActivityIcon } from 'lucide-react';
import { format, subDays, differenceInDays } from 'date-fns';
import { formatCurrency } from '../../utils';

const COLORS = ['#4A0404', '#D4AF37', '#1F2937', '#9CA3AF', '#F3F4F6'];

export function AnalyticsTab({ chartData, reservations }: any) {

  // Process data for charts
  const analytics = useMemo(() => {
    const today = new Date();
    
    // Revenue & Bookings Trend (Last 7 Days)
    const trendData = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(today, 6 - i);
        return {
           date: d,
           name: format(d, 'EEE'),
           revenue: 0,
           bookings: 0,
           occupancy: Math.floor(Math.random() * 40) + 40 // Simulated occupancy %
        };
    });

    const roomUtilization: Record<string, number> = {};
    let newGuests = 0;
    let returningGuests = 0;

    // Track unique guests for retention
    const guestVisits: Record<string, number> = {};

    reservations.forEach((res: any) => {
        // Room Utilization
        const rt = res.roomType ? res.roomType.replace('Suite', '').trim() : 'Unknown';
        roomUtilization[rt] = (roomUtilization[rt] || 0) + 1;

        // Guest Retention
        if (res.userId) {
            guestVisits[res.userId] = (guestVisits[res.userId] || 0) + 1;
        } else if (res.userEmail) {
            guestVisits[res.userEmail] = (guestVisits[res.userEmail] || 0) + 1;
        }

        if (res.createdAt) {
            const created = res.createdAt.toDate ? res.createdAt.toDate() : new Date(res.createdAt);
            const dayDiff = differenceInDays(today, created);
            if (dayDiff >= 0 && dayDiff < 7) {
                const index = 6 - dayDiff;
                if (trendData[index]) {
                    trendData[index].revenue += Number(res.totalPrice) || 0;
                    trendData[index].bookings += 1;
                }
            }
        }
    });

    // We can merge with passed chartData if reservations are empty for those days
    trendData.forEach((td, i) => {
        if (td.revenue === 0 && chartData[i]) {
            td.revenue = chartData[i].revenue;
            td.bookings = Math.floor(chartData[i].revenue / 500); 
        }
    });

    Object.values(guestVisits).forEach(visits => {
        if (visits > 1) returningGuests++;
        else newGuests++;
    });
    
    if (newGuests === 0 && returningGuests === 0) {
        newGuests = 75;
        returningGuests = 25;
    }

    const roomData = Object.entries(roomUtilization).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    
    const retentionData = [
       { name: 'New Guests', value: newGuests },
       { name: 'Returning Guests', value: returningGuests }
    ];

    return { trendData, roomData: roomData.length ? roomData : [{name: 'Standard', value: 10}, {name: 'Deluxe', value: 5}], retentionData };
  }, [reservations, chartData]);

  const { trendData, roomData, retentionData } = analytics;

  const totalRevenue = trendData.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = trendData.reduce((sum, d) => sum + d.bookings, 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Reporting</h1>
            <p className="text-sm text-gray-500 mt-1">High-level insights and performance metrics.</p>
         </div>
         <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 shadow-sm w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time Systems Active
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><DollarSign size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">7D Revenue</span></div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-green-600 flex items-center gap-1 font-medium"><TrendingUp size={12}/> +12% vs last week</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><CalendarDays size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">7D Bookings</span></div>
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <div className="text-xs text-green-600 flex items-center gap-1 font-medium"><TrendingUp size={12}/> +5% vs last week</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><ActivityIcon size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Avg Occupancy</span></div>
            <div className="text-2xl font-bold text-gray-900">76%</div>
            <div className="text-xs text-oxblood flex items-center gap-1 font-medium"><TrendingUp size={12}/> High Demand</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><Users size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Retention</span></div>
            <div className="text-2xl font-bold text-gray-900">{Math.round((retentionData[1].value / (retentionData[0].value + retentionData[1].value)) * 100) || 0}%</div>
            <div className="text-xs text-green-600 flex items-center gap-1 font-medium"><TrendingUp size={12}/> Steady growth</div>
         </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-6">Revenue & Booking Trends</h3>
            <div className="flex-1 w-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorRevenueExec" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#4A0404" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#4A0404" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                   <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => formatCurrency(value)} width={80} />
                   <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <Tooltip 
                      contentStyle={{backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                      itemStyle={{color: '#fff', fontWeight: 'bold'}}
                   />
                   <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                   <Area yAxisId="left" type="monotone" name="Revenue" dataKey="revenue" stroke="#4A0404" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueExec)" />
                   <Line yAxisId="right" type="monotone" name="Bookings" dataKey="bookings" stroke="#D4AF37" strokeWidth={3} dot={{r: 4, fill: '#D4AF37'}} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-6">Guest Retention Ratio</h3>
            <div className="flex-1 w-full min-h-[300px] flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={retentionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                     >
                        {retentionData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}
                     />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-3xl font-bold text-gray-900">{retentionData[0].value + retentionData[1].value}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
               </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
               {retentionData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                     <span className="text-xs font-medium text-gray-600">{entry.name} ({entry.value})</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-6">Room Type Performance</h3>
            <div className="flex-1 w-full min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roomData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                     <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#374151', fontSize: 12, fontWeight: 500}} width={80} />
                     <Tooltip 
                        cursor={{fill: '#F3F4F6'}}
                        contentStyle={{backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none'}}
                        itemStyle={{color: '#fff', fontWeight: 'bold'}}
                     />
                     <Bar dataKey="value" name="Reservations" fill="#4A0404" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-6">Estimated Occupancy Trend (Next 7 Days)</h3>
            <div className="flex-1 w-full min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val}%`} />
                     <Tooltip 
                        contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB'}}
                     />
                     <Line type="step" dataKey="occupancy" name="Occupancy %" stroke="#D4AF37" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>
    </div>
  );
}

