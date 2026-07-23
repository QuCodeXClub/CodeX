import legal from "../data/legal.json";

const PrivacyPolicy = () => {
  const policy = legal.privacyPolicy;

  return (
    <div className=" mx-auto max-w-[1200px] px-6 py-16 text-text">
      <h1 className="text-3xl font-bold uppercase tracking-wider">
        {policy.title}
      </h1>

      <p className="mt-2 text-sm text-text-muted">
        Last Updated: {policy.lastUpdated}
      </p>

      {policy.sections.map((section) => (
        <section key={section.title} className="mt-10 border-t border-border pt-8">
          <h2 className="text-xl font-semibold text-accent mb-4">
            {section.title}
          </h2>

          {section.content?.map((paragraph, index) => (
            <p
              key={index}
              className="mb-4 leading-8 text-text-muted"
            >
              {paragraph}
            </p>
          ))}

          {section.list && (
            <ul className="space-y-2 text-text-muted list-disc pl-6">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};

export default PrivacyPolicy;