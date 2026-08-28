import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  HelpCircle,
  AlertTriangle,
  CheckSquare,
  Search,
  XCircle,
  Smartphone,
  ChevronRight,
  ShieldAlert,
  Info,
  ZoomIn,
} from "lucide-react";
import PageContainer from "../components/common/PageContainer";
import { ASSETS } from "../config/assets";
import legalData from "../data/legal.json";
import contentData from "../data/content.json";

const TREASURER_UPI_ID = contentData.register.treasurerUpiId || null;

/* ─── Shared sub-components ─── */

function SectionBadge({ icon: Icon, label }) {
  if (!Icon) return null;
  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2.5 sm:mb-3">
      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      <span>{label}</span>
    </div>
  );
}

function StepItem({ number, children }) {
  return (
    <li className="flex items-start gap-2.5 sm:gap-3">
      <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent text-text-inverse text-[10px] sm:text-xs font-bold font-mono shrink-0 mt-0.5 shadow-sm">
        {number}
      </span>
      <span className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">{children}</span>
    </li>
  );
}

function CheckItem({ children, variant = "default" }) {
  const colors = {
    default: "text-success",
    danger: "text-danger",
  };
  return (
    <li className="flex items-start gap-2 sm:gap-2.5">
      <CheckSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 ${colors[variant]}`} />
      <span className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">{children}</span>
    </li>
  );
}

function XItem({ children }) {
  return (
    <li className="flex items-start gap-2 sm:gap-2.5">
      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 text-danger" />
      <span className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">{children}</span>
    </li>
  );
}

// Simple parser to convert **text** to bold tags
const parseFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-text font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="font-mono text-accent text-xs sm:text-sm bg-accent/10 px-1 py-0.5 rounded break-all">{part.slice(1, -1)}</code>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const ICONS = {
  CreditCard,
  Smartphone,
  HelpCircle,
  Search,
  XCircle,
  ShieldAlert,
  CheckSquare
};

/* ─── Page ─── */

const PaymentRegistrationGuide = () => {
  const guideData = legalData.paymentGuide;
  const header = guideData.header;

  return (
    <div className="py-6 sm:py-10 md:py-14 bg-transparent min-h-screen font-sans text-text">
      <PageContainer>
        {/* Header */}
        <header className="mb-8 sm:mb-12 border-b border-border/80 pb-6 sm:pb-8">
          <SectionBadge icon={CreditCard} label={header.badge} />
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black uppercase text-text tracking-tight mb-2.5 sm:mb-3 leading-tight break-words">
            {header.title.split('&')[0]} &amp;{" "}
            <span className="text-accent">{header.title.split('&')[1]?.trim()}</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-text-muted max-w-2xl leading-relaxed mb-3 sm:mb-4">
            {header.description}
          </p>
          <div className="mb-6 sm:mb-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-xs sm:text-sm text-accent hover:text-accent/80 font-medium transition-colors underline underline-offset-2"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
              {header.backLink}
            </Link>
          </div>
          
          <div className="w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-card group relative cursor-zoom-in">
            <img 
              src={ASSETS.IMAGES.PAYMENT_GUIDE_COVER} 
              alt="Payment Guide - Step 1 Payment Instructions" 
              className="w-full h-auto block select-none group-hover:scale-[1.01] transition-transform duration-300"
            />
            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono flex items-center gap-1.5 shadow-lg pointer-events-none">
              <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
              <span>Click to Zoom</span>
            </div>
          </div>
        </header>

        <div className="space-y-6 sm:space-y-8">
          {guideData.sections.map((section) => {
            const SectionIcon = ICONS[section.icon] || Info;
            
            // Special styling for verification warning section
            const isWarningSection = section.id === 'verification-warning';
            const isSuccessSection = section.id === 'checklist';
            
            let sectionClassName = "glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-border/80 shadow-sm";
            if (isWarningSection) {
              sectionClassName = "glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-warning/30 bg-warning/5 shadow-sm";
            } else if (isSuccessSection) {
              sectionClassName = "glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-success/30 bg-success/5 shadow-sm";
            }

            let titleClassName = "text-base sm:text-lg md:text-xl font-display font-bold text-accent uppercase tracking-wide mb-3 sm:mb-4";
            if (isWarningSection) titleClassName = "text-base sm:text-lg md:text-xl font-display font-bold text-warning uppercase tracking-wide mb-2 sm:mb-3";
            else if (isSuccessSection) titleClassName = "text-base sm:text-lg md:text-xl font-display font-bold text-success uppercase tracking-wide mb-3 sm:mb-4";
            else if (section.id === 'do-not-enter') titleClassName = "text-base sm:text-lg md:text-xl font-display font-bold text-danger uppercase tracking-wide mb-3 sm:mb-4";

            return (
              <section key={section.id} className={sectionClassName}>
                {!isWarningSection && (
                  <SectionBadge icon={SectionIcon} label={section.badge} />
                )}
                
                {isWarningSection ? (
                  <div className="flex items-start gap-2.5 sm:gap-3.5">
                    <SectionIcon className="w-5 h-5 sm:w-6 sm:h-6 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h2 className={titleClassName}>{section.title}</h2>
                      {section.description?.map((desc, i) => (
                        <p key={i} className="text-xs sm:text-sm text-text-muted leading-relaxed mb-2 sm:mb-3">
                          {parseFormattedText(desc)}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className={titleClassName}>{section.title}</h2>
                    {section.description?.map((desc, i) => (
                      <p key={i} className={`text-xs sm:text-sm text-text-muted leading-relaxed ${i === section.description.length - 1 ? 'mb-3 sm:mb-4' : 'mb-2 sm:mb-3'}`}>
                        {parseFormattedText(desc)}
                      </p>
                    ))}
                  </>
                )}

                {/* Section 1: Fee Details */}
                {section.feeDetails && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-xl p-3 sm:px-5 sm:py-3.5 flex-1">
                        <CreditCard className="w-5 h-5 text-accent shrink-0" />
                        <div>
                          <p className="text-[10px] sm:text-xs font-mono font-bold text-accent uppercase tracking-wider">
                            {section.feeDetails.label}
                          </p>
                          <p className="text-xl sm:text-2xl font-display font-black text-text">
                            {section.feeDetails.amount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-card-hover border border-border rounded-xl p-3 sm:px-5 sm:py-3.5 flex-1">
                        <Smartphone className="w-5 h-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase tracking-wider">
                            {section.feeDetails.upiLabel}
                          </p>
                          {TREASURER_UPI_ID ? (
                            <p className="text-xs sm:text-sm font-mono font-bold text-accent select-all break-all">
                              {TREASURER_UPI_ID}
                            </p>
                          ) : (
                            <p className="text-[11px] sm:text-xs text-warning/80 font-semibold">
                              {section.feeDetails.upiMissing}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {TREASURER_UPI_ID && (
                      <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-text-muted">
                        {section.feeDetails.note}
                      </p>
                    )}
                  </>
                )}

                {/* Numbered Steps */}
                {section.steps && (
                  <ol className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
                    {section.steps.map((step, i) => (
                      <StepItem key={i} number={i + 1}>
                        {parseFormattedText(step)}{section.id === 'payment-steps' && i === 2 && TREASURER_UPI_ID ? <strong className="text-accent font-mono break-all"> {TREASURER_UPI_ID}</strong> : null}{section.id === 'payment-steps' && i === 2 && !TREASURER_UPI_ID ? <em className="text-warning/80"> (contact the CodeX team for the UPI ID)</em> : null}
                      </StepItem>
                    ))}
                  </ol>
                )}

                {/* Aliases Grid */}
                {section.aliases && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {section.aliases.map((alias) => (
                      <div
                        key={alias}
                        className="bg-card-hover border border-border rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-mono font-semibold text-text break-words"
                      >
                        {alias}
                      </div>
                    ))}
                  </div>
                )}

                {/* X Items List */}
                {section.xList && (
                  <ul className="space-y-2.5 sm:space-y-3">
                    {section.xList.map((item, i) => (
                      <XItem key={i}>{parseFormattedText(item)}</XItem>
                    ))}
                  </ul>
                )}

                {/* Check Items List */}
                {section.checkList && (
                  <ul className="space-y-2.5 sm:space-y-3">
                    {section.checkList.map((item, i) => (
                      <CheckItem key={i}>
                        {parseFormattedText(item)}
                        {i === 2 && TREASURER_UPI_ID ? (
                          <> ( <code className="font-mono text-accent text-[11px] sm:text-xs break-all">{TREASURER_UPI_ID}</code> )</>
                        ) : null}
                        {i === 2 && !TREASURER_UPI_ID ? "." : ""}
                      </CheckItem>
                    ))}
                  </ul>
                )}

                {/* Info Block */}
                {section.info && (
                  <div className="mt-3.5 sm:mt-4 flex items-start gap-2.5 p-2.5 sm:p-3.5 rounded-xl bg-accent/5 border border-accent/15">
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                      {parseFormattedText(section.info)}
                    </p>
                  </div>
                )}

                {/* Section 4 Visual Guide Image */}
                {section.id === 'find-utr' && ASSETS.IMAGES.PAYMENT_GUIDE_IMAGE_2 && (
                  <div className="mt-5 sm:mt-6 rounded-xl sm:rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-card group relative cursor-zoom-in">
                    <img
                      src={ASSETS.IMAGES.PAYMENT_GUIDE_IMAGE_2}
                      alt="Visual Guide: Finding UTR / Transaction Reference Number"
                      className="w-full h-auto block select-none group-hover:scale-[1.01] transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono flex items-center gap-1.5 shadow-lg pointer-events-none">
                      <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
                      <span>Click to Zoom</span>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-card-hover border-t border-border/60 text-center">
                      <p className="text-[11px] sm:text-xs text-text-muted font-mono leading-tight">
                        Visual Example: Step 2 — Entering UTR &amp; Finding Transaction Reference Number
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Link (Checklist section) */}
                {section.footerLink && (
                  <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-success/20">
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-accent text-text-inverse text-xs sm:text-sm font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {section.footerLink}
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
};

export default PaymentRegistrationGuide;
