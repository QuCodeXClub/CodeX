import React from "react";
import legal from "../data/legal.json";
import PageContainer from "../components/common/PageContainer";
import { Users, Clock } from "lucide-react";

const CommunityGuidelines = () => {
  const policy = legal.communityGuidelines;

  return (
    <div className="py-12 bg-bg min-h-screen font-sans text-text">
      <PageContainer>
        <header className="mb-10 border-b border-border/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY STANDARDS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-text tracking-tight">
            {policy.title}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-xs font-mono text-text-muted">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Last Updated: {policy.lastUpdated}</span>
          </div>
        </header>

        <div className="space-y-8">
          {policy.sections.map((section, index) => (
            <section
              key={index}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-sm"
            >
              <h2 className="text-xl font-display font-bold text-accent uppercase tracking-wide mb-4">
                {section.title}
              </h2>

              {section.content?.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-4 leading-relaxed text-text-muted font-sans text-sm sm:text-base"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="space-y-2.5 text-text-muted font-sans text-sm list-disc pl-6 marker:text-accent">
                  {section.list.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </PageContainer>
    </div>
  );
};

export default CommunityGuidelines;