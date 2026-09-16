import React from "react";
import { Link } from "react-router-dom";
import { ASSETS } from "../config/assets";
import { CodeXLogo } from "../components/common/CodeXLogo";

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

const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
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
  if (lowerName.includes("youtube")) {
    return <YoutubeIcon className={iconClass} />;
  }
  if (lowerName.includes("x") || lowerName.includes("twitter")) {
    return <XIcon className={iconClass} />;
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
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">

          {/* Column 1: Brand & Info */}
          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex items-center gap-3">
              <div
                onClick={onFooterClick}
                className="cursor-pointer select-none inline-flex items-center group"
                aria-label="CodeX Logo"
              >
                <CodeXLogo className="h-6 sm:h-7 w-auto text-text transition-transform duration-300 group-hover:scale-105" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                SYSTEM OPERATIONAL
              </span>
            </div>

            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
              Empowering student developers through code, innovation, collaboration, and community building.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card-hover/50 border border-border/60 w-fit">
                <span className="text-xs text-text-muted font-mono tracking-wider uppercase">AN INITIATIVE BY</span>
                <img src={ASSETS.IMAGES.UNIVERSITY_LOGO_ICON} alt="Quantum University" className="h-5 w-5 object-contain" />
                <span className="text-xs text-text font-bold font-sans tracking-wider uppercase">Quantum University</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Quantum+University,+22+Km+Milestone,+Roorkee%E2%80%93Dehradun+Highway,+NH+73,+Mandawar,+Roorkee,+Uttarakhand+247167,+India"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 group w-full sm:w-fit sm:max-w-[340px]"
                aria-label="View Quantum University on Google Maps"
              >
                <MapPinIcon className="w-4 h-4 mt-1 text-accent shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-text-muted group-hover:text-text transition-colors leading-relaxed break-words">
                  Quantum University, 22 Km Milestone, Roorkee–Dehradun Highway, NH 73, Mandawar, Roorkee, Uttarakhand 247167, India.
                </span>
              </a>
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
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

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16">
            
            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-mono font-bold text-accent uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Navigation
              </h3>
              <div className="flex flex-col gap-2.5">
                <Link to="/events" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Events</Link>
                <Link to="/team" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Team Roster</Link>
                <Link to="/about" state={{ scrollTo: "partners" }} className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Partners</Link>
                <Link to="/" state={{ scrollTo: "contact" }} className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Contact</Link>
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
                <Link to="/payment-registration-guide" className="text-sm text-text-muted hover:text-accent transition-colors w-fit">Payment & Registration Guide</Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <p
            onClick={onFooterClick}
            className="text-xs text-text-muted font-mono uppercase tracking-wider text-center md:text-left select-none cursor-pointer hover:text-accent transition-colors"
          >
            {footerText}
          </p>

          {layout?.meta && (
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest text-center md:text-right">
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