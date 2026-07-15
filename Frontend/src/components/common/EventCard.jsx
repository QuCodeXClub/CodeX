import React from "react";
import {
  Image as ImageIcon,
  Calendar,
  X,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";

export default function EventCard({ event, onClose }) {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-none border-4 border-black w-full max-w-3xl max-h-[90vh] flex flex-col relative transform transition-all overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- FIXED HEADER --- */}
        <div className="flex items-center justify-between px-8 py-5 border-b-4 border-black bg-white z-20">
          <h2 className="text-xl font-bold text-black uppercase tracking-widest">
            Event Details
          </h2>
          <button
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-black hover:text-red-600 rounded-none border-4 border-black transition-colors"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          {/* Hero Image */}
          <div className="w-full h-64 sm:h-80 bg-slate-200 relative flex items-center justify-center shrink-0 border-b-4 border-black">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-black">
                <ImageIcon className="w-16 h-16 mb-2 stroke-[1.5]" />
                <span className="text-xl font-bold uppercase tracking-widest">
                  No Image
                </span>
              </div>
            )}

            {/* Floating Date Badge */}
            <div className="absolute -bottom-10 right-10 bg-white px-5 py-3 rounded-none border-4 border-black flex flex-col items-center min-w-[100px] z-10">
              <span className="text-xs font-black text-[#2ec5d4] uppercase tracking-widest mb-1">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </span>
              <span className="text-3xl font-black text-black leading-none uppercase">
                {new Date(event.date).getDate()}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-10 pt-12 bg-white rounded-none relative z-0">
            <div className="inline-block bg-[#e6f8fa] text-[#2ec5d4] text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-none border-2 border-black mb-6">
              Event Overview
            </div>

            <h3 className="font-bold text-4xl sm:text-5xl text-black mb-8 leading-tight uppercase">
              {event.eventName}
            </h3>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-black mb-10 py-6 border-y-4 border-black">
              <div className="flex items-center gap-2.5 px-4 py-2 border-2 border-black bg-white">
                <Calendar className="w-5 h-5 text-[#2ec5d4] stroke-[2.5]" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 border-2 border-black bg-white">
                <Clock className="w-5 h-5 text-[#2ec5d4] stroke-[2.5]" />
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 border-2 border-black bg-white">
                <MapPin className="w-5 h-5 text-[#2ec5d4] stroke-[2.5]" />
                Offline
              </div>
            </div>

            {/* Rich Text Wrapper */}
            <div
              className="
                text-slate-600 text-base leading-relaxed
                [&_p]:mb-6
                [&_h1]:text-2xl [&_h1]:font-black [&_h1]:uppercase [&_h1]:mb-6 [&_h1]:text-black
                [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:mb-5 [&_h2]:text-black
                [&_h3]:text-lg [&_h3]:font-black [&_h3]:uppercase [&_h3]:mb-4 [&_h3]:text-black
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:mb-3 [&_ul_li]:pl-1 [&_ul_li]:font-semibold [&_ul_li]:text-black
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:mb-3 [&_ol_li]:pl-1 [&_ol_li]:font-semibold [&_ol_li]:text-black
                [&_a]:text-[#2ec5d4] [&_a]:underline hover:[&_a]:text-teal-700 [&_a]:font-bold
                [&_strong]:font-black [&_strong]:text-black
                [&_blockquote]:border-4 [&_blockquote]:border-black [&_blockquote]:pl-6 [&_blockquote]:py-3 [&_blockquote]:mb-6 [&_blockquote]:bg-slate-100 [&_blockquote]:italic [&_blockquote]:rounded-none
              "
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        </div>

        {/* --- FIXED FOOTER --- */}
        {event.registrationLink && (
          <div className="p-6 sm:p-8 border-t-4 border-black bg-white z-10 flex justify-end">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0a0a0a] text-white px-10 py-4 rounded-none font-black uppercase tracking-wider hover:bg-[#2ec5d4] hover:text-black border-4 border-black transition-colors"
            >
              Register Now
              <ExternalLink className="w-5 h-5 stroke-[3]" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
