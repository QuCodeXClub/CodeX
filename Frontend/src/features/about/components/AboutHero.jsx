import contentData from "../../../data/content.json";

const AboutHero = () => {
  const { about } = contentData;
  const { hero } = about;

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-24 pb-8 md:pb-12 px-6 lg:px-16 mt-8 md:mt-12">
      
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
       

        {/* Title */}
        <div className="relative mb-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 bg-accent/15 blur-3xl rounded-full pointer-events-none" />
          
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm relative z-10">
            {hero.eyebrow}
          </span>
          
          <h1 className="relative z-10 font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-text uppercase flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
            <span className="tracking-widest text-text drop-shadow-sm">
              {hero.titlePart1}
            </span>
            <span className="relative inline-flex items-center justify-center px-4 sm:px-7 py-1 sm:py-2.5 rounded-2xl bg-accent/10 border-2 border-accent text-accent shadow-[0_0_35px_var(--color-accent-glow)] transform -skew-x-6 hover:skew-x-0 hover:scale-105 transition-all duration-300 group cursor-default mt-2 sm:mt-0">
              <span className="relative z-10 text-accent font-black tracking-normal drop-shadow-md">
                {hero.titlePart2}
              </span>
              <span className="absolute inset-0 rounded-2xl bg-accent/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </span>
            <span className="tracking-widest text-text drop-shadow-sm mt-2 sm:mt-0">
              {hero.titlePart3}
            </span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-text-muted font-sans text-lg sm:text-xl leading-relaxed max-w-2xl">
          {hero.description}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
