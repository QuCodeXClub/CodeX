import React from "react";
import Button from "../../../components/common/Button";
import contentData from "../../../data/content.json";

const HeroSection = () => {
  const { hero } = contentData.landing;
  return (
    <>
      <section className="hero-panel relative overflow-hidden" id="about">
        <div className="ambient-glow w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bottom-[-10%] left-[-10%] lg:left-[-5%] z-0"></div>
        <div className="hero-copy relative z-10">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="hero-title text-reflect mb-12">
            <span>{hero.titlePart1}</span>
            <span className="hero-accent">{hero.titlePart2}</span>
          </h1>

          <p className="hero-quote">{hero.quote}</p>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-actions" id="join">
            <Button to="/events" variant="solid">
              {hero.ctaPrimary}
            </Button>
            <Button to="/team" variant="outline">
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>

        <aside className="hero-stats relative z-10" aria-label="Codex metrics">
          {hero.stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-text">{stat.text}</p>
            </article>
          ))}
        </aside>
      </section>
    </>
  );
};

export default HeroSection;
