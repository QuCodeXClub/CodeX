import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Image as ImageIcon,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  ArrowLeft,
  Share2,
  Globe,
  ZoomIn,
} from "lucide-react";
import { eventService } from "../services/eventService";
import PageContainer from "../components/common/PageContainer";
import { ASSETS } from "../config/assets";
import {
  normalizeEvent,
  optimizeCloudinaryUrl,
  isRegistrationOpen,
} from "../utils/helpers";
import { useImageZoom } from "../context/ImageZoomContext";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openImage } = useImageZoom();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        try {
          const response = await eventService.getEventById(id);
          const raw = response.data?.data || response.data;
          if (raw && (raw._id || raw.eventName)) {
            setEvent(normalizeEvent(raw));
            return;
          }
        } catch {
          // Fallback to getEvents if getEventById fails
        }

        const response = await eventService.getEvents({ all: "true" });
        const eventsList = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : response?.data?.data?.events || response?.data?.events || [];
        const foundEvent = eventsList.find((e) => e._id === id || e.id === id);
        setEvent(normalizeEvent(foundEvent));
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    window.scrollTo(0, 0);
  }, [id]);

  // Handle Share Functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.eventName,
          text: `Check out ${event?.eventName}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  // Generate Google Calendar Link
  const generateCalendarLink = () => {
    if (!event || !event.date) return "#";
    const startDate = new Date(event.date);
    if (isNaN(startDate.getTime())) return "#";
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assumes 2 hour duration

    const formatGoogleDate = (date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const text = encodeURIComponent(event.eventName);
    const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
    const regOpen = isRegistrationOpen(event);
    const details = encodeURIComponent(
      regOpen && event.registrationLink
        ? `Register here: ${event.registrationLink}`
        : `Event Details: ${window.location.href}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-mono text-text gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
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
    <div className="min-h-screen bg-transparent pb-8 lg:pb-20 font-sans relative">
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

        {/* Hero Image Container (Fixed to 1920x557 Aspect Ratio) */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
          <div 
            onClick={() => event.coverImage && openImage({ src: event.coverImage, alt: event.eventName })}
            className={`w-full aspect-[1920/557] bg-card-hover relative border border-border/80 rounded-2xl overflow-hidden shadow-sm group ${event.coverImage ? 'cursor-zoom-in' : ''}`}
          >
            {event.coverImage ? (
              <>
                <img
                  src={optimizeCloudinaryUrl(event.coverImage, 1920)}
                  alt={event.eventName}
                  className="w-full h-full object-contain object-center absolute inset-0 bg-black/5 group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 shadow-lg pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-accent" />
                  <span>Click to Zoom</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted bg-card">
                <ImageIcon className="w-16 h-16 mb-3 opacity-40" />
                <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                  NO COVER IMAGE PROVIDED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - 2 Column Layout (Unstop Style) */}
        <PageContainer>
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Event Details */}
            <div className="flex-1 min-w-0 space-y-6">
              
              {/* Main Info Card */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-2 text-text-muted text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {event.locationType === "Online" ? (
                      <Globe className="w-4 h-4 text-accent" />
                    ) : (
                      <MapPin className="w-4 h-4 text-red-500" />
                    )}
                    <span>{event.locationType}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {isRegistrationOpen(event) && event.registrationLink && (
                      <a href={event.registrationLink} target="_blank" rel="noreferrer" title="Register on Website">
                        <Globe className="w-4 h-4 cursor-pointer hover:text-accent transition-colors" />
                      </a>
                    )}
                    <a href={generateCalendarLink()} target="_blank" rel="noreferrer" title="Add to Google Calendar">
                      <Calendar className="w-4 h-4 cursor-pointer hover:text-accent transition-colors" />
                    </a>
                    <button onClick={handleShare} title="Share Event">
                      <Share2 className="w-4 h-4 cursor-pointer hover:text-accent transition-colors" />
                    </button>
                  </div>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl text-text mb-2 tracking-tight">
                  {event.eventName}
                </h1>
                {event.location && (
                  <p className="text-text-muted text-base mb-8">{event.location}</p>
                )}

                {/* Metadata List */}
                <div className="space-y-6">
                  {/* Location Row — only shown when location is provided */}
                  {event.location && (
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/10 p-2.5 rounded-lg text-accent mt-0.5">
                        {event.locationType === "Online" ? (
                          <Globe className="w-5 h-5" />
                        ) : (
                          <MapPin className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text mb-1">
                          {event.locationType === "Online" ? "Online Platform" : "Venue"}
                        </h3>
                        <p className="text-sm text-text-muted">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Date & Time Row */}
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-2.5 rounded-lg text-accent mt-0.5">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text mb-1">Date & Time</h3>
                      <p className="text-sm text-text-muted">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} • {new Date(event.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Registration Close Date Row (if configured) */}
                  {event.registrationCloseDate && (
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/10 p-2.5 rounded-lg text-accent mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text mb-1">Registration Deadline</h3>
                        <p className="text-sm text-text-muted">
                          {new Date(event.registrationCloseDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })} • {new Date(event.registrationCloseDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags — only shown when the event has tags */}
                {event.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap gap-2">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-card-hover border border-border/80 rounded-full text-xs font-semibold text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Card */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-display font-bold text-text mb-6 border-l-4 border-accent pl-4 uppercase">
                  Event Details
                </h2>
                <div
                  className="
                    text-text-muted text-base leading-relaxed max-w-none
                    [&_p]:mb-6
                    [&_h1]:text-2xl [&_h1]:font-display [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-text [&_h1]:mt-8
                    [&_h2]:text-xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:text-text [&_h2]:mt-6
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:text-text [&_h3]:mt-6
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:mb-1.5
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:mb-1.5
                    [&_a]:text-accent [&_a]:underline hover:[&_a]:text-accent
                    [&_strong]:font-bold [&_strong]:text-text
                    [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:mb-6 [&_blockquote]:bg-card/60 [&_blockquote]:italic [&_blockquote]:rounded-r-xl [&_blockquote]:text-text
                  "
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>

              {/* Mobile Sticky Bottom Registration Bar */}
              <div className="lg:hidden sticky bottom-6 z-50 flex items-center justify-center pointer-events-none mt-6">
                {isRegistrationOpen(event) ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full pointer-events-auto bg-accent hover:bg-accent/90 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_20px_var(--color-accent-glow)] text-text-inverse px-8 py-3.5 rounded-xl font-bold font-sans text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Register <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full pointer-events-auto bg-card border border-border text-text-muted px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                  >
                    Registration Closed
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Registration Sidebar (Hidden on Mobile) */}
            <div className="hidden lg:block w-[380px] flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                
                {/* Registration Card */}
                <div className="bg-card border border-border/80 rounded-2xl shadow-sm relative overflow-hidden">
                  {/* Status Banner */}
                  {new Date(event.date) < new Date() ? (
                    <div className="bg-card-hover text-text-muted border-b border-r border-border px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest flex justify-between items-center rounded-br-2xl inline-flex absolute top-0 left-0">
                      Completed
                    </div>
                  ) : isRegistrationOpen(event) ? (
                    <div className="bg-accent text-text-inverse px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest flex justify-between items-center rounded-br-2xl inline-flex absolute top-0 left-0 shadow-sm">
                      Registration Open
                    </div>
                  ) : (
                    <div className="bg-warning/90 text-text-inverse px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest flex justify-between items-center rounded-br-2xl inline-flex absolute top-0 left-0 shadow-sm">
                      Registration Closed
                    </div>
                  )}

                  <div className="p-6 pt-16">
                    {/* Organizer/Event Info */}
                    <div className="flex items-center gap-4 p-4 border border-border/80 rounded-xl mb-6">
                      <div className="w-12 h-12 bg-card-hover rounded-full border border-border flex items-center justify-center overflow-hidden">
                        <img 
                          src={ASSETS.IMAGES.CODEX_LOGO_ICON} 
                          alt="Codex Logo" 
                          className="w-full h-full object-cover p-1" 
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-text text-sm">{event.eventName}</h3>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isRegistrationOpen(event) ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent-glow)] text-text-inverse px-6 py-3.5 rounded-xl font-bold font-sans text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer"
                      >
                        Register <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="space-y-2">
                        <button disabled className="w-full bg-card-hover border border-border text-text-muted px-6 py-3.5 rounded-xl font-bold font-sans text-sm uppercase tracking-wider cursor-not-allowed">
                          Registration Closed
                        </button>
                        {event.registrationCloseDate && new Date(event.registrationCloseDate) < new Date() && (
                          <p className="text-[11px] font-mono text-center text-text-muted">
                            Registration deadline passed on{" "}
                            {new Date(event.registrationCloseDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Share Card */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
                  <span className="font-display font-black text-xl text-text uppercase leading-tight">
                    Share with<br />Friends
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-accent hover:bg-accent/90 hover:shadow-[0_0_16px_var(--color-accent-glow)] text-text-inverse px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>

          </div>
        </PageContainer>
      </div>
    </div>
  );
}
