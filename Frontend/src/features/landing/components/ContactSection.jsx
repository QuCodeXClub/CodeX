import React from "react";
import Button from "../../../components/common/Button";
import contentData from "../../../data/content.json";
import { Users, Mail, ArrowRight } from "lucide-react";

const ContactSection = () => {
  const { contactSection } = contentData.landing;
  const highlightPhrase = "love to hear";
  const titleParts = contactSection.headline.split(highlightPhrase);

  return (
    <section className="bg-bg transition-colors duration-300 relative overflow-hidden py-16 lg:py-24 px-6 border-b border-border" id="contact">
      <div className="max-w-[1400px] mx-auto bg-bg-soft rounded-[24px] border border-border shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] relative z-20">
          <div className="relative p-10 lg:p-16 xl:p-20 flex flex-col justify-center overflow-hidden">
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-bg to-transparent pointer-events-none z-0"></div>
            <svg className="absolute top-10 right-10 w-24 h-24 text-accent/20 z-0 pointer-events-none hidden md:block" viewBox="0 0 96 96" fill="currentColor">
              {Array.from({ length: 36 }).map((_, i) => (
                <circle key={i} cx={(i % 6) * 16 + 8} cy={Math.floor(i / 6) * 16 + 8} r="1.5" />
              ))}
            </svg>
            <svg className="absolute bottom-10 left-10 w-24 h-24 text-accent/20 z-0 pointer-events-none hidden md:block" viewBox="0 0 96 96" fill="currentColor">
              {Array.from({ length: 36 }).map((_, i) => (
                <circle key={i} cx={(i % 6) * 16 + 8} cy={Math.floor(i / 6) * 16 + 8} r="1.5" />
              ))}
            </svg>
            <div className="absolute top-10 right-10 hidden lg:block z-0 pointer-events-none opacity-80 w-40 h-40">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_30px_rgba(46,197,212,0.15)]">
                <path d="M85 30C98.807 30 110 41.1929 110 55C110 68.8071 98.807 80 85 80C82.1643 80 79.4385 79.5276 76.9062 78.6659L65 85L70.1989 75.4674C64.6315 70.9238 60 63.454 60 55C60 41.1929 71.1929 30 85 30Z" stroke="currentColor" className="text-accent/30" strokeWidth="1" fill="var(--color-bg-soft)"/>
                <path d="M45 40C61.5685 40 75 51.1929 75 65C75 78.8071 61.5685 90 45 90C41.5283 90 38.2045 89.3791 35.1207 88.244L20 95L26.5401 84.1033C19.2982 79.1306 15 72.4831 15 65C15 51.1929 28.4315 40 45 40Z" stroke="currentColor" className="text-accent/40" strokeWidth="1.5" fill="var(--color-bg-soft)"/>
                <circle cx="33" cy="65" r="3" fill="var(--color-accent)"/>
                <circle cx="45" cy="65" r="3" fill="var(--color-accent)"/>
                <circle cx="57" cy="65" r="3" fill="var(--color-accent)"/>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-8">
                <p className="m-0 text-accent text-[0.75rem] font-mono font-bold tracking-[0.2em] uppercase mb-2"> // {contactSection.eyebrow}</p>
                <div className="w-8 h-[2px] bg-accent"></div>
              </div>
              <h2 className="font-sans text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-text mb-8">{titleParts.length === 2 ? (<>{titleParts[0]} <span className="text-accent drop-shadow-[0_0_15px_rgba(46,197,212,0.3)]">{highlightPhrase}</span>{titleParts[1]}</>):(contactSection.headline)}</h2>
              <div className="flex items-center gap-1.5 mb-8 text-accent">
                <div className="w-8 h-[2px] bg-accent"></div>
                <div className="w-3 h-[2px] bg-accent"></div>
                <div className="w-3 h-[2px] bg-accent"></div>
                <div className="w-3 h-[2px] bg-accent"></div>
              </div>
              <p className="text-text-muted transition-colors duration-300 font-mono text-[0.95rem] leading-[1.8] max-w-md mb-12">{contactSection.description}
              </p>
              <Button
                to="/contact"
                variant="solid"
                className="group relative inline-flex items-center gap-4 px-[2rem] py-[1.2rem] bg-text text-bg font-sans text-[0.9rem] font-bold tracking-[0.2em] uppercase rounded-sm hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="relative z-10">{contactSection.ctaPrimary}</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-border-soft">
            {contactSection.directLines.map((line, index) => {
              const Icon = index === 0 ? Users : Mail;
              return (
                <article
                  key={index}
                  className="flex-1 p-10 lg:p-16 flex flex-col justify-center border-b border-border-soft last:border-b-0 hover:bg-card/60 transition-colors duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-8 border border-accent/20">
                    <Icon size={28} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <p className="text-accent text-[0.7rem] font-mono tracking-[0.25em] uppercase font-bold mb-3">{line.label}</p>
                  <h3 className="font-sans text-[1.8rem] font-bold text-text uppercase tracking-wide mb-3">{line.name}</h3>
                  <div>
                    <a href={`mailto:${line.detail}`} className="font-mono text-[0.95rem] text-text-muted hover:text-accent transition-colors relative inline-block group">{line.detail}
                      <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-accent opacity-50 group-hover:opacity-100 transition-opacity"></span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
