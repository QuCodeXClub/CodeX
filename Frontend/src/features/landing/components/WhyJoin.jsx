import React from "react";
import contentData from "../../../data/content.json";

const WhyJoin = () => {
  const { whyJoin } = contentData.landing;

  return (
    <section className="modules-section" id="why-join">
      <div className="section-heading">
        <p className="section-kicker">{whyJoin.eyebrow}</p>
        <h2 className="section-title">{whyJoin.title}</h2>
      </div>

      <div className="module-list">
        {whyJoin.benefits.map((benefit) => (
          <article className="module-row" key={benefit.id}>
            <div className="module-index">{benefit.id}</div>

            <div className="module-copy">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WhyJoin;
