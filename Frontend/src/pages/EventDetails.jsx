import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { eventService } from "../services/eventService";
import PageContainer from "../components/common/PageContainer";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEvents();
        const eventsList = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : response?.data?.events || [];
        const foundEvent = eventsList.find((e) => e._id === id || e.id === id);
        setEvent(foundEvent);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-mono text-text gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        <span className="text-xs uppercase tracking-widest text-text-muted">Loading Event Details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-sans text-center px-4">
        <h2 className="text-3xl font-display font-bold text-text uppercase">Event Not Found</h2>
        <p className="text-sm text-text-muted">The requested event could not be retrieved.</p>
        <button
          onClick={() => navigate("/events")}
          className="mt-4 px-6 py-2.5 rounded-xl bg-accent text-text-inverse font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all"
        >
          Return to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20 font-sans relative">
      <div className="w-full relative z-10">
        
        {/* Top Navigation Bar */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-text-muted hover:text-accent uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>

        {/* Hero Image Container */}
        <div className="w-full aspect-[16/9] lg:aspect-[21/9] max-h-[55vh] bg-card-hover relative border-y border-border/80 overflow-hidden">
          {event.coverImage ? (
            <>
              <img
                src={event.coverImage}
                alt={event.eventName}
                className="w-full h-full object-cover object-center absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"></div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted bg-card">
              <ImageIcon className="w-16 h-16 mb-3 opacity-40" />
              <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                NO COVER IMAGE PROVIDED
              </span>
            </div>
          )}

          {/* Floating Date Badge */}
          <div className="max-w-[1400px] mx-auto relative h-full">
            <div className="absolute bottom-6 right-6 lg:right-12 glass-card px-6 py-4 rounded-2xl flex flex-col items-center min-w-[110px] z-10">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </span>
              <span className="text-4xl font-display font-black text-text leading-none">
                {new Date(event.date).getDate()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <PageContainer className="py-12">

          <div className="mb-10">
            <div className="inline-flex items-center bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-4">
              EVENT OVERVIEW
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-text mb-6 uppercase tracking-tight leading-none">
              {event.eventName}
            </h1>

            {/* Meta Badges Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/80 pb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-semibold text-text-muted">
                <div className="flex items-center gap-2 bg-card border border-border/80 px-4 py-2.5 rounded-xl shadow-sm">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-card border border-border/80 px-4 py-2.5 rounded-xl shadow-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-card border border-border/80 px-4 py-2.5 rounded-xl shadow-sm">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>QUANTUM UNIVERSITY</span>
                </div>
              </div>

              {/* Action Buttons */}
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-accent text-text-inverse px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:opacity-95 shadow-lg shadow-accent/20 cursor-pointer border-0"
                >
                  <span>REGISTER NOW</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Description Container */}
          <div
            className="
              text-text-muted text-base sm:text-lg leading-relaxed max-w-none
              [&_p]:mb-6
              [&_h1]:text-3xl [&_h1]:font-display [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-text [&_h1]:uppercase
              [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:text-text [&_h2]:mt-8 [&_h2]:uppercase
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:text-text [&_h3]:mt-6
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:mb-1.5
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:mb-1.5
              [&_a]:text-accent [&_a]:underline hover:[&_a]:text-accent
              [&_strong]:font-bold [&_strong]:text-text
              [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:mb-6 [&_blockquote]:bg-card/60 [&_blockquote]:italic [&_blockquote]:rounded-r-xl [&_blockquote]:text-text
            "
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </PageContainer>
      </div>
    </div>
  );
}