import { Quote } from "lucide-react";
import contentData from "../../../data/content.json";

const AboutLeadership = () => {
  const { leadership } = contentData.about;
  return (
    <section id="leadership" className="relative min-h-[50vh] flex flex-col justify-center py-16 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            {leadership.eyebrow}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text uppercase">
            A Word From Our <span className="text-accent">{leadership.title === "Leadership" ? "Leadership" : leadership.title}</span>
          </h2>
          <div className="h-1 w-20 bg-accent rounded-full mt-6 shadow-[0_0_10px_var(--color-accent)]" />
        </div>

        {/* Leadership Card */}
        <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-8 sm:p-12 shadow-xl hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group overflow-hidden">
          
          {/* Subtle Background Elements */}
         
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Photo Placeholder */}
            <div className="shrink-0 relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-border/50 border border-border/80 overflow-hidden flex items-center justify-center relative z-10 group-hover:border-accent/40 transition-colors duration-300 shadow-md">
                {leadership.photoUrl && leadership.photoUrl !== "[Leadership Photo URL]" ? (
                  <img src={leadership.photoUrl} alt={leadership.photoAlt} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-text-muted font-mono text-xs text-center px-4 uppercase tracking-widest opacity-60">
                    [Leadership Photo]
                  </span>
                )}
              </div>
              {/* Decorative Accent Behind Photo */}
              <div className="absolute inset-0 bg-accent translate-x-2 translate-y-2 rounded-2xl -z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <Quote className="w-10 h-10 text-accent/20 mb-4 group-hover:text-accent/40 transition-colors duration-300" />
              
              <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-text leading-relaxed mb-6 italic">
                "{leadership.quote}"
              </blockquote>
              
              <div className="mt-auto">
                <h3 className="font-sans font-bold text-xl text-text tracking-wide uppercase">
                  {leadership.name}
                </h3>
                <p className="font-mono text-sm text-accent tracking-wider uppercase mt-1 font-semibold">
                  {leadership.position}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutLeadership;
