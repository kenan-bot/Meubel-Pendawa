import React from "react";

const CardTitle = ({children, className = "" }) => {
  return <h3 className={`text-xl font-bold ${className}`}>
  {children}</h3>;
};

export default CardTitle;
