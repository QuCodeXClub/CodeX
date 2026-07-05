import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsHero from '../features/events/components/EventsHero';
import EventList from '../features/events/components/EventList';
import EventSidebar from '../features/events/components/EventSidebar';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/v1/events');
        setEvents(response.data?.data || []);
      } catch (err) {
        setError('Failed to sync event data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page flex flex-col min-h-screen bg-[#Faf9f6] relative font-jetbrains">
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 z-0" 
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      <div className="relative z-10">
        <EventsHero events={events} loading={loading} />
        
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-12 py-12 lg:py-20 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-12 lg:gap-20">
            
            <div className="event-feed">
              {error ? (
                <div className="text-red-500 font-bold uppercase tracking-widest">{error}</div>
              ) : (
                <EventList events={events} loading={loading} />
              )}
            </div>

            <aside className="event-sidebar hidden xl:block">
              <EventSidebar events={events} />
            </aside>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;