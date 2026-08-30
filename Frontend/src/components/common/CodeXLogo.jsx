import React from "react";

/**
 * CodeX Brand Wordmark Vector SVG Logo
 * Dynamically adapts the "CODE" letters based on current theme (light/dark) via currentColor / text-text,
 * while keeping the "X" in vibrant cyan accent.
 */
export const CodeXLogo = ({ className = "h-7 w-auto", ...props }) => {
  return (
    <svg
      viewBox="0 0 640 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-label="CodeX Logo"
      {...props}
    >
      {/* "CODE" Paths - Inherits color from text-text / currentColor for automatic Light/Dark theme switching */}
      <g className="text-text fill-current transition-colors duration-300">
        {/* C */}
        <path d="M 112 0 L 44 0 A 44 44 0 0 0 0 44 L 0 72 A 44 44 0 0 0 44 116 L 112 116 L 112 94.5 L 44 94.5 A 22.5 22.5 0 0 1 21.5 72 L 21.5 44 A 22.5 22.5 0 0 1 44 21.5 L 112 21.5 Z" />
        
        {/* O */}
        <path fillRule="evenodd" clipRule="evenodd" d="M 174 0 L 207 0 A 44 44 0 0 1 251 44 L 251 72 A 44 44 0 0 1 207 116 L 174 116 A 44 44 0 0 1 130 72 L 130 44 A 44 44 0 0 1 174 0 Z M 174 21.5 A 22.5 22.5 0 0 0 151.5 44 L 151.5 72 A 22.5 22.5 0 0 0 174 94.5 L 207 94.5 A 22.5 22.5 0 0 0 229.5 72 L 229.5 44 A 22.5 22.5 0 0 0 207 21.5 Z" />
        
        {/* D */}
        <path fillRule="evenodd" clipRule="evenodd" d="M 271 0 L 337 0 A 44 44 0 0 1 381 44 L 381 72 A 44 44 0 0 1 337 116 L 271 116 Z M 292.5 21.5 L 337 21.5 A 22.5 22.5 0 0 1 359.5 44 L 359.5 72 A 22.5 22.5 0 0 1 337 94.5 L 292.5 94.5 Z" />
        
        {/* E (3 horizontal bars) */}
        <path d="M 403 0 L 514 0 L 514 21.5 L 403 21.5 Z M 403 47.25 L 514 47.25 L 514 68.75 L 403 68.75 Z M 403 94.5 L 514 94.5 L 514 116 L 403 116 Z" />
      </g>

      {/* "X" Path in Cyan Accent */}
      <g className="fill-accent transition-colors duration-300" style={{ fill: "var(--color-accent, #00D8F6)" }}>
        <path d="M 533 0 L 563 0 L 589 47.5 L 615 0 L 645 0 L 604 58 L 646 116 L 616 116 L 589 68.5 L 562 116 L 533 116 L 574 58 Z" />
      </g>
    </svg>
  );
};

export default CodeXLogo;
