import React from "react";

interface LocationProps {
  show: boolean;
  onClose: () => void;
  mapUrl: string; // Added mapUrl to props
}

const Location: React.FC<LocationProps> = ({ show, onClose, mapUrl }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-2 sm:p-4 rounded w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 h-3/4 md:h-1/2 flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center"
          onClick={onClose}
        >
          &times;
        </button>
        <iframe
          src={mapUrl}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Location;
