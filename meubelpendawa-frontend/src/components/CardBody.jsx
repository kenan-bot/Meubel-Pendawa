import React from "react";

const CardBody = ({ children, className = "" }) => {
  return <div className={`text-gray-600 ${className}`}>{children}</div>;
};

export default CardBody;
