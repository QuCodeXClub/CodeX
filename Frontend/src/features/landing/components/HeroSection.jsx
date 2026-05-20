import React from 'react';
import Button from '../../../components/common/Button';
import { stats } from '../../../constants/landingData';

const HeroSection = () => {
  return (
    <>
      <section className="hero-panel relative overflow-hidden" id="about">
        <div className="ambient-glow w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bottom-[-10%] left-[-10%] lg:left-[-5%] z-0"></div>
        <div className="hero-copy relative z-10">
          <p className="eyebrow">init sequence complete // active status</p>
                    <h1 className="hero-title text-reflect mb-12">
            <span>CODE</span>
            <span className="hero-accent">X</span>
          </h1>
          
          <p className="hero-quote">"Engineering the future, code by code."</p>
          <p className="hero-description">
            A high-frequency technical collective focused on protocol development,
            pixel-perfect UI architecture, and computational excellence.
          </p>

          <div className="hero-actions" id="join">
            <Button to="/events" variant="solid">
              explore events
            </Button>
            <Button to="/team" variant="outline">
              learn more
            </Button>
          </div>
        </div>

        <aside className="hero-stats relative z-10" aria-label="Codex metrics">
          {stats.map((stat) => (
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