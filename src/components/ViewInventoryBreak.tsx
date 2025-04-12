import { useNavigate } from "react-router-dom";
import React from "react";

const BreakSection = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-[25vh] bg-cover bg-center bg-no-repeat my-0"
      style={{
        backgroundImage: 'url(/blue_murci.png)',
        backgroundPosition: '15% 70%',
        backgroundSize: '100%',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl sm:text-xl md:text-3xl lg:text-4xl font-bold text-white mb-0">Your Dream Exotic Is Waiting</h2>
        <div className="mt-4">
          <button
            onClick={() => navigate("/listings")}
            className="bg-yellow-400 text-black px-7 py-4 sm:text-lg md:text-xl font-semibold rounded-lg hover:bg-yellow-300 transition"
          >
            View Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakSection;
