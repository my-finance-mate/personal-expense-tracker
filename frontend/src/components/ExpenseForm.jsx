import { useState } from 'react'

const ExpenseForm = ({ members, onSubmit, onCancel }) => {
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    payer: members.length > 0 ? members[0].id : ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setExpense(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...expense,
      amount: parseFloat(expense.amount),
      payer: members.find(m => m.id === expense.payer)?.name || 'Unknown'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={expense.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6fad4a] focus:border-[#6fad4a]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6fad4a] focus:border-[#6fad4a]"
          required
        />
      </div>
      {members.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Paid by</label>
          <select
            name="payer"
            value={expense.payer}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6fad4a] focus:border-[#6fad4a]"
            required
          >
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#6fad4a] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6fad4a]"
        >
          Add Expense
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6fad4a]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm