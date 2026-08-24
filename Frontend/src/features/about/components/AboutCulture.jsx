import contentData from "../../../data/content.json";

const classNames = {
  learn: "md:col-span-1 min-h-[320px] md:min-h-[400px]",
  build: "md:col-span-1 md:row-span-2 min-h-[320px] md:min-h-[600px]",
  compete: "md:col-span-1 min-h-[320px] md:min-h-[400px]",
  grow: "md:col-span-2 min-h-[320px] md:min-h-[400px]"
};

const AboutCulture = () => {
  const { community } = contentData.about;
  const cultureItems = community.principles.map((principle, index) => ({
    id: principle.id,
    title: principle.title.toUpperCase(),
    desc: principle.description,
    image: community.images[index]?.src,
    className: classNames[principle.id] || "md:col-span-1 min-h-[320px]"
  }));
  return (
    <section id="community" className="relative pt-8 pb-16 lg:pt-4 lg:pb-16 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            {community.eyebrow}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text uppercase leading-tight">
            {community.titlePart1}<br/>
            <span className="text-accent">{community.titlePart2}</span>
          </h2>
          <p className="mt-6 text-text-muted font-sans text-base sm:text-lg max-w-2xl">
            {community.description}
          </p>
        </div>

        {/* Editorial Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 auto-rows-min">
          {cultureItems.map((item) => (
            <div 
              key={item.id}
              className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-card ${item.className}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-[1.04] transition-transform duration-1000 ease-out"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500 mix-blend-overlay" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  
                  {/* Badge */}
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-bg/60 backdrop-blur-md border border-border/50 shadow-sm mb-4">
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-accent tracking-widest uppercase">
                      {item.title}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-lg sm:text-xl text-text font-medium leading-snug drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity duration-500 max-w-md">
                    {item.desc}
                  </p>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutCulture;
