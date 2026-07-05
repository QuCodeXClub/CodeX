import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';

const EventList = ({ events, loading }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const tabs = ['ALL', 'HACKATHONS', 'WORKSHOPS', 'MEETUPS', 'WEBINARS'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 animate-spin text-[#2ec5d4] mb-4" />
        <span className="font-bold uppercase tracking-widest text-gray-500 text-sm">
          Fetching Database Records...
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-10">
            <div className="flex flex-wrap gap-3 font-bold uppercase tracking-wider text-xs border-b-2 border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 border-2 transition-all ${
              activeTab === tab 
                ? 'border-[#2ec5d4] bg-[#2ec5d4] text-[#0a0a0a]' 
                : 'border-transparent text-gray-400 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center text-[#2ec5d4] text-xs font-bold uppercase tracking-widest">
          Event Highlights
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {events.length === 0 ? (
          <div className="text-gray-500 font-bold uppercase tracking-widest">No events currently scheduled.</div>
        ) : (
          events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-[2rem] border-2 border-gray-200 p-4 flex flex-col md:flex-row gap-8 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.05)] transition-shadow"
            >
                            <div className="w-full md:w-[320px] h-[220px] shrink-0 bg-[#0a0a0a] rounded-3xl overflow-hidden relative group flex items-center justify-center">
                {event.coverImage ? (
                  <>
                    <img src={event.coverImage} alt={event.eventName} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    <h3 className="relative z-10 font-oswald text-4xl font-bold uppercase text-[#2ec5d4] text-center px-6 leading-none drop-shadow-[0_0_15px_rgba(46,197,212,0.6)]">
                      {event.eventName.split(' ').map((word, i) => (
                        <React.Fragment key={i}>{word}<br/></React.Fragment>
                      ))}
                    </h3>
                  </>
                ) : (
                  <h3 className="font-oswald text-3xl font-bold uppercase text-[#2ec5d4] text-center px-4">
                    {event.eventName}
                  </h3>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center py-2 pr-4">
                <div className="inline-block bg-[#e6f8fa] text-[#2ec5d4] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-3">
                  EVENT
                </div>
                <h2 className="font-oswald text-3xl font-bold uppercase text-[#0a0a0a] mb-2">
                  {event.eventName}
                </h2>
                
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
                
                <div className="flex flex-wrap items-center justify-between mt-auto gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      ONLINE
                    </div>
                  </div>
                  
                  <a 
                    href={event.registrationLink || '#'} 
                    target={event.registrationLink ? "_blank" : "_self"} 
                    rel="noreferrer" 
                    className="w-12 h-12 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center hover:bg-[#2ec5d4] hover:text-[#0a0a0a] transition-colors shrink-0"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
            {events.length > 0 && (
        <div className="flex justify-center mt-4">
          <button className="border-2 border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs px-8 py-4 hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors rounded-lg">
            Load More Events
          </button>
        </div>
      )}
    </div>
  );
};
export default EventList;