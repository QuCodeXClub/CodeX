import React from 'react';
import Button from '../../../components/common/Button';
import { stats } from '../../../constants/landingData';

const HeroSection = () => {
  return (
    <section className="hero-panel" id="about">
      <div className="hero-copy">
        <p className="eyebrow">init sequence complete // active status</p>
        <h1 className="hero-title">
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

      <aside className="hero-stats" aria-label="Codex metrics">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-text">{stat.text}</p>
          </article>
        ))}
      </aside>
    </section>
  );
};

export default HeroSection;