import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import contentData from "../../../data/content.json";

const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState(contentData.faqs[0]?.category || "General");
  const [openIndex, setOpenIndex] = useState(null);

  const categories = contentData.faqs.map((f) => f.category);
  const currentCategoryData = contentData.faqs.find((f) => f.category === activeCategory);
  const activeFaqs = currentCategoryData?.items.filter((faq) => faq.isActive) || [];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Reduced vertical padding (py-8) and added min-h-screen/justify-center to fit on one page
    <section id="faqs" className="relative font-mono flex flex-col justify-center py-12 lg:py-20 overflow-hidden">
     
      
      {/* Increased max-width for the 2-column layout */}
      <div className="relative z-10 w-full mx-auto max-w-6xl">
        {/* Compressed header spacing */}
        <div className="px-4 lg:px-8 pb-8 lg:pb-12 text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-accent"></div>
            <p className="m-0 text-accent text-xs md:text-sm font-mono font-bold tracking-[0.25em] uppercase">
              // KNOWLEDGE BASE
            </p>
            <div className="w-6 h-[2px] bg-accent"></div>
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-text to-text/60 mb-3 drop-shadow-sm">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted text-sm md:text-base font-mono max-w-lg leading-[1.8]">
            Clear answers to your most pressing questions about the Codex Club.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 lg:px-8">
          {/* Category Tabs (Sidebar on desktop) */}
          <div className="w-full lg:w-1/4 shrink-0 flex flex-row lg:flex-col flex-wrap justify-center lg:justify-start gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenIndex(null); // Reset accordion when switching category
                }}
                className={`px-5 py-3 lg:px-6 lg:py-4 font-mono text-sm uppercase font-bold rounded-full lg:rounded-xl text-center lg:text-left transition-all duration-300 border ${
                  activeCategory === category 
                    ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(46,197,212,0.2)]"
                    : "bg-card/40 border-border-soft text-text-muted hover:border-accent/30 hover:text-text"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQs List */}
          <div className="w-full lg:w-3/4">
            {activeFaqs.length === 0 ? (
              <div className="text-center py-12 text-text-muted font-bold uppercase tracking-widest bg-card/20 backdrop-blur-md rounded-2xl border border-border-soft">
                No active entries found.
              </div>
            ) : (
              // Reduced gap between items to fit more on screen
              <div className="flex flex-col gap-3">
                {activeFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={faq._id}
                      className={`relative group bg-card/40 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border transition-all duration-500 overflow-hidden ${
                        isOpen 
                          ? "border-accent/60 shadow-[0_0_25px_rgba(46,197,212,0.12)] bg-card/60" 
                          : "border-border-soft hover:border-accent/30"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/0 to-transparent transition-opacity duration-500 pointer-events-none ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}></div>
                      
                      <button
                        onClick={() => toggleAccordion(index)}
                        // Reduced padding on the button
                        className="relative z-10 w-full text-left p-4 md:p-5 flex justify-between items-center focus:outline-none"
                      >
                        <h3 className={`font-sans text-lg md:text-xl font-bold uppercase transition-colors duration-300 pr-6 ${isOpen ? "text-accent drop-shadow-[0_0_8px_rgba(46,197,212,0.3)]" : "text-text group-hover:text-text/90"}`}>
                          {faq.question}
                        </h3>
                        
                        {/* Rotating Hexagon Container */}
                        <div 
                          className={`shrink-0 relative w-9 h-9 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                          style={{
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                          }}
                        >
                          {/* Hexagon Backgrounds */}
                          <div className={`absolute inset-0 transition-colors duration-500 ${
                            isOpen ? "bg-accent/20" : "bg-border-soft group-hover:bg-accent/10"
                          }`}></div>
                          
                          {/* Icons */}
                          {isOpen ? (
                            <Minus className="w-4 h-4 text-accent relative z-10 transition-opacity duration-300" />
                          ) : (
                            <Plus className="w-4 h-4 text-accent/70 group-hover:text-accent relative z-10 transition-opacity duration-300" />
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
                          {/* Reduced padding in the answer section */}
                          <div className="p-4 md:p-5 pt-0 mt-1 text-text-muted text-[0.9rem] leading-relaxed relative whitespace-pre-line">
                             <div className={`absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent transition-transform duration-700 origin-center ${isOpen ? "scale-x-100" : "scale-x-0"}`}></div>
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
      </div>
    </section>
  );
};

export default FaqSection;