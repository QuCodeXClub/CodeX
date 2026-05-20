import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    tag: 'Hackathon',
    title: 'QHackathon 2026',
    description: '36 hours. Real problems. Real impact. Build solutions that matter.',
    date: '8 may - 9 may, 2026',
    duration: '48 HOURS',
    location: 'Shyamji Auditorim',
    imageText: 'HACK BUILD WIN',
  },
  {
    id: 2,
    tag: 'Hackathon',
    title: 'Crazy UI/UX',
    description: 'Design beautiful. Build intuitive. Create Crazy experiences.',
    date: '27 march, 2026',
    time: '10:00 AM - 01:00 PM',
    location: 'ONLINE',
    imageText: 'UI/UX',
  },
  {
    id: 3,
    tag: 'Tech Talk',
    title: 'Automation N8B',
    description: 'Explore the core of modern protocols and automated systems.',
    date: 'JUL 05, 2026',
    time: '06:00 AM - 08:00 AM',
    location: 'ONLINE',
    imageText: ' N8N AUTOMATION',
  },
];

const EventList = () => {
  return (
    <div className="w-full" id="upcoming">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent drop-shadow-[0_0_8px_rgba(46,197,212,0.8)]"></div>
          <h2 className="font-sans text-xl uppercase tracking-widest">Upcoming Events</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Hackathons', 'Workshops', 'Meetups', 'Webinars'].map((filter, index) => (
            <button 
              key={filter}
              className={`px-4 py-2 text-[0.7rem] font-mono uppercase tracking-wider border rounded-md transition-colors ${
                index === 0 
                  ? 'bg-accent text-ink border-accent' 
                  : 'bg-transparent text-ink/60 border-line hover:border-ink/40'
              }`}
            >
              {filter}
            </button>
          ))}
          <button className="ml-auto md:ml-4 px-4 py-2 text-[0.7rem] font-mono uppercase tracking-wider border border-line bg-white/50 hover:bg-black/5 rounded-md flex items-center gap-2 transition-colors">
            Calendar View <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {mockEvents.map((event) => (
          <article 
            key={event.id} 
            className="group flex flex-col md:flex-row gap-6 p-4 border border-line rounded-2xl bg-white/40 backdrop-blur-md hover:border-accent/40 transition-colors shadow-sm"
          >
                        <div className="w-full md:w-[260px] h-[180px] bg-panel rounded-xl flex items-center justify-center relative shrink-0 overflow-hidden border border-white/5">
                           <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-black/40 z-10"></div>
               <div className="absolute top-0 left-0 w-full h-full bg-accent/5 mix-blend-overlay z-10"></div>
               
               <h3 className="relative z-20 text-accent font-sans text-3xl uppercase tracking-widest px-6 text-center leading-[0.9] drop-shadow-[0_0_12px_rgba(46,197,212,0.4)]">
                 {event.imageText}
               </h3>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <span className="inline-block px-2.5 py-1 bg-accent/10 text-accent text-[0.65rem] font-mono uppercase tracking-widest rounded mb-3">
                  {event.tag}
                </span>
                <h3 className="font-sans text-2xl uppercase tracking-wide mb-2 text-ink">
                  {event.title}
                </h3>
                <p className="text-ink/60 text-sm max-w-lg mb-6 leading-relaxed">
                  {event.description}
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4 text-[0.75rem] font-mono text-ink/70 uppercase">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ink/40" /> {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ink/40" /> {event.time || event.duration}
                </div>
                <div className="flex items-center justify-between lg:justify-start gap-2 col-span-2 lg:col-span-1">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ink/40" /> {event.location}
                  </span>
                                    <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-panel text-white ml-auto lg:ml-4 group-hover:bg-accent group-hover:text-ink transition-all shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button className="px-6 py-3 border border-line text-ink/60 font-mono text-xs uppercase tracking-widest rounded-md hover:bg-black/5 hover:text-ink transition-colors flex items-center justify-center gap-2 mx-auto">
          Load More Events 
        </button>
      </div>
    </div>
  );
};

export default EventList;