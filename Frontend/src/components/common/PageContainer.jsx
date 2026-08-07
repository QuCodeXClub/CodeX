import React from "react";

const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
