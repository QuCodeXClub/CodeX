import React from "react";
import { Link } from "react-router-dom";

// Import your local SVG assets
import githubLogo from "../assets/footer/github-logo.svg";
import linkedinLogo from "../assets/footer/linkedin-logo.svg";
import instagramLogo from "../assets/footer/instagram-logo.svg";

const getSocialIcon = (name) => {
  const lowerName = name.toLowerCase();
  
  // Simple image tags. We use opacity for a clean hover effect.
  if (lowerName.includes("github")) {
    return <img src={githubLogo} alt="GitHub" className="w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity duration-200" />;
  }
  if (lowerName.includes("linkedin")) {
    return <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity duration-200" />;
  }
  if (lowerName.includes("instagram")) {
    return <img src={instagramLogo} alt="Instagram" className="w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity duration-200" />;
  }
  
  // Fallback text if an icon isn't found
  return <span className="text-xs font-bold uppercase tracking-wider group-hover:text-accent transition-colors">{name}</span>;
};

const Footer = ({ layout, onFooterClick }) => {
  const currentYear = new Date().getFullYear();
  const footerText = layout?.footerText 
    ? layout.footerText.replace("2026", currentYear)
    : `© ${currentYear} CodeX. ALL RIGHTS RESERVED.`;

  return (
    <footer className="border-t border-border bg-bg pt-16 pb-8 px-6 md:px-12">
      <div className=" mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
          
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
                    bg-card/60
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
              <Link to="/about" className="text-sm text-text-muted hover:text-accent transition-colors">About Us</Link>
              <Link to="/events" className="text-sm text-text-muted hover:text-accent transition-colors">Events</Link>
              <Link to="/team" className="text-sm text-text-muted hover:text-accent transition-colors">Team</Link>
              <Link to="/faqs" className="text-sm text-text-muted hover:text-accent transition-colors">FAQs</Link>
              <Link to="/contact" className="text-sm text-text-muted hover:text-accent transition-colors">Contact</Link>
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

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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