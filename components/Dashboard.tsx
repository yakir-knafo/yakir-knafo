import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CATERING_PACKAGES, KITCHEN_MENU_ITEMS, EQUIPMENT_CATALOG } from '../constants';
import { EventData } from '../types';
import { Users, DollarSign, Calendar, TrendingUp, Copy, Edit3 } from 'lucide-react';

interface DashboardProps {
  events: EventData[];
  onDuplicateEvent: (event: EventData) => void;
  onEditEvent: (event: EventData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ events, onDuplicateEvent, onEditEvent }) => {

  // Calculate profitability
  const chartData = events.map(event => {
      // 1. Calculate Revenue (Total Cost to Client)
      const pkg = CATERING_PACKAGES.find(p => p.id === event.catering.packageId);
      let revenue = 0;
      if (pkg?.pricingTiers) {
          const tier = pkg.pricingTiers.find(t => event.attendees >= t.minAttendees && event.attendees <= t.maxAttendees) || pkg.pricingTiers[0];
          revenue += tier.isFixedPrice ? tier.price : tier.price * event.attendees;
      } else if (pkg?.subOptions) {
         const subOption = pkg.subOptions.find(o => o.id === event.catering.subOptionId);
         if(subOption) revenue += subOption.price * event.attendees;
      }
      // Addons Revenue
      event.selectedMenu.forEach(id => {
          const item = KITCHEN_MENU_ITEMS.find(i => i.id === id);
          if (item) revenue += item.price * event.attendees;
      });
      // Equipment Revenue
      event.equipment.forEach(eq => {
          const item = EQUIPMENT_CATALOG.find(i => i.id === eq.itemId);
          if (item) revenue += item.price * eq.quantity;
      });

      // 2. Calculate COGS (Estimated Base Cost)
      let cogs = 0;
      // Assume 40% of package price is base food cost for the base package
      if (pkg) cogs += (revenue * 0.4); 
      
      // Addons COGS
      event.selectedMenu.forEach(id => {
          const item = KITCHEN_MENU_ITEMS.find(i => i.id === id);
          if (item) cogs += item.baseCost * event.attendees;
      });
       // Equipment COGS (Assume 30% wear & tear / sub-rental cost)
      event.equipment.forEach(eq => {
          const item = EQUIPMENT_CATALOG.find(i => i.id === eq.itemId);
          if (item) cogs += (item.price * eq.quantity) * 0.3;
      });

      return {
          name: event.name.split(' ')[0] + '...', // Short name
          revenue: revenue,
          cogs: cogs,
          profit: revenue - cogs
      };
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
               <Calendar size={24} />
             </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{events.length}</div>
          <div className="text-sm text-gray-500 mt-1">אירועים החודש</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-green-50 text-green-600 rounded-lg">
               <DollarSign size={24} />
             </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">₪{chartData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">צפי הכנסות</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
               <Users size={24} />
             </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{events.reduce((acc, curr) => acc + curr.attendees, 0)}</div>
          <div className="text-sm text-gray-500 mt-1">משתתפים סה"כ</div>
        </div>
        
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
               <TrendingUp size={24} />
             </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {chartData.length > 0 
                ? Math.round((chartData.reduce((acc, curr) => acc + curr.profit, 0) / (chartData.reduce((acc, curr) => acc + curr.revenue, 0) || 1)) * 100) 
                : 0}%
          </div>
          <div className="text-sm text-gray-500 mt-1">רווחיות ממוצעת</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">אירועים אחרונים</h3>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>אין אירועים במערכת</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(event => {
                  const pkg = CATERING_PACKAGES.find(p => p.id === event.catering.packageId);
                  return (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
                          <div>
                              <h4 className="font-bold text-gray-800">{event.name}</h4>
                              <p className="text-sm text-gray-500">{event.date} • {event.attendees} משתתפים</p>
                          </div>
                          <div className="flex items-center gap-2">
                               <div className="text-right ml-4">
                                    <div className="text-sm font-medium text-blue-600">
                                        {event.locationType === 'STANDING' && 'סדנה בעמידה'}
                                        {event.locationType === 'IN_HOUSE' && 'חלל פנימי'}
                                        {event.locationType === 'EXTERNAL' && 'משק חיצוני'}
                                    </div>
                                    <div className="text-xs text-gray-500">{pkg?.name}</div>
                               </div>
                               <button 
                                onClick={() => onEditEvent(event)}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                title="ערוך אירוע (Edit)"
                               >
                                   <Edit3 size={18} />
                               </button>
                               <button 
                                onClick={() => onDuplicateEvent(event)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="שכפל אירוע (Duplicate)"
                               >
                                   <Copy size={18} />
                               </button>
                          </div>
                      </div>
                  );
              })}
            </div>
          )}
        </div>

        {/* Profitability Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ניתוח רווחיות (הכנסות מול עלויות)</h3>
          {events.length === 0 ? (
             <div className="h-64 flex items-center justify-center text-gray-400">
                 אין נתונים להצגה
             </div>
          ) : (
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                    <Legend />
                    <Bar dataKey="revenue" name="הכנסות (Revenue)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="cogs" name="עלות מכר (COGS)" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
                </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};