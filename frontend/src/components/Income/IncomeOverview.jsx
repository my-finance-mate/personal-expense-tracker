import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../charts/CustomBarChart';
import {prepareIncomeBarChartData } from '../../utils/helper';


const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    
        <div className="bg-white rounded-xl shadow-md p-6 transition-shadow hover:shadow-lg duration-300 ease-in-out">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <h5 className="text-2xl font-semibold text-gray-900 tracking-tight leading-6">
                Income Overview
              </h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track your earnings over time and analyze your income trends.
              </p>
            </div>
    
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
              onClick={onAddIncome}
            >
              <LuPlus className="text-base" />
              Add Income
            </button>
          </div>
          {/* Add your income chart or data display here */}
          {/* Example:
          <div className="mt-6 border-t pt-4">
            <div className="text-center text-gray-500">
              Chart data goes here.
            </div>
          </div>
          */}
          <div className="mt-10">
          <CustomBarChart data={chartData} />
            </div>
        </div>
      );
    };

export default IncomeOverview
