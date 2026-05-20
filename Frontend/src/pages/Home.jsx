import React from 'react';
import HeroSection from '../features/landing/components/HeroSection';
import SystemModules from '../features/landing/components/SystemModules';
import CommitSection from '../features/landing/components/CommitSection';
import GradientPulse from '../features/landing/components/GradientPulse';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <SystemModules />
      <CommitSection />
      <GradientPulse />
    </div>
  );
};


export default Home;