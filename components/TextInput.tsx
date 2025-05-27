import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = ({ className = '', ...props }) => {
  return (
    <input
      type="text"
      className={`bg-secondary-DEFAULT border border-inputBorder text-light text-sm rounded-md focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT block w-full p-2.5 placeholder-secondaryText transition-colors duration-150 ease-in-out ${className}`}
      {...props}
    />
  );
};

export default TextInput;