import React from 'react';
import EventsHero from '../features/events/components/EventsHero';
import EventList from '../features/events/components/EventList';
import EventSidebar from '../features/events/components/EventSidebar';

const Events = () => {
  return (
    <div className="events-page flex flex-col min-h-screen">
     <EventsHero />
      <section className="w-full max-w-[1400px] mx-auto px-[1.15rem] lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-12 lg:gap-20">
                    <div className="event-feed">
            <EventList />
          </div>
          <aside className="event-sidebar hidden lg:block">
            <EventSidebar />
          </aside>

        </div>
      </section>

    </div>
  );
};

export default Events;