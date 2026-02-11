import React, { useState } from 'react';
import { EventData, EventStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar, Users, MapPin } from 'lucide-react';

interface CalendarViewProps {
  events: EventData[];
  onEditEvent: (event: EventData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onEditEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate); // 0 = Sunday

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getDate() === day &&
               eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={today} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">
             היום
           </button>
           <div className="flex bg-gray-100 rounded-lg p-1">
             <button onClick={prevMonth} className="p-2 hover:bg-white rounded-md transition shadow-sm">
               <ChevronRight size={20} className="text-gray-600" />
             </button>
             <button onClick={nextMonth} className="p-2 hover:bg-white rounded-md transition shadow-sm">
               <ChevronLeft size={20} className="text-gray-600" />
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4 text-center">
         {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
           <div key={day} className="font-bold text-gray-400">{day}</div>
         ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} className="h-32 bg-gray-50/50 rounded-lg border border-transparent"></div>;
          
          const dayEvents = getEventsForDay(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div key={idx} className={`h-32 bg-white border ${isToday ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} rounded-lg p-2 overflow-y-auto relative hover:border-blue-300 transition-colors group`}>
               <span className={`text-sm font-bold ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                 {day}
               </span>
               
               <div className="mt-2 space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                      className={`p-1.5 rounded text-xs border truncate cursor-pointer transition hover:scale-[1.02] ${
                        event.status === EventStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' : 
                        event.status === EventStatus.QUOTE_SENT ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                      title={`${event.name} - לחץ לעריכה`}
                    >
                      <div className="font-bold truncate">{event.name}</div>
                      <div className="flex items-center gap-1 opacity-80 mt-0.5">
                        <Users size={8} /> {event.attendees}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};