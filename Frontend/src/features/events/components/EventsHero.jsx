import React from "react";
import Button from "../../../components/common/Button";
import { Play } from "lucide-react";
import content from "../../../data/content.json";
import hackathonImg from "../../../assets/events/hackthon.jpg";
import contestImg from "../../../assets/events/contest.jpg";
import webinarImg from "../../../assets/events/webinar.jpg";
const EventsHero = () => {
  const { eventsHero } = content;
  const images = {
  hackathon: hackathonImg,
  contest: contestImg,
  webinar: webinarImg,
};
  return (
    <section className="relative overflow-hidden border-b border-line bg-[#f8f5f0] pt-16 pb-24 lg:pt-24 lg:pb-32 px-[1.15rem] lg:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <span className="inline-block px-4 py-1.5 border border-line rounded-full text-xs font-mono tracking-widest uppercase mb-8 bg-white/50 backdrop-blur-sm">
            {eventsHero.badge}
          </span>
          <h1 className="font-sans text-[clamp(4rem,7vw,6.5rem)] leading-[0.85] tracking-tight uppercase mb-6">
            {eventsHero.title.line1}
            <br />
            <span className="text-accent">{eventsHero.title.highlight}</span>
          </h1>
          <p className="text-ink/60 max-w-md text-lg mb-10 leading-relaxed">
            {eventsHero.description}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Button to="#upcoming" variant="solid">
              Explore Events →
            </Button>
            
          </div>
        </div>
        <div className="relative h-[400px] hidden lg:block">
  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
    <span className="text-[30rem] font-sans font-bold text-accent leading-none">
      X
    </span>
  </div>

  {eventsHero.cards.map((card) => (
    <div
      key={card.id}
      className={`${card.className}
  rounded-xl
  overflow-hidden
  shadow-2xl
  border border-white/20
  cursor-pointer
  transition-all duration-500
  hover:scale-105
  hover:rotate-0
  hover:z-50
  hover:opacity-100
`}>
      <img
        src={images[card.image]}
        alt={card.title}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white font-sans text-2xl uppercase leading-tight">
          {card.title}
        </h3>

        <p className="text-accent text-xs font-mono tracking-widest mt-1">
          {card.subtitle}
        </p>

        <p className="text-white/70 text-xs font-mono mt-4">
          {card.date}
        </p>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
};

export default EventsHero;
