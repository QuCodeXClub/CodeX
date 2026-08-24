import { Link } from "react-router-dom";
import { Users, CalendarDays, ChevronRight } from "lucide-react";
import contentData from "../../../data/content.json";

const AboutCTA = () => {
  const { cta } = contentData.about;
  const CustomButton = ({ to, variant, children, icon: Icon }) => {
    const baseStyle = "group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-sans text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl cursor-pointer shadow-md hover:-translate-y-0.5 w-full sm:w-auto";
    const variantStyle = variant === "solid"
      ? "bg-accent text-white hover:bg-accent/90 border border-accent shadow-accent/25 hover:shadow-accent/40"
      : "bg-card/90 backdrop-blur-xl text-text border border-border hover:bg-card-hover hover:border-accent/40";

    return (
      <Link to={to} className={`${baseStyle} ${variantStyle} whitespace-nowrap`}>
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={18} className={variant === "solid" ? "text-white" : "text-accent"} />}
          <span>{children}</span>
          <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    );
  };

  return (
    <section className="relative py-24 px-6 lg:px-16 overflow-hidden">
      {/* Background Styling for CTA */}
      
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        
        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-text uppercase mb-6 drop-shadow-md">
          {cta.titlePart1} <span className="text-accent">{cta.titlePart2}</span>
        </h2>
        
        <p className="text-text-muted font-sans text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
          {cta.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <CustomButton to={cta.primaryButton.link} variant="solid" icon={Users}>
            {cta.primaryButton.label}
          </CustomButton>
          <CustomButton to={cta.secondaryButton.link} variant="outline" icon={CalendarDays}>
            {cta.secondaryButton.label}
          </CustomButton>
        </div>

      </div>
    </section>
  );
};

export default AboutCTA;
