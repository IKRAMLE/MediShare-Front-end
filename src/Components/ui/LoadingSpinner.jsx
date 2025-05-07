import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f0f7ff]">
      <div className="text-[#0070cc] text-xl">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;