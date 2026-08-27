import React from "react";
import { Link } from "react-router-dom";
import { ASSETS } from "../config/assets";

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const getSocialIcon = (name) => {
  const lowerName = name.toLowerCase();
  const iconClass = "w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity duration-200 group-hover:text-accent text-text";

  if (lowerName.includes("github")) {
    return <GithubIcon className={iconClass} />;
  }
  if (lowerName.includes("linkedin")) {
    return <LinkedinIcon className={iconClass} />;
  }
  if (lowerName.includes("instagram")) {
    return <InstagramIcon className={iconClass} />;
  }
  
  return <span className="text-xs font-bold uppercase tracking-wider group-hover:text-accent transition-colors">{name}</span>;
};

const Footer = ({ layout, onFooterClick }) => {
  const currentYear = new Date().getFullYear();
  const footerText = layout?.footerText 
    ? layout.footerText.replace("2026", currentYear)
    : `© ${currentYear} CodeX. ALL RIGHTS RESERVED.`;

  return (
    <footer className="relative overflow-hidden border-t border-border/80 bg-card/60 backdrop-blur-xl pt-16 pb-8 px-6 md:px-12 mt-auto">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Column 1: Brand & Info */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <span 
                onClick={onFooterClick}
                className="cursor-pointer select-none font-display font-black text-3xl uppercase tracking-widest text-text inline-block hover:text-accent transition-colors"
              >
                CODE<span className="text-accent">X</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                SYSTEM OPERATIONAL
              </span>
            </div>

            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
              Empowering student developers through code, innovation, collaboration, and community building.
            </p>
            
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card-hover/50 border border-border/60 w-fit">
              <span className="text-xs text-text-muted font-mono tracking-wider uppercase">AN INITIATIVE BY</span>
              <img src={ASSETS.IMAGES.UNIVERSITY_LOGO_ICON} alt="Quantum University" className="h-5 w-5 object-contain" />
              <span className="text-xs text-text font-bold font-sans tracking-wider uppercase">Quantum University</span>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              {layout?.socials?.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.name}
                  className="
                    group
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    border border-border
                    bg-card/80
                    backdrop-blur-sm
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-accent/60
                    hover:bg-accent/10
                    hover:shadow-md hover:shadow-accent/10
                  "
                >
                  {getSocialIcon(link.name)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono font-bold text-accent uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link to="/events" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Events</Link>
              <Link to="/team" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Team Roster</Link>
              <Link to="/register" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Register</Link>
            </div>
          </div>

          {/* Column 3: Legal & Privacy */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono font-bold text-accent uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Legal & Compliance
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link to="/privacy-policy" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Terms & Conditions</Link>
              <Link to="/accessibility" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Accessibility</Link>
            </div>
          </div>

          {/* Column 4: Community */}
          <div className="flex flex-col gap-4">
            <h3 className="font-mono font-bold text-accent uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Governance
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link to="/community-guidelines" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Guidelines</Link>
              <Link to="/event-policy" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Event Policy</Link>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p 
            onClick={onFooterClick}
            className="text-xs text-text-muted font-mono uppercase tracking-wider text-center md:text-left select-none cursor-pointer hover:text-accent transition-colors"
          >
            {footerText}
          </p>
          
          {layout?.meta && (
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                {layout.meta}
              </p>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;