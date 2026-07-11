import React from "react";
import Button from "../../../components/common/Button";
import contentData from "../../../data/content.json";

const ContactSection = () => {
  const { contactSection } = contentData.landing;

  return (
    <section className="border-b border-line bg-[#faf6ef]/66 flex flex-col" id="contact">
      
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] items-stretch">
        
        {/* Left Area: Unified Message & Primary Action */}
        <div className="p-[1.15rem] py-[4rem] lg:p-[5rem] flex flex-col justify-center relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="ambient-glow w-[300px] h-[300px] bottom-[-10%] left-[-5%] z-0 opacity-20"></div>
          
          <div className="relative z-10">
            <h3 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1] mb-6 text-ink max-w-[36rem]">
              {contactSection.headline}
            </h3>
            
            <p className="font-mono text-ink/60 text-[0.95rem] leading-[1.8] max-w-[42rem] mb-10">
              {contactSection.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button to="/contact" variant="solid" className="button button--solid w-full sm:w-auto">
                {contactSection.ctaPrimary}
              </Button>
            </div>
          </div>
        </div>

        <aside className="border-t lg:border-t-0 lg:border-l border-line flex flex-col bg-bg-soft">
          {contactSection.directLines.map((line, index) => (
            <article
              key={index}
              className="flex-1 p-[2rem] lg:p-[2.5rem] border-b border-line last:border-b-0 hover:bg-white/60 transition-colors flex flex-col justify-center"
            >
              <p className="text-accent text-[0.72rem] tracking-[0.25em] uppercase font-bold mb-3">
                {line.label}
              </p>
              <p className="font-sans text-[1.35rem] text-ink uppercase tracking-wide mb-1">
                {line.name}
              </p>
              <a 
                href={`mailto:${line.detail}`}
                className="font-mono text-[0.85rem] text-ink/50 hover:text-ink transition-colors underline decoration-line-soft underline-offset-4"
              >
                {line.detail}
              </a>
            </article>
          ))}
        </aside>

      </div>
    </section>
  );
};

export default ContactSection;