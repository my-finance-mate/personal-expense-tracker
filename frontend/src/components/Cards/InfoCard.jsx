import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="flex gap-4 items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out border border-gray-100"
    >
      <div
        className={`w-14 h-14 flex items-center justify-center text-white rounded-full text-2xl ${color} shadow-inner`}>
      {icon}
      </div>
      <div>
        <h6 className="text-sm md:text-base text-gray-600 font-medium">{label}</h6>
        <span className="text-lg md:text-xl font-semibold text-gray-900">${value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
