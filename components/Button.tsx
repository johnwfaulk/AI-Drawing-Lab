import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2.5 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darker disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out shadow-md hover:shadow-lg";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-primary-DEFAULT text-white hover:bg-primary-hover focus:ring-primary-DEFAULT'; // text-white is good for slate-50 effectively
      break;
    case 'secondary':
      variantStyle = 'bg-secondary-DEFAULT text-light hover:bg-secondary-hover focus:ring-secondary-DEFAULT border border-panelBorder';
      break;
    case 'danger':
      variantStyle = 'bg-error-DEFAULT text-white hover:bg-red-600 focus:ring-error-DEFAULT';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;