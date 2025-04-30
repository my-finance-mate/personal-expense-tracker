import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const ReportGenerator = ({ group }) => {
  const reportRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => reportRef.current
  })

  const handleDownloadPDF = () => {
    const input = reportRef.current
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${group.name}_report.pdf`)
    })
  }

  const calculateSummary = () => {
    const summary = {}
    group.members.forEach(member => {
      summary[member.name] = member.balance || 0
    })
    return summary
  }

  const summary = calculateSummary()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#6fad4a]">Group Report</h3>
        <div className="space-x-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-[#6fad4a] text-white rounded-md text-sm"
          >
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1 bg-[#6fad4a] text-white rounded-md text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div ref={reportRef} className="p-4">
        <h2 className="text-2xl font-bold text-center text-[#6fad4a] mb-4">
          {group.name} - Expense Report
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Generated on {new Date().toLocaleDateString()}
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Group Summary</h3>
          <p className="mb-2">Total Members: {group.members.length}</p>
          <p>Total Expenses: {group.expenses.length}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Members</h3>
          <ul className="list-disc pl-5">
            {group.members.map(member => (
              <li key={member.id} className="mb-1">
                {member.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Recent Expenses</h3>
          {group.expenses.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid by
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {group.expenses.map(expense => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.payer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {expense.paid ? (
                        <span className="text-green-500">Paid</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No expenses recorded</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Balances</h3>
          {Object.keys(summary).length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(summary).map(([name, balance]) => (
                  <tr key={name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {balance > 0 ? (
                        <span className="text-red-500">
                          Owes ${balance.toFixed(2)}
                        </span>
                      ) : balance < 0 ? (
                        <span className="text-green-500">
                          Gets back ${Math.abs(balance).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500">Settled up</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No balance information</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportGenerator