import React from "react";
import contentData from "../../../data/content.json";

const PartnerSection = () => {
  const { partners } = contentData.landing;

  return (
    <section className="border-b border-line bg-bg flex flex-col" id="partners">
      
      {/* Header Area */}
      <div className="p-[1.15rem] py-[4rem] lg:p-[5rem] border-b border-line flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-[50rem]">
          <h2 className="font-sans text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[0.01em] uppercase text-ink mb-6">
            {partners.title}
          </h2>
          <p className="font-mono text-ink/60 text-[0.95rem] leading-[1.8] max-w-[36rem]">
            {partners.description}
          </p>
        </div>
        
        {/* Decorative elements to fit the tech/coding vibe */}
        <div className="hidden lg:flex gap-2">
          <div className="w-3 h-3 bg-ink"></div>
          <div className="w-3 h-3 bg-accent"></div>
          <div className="w-3 h-3 border border-ink"></div>
        </div>
      </div>

      {/* Rigid Logo Grid */}
      {/* Uses a strict 2-column grid on mobile, 4-column on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-bg-soft">
        {partners.list.map((org, index) => (
          <article 
            key={index}
            className={`
              relative aspect-[3/2] flex items-center justify-center p-6
              border-r border-b border-line
              hover:bg-ink hover:text-white transition-colors duration-200 cursor-pointer group
              /* Remove right border on the last item of a row depending on screen size */
              ${(index + 1) % 2 === 0 ? 'lg:border-r' : ''}
              ${(index + 1) % 4 === 0 ? 'lg:border-r-0' : ''}
            `}
          >
            {/* If you add actual image logos later, you can replace this text span with an <img> tag */}
            <span className="font-sans text-[clamp(1.5rem,2.5vw,2rem)] tracking-[0.15em] uppercase text-ink group-hover:text-white transition-colors">
              {org.name}
            </span>
            
            {/* Brutalist crosshair decorative corners on hover */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </article>
        ))}
      </div>
      
    </section>
  );
};

export default PartnerSection;