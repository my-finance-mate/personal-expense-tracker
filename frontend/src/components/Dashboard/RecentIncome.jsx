import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-semibold text-gray-800">Income</h5>
        <button
          className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
          onClick={onSeeMore}
        >
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="space-y-3">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.source}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type="income"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
