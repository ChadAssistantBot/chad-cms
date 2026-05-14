import React from "react";

const Input = ({ 
  type = "text", 
  placeholder, 
  className = "",
  label,
  error,
  icon: Icon,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-1.5 text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full bg-panel-strong border border-line rounded-lg px-4 py-2.5 text-white placeholder-muted focus:outline-none focus:border-gold transition ${Icon ? 'pl-10' : ''} ${error ? 'border-red focus:border-red' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
