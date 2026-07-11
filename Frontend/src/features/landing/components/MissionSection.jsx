import React from "react";
import Button from "../../../components/common/Button";
import contentData from "../../../data/content.json";

const MissionSection = () => {
  const { mission } = contentData.landing;

  return (
    <section className="border-b border-line bg-panel text-[#f4efe6] relative overflow-hidden" id="vision">
      {/* Subtle ambient glow locked to the dark background */}

      <div className="relative z-10 px-[1.15rem] py-16 lg:px-12 lg:py-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        
        <div className="max-w-[54rem]">
          <p className="eyebrow !text-accent mb-6">{mission.eyebrow}</p>
          
          <h2 className="font-serif text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.15] mb-8 text-[#f4efe6]">
            {mission.headline}
          </h2>
          
          <p className="font-mono text-[#f4efe6]/75 text-[0.95rem] lg:text-[1.05rem] leading-[1.8] max-w-[48rem]">
            {mission.description}
          </p>
        </div>

        <div className="w-full lg:w-auto shrink-0 pb-2">
          {/* Brutalist outline button adapted for dark mode */}
          <Button 
            to="/about" 
            variant="outline" 
            className="button w-full lg:w-[220px] border-[#f4efe6]/30 text-[#f4efe6] hover:bg-[#f4efe6] hover:text-panel transition-colors"
          >
            {mission.cta}
          </Button>
        </div>

      </div>
    </section>
  );
};

export default MissionSection;