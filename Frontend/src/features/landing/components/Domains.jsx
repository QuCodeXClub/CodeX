import contentData from "../../../data/content.json";

const Domains = () => {
  const { domains } = contentData?.landing || {};

  if (!domains || !domains.list) return null;

  return (
    <section className="border-b domains-panel relative overflow-hidden py-16 md:py-24" id="domains">
      <div className="section-header mb-12 text-center relative z-10">
        <p className="eyebrow">{domains.eyebrow}</p>
        <h2 className="hero-title text-reflect mb-4">
          <span>{domains.titlePart1} </span>
          <span className="hero-accent">{domains.titlePart2}</span>
        </h2>
        <p className="hero-description max-w-2xl mx-auto">
          {domains.description}
        </p>
      </div>

      <div className="domains-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {domains.list.map((domain, index) => (
          <article 
            key={domain.title || index}
            className="stat-card flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
          >
            <div>
              {/* Optional: You can add an index counter like 01, 02 to match SystemModules */}
              <p className="stat-label mb-2 text-xs opacity-50">
                {`domain_0${index + 1}`}
              </p>
              <h3 className="stat-value text-xl mb-3">{domain.title}</h3>
              <p className="stat-text text-sm leading-relaxed text-gray-400">
                {domain.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Domains;