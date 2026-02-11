import React, { useMemo } from 'react';
import { ChefHat, ShoppingCart, AlertTriangle, CheckCircle, Package, Calendar } from 'lucide-react';
import { KITCHEN_MENU_ITEMS } from '../constants';
import { EventStatus, EventData } from '../types';

interface KitchenViewProps {
  events: EventData[];
}

export const KitchenView: React.FC<KitchenViewProps> = ({ events }) => {
  // Simulate fetching only approved events
  const approvedEvents = events.filter(e => e.status === EventStatus.APPROVED || e.status === EventStatus.QUOTE_SENT);

  // Calculate aggregated shopping list
  const shoppingList = useMemo<{ [key: string]: { unit: string; quantity: number; events: string[] } }>(() => {
    const list: Record<string, { unit: string, quantity: number, events: string[] }> = {};

    approvedEvents.forEach(event => {
      event.selectedMenu.forEach(menuId => {
        const menuItem = KITCHEN_MENU_ITEMS.find(i => i.id === menuId);
        if (menuItem?.ingredients) {
          menuItem.ingredients.forEach(ing => {
            const totalQty = ing.quantity * event.attendees;
            if (list[ing.name]) {
              list[ing.name].quantity += totalQty;
              if (!list[ing.name].events.includes(event.name)) {
                list[ing.name].events.push(event.name);
              }
            } else {
              list[ing.name] = {
                unit: ing.unit,
                quantity: totalQty,
                events: [event.name]
              };
            }
          });
        }
      });
    });

    return list;
  }, [approvedEvents]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <h3 className="text-gray-500 text-sm font-medium mb-1">אירועים פעילים במטבח</h3>
             <span className="text-3xl font-bold text-gray-800">{approvedEvents.length}</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
             <ChefHat size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <h3 className="text-gray-500 text-sm font-medium mb-1">פריטים לרכש (Shopping List)</h3>
             <span className="text-3xl font-bold text-gray-800">{Object.keys(shoppingList).length}</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
             <ShoppingCart size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <h3 className="text-gray-500 text-sm font-medium mb-1">התראות אלרגנים</h3>
             <span className="text-3xl font-bold text-amber-600">
               {approvedEvents.reduce((acc, curr) => acc + (curr.catering.veganCount + curr.catering.glutenFreeCount > 0 ? 1 : 0), 0)}
             </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
             <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Production Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Package className="text-red-500" />
             כרטיסי עבודה (Production Tickets)
           </h3>
           <div className="space-y-4">
             {approvedEvents.length === 0 ? (
               <p className="text-gray-400 text-center py-4">אין אירועים מאושרים להפקה</p>
             ) : (
               approvedEvents.map(event => (
                 <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                          <h4 className="font-bold text-lg text-gray-800">{event.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                             <Calendar size={14} />
                             {event.date} • {event.attendees} סועדים
                          </div>
                       </div>
                       <span className={`text-xs px-2 py-1 rounded-full font-bold border ${event.status === EventStatus.APPROVED ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                         {event.status === EventStatus.APPROVED ? 'מאושר' : 'הצעת מחיר'}
                       </span>
                    </div>
                    
                    {/* Dietary Alerts */}
                    {(event.catering.veganCount > 0 || event.catering.glutenFreeCount > 0) && (
                      <div className="bg-amber-50 border border-amber-200 p-2 rounded mb-3 text-sm text-amber-800 flex gap-4">
                         {event.catering.veganCount > 0 && <span className="font-bold">🌱 {event.catering.veganCount} טבעוני</span>}
                         {event.catering.glutenFreeCount > 0 && <span className="font-bold">🌾 {event.catering.glutenFreeCount} ללא גלוטן</span>}
                      </div>
                    )}

                    {/* Menu List */}
                    <div className="space-y-1">
                      {event.selectedMenu.map(itemId => {
                        const item = KITCHEN_MENU_ITEMS.find(i => i.id === itemId);
                        return (
                          <div key={itemId} className="text-sm text-gray-700 flex justify-between border-b border-gray-200 border-dashed pb-1 last:border-0">
                             <span>{item?.name}</span>
                             <span className="font-mono bg-white px-1 rounded text-gray-500">x{event.attendees}</span>
                          </div>
                        )
                      })}
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Aggregated Shopping List */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 text-white">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <ShoppingCart className="text-blue-400" />
             רשימת רכש מרוכזת (Smart Procurement)
           </h3>
           <p className="text-slate-400 text-xs mb-4">
             מחושב אוטומטית על בסיס מפרט טכני של המנות באירועים המאושרים בלבד.
           </p>

           <div className="space-y-2">
             {Object.entries(shoppingList).length === 0 ? (
                <p className="text-slate-500 text-center py-4">אין נתונים לרכש</p>
             ) : (
               Object.entries(shoppingList).map(([name, d], idx) => {
                 const details = d as { unit: string; quantity: number; events: string[] };
                 return (
                 <div key={idx} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div>
                      <div className="font-medium text-gray-200">{name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">
                        עבור: {details.events.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xl font-bold text-blue-400">{details.quantity.toLocaleString()}</span>
                       <span className="text-sm text-slate-400 mr-1">{details.unit}</span>
                    </div>
                 </div>
               )})
             )}
           </div>
        </div>

      </div>
    </div>
  );
};