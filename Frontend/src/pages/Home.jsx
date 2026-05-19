import React from 'react';
import HeroSection from '../features/landing/components/HeroSection';
import SystemModules from '../features/landing/components/SystemModules';
import CommitSection from '../features/landing/components/CommitSection';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <SystemModules />
      <CommitSection />
    </div>
  );
};


export default Home;