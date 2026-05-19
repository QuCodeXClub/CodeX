import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  to,       
  href,  
  onClick, 
  variant = 'solid', 
  className = '', 
  ...props 
}) => {
  const baseStyle = 'button';
  const variantStyle = variant === 'outline' ? 'button--outline' : 'button--solid';
  const combinedClasses = `${baseStyle} ${variantStyle} ${className}`.trim();
  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;