import React from "react";
import legal from "../data/legal.json";

const TermsConditions = () => {
  const policy = legal.termsConditions;

  return (
    <div className=" mx-auto max-w-[1200px] py-16 px-6 md:px-12 text-text">
      <h1 className="text-3xl font-bold uppercase tracking-wider">
        {policy.title}
      </h1>

      <p className="mt-2 text-sm text-text-muted">
        Last Updated: {policy.lastUpdated}
      </p>

      {policy.sections.map((section, index) => (
        <section
          key={index}
          className="mt-10 pt-8 border-t border-border"
        >
          <h2 className="text-xl font-semibold text-accent mb-4">
            {section.title}
          </h2>

          {section.content?.map((paragraph, i) => (
            <p
              key={i}
              className="text-text-muted leading-8 mb-4"
            >
              {paragraph}
            </p>
          ))}

          {section.list && (
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              {section.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};

export default TermsConditions;