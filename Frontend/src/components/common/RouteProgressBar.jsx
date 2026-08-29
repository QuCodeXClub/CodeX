import React from "react";

/**
 * Sleek, non-intrusive top loading progress bar (like YouTube / GitHub)
 * displayed during page transitions and route loads.
 */
const RouteProgressBar = () => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] overflow-hidden bg-accent/15 pointer-events-none"
      role="progressbar"
      aria-label="Loading page..."
    >
      <div className="h-full bg-accent w-1/2 rounded-r-full shadow-[0_0_10px_var(--color-accent)] animate-indeterminate-progress" />
    </div>
  );
};

export default React.memo(RouteProgressBar);
