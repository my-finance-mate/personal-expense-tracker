import React from "react";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../../components/Cards/TransactionInfoCard";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  console.log(" Recent Transactions:", transactions);

  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-xl font-semibold text-gray-800">Recent Transactions</h5>
        <button
          className="flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-700 transition-all"
          onClick={onSeeMore}
        >
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5).map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type === "expense" ? item.category : item.source}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn // Hide delete in dashboard view
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
