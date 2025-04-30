import { useState } from 'react'
import MemberForm from './MemberForm'
import ExpenseForm from './ExpenseForm'
import ReportGenerator from './ReportGenerator'

const GroupDetails = ({
  group,
  onUpdateGroup,
  onAddMember,
  onRemoveMember,
  onAddExpense,
  onMarkExpenseAsPaid,
  onBack
}) => {
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: group.name,
    description: group.description
  })

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    onUpdateGroup(group.id, editData)
    setEditing(false)
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-[#6fad4a] hover:text-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Groups
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {editing ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#6fad4a] text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-[#6fad4a]">{group.name}</h2>
              <button
                onClick={() => setEditing(true)}
                className="text-[#6fad4a] hover:text-green-600"
              >
                Edit
              </button>
            </div>
            <p className="text-gray-600 mt-2">{group.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              Created on {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#6fad4a]">Members</h3>
            <button
              onClick={() => setShowMemberForm(true)}
              className="px-3 py-1 bg-[#6fad4a] text-white rounded-md text-sm"
            >
              Add Member
            </button>
          </div>

          {showMemberForm && (
            <div className="mb-4">
              <MemberForm
                onSubmit={(member) => {
                  onAddMember(group.id, member)
                  setShowMemberForm(false)
                }}
                onCancel={() => setShowMemberForm(false)}
              />
            </div>
          )}

          {group.members.length === 0 ? (
            <p className="text-gray-500">No members yet</p>
          ) : (
            <ul className="divide-y">
              {group.members.map(member => (
                <li key={member.id} className="py-3 flex justify-between">
                  <div>
                    <span className="font-medium">{member.name}</span>
                    {member.balance !== undefined && (
                      <span className={`ml-2 text-sm ${member.balance > 0 ? 'text-red-500' : member.balance < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                        {member.balance > 0
                          ? `Owes $${member.balance.toFixed(2)}`
                          : member.balance < 0
                          ? `Gets back $${Math.abs(member.balance).toFixed(2)}`
                          : 'Settled up'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveMember(group.id, member.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#6fad4a]">Expenses</h3>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="px-3 py-1 bg-[#6fad4a] text-white rounded-md text-sm"
            >
              Add Expense
            </button>
          </div>

          {showExpenseForm && (
            <div className="mb-4">
              <ExpenseForm
                members={group.members}
                onSubmit={(expense) => {
                  onAddExpense(group.id, expense)
                  setShowExpenseForm(false)
                }}
                onCancel={() => setShowExpenseForm(false)}
              />
            </div>
          )}

          {group.expenses.length === 0 ? (
            <p className="text-gray-500">No expenses yet</p>
          ) : (
            <ul className="divide-y">
              {group.expenses.map(expense => (
                <li key={expense.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{expense.description}</span>
                      <span className="ml-2 text-gray-600">${expense.amount.toFixed(2)}</span>
                    </div>
                    {!expense.paid && (
                      <button
                        onClick={() => onMarkExpenseAsPaid(group.id, expense.id)}
                        className="text-sm text-[#6fad4a] hover:text-green-600"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>Paid by: {expense.payer}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                    {expense.paid && (
                      <span className="ml-2 text-green-500">✓ Paid</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <ReportGenerator group={group} />
      </div>
    </div>
  )
}

export default GroupDetails