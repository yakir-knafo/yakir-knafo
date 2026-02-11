import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { EventForm } from './components/EventForm';
import { Dashboard } from './components/Dashboard';
import { OperationsView } from './components/OperationsView';
import { KitchenView } from './components/KitchenView';
import { CalendarView } from './components/CalendarView';
import { EventData, EventStatus } from './types';
import { MOCK_EVENTS } from './constants';
import { supabase, mapEventFromDb, mapEventToDb } from './supabaseClient';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventToEdit, setEventToEdit] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Load events from Supabase on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Check if credentials exist
      if (!supabase.supabaseUrl || !supabase.supabaseKey) {
        console.warn('Supabase credentials missing. Using Mock Data.');
        setEvents(MOCK_EVENTS);
        setIsConnected(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedEvents = data.map(mapEventFromDb);
        setEvents(formattedEvents);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to mock data on error
      setEvents(MOCK_EVENTS);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (newEvent: EventData) => {
    const eventWithId = { ...newEvent, id: `evt_${Date.now()}`, history: [] };
    
    // Optimistic Update
    setEvents(prev => [...prev, eventWithId]);
    setActiveTab('calendar');
    setEventToEdit(null);

    if (isConnected) {
      try {
        const { error } = await supabase
          .from('events')
          .insert([mapEventToDb(eventWithId)]);
        
        if (error) {
          console.error('Error saving event to DB:', error);
          alert('שגיאה בשמירת האירוע בענן');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateEvent = async (updatedEvent: EventData) => {
    // Optimistic Update
    setEvents(prev => prev.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
    setActiveTab('dashboard');
    setEventToEdit(null);

    if (isConnected) {
      try {
        const { error } = await supabase
          .from('events')
          .update(mapEventToDb(updatedEvent))
          .eq('id', updatedEvent.id);

        if (error) {
           console.error('Error updating event in DB:', error);
           alert('שגיאה בעדכון האירוע בענן');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDuplicateEvent = (event: EventData) => {
    const newEvent = {
        ...event,
        id: '', 
        name: `${event.name} (עותק)`,
        date: '',
        status: EventStatus.DRAFT,
        history: []
    };
    setEventToEdit(newEvent);
    setActiveTab('new-event');
  };

  const handleEditEvent = (event: EventData) => {
    setEventToEdit(event);
    setActiveTab('new-event');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'new-event') {
        setEventToEdit(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <Loader2 className="animate-spin text-amber-600" size={48} />
        <p className="text-gray-500 font-medium">טוען נתונים...</p>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange}>
      <div className="max-w-7xl mx-auto">
        {!isConnected && (
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-yellow-800 text-sm">
             <strong>מצב לא מחובר:</strong> המערכת פועלת על נתונים מקומיים. כדי לשמור נתונים בענן, הגדר את משתני הסביבה של Supabase.
           </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            events={events} 
            onDuplicateEvent={handleDuplicateEvent} 
            onEditEvent={handleEditEvent}
          />
        )}
        {activeTab === 'new-event' && (
          <EventForm 
            onEventCreated={handleAddEvent} 
            onEventUpdated={handleUpdateEvent}
            initialData={eventToEdit} 
          />
        )}
        {activeTab === 'kitchen' && <KitchenView events={events} />}
        {activeTab === 'operations' && <OperationsView />}
        {activeTab === 'calendar' && <CalendarView events={events} onEditEvent={handleEditEvent} />}
      </div>
    </Layout>
  );
};

export default App;