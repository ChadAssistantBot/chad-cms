import React from "react";

const Button = ({ onClick, children, className, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
