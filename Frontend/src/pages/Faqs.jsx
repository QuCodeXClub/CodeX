import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import contentData from "../data/content.json";

const Faqs = () => {
  const activeFaqs = contentData.faqs.filter((faq) => faq.isActive);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#Faf9f6] relative font-jetbrains flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="relative z-10 w-full max-w-[1000px] mx-auto pb-20">
        <div className="pt-16 px-6 lg:px-12 pb-12">
          <p className="text-[#2ec5d4] text-xs font-bold uppercase tracking-widest mb-3">
            SYS_MODULE: KNOWLEDGE_BASE
          </p>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-[#0a0a0a] mb-3">
            FAQ
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Clear answers to your most pressing questions about the Codex Club.
          </p>
        </div>
        <div className="px-4 lg:px-12">
          {activeFaqs.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
              No active entries found.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeFaqs.map((faq, index) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-2 border-gray-100 overflow-hidden transition-all hover:border-[#2ec5d4]/50"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left p-6 md:p-8 flex justify-between items-center focus:outline-none"
                  >
                    <h3 className="font-oswald text-2xl font-bold uppercase text-[#0a0a0a] pr-8">
                      {faq.question}
                    </h3>
                    <div className="shrink-0 text-[#2ec5d4]">
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
                      <div className="p-6 md:p-8 pt-0 border-t-2 border-dashed border-gray-100 mt-2 text-gray-600 text-sm leading-relaxed">
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
    </div>
  );
};

export default Faqs;
