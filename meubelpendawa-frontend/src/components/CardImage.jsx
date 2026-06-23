import React from "react";

const CardImage = ({ src, alt = "Card Image", className = "" }) => {
  return (
    <div className={`w-full h-48 overflow-hidden rounded-t-lg`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full
        object-contain"
        />
      ) : (
        <div
          className="w-full h-full bg-linear-to-r from-gray-200
        to-gray-300 flex items-center justify-center"
        >
          <span className="text-gray-400 text-sm"> Tidak ada gambar</span>
        </div>
      )}
    </div>
  );
};

export default CardImage;
