import React from 'react';
import { MousePointer, ClipboardCheck, Truck, BarChart2 } from 'lucide-react';

export const OperationsView: React.FC = () => {
  const workflowData = [
    {
      trigger: 'New Event Request',
      triggerLabel: 'בקשת אירוע חדש',
      sales: 'Draft Quote & Availability check',
      kitchen: 'Pre-alert for date',
      ops: 'Logistics feasibility check',
      admin: 'Pending Revenue Pipeline'
    },
    {
      trigger: 'Menu Selected',
      triggerLabel: 'בחירת תפריט',
      sales: 'Finalized Price per head',
      kitchen: 'Ingredients list & Dietary alerts',
      ops: 'Service-ware requirements',
      admin: 'Cost of Goods Sold (COGS)'
    },
    {
      trigger: 'Location Fixed (Farm)',
      triggerLabel: 'קיבוע מיקום (משק)',
      sales: 'Travel fee added',
      kitchen: 'Portable kitchen kit',
      ops: 'Vehicle & Staffing assign.',
      admin: 'Logistics complexity score'
    },
    {
      trigger: 'Event Approval',
      triggerLabel: 'אישור אירוע',
      sales: 'Commission/Sale closed',
      kitchen: 'Final Production Order',
      ops: 'Checklist Activation',
      admin: 'Calendar Lock & Final ROI'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 className="text-slate-600" />
          תהליכים תפעוליים ומבטים (Operational Workflows)
        </h2>
        <p className="text-gray-500 mb-6">
          מטריצת פעולות והשפעות רוחביות על מחלקות הארגון
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-right">
                <th className="p-4 font-bold text-slate-700 w-1/5">
                    <span className="flex items-center gap-2">
                        <MousePointer size={16} />
                        Trigger (פעולה)
                    </span>
                </th>
                <th className="p-4 font-bold text-blue-700 w-1/5">Sales/Agent View</th>
                <th className="p-4 font-bold text-amber-700 w-1/5">Kitchen View</th>
                <th className="p-4 font-bold text-teal-700 w-1/5">Operations View</th>
                <th className="p-4 font-bold text-purple-700 w-1/5">Dashboard/Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workflowData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 border-l border-gray-100">
                    <div>{row.trigger}</div>
                    <div className="text-xs text-slate-500 mt-1">{row.triggerLabel}</div>
                  </td>
                  <td className="p-4 text-gray-600 border-l border-gray-100">{row.sales}</td>
                  <td className="p-4 text-gray-600 border-l border-gray-100">{row.kitchen}</td>
                  <td className="p-4 text-gray-600 border-l border-gray-100">{row.ops}</td>
                  <td className="p-4 text-gray-600">{row.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Truck size={18} />
                לוגיסטיקה חכמה
            </h3>
            <p className="text-sm text-amber-700">
                המערכת מחשבת אוטומטית מורכבות לוגיסטית בהתבסס על מיקום האירוע. אירועי שטח (Farm) מפעילים אוטומטית הקצאת רכבים וקיט מטבח נייד.
            </p>
         </div>
         <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <ClipboardCheck size={18} />
                בקרת איכות מטבח
            </h3>
            <p className="text-sm text-blue-700">
                רשימת רכיבים והתראות אלרגנים נגזרות ישירות מבחירת המנות. כל שינוי בתפריט מעדכן את דוח הייצור במטבח בזמן אמת.
            </p>
         </div>
         <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                <BarChart2 size={18} />
                ניהול הכנסות
            </h3>
            <p className="text-sm text-purple-700">
                צפי הכנסות (Revenue Pipeline) מתעדכן משלב הטיוטה. אישור סופי נועל את היומן ומחשב ROI סופי לאירוע.
            </p>
         </div>
      </div>
    </div>
  );
};