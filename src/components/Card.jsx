import React from "react";

const Card = ({ children, className = "", hover = false, onClick }) => {
  return (
    <div 
      className={`glass-panel rounded-xl p-6 ${hover ? 'hover:border-gold/50 transition-normal cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
