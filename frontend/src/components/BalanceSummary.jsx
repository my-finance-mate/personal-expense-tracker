import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BalanceSummary = ({ members }) => {
  // Calculate balances
  const balances = members.map(member => ({
    username: member.user.username,
    balance: member.balance
  }));

  // Prepare data for chart
  const chartData = {
    labels: balances.map(b => b.username),
    datasets: [
      {
        data: balances.map(b => Math.abs(b.balance)),
        backgroundColor: [
          '#6fad4a',
          '#4a8cad',
          '#ad4a8c',
          '#ad6f4a',
          '#8c4aad',
          '#4aad6f',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Balances</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Who owes whom:</h3>
          <ul className="space-y-2">
            {balances
              .filter(m => m.balance < 0)
              .map((debtor, idx) => (
                balances
                  .filter(m => m.balance > 0)
                  .map((creditor, cIdx) => (
                    <li key={`${idx}-${cIdx}`} className="text-sm">
                      <span className="font-medium">{debtor.username}</span> owes{' '}
                      <span className="font-medium">{creditor.username}</span>: LKR{' '}
                      {Math.min(Math.abs(debtor.balance), creditor.balance).toFixed(2)}
                    </li>
                  ))
              ))}
          </ul>
        </div>
        
        <div className="h-64">
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;