import React, { useState, useEffect, memo } from "react";
import { ArrowRight, ZoomIn } from "lucide-react";
import contentData from "../../../data/content.json";
import { ASSETS } from "../../../config/assets";
import { useImageZoom } from "../../../context/ImageZoomContext";

// Import local vector logos
import techThriveLogo from "../../../assets/about/techthrive-logo.svg";
import techSprintLogo from "../../../assets/about/techsprint-logo.svg";
import qHackathonLogo from "../../../assets/about/qhackathon-logo.svg";

/**
 * Event identifier to vector logo asset mapping.
 */
const EVENT_LOGOS = {
  techthrive: techThriveLogo,
  techsprint: techSprintLogo,
  "q-hackathon": qHackathonLogo,
};

const ROTATION_INTERVAL_MS = 6000; // 6 seconds per auto-slide
const DEFAULT_FALLBACK_IMAGE =
  "https://res.cloudinary.com/ddfwdj4jn/image/upload/f_auto,q_auto,w_1200/v1787475195/3R5A5324_mlzhos.jpg";

/**
 * AboutFlagshipEvents Component
 * 
 * Displays CodeX's flagship events (TechThrive, Q-Hackathon, TechSprint)
 * in an interactive, accessible, hardware-accelerated carousel with
 * infinite auto-rotation, pause-on-hover, and keyboard navigation.
 */
