import React from "react";

const Button = ({ 
  onClick, 
  children, 
  className = "", 
  type = "button",
  variant = "default", // default, gold, danger, outline, ghost
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-normal focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    default: "bg-blue text-white hover:bg-blue/80",
    gold: "bg-gold text-bg font-bold hover:opacity-90",
    danger: "bg-red/10 text-red border border-red/30 hover:bg-red/20",
    outline: "border border-line text-white hover:bg-line/20",
    ghost: "text-white hover:bg-line/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
