import React, { memo } from "react";
import { Link } from "react-router-dom";
import contentData from "../../../data/content.json";
import { ASSETS } from "../../../config/assets";

const logoMap = {
  "HackIndia": ASSETS.IMAGES.PARTNER_HACKINDIA,
  "Unstop": ASSETS.IMAGES.PARTNER_UNSTOP,
  "Hostinger": ASSETS.IMAGES.PARTNER_HOSTINGER,
  ".xyz": ASSETS.IMAGES.PARTNER_XYZ,
  "CodeChef": ASSETS.IMAGES.PARTNER_CODECHEF,
  "Blackbox": ASSETS.IMAGES.PARTNER_BLACKBOX,
  "CollageCart": ASSETS.IMAGES.PARTNER_COLLAGECART,
  "CodeCrafters": ASSETS.IMAGES.PARTNER_CODECRAFTERS,
  "Memcode": ASSETS.IMAGES.PARTNER_MEMCODE
};

const MarqueeTrack = memo(({ partners, isAriaHidden = false }) => (
  <div
    className="flex shrink-0 items-center justify-around gap-8 sm:gap-12 md:gap-16 pr-8 sm:pr-12 md:pr-16 animate-marquee group-hover:[animation-play-state:paused] transform-gpu will-change-transform"
    aria-hidden={isAriaHidden}
  >
    {partners.map((org, index) => {
      const logoUrl = logoMap[org.name];
      return (
        <div 
          key={`${org.name}-${index}`} 
          className="flex-shrink-0 flex items-center gap-3 sm:gap-4 select-none"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-card/80 border border-border-soft flex items-center justify-center shadow-sm group-hover/item:border-accent/50 transition-colors">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${org.name} logo`} 
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="font-mono text-xs font-bold text-accent">
                {org.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-sans text-sm sm:text-base font-bold tracking-wider text-text-muted/90 uppercase whitespace-nowrap">
            {org.name}
          </span>
        </div>
      );
    })}
  </div>
));

MarqueeTrack.displayName = "MarqueeTrack";

const PartnerMarquee = () => {
  const partnersList = contentData.landing?.partners?.list || [];

  if (!partnersList.length) return null;

  return (
    <div className="w-full py-3 sm:py-4 border-y border-border-soft/40 bg-card/20 overflow-hidden relative group">
      {/* Side gradient blur overlays */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-bg via-bg/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-bg via-bg/80 to-transparent z-10 pointer-events-none" />

      <Link 
        to="/about"
        state={{ scrollTo: "partners" }}
        className="flex w-full overflow-hidden focus:outline-none"
        aria-label="View all partners on About page"
      >
        {/* Track 1 */}
        <MarqueeTrack partners={partnersList} />
        {/* Track 2 (Seamless infinite continuation) */}
        <MarqueeTrack partners={partnersList} isAriaHidden={true} />
      </Link>
    </div>
  );
};

export default memo(PartnerMarquee);
