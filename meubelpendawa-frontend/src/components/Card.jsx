import React from "react";

const Card = ({
  children,
  className = "",
  variant = "default",
  hover = true,
  dashboard = false,
  padding = "normal",
  onClick,
}) => {
  const baseStyles = "rounded-lg shadow-md transition-all duration-300";

  const variants = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    dark: "bg-gray-800 border border-gray-700 text-white",
    orange: "bg-orange-500",
  };

  // Hover biasa
  const hoverStyles =
    hover && !dashboard
      ? "hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:-translate-y-2"
      : "";

  // Hover khusus dashboard
  const dashboardHoverStyles = dashboard
    ? "hover:scale-[1.01] hover:ring-2 hover:ring-orange-500"
    : "";

  const paddingStyles = {
    none: "p-0",
    small: "p-4",
    normal: "p-6",
    large: "p-8",
    dashboard: "p-3 md:p-4", // baru
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${hoverStyles}
        ${dashboardHoverStyles}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
