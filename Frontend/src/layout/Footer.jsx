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
    <footer className="relative overflow-hidden border-t border-border bg-card/20 backdrop-blur-md pt-20 pb-10 px-6 md:px-12">
         
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Column 1: Brand & Info */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <span 
              onClick={onFooterClick}
              className="cursor-pointer select-none font-sans text-3xl uppercase tracking-widest text-text inline-block w-max"
            >
              CODE<span className="text-accent">X</span>
            </span>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
              Empowering student developers through code, collaboration, and community.
            </p>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs text-text-muted font-sans tracking-widest uppercase">An initiative by</span>
              <img src={ASSETS.IMAGES.UNIVERSITY_LOGO_ICON} alt="Quantum University" className="h-5 w-5 object-contain" />
              <span className="text-xs text-text font-bold font-sans tracking-widest uppercase">Quantum University</span>
            </div>
            
            <div className="flex items-center gap-4 mt-5">
              {layout?.socials?.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.name}
                  className="
                    group
                    flex h-11 w-11 items-center justify-center
                    rounded-full
                    border border-border
                    bg-card/80
                    backdrop-blur-sm
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-accent
                    hover:bg-accent/10
                    hover:shadow-lg hover:shadow-accent/20
                  "
                >
                  {getSocialIcon(link.name)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-bold text-text uppercase tracking-widest text-xs">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              <Link to="/events" className="text-sm text-text-muted hover:text-accent transition-colors">Events</Link>
              <Link to="/team" className="text-sm text-text-muted hover:text-accent transition-colors">Team</Link>
            </div>
          </div>

          {/* Column 3: Legal & Privacy */}
          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-bold text-text uppercase tracking-widest text-xs">
              Legal & Privacy
            </h3>
            <div className="flex flex-col gap-3">
              <Link to="/privacy-policy" className="text-sm text-text-muted hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-sm text-text-muted hover:text-accent transition-colors">Terms & Conditions</Link>
              <Link to="/accessibility" className="text-sm text-text-muted hover:text-accent transition-colors">Accessibility</Link>
            </div>
          </div>

          {/* Column 4: Community */}
          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-bold text-text uppercase tracking-widest text-xs">
              Community
            </h3>
            <div className="flex flex-col gap-3">
              <Link to="/community-guidelines" className="text-sm text-text-muted hover:text-accent transition-colors">Guidelines</Link>
              <Link to="/event-policy" className="text-sm text-text-muted hover:text-accent transition-colors">Event Policy</Link>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted font-mono uppercase tracking-widest text-center md:text-left">
            {footerText}
          </p>
          
          {layout?.meta && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></div>
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