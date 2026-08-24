import React, { memo } from "react";
import contentData from "../../../data/content.json";
import { optimizeCloudinaryUrl } from "../../../utils/helpers";

const classNames = {
  learn: "md:col-span-1 min-h-[300px] md:min-h-[380px]",
  build: "md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-[580px]",
  compete: "md:col-span-1 min-h-[300px] md:min-h-[380px]",
  grow: "md:col-span-2 min-h-[300px] md:min-h-[380px]",
};

const { community } = contentData.about;
const cultureItems = community.principles.map((principle, index) => ({
  id: principle.id,
  title: principle.title.toUpperCase(),
  desc: principle.description,
  image: optimizeCloudinaryUrl(community.images[index]?.src, 800),
  className: classNames[principle.id] || "md:col-span-1 min-h-[300px]",
}));

const AboutCulture = () => {
  return (
    <section
      id="community"
      className="relative pt-8 pb-16 lg:pt-4 lg:pb-16 px-4 sm:px-6 lg:px-16 overflow-hidden [content-visibility:auto] [contain-intrinsic-size:800px]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            {community.eyebrow}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text uppercase leading-tight">
            {community.titlePart1}
            <br />
            <span className="text-accent">{community.titlePart2}</span>
          </h2>
          <p className="mt-4 md:mt-6 text-text-muted font-sans text-base sm:text-lg max-w-2xl">
            {community.description}
          </p>
        </div>

        {/* Editorial Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 auto-rows-min">
          {cultureItems.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card ${item.className} transform-gpu`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  />
                )}
              </div>

              {/* High-Performance Smooth Gradient Overlays without mix-blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end">
                <div className="transform-gpu translate-y-1 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  {/* Badge */}
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 shadow-sm mb-3">
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-accent tracking-widest uppercase">
                      {item.title}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-base sm:text-lg md:text-xl text-white font-medium leading-snug drop-shadow-md opacity-95 group-hover:opacity-100 transition-opacity duration-300 max-w-md">
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

export default memo(AboutCulture);
