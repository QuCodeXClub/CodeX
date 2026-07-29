import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import contentData from "../../../data/content.json";

const FaqSection = () => {
  const activeFaqs = contentData.faqs.filter((faq) => faq.isActive);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative font-mono flex flex-col py-16 lg:py-32 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[800px] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10"></div>
      
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      
      <div className="relative z-10 w-full mx-auto max-w-[1000px]">
        <div className="px-6 lg:px-12 pb-12 text-center flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-accent text-[0.75rem] tracking-[0.34em] uppercase font-bold">KNOWLEDGE_BASE</span>
            <div className="h-[2px] w-12 bg-accent shadow-[0_0_8px_rgba(46,197,212,0.8)]"></div>
            <div className="w-[4px] h-[4px] border border-accent rounded-full shadow-[0_0_8px_rgba(46,197,212,0.8)] animate-pulse"></div>
          </div>
          <h2 className="font-sans text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase text-transparent bg-clip-text bg-gradient-to-b from-text to-text/60 mb-6 drop-shadow-sm">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted text-[1rem] font-mono max-w-xl leading-relaxed">
            Clear answers to your most pressing questions about the Codex Club.
          </p>
        </div>
        
        <div className="px-6 lg:px-12">
          {activeFaqs.length === 0 ? (
            <div className="text-center py-20 text-text-muted font-bold uppercase tracking-widest bg-card/20 backdrop-blur-md rounded-3xl border border-border-soft">
              No active entries found.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {activeFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq._id}
                    className={`relative group bg-card/40 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] border transition-all duration-500 overflow-hidden ${
                      isOpen 
                        ? "border-accent/60 shadow-[0_0_30px_rgba(46,197,212,0.15)]" 
                        : "border-border-soft hover:border-accent/30"
                    }`}
                  >
                    {/* Active Glow Layer */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/0 to-transparent transition-opacity duration-500 pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}></div>
                    
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="relative z-10 w-full text-left p-6 md:p-8 flex justify-between items-center focus:outline-none"
                    >
                      <h3 className={`font-sans text-xl md:text-2xl font-bold uppercase transition-colors duration-300 pr-8 ${isOpen ? "text-accent drop-shadow-[0_0_8px_rgba(46,197,212,0.3)]" : "text-text group-hover:text-text/90"}`}>
                        {faq.question}
                      </h3>
                      <div className="shrink-0 relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500">
                        <div className={`absolute inset-0 rounded-full transition-colors duration-500 ${isOpen ? "bg-accent/10" : "bg-card border border-border-soft group-hover:border-accent/30"}`}></div>
                        {isOpen ? (
                          <Minus className="w-5 h-5 text-accent relative z-10" />
                        ) : (
                          <Plus className="w-5 h-5 text-accent/70 group-hover:text-accent relative z-10" />
                        )}
                      </div>
                    </button>
                    
                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-6 md:p-8 pt-0 mt-2 text-text-muted text-[0.95rem] leading-relaxed relative">
                           {/* Subtle top divider line that grows when opened */}
                           <div className={`absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent transition-transform duration-700 origin-center ${isOpen ? "scale-x-100" : "scale-x-0"}`}></div>
                           {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
