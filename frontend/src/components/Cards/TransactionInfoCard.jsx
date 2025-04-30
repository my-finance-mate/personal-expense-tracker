import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";


const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () => {
    if (type === "income") {
      return "text-green-500";
    } else {
      return "text-red-500";
    }
  };

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200">
      
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6 object-contain" />
        ) : (
          <LuUtensils className="text-gray-700 w-6 h-6" />
        )}
      </div>

      {/* Title & Date */}
      <div className="flex flex-col justify-center text-sm text-gray-700">
        <p className="font-semibold text-base text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>

      {/* Optional Delete */}
      {!hideDeleteBtn && (
        <button
          className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition"
          onClick={onDelete}
        >
          <LuTrash2 size={18} />
        </button>
      )}

      {/* Amount */}
      <div className={`flex items-center gap-2 ${getAmountStyles()}`}>
        <h6 className="text-sm font-medium">
          {type === "income" ? "+" : "-"} ${amount}
        </h6>
        {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
