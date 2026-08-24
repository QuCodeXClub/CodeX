import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import contentData from "../../../data/content.json";

// Import local logos
import techThriveLogo from "../../../assets/about/techthrive-logo.svg";
import techSprintLogo from "../../../assets/about/techsprint-logo.svg";
import qHackathonLogo from "../../../assets/about/qhackathon-logo.svg";

const eventLogos = {
  "techthrive": techThriveLogo,
  "techsprint": techSprintLogo,
  "q-hackathon": qHackathonLogo,
};

const AboutFlagshipEvents = () => {
  const { flagshipEvents } = contentData.about;
  const events = flagshipEvents.events;

  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const ROTATION_INTERVAL = 6000; // 6 seconds per tab
  const UPDATE_INTERVAL = 30; // Update progress every 30ms

  // Reset progress when a new event is selected manually or automatically
  useEffect(() => {
    setProgress(0);
  }, [selectedEventIndex]);

  // Handle auto-rotation
  useEffect(() => {
    if (isHovered) return;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (UPDATE_INTERVAL / ROTATION_INTERVAL) * 100;
        if (nextProgress >= 100) {
          setSelectedEventIndex((prevIndex) => (prevIndex + 1) % events.length);
          return 0;
        }
        return nextProgress;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(progressTimer);
  }, [events.length, isHovered]);

  const selectedEvent = events[selectedEventIndex] || events[0];

  return (
    <section id="events" className="relative pt-4 pb-12 lg:pt-2 lg:pb-8 px-6 lg:px-16 overflow-hidden flex flex-col justify-center min-h-0 lg:min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto w-full">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 lg:mb-6">
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            {flagshipEvents.eyebrow}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text uppercase">
            {flagshipEvents.titlePart1} <span className="text-accent">{flagshipEvents.titlePart2}</span>
          </h2>
          <p className="mt-4 text-text-muted font-sans text-base sm:text-lg max-w-2xl">
            {flagshipEvents.description}
          </p>
        </div>

      </div>

      {/* Detailed Event Panel — wider, matches page max-width */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div
          className="relative bg-card/80 backdrop-blur-xl border border-border rounded-[2rem] overflow-hidden min-h-[480px] md:min-h-[550px] lg:min-h-[500px] flex w-full transition-all duration-700 ease-in-out shadow-lg group/panel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-border/50 z-30">
            <div
              className="h-full bg-accent transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Background Images */}
          <div className="absolute inset-0">
            {events.map((event, index) => (
              <div
                key={`img-${event.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${selectedEventIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <img
                  src={event.image?.src || "https://res.cloudinary.com/ddfwdj4jn/image/upload/v1787475195/3R5A5324_mlzhos.jpg"}
                  alt={event.image?.alt || event.name}
                  className="w-full h-full object-cover transform group-hover/panel:scale-[1.03] transition-transform duration-[10000ms] ease-out"
                />
              </div>
            ))}
            {/* Dark Gradient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
          </div>

          {/* Content Area Overlay */}
          <div className="relative z-30 w-full p-8 md:p-10 lg:p-12 flex flex-col justify-end">
            {events.map((event, index) => {
              const isActive = selectedEventIndex === index;
              if (!isActive) return null;

              return (
                <div
                  key={`content-${event.id}`}
                  className="flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={eventLogos[event.id]} alt={`${event.name} Logo`} className="h-10 md:h-12 object-contain drop-shadow-lg" />
                  </div>

                  <span className="inline-block px-3 py-1.5 rounded-md bg-accent/20 border border-accent/30 text-xs font-mono font-semibold text-white uppercase tracking-widest w-fit mb-3 backdrop-blur-md">
                    {event.tagline || "Flagship Event"}
                  </span>

                  <h3 className="font-display font-black text-4xl md:text-6xl text-white uppercase mb-3 tracking-tight drop-shadow-md">
                    {event.name}
                  </h3>

                  <p className="text-white/90 font-sans text-base md:text-lg leading-relaxed mb-6 drop-shadow-sm max-w-2xl">
                    {event.description}
                  </p>

                  {event.website && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-sans text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all duration-300 hover:-translate-y-1 group/btn border border-accent/50"
                      >
                        Visit Website <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Tab Selector Row — narrower, max-w-6xl */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex w-full justify-between gap-2 sm:gap-4">
          {events.map((event, index) => {
            const isActive = selectedEventIndex === index;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEventIndex(index)}
                className={`flex-1 flex flex-col items-center justify-center p-2 sm:p-4 h-20 sm:h-24 rounded-2xl transition-all duration-300 border backdrop-blur-xl ${isActive
                    ? "bg-accent/10 border-accent/50 shadow-[0_0_16px_var(--color-accent-glow)] -translate-y-0.5"
                    : "bg-card/50 border-border/50 hover:bg-card hover:border-accent/30"
                  }`}
                aria-selected={isActive}
                role="tab"
              >
                <img
                  src={eventLogos[event.id]}
                  alt={`${event.name} Logo`}
                  className={`h-6 sm:h-8 mb-1.5 object-contain transition-all duration-300 ${isActive ? "drop-shadow-[0_0_10px_var(--color-accent)] scale-110" : "opacity-70"}`}
                />
                <span className={`font-mono text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-tight sm:tracking-wider transition-colors duration-300 text-center ${isActive ? "text-accent" : "text-text-muted"}`}>
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

export default AboutFlagshipEvents;
