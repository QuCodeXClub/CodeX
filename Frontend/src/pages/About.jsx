import React from "react";
import contentData from "../data/content.json";

const About = () => {
  const { about } = contentData;

  return (
    <div className="about-page min-h-screen bg-bg-soft relative font-jetbrains selection:bg-accent selection:text-white pb-24">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10  mx-auto px-6 pt-16 lg:pt-24">
        <header className="mb-16">
          <p className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            {about.eyebrow}
          </p>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-text mb-6 tracking-tight">
            {about.title}
          </h1>
          <div className="w-20 h-1 bg-accent mb-8"></div>
          <p className="text-text text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-6">
            {about.description}
          </p>
          <p className="text-text-muted leading-relaxed max-w-3xl">
            {about.mission}
          </p>
        </header>

        <section className="mb-16">
          <h2 className="font-oswald text-3xl font-bold uppercase text-text mb-8 border-b-2 border-border-soft pb-4">
            {about.activitiesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.activities.map((activity, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-2 border-border-soft hover:border-accent/30 transition-colors"
              >
                <div className="text-accent text-xs font-bold font-mono mb-3">
                  0{index + 1}
                </div>
                <h3 className="font-bold text-text text-lg mb-2">
                  {activity.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-text text-bg rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/80"></div>
          <p className="text-sm md:text-base font-medium opacity-90">
            {about.contact}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;