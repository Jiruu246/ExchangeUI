import React from "react";

interface SeInputProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SeNumberInput: React.FC<SeInputProps> = ({ label, value, onChange, placeholder, className, disabled = false }) => {
  return (
    <div 
      className={`flex items-center justify-between border border-gray-600 rounded-md px-4 py-2 focus-within:border-white 
        ${disabled? 'cursor-not-allowed' : 'hover:border-white'} 
        ${className}`}>
      <label className={`mr-2 whitespace-nowrap
        ${disabled? 'cursor-not-allowed': ''}`}>{label}</label>
      <input
        type="number"
        value={value}
        onFocus={(e) => {
          if (e.target.value === "0") {
            onChange('');
        }}}
        onBlur={(e) => {
          if (e.target.value === "") {
            onChange(0);
        }}}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-transparent focus:outline-none text-right min-w-10
          ${disabled? 'cursor-not-allowed': ''}`}
      />
    </div>
  );
};

export default SeNumberInput;
