import React from 'react';
import { SelectOption } from '../types';

interface SelectDropdownProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, options, value, onChange, disabled, className = '', labelClassName = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className={`block mb-1.5 text-sm font-medium text-light ${labelClassName}`}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="bg-secondary-DEFAULT border border-inputBorder text-light text-sm rounded-md focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT block w-full p-2.5 transition-colors duration-150 ease-in-out"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-dark text-light">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;