import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import contentData from "../../../data/content.json";

const CommitSection = () => {
  const navigate = useNavigate();
  const { commitSection } = contentData.landing;
  return (
    <section className="split-section" id="team">
      <div className="split-left">
        <p className="eyebrow">{commitSection.eyebrow}</p>
        <h2 className="split-title">{commitSection.title}</h2>
        <p className="split-copy">{commitSection.description}</p>
        <Button
          onClick={() => navigate("/register")}
          variant="solid"
          className="join-button m-0 lg:ml-4"
        >
          Join Now
        </Button>
      </div>
      <div className="split-right" id="archive">
        <p className="split-kicker">{commitSection.kicker}</p>
        <ul className="split-list">
          {commitSection.benefits.map((benefit) => (
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
