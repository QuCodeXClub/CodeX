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
    <section id="faqs" className="relative font-mono flex flex-col py-16 lg:py-24">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="relative z-10 w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-12 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-accent text-[0.75rem] tracking-[0.34em] uppercase font-bold">KNOWLEDGE_BASE</span>
            <div className="h-[2px] w-12 bg-accent shadow-[0_0_8px_rgba(46,197,212,0.8)]"></div>
            <div className="w-[4px] h-[4px] border border-accent rounded-full shadow-[0_0_8px_rgba(46,197,212,0.8)]"></div>
          </div>
          <h2 className="font-sans text-[clamp(2.5rem,4vw,3.8rem)] font-bold uppercase text-text mb-4">
            FAQ
          </h2>
          <p className="text-text-muted text-sm font-mono max-w-xl leading-relaxed">
            Clear answers to your most pressing questions about the Codex Club.
          </p>
        </div>
        <div className="px-6 lg:px-12">
          {activeFaqs.length === 0 ? (
            <div className="text-center py-20 text-text-muted font-bold uppercase tracking-widest">
              No active entries found.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeFaqs.map((faq, index) => (
                <div
                  key={faq._id}
                  className="bg-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-border-soft overflow-hidden transition-all hover:border-accent/40"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left p-6 md:p-8 flex justify-between items-center focus:outline-none"
                  >
                    <h3 className="font-sans text-xl md:text-2xl font-bold uppercase text-text pr-8">
                      {faq.question}
                    </h3>
                    <div className="shrink-0 text-accent">
                      {openIndex === index ? (
                        <Minus className="w-6 h-6" />
                      ) : (
                        <Plus className="w-6 h-6" />
                      )}
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 md:p-8 pt-0 border-t border-dashed border-border-soft mt-2 text-text-muted text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