const AboutFlagshipEvents = () => {
  const { openImage } = useImageZoom();
  const flagshipData = contentData.about?.flagshipEvents;
  const events = flagshipData?.events || [];

  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide rotation effect (pauses on hover)
  useEffect(() => {
    if (isHovered || events.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [events.length, isHovered]);

  const handleTabClick = (index) => {
    setSelectedEventIndex(index);
  };

  const handleTabKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedEventIndex(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelectedEventIndex((index + 1) % events.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelectedEventIndex((index - 1 + events.length) % events.length);
    }
  };

  const currentEvent = events[selectedEventIndex];
  const currentImageSrc = (currentEvent?.image?.assetKey ? ASSETS.IMAGES[currentEvent.image.assetKey] : currentEvent?.image?.src) || DEFAULT_FALLBACK_IMAGE;

  if (!events.length) return null;

  return (
    <section
      id="events"
      aria-label="Flagship Events Section"
      className="relative pt-6 pb-14 md:pt-4 md:pb-16 px-4 sm:px-6 lg:px-16 overflow-hidden flex flex-col justify-center scroll-mt-20 md:scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            {flagshipData?.eyebrow || "FLAGSHIP EVENTS"}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text uppercase">
            {flagshipData?.titlePart1 || "Where Ideas Become"}{" "}
            <span className="text-accent">
              {flagshipData?.titlePart2 || "Action"}
            </span>
          </h2>
          <p className="mt-4 text-text-muted font-sans text-base sm:text-lg max-w-2xl">
            {flagshipData?.description}
          </p>
        </div>
      </div>

      {/* Detailed Event Panel */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div
          className="relative bg-card/95 border border-border rounded-[2rem] overflow-hidden min-h-[440px] sm:min-h-[480px] md:min-h-[520px] flex w-full shadow-lg group/panel transform-gpu cursor-zoom-in"
          data-zoom-src={currentImageSrc}
          data-zoom-alt={currentEvent?.image?.alt || currentEvent?.name}
          onClick={() => openImage({ src: currentImageSrc, alt: currentEvent?.image?.alt || currentEvent?.name })}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top Progress Bar - Hardware Accelerated CSS Animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-border/40 z-30 overflow-hidden">
            <div
              key={selectedEventIndex}
              className="h-full bg-accent origin-left w-full transform-gpu"
              style={{
                animation: `progressGrow ${ROTATION_INTERVAL_MS}ms linear forwards`,
                animationPlayState: isHovered ? "paused" : "running",
              }}
            />
          </div>

          {/* Zoom Badge on Hover */}
          <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-300 bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg pointer-events-none">
            <ZoomIn size={14} className="text-accent" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Click to Zoom</span>
          </div>

          {/* Background Images */}
          <div className="absolute inset-0 pointer-events-none">
            {events.map((event, index) => {
              const isSelected = selectedEventIndex === index;
              const optimizedSrc = (event.image?.assetKey ? ASSETS.IMAGES[event.image.assetKey] : event.image?.src) || DEFAULT_FALLBACK_IMAGE;

              return (
                <div
                  key={`img-${event.id}`}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    isSelected
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                  aria-hidden={!isSelected}
                >
                  <img
                    src={optimizedSrc}
                    alt={event.image?.alt || event.name}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu group-hover/panel:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              );
            })}
            {/* Dark Gradient Backdrop for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 z-20 pointer-events-none" />
          </div>

          {/* Content Area Overlay */}
          <div className="relative z-30 w-full p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-end pointer-events-none">
            {events.map((event, index) => {
              const isSelected = selectedEventIndex === index;
              const logoSrc = EVENT_LOGOS[event.id];

              return (
                <div
                  key={`content-${event.id}`}
                  id={`panel-${event.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${event.id}`}
                  className={`flex flex-col max-w-3xl transition-all duration-400 ease-out ${
                    isSelected
                      ? "opacity-100 translate-y-0 relative z-10 pointer-events-auto"
                      : "opacity-0 translate-y-3 absolute inset-x-6 sm:inset-x-8 md:inset-x-10 lg:inset-x-12 bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 z-0 pointer-events-none"
                  }`}
                  aria-hidden={!isSelected}
                >
                  {logoSrc && (
                    <div className="flex items-center gap-4 mb-3 sm:mb-4">
                      <img
                        src={logoSrc}
                        alt={`${event.name} Logo`}
                        loading="lazy"
                        decoding="async"
                        className="h-9 sm:h-11 md:h-12 object-contain drop-shadow"
                      />
                    </div>
                  )}

                  <span className="inline-block px-3 py-1 rounded-md bg-accent/20 border border-accent/40 text-xs font-mono font-semibold text-white uppercase tracking-widest w-fit mb-3">
                    {event.tagline || "Flagship Event"}
                  </span>

                  <h3 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase mb-3 tracking-tight drop-shadow-md">
                    {event.name}
                  </h3>

                  <p className="text-white/90 font-sans text-sm sm:text-base md:text-lg leading-relaxed mb-6 drop-shadow-sm max-w-2xl">
                    {event.description}
                  </p>

                  {event.website && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-accent text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all duration-300 hover:-translate-y-0.5 group/btn border border-accent/50 cursor-pointer"
                      >
                        Visit Website{" "}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Selector Row */}
      <div className="w-full max-w-6xl mx-auto">
        <div
          className="flex w-full justify-between gap-2 sm:gap-4"
          role="tablist"
          aria-label="Flagship Events Selector"
        >
          {events.map((event, index) => {
            const isActive = selectedEventIndex === index;
            const logoSrc = EVENT_LOGOS[event.id];

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => handleTabClick(index)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`flex-1 flex flex-col items-center justify-center p-2 sm:p-4 h-20 sm:h-24 rounded-2xl transition-all duration-200 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "bg-accent/10 border-accent shadow-[0_0_14px_var(--color-accent-glow)] -translate-y-0.5"
                    : "bg-card/70 border-border/70 hover:bg-card hover:border-accent/40"
                }`}
                aria-selected={isActive}
                role="tab"
                id={`tab-${event.id}`}
                aria-controls={`panel-${event.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className={`h-5 sm:h-7 md:h-8 mb-1.5 object-contain transition-transform duration-200 ${
                      isActive ? "scale-110" : "opacity-75"
                    }`}
                  />
                )}
                <span
                  className={`font-mono text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-tight sm:tracking-wider transition-colors duration-200 text-center ${
                    isActive ? "text-accent font-black" : "text-text-muted"
                  }`}
                >
                  {event.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

AboutFlagshipEvents.displayName = "AboutFlagshipEvents";

export default memo(AboutFlagshipEvents);
