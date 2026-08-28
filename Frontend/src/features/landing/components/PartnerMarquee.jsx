import React from "react";
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

const PartnerMarquee = () => {
  const { partners } = contentData.landing;

  // Duplicate list to create a seamless infinite scroll effect
  const marqueeItems = [...partners.list, ...partners.list, ...partners.list, ...partners.list];

  return (
    <Link to="/about#partners" className="block py-2 md:py-3 border-y border-border-soft/30 overflow-hidden relative cursor-pointer group">
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none"></div>

      <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((org, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 flex items-center justify-center gap-4 px-10 md:px-14 w-max"
          >
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-accent/15 border border-accent/30" 
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              ></div>
              <div 
                className="absolute inset-[1px] bg-card/90" 
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              ></div>
              <img 
                src={logoMap[org.name]} 
                alt={`${org.name} logo`} 
                className="w-5 h-5 md:w-7 md:h-7 object-contain z-10 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
            <span className="font-sans text-base md:text-lg font-bold tracking-wider text-text-muted uppercase">
              {org.name}
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default PartnerMarquee;
