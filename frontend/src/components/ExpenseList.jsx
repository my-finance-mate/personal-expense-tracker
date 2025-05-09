import { useState } from 'react';
import { toast } from 'react-hot-toast';
import ExpenseForm from './ExpenseForm';
import ExpenseItem from './ExpenseItem';
import { PlusIcon } from '@heroicons/react/24/solid';

const ExpenseList = ({ expenses, members, onAddExpense, onSettleExpense }) => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (expenseData) => {
    onAddExpense(expenseData);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Expenses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Expense
        </button>
      </div>
      
      {showForm && (
        <div className="mb-6">
          <ExpenseForm 
            members={members} 
            onSubmit={handleSubmit} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      )}
      
      <div className="space-y-4">
        {expenses.length > 0 ? (
          expenses.map(expense => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onSettle={() => onSettleExpense(expense._id)}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No expenses yet. Add your first expense!
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;