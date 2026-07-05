import React from 'react';
import Button from '../../../components/common/Button';
import { benefits } from '../../../constants/landingData';

const CommitSection = () => {
  return (
    <section className="split-section" id="team">
      <div className="split-left">
        <p className="eyebrow">auth_required</p>
        <h2 className="split-title">Write the next chapter.</h2>
        <p className="split-copy">
          We are looking for high-performance individuals to bridge the gap between
          abstract logic and hardware reality. Ready to commit?
        </p>
       <Button 
            onClick={() => navigate('/register')} 
            variant="solid" 
            className="join-button m-0 lg:ml-4"
          >
   Join Now 
             </Button>
      </div>
      <div className="split-right" id="archive">
        <p className="split-kicker">// why codex?</p>
        <ul className="split-list">
          {benefits.map((benefit) => (
            <li className="split-item" key={benefit}>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CommitSection;