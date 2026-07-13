import React from "react";
import { Image as ImageIcon, Calendar, X, ExternalLink, MapPin, Clock } from "lucide-react";
import parse from "html-react-parser";

export default function EventCard({ event, onClose }) {
  if (!event) return null;

  return (
    <div 
      // Navbar clearance on top, small elegant gap on the bottom
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-slate-900/60 backdrop-blur-md px-4 pt-24 pb-6 lg:pt-28 lg:pb-8"
      onClick={onClose}
    >
      <div 
        // INCREASED HEIGHT: Changed to `h-full` to stretch exactly to the bottom padding
        className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-5xl flex flex-col overflow-hidden h-full relative transform transition-all border border-white/20"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-8 bg-white/90 backdrop-blur-xl border-b border-slate-100 z-20 shrink-0">
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">
            Event Details
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="flex-1 overflow-y-auto bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          
          {/* Hero Image */}
          <div className="w-full h-[280px] sm:h-[350px] md:h-[420px] bg-slate-50 relative flex items-center justify-center shrink-0 group">
            {event.coverImage ? (
              <>
                <img
                  src={event.coverImage}
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
              </>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <ImageIcon className="w-16 h-16 mb-4 opacity-40 stroke-[1.5]" />
                <span className="text-lg font-medium tracking-wide">No Cover Image</span>
              </div>
            )}
            
            {/* Soft Floating Date Badge */}
            <div className="absolute -bottom-8 right-6 md:right-12 bg-white px-7 py-4 rounded-2xl shadow-xl border border-slate-50 flex flex-col items-center min-w-[110px] z-10 transform group-hover:-translate-y-1 transition-transform duration-300">
              <span className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="text-4xl font-black text-slate-900 leading-none">
                {new Date(event.date).getDate()}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-10 lg:p-12 pt-14 md:pt-16 bg-white relative z-0">
            <div className="inline-flex items-center bg-teal-50/80 text-teal-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Event Overview
            </div>
            
            <h3 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 mb-8 leading-[1.15] tracking-tight">
              {event.eventName}
            </h3>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-semibold text-slate-600 mb-12">
              <div className="flex items-center gap-2.5 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100/80">
                <Calendar className="w-4 h-4 text-teal-500" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                })} 
              </div>
              
              <div className="flex items-center gap-2.5 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100/80">
                <Clock className="w-4 h-4 text-teal-500" />
                {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              
              <div className="flex items-center gap-2.5 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100/80">
                <MapPin className="w-4 h-4 text-teal-500" />
                Offline Event
              </div>
            </div>

            {/* Rich Text Wrapper */}
            <div 
              className="
                text-slate-600 text-[1.05rem] lg:text-lg leading-[1.8] max-w-none
                [&_p]:mb-6
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-slate-900 [&_h1]:tracking-tight
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-5 [&_h2]:text-slate-900 [&_h2]:tracking-tight [&_h2]:mt-10
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:text-slate-900 [&_h3]:mt-8
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:mb-2 [&_ul_li]:pl-2 [&_ul_marker]:text-teal-500
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:mb-2 [&_ol_li]:pl-2
                [&_a]:text-teal-600 [&_a]:underline hover:[&_a]:text-teal-800 [&_a]:font-medium [&_a]:underline-offset-2
                [&_strong]:font-bold [&_strong]:text-slate-900
                [&_blockquote]:border-l-4 [&_blockquote]:border-teal-500 [&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:mb-6 [&_blockquote]:bg-slate-50 [&_blockquote]:italic [&_blockquote]:rounded-r-2xl [&_blockquote]:text-slate-700
              "
            >
              {parse(event.description || "")}
            </div>
          </div>
        </div>

        {/* --- FIXED FOOTER --- */}
        {event.registrationLink && (
          <div className="p-5 sm:p-6 md:px-8 border-t border-slate-100 bg-white z-10 flex justify-end shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <a 
              href={event.registrationLink} 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-slate-900 text-white px-9 py-3.5 rounded-2xl font-semibold tracking-wide transition-all hover:bg-teal-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Register Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}