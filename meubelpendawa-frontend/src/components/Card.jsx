import React from "react";

const Card = ({
  children,
  className = "",
  variant = "default",
  hover = true,
  padding = "normal",
}) => {
  const baseStyles = "rounded-lg shadow-md transition-all duration-300";

  const variants = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    dark: "bg-gray-800 border border-gray-700 text-white",
  };

  const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1" : "";

  const paddingStyles = {
    none: "p-0",
    small: "p-4",
    normal: "p-6",
    large: "p-8",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
