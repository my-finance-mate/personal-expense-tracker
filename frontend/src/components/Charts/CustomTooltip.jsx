import React from "react";


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow text-sm">
        <p className="font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">
          Amount: {""} 
          <span className="font-semibold">${payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
