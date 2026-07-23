import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { eventService } from "../services/eventService";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Fallback: fetch all and find by ID. If you have getEventById, use that instead.
        const response = await eventService.getEvents();
        const foundEvent = response.data.find((e) => e._id === id);
        setEvent(foundEvent);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-jetbrains text-text">
        Loading Event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-jetbrains">
        <h2 className="text-2xl font-bold text-text">Event Not Found</h2>
        <button
          onClick={() => navigate("/events")}
          className="text-accent hover:underline"
        >
          Return to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft pb-20 font-jetbrains relative">
      {/* Background grid pattern */}
       <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main Container - Full Width utilization */}
      <div className="w-full relative z-10">
        


        {/* Hero Image - Fixed Aspect Ratio and Image Cropping */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[60vh] bg-card-hover relative border-y border-border">
          {event.coverImage ? (
            <>
              <img
                src={event.coverImage}
                alt={event.eventName}
                className="w-full h-full object-cover object-center absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
              <ImageIcon className="w-20 h-20 mb-4 opacity-50 stroke-[1.5]" />
              <span className="text-base font-bold uppercase tracking-widest opacity-50">
                No Image Provided
              </span>
            </div>
          )}

          {/* Floating Date Badge (constrained within max-width layout for alignment) */}
          <div className=" w-full mx-auto relative h-full">
            <div className="absolute -bottom-8 right-4 lg:right-12 bg-card px-6 py-5 rounded-2xl border border-border shadow-xl flex flex-col items-center min-w-[120px] z-10">
              <span className="text-sm font-black text-accent uppercase tracking-widest mb-1">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </span>
              <span className="text-5xl font-black text-text leading-none">
                {new Date(event.date).getDate()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Container (Standard padded container for text readability) */}
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-16 md:py-20">
          
           <div className="mb-10">
          <div className="inline-flex items-center bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Event Overview
          </div>

          <h1 className="font-oswald font-bold text-4xl sm:text-5xl md:text-6xl text-text mb-8 leading-tight uppercase tracking-tight">
            {event.eventName}
          </h1>

          {/* Meta Tags & Compact Register Button Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-soft pb-8">
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-text-muted">
              <div className="flex items-center gap-2 bg-bg px-4 py-2.5 rounded-lg border border-border shadow-sm">
                <Calendar className="w-4 h-4 text-accent" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2 bg-bg px-4 py-2.5 rounded-lg border border-border shadow-sm">
                <Clock className="w-4 h-4 text-accent" />
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="flex items-center gap-2 bg-bg px-4 py-2.5 rounded-lg border border-border shadow-sm">
                <MapPin className="w-4 h-4 text-accent" />
                Offline
              </div>
            </div>

            {/* Compact Register Button */}
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-accent text-text-inverse px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all hover:opacity-90 shadow-md active:scale-95 shrink-0"
              >
                Register Now
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

          {/* Rich Text Wrapper */}
          <div
            className="
              text-text-muted text-[1.1rem] leading-[1.9] max-w-none
              [&_p]:mb-7
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-text [&_h1]:tracking-tight [&_h1]:font-oswald [&_h1]:uppercase
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-5 [&_h2]:text-text [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:font-oswald [&_h2]:uppercase
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:text-text [&_h3]:mt-10
              [&_ul]:list-disc [&_ul]:pl-7 [&_ul]:mb-7 [&_ul_li]:mb-2 [&_ul_li]:pl-2 [&_ul_marker]:text-accent
              [&_ol]:list-decimal [&_ol]:pl-7 [&_ol]:mb-7 [&_ol_li]:mb-2 [&_ol_li]:pl-2
              [&_a]:text-accent [&_a]:underline hover:[&_a]:text-accent [&_a]:font-medium [&_a]:underline-offset-2
              [&_strong]:font-bold [&_strong]:text-text
              [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-8 [&_blockquote]:py-3 [&_blockquote]:mb-7 [&_blockquote]:bg-card [&_blockquote]:italic [&_blockquote]:rounded-r-xl [&_blockquote]:text-text [&_blockquote]:text-xl
            "
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>
      </div>
    </div>
  );
}