import { ArrowUp, ArrowDown } from "lucide-react";

const OverviewPanel = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High Spending Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">High Spending Alert</h3>
          <div className="flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <ArrowUp className="text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium dark:text-white">Dining expenses this month</p>
              <p className="text-2xl font-bold dark:text-white">Rs4000</p>
              <p className="text-red-500 flex items-center gap-1">
                <ArrowUp size={16} /> 32% above average
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You've spent Rs500 more than your usual dining budget.
              </p>
            </div>
          </div>
        </div>

        {/* Savings Opportunity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Savings Opportunity</h3>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <ArrowDown className="text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium dark:text-white">Subscription optimization</p>
              <p className="text-2xl font-bold dark:text-white">Rs5000</p>
              <p className="text-green-500 flex items-center gap-1">
                <ArrowDown size={16} /> Save monthly
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600 dark:text-gray-300">
                    3 overlapping entertainment subscriptions detected
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Consolidate your streaming services to save Rs500/month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Monthly Overview</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Your financial summary for this month
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Income */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">Total Income</p>
            <p className="text-2xl font-bold dark:text-white">Rs44,250</p>
            <p className="text-blue-500 flex items-center gap-1">
              <ArrowUp size={16} /> 5% from last month
            </p>
          </div>

          {/* Total Expenses */}
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">Total Expenses</p>
            <p className="text-2xl font-bold dark:text-white">Rs2,840</p>
            <p className="text-red-500 flex items-center gap-1">
              <ArrowUp size={16} /> 12% from last month
            </p>
          </div>

          {/* Savings */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">Savings</p>
            <p className="text-2xl font-bold dark:text-white">Rs1,410</p>
            <p className="text-gray-600 dark:text-gray-300">33% of income</p>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Budget Progress</h3>
        <div className="space-y-4">
          {/* Dining */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium dark:text-white">Dining</span>
              <span className="text-gray-600 dark:text-gray-300">Rs4000 / Rs3500</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>

          {/* Entertainment */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium dark:text-white">Entertainment</span>
              <span className="text-gray-600 dark:text-gray-300">Rs180 / Rs200</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: '90%' }}
              ></div>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium dark:text-white">Shopping</span>
              <span className="text-gray-600 dark:text-gray-300">Rs320 / Rs400</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: '80%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;