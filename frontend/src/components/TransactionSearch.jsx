import React, { useState } from "react";

const TransactionSearch = ({ data }) => {
  const [query, setQuery] = useState("");

  const filteredData = data?.filter((item) =>
    item?.source?.toLowerCase()?.includes(query.toLowerCase()) ||
    item?.category?.toLowerCase()?.includes(query.toLowerCase()) ||
    String(item?.amount).includes(query)
  );

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Search Transactions</h2>

      <input
        type="text"
        placeholder="Search by source, category, or amount..."
        className="w-full p-2 border border-gray-300 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Show table only if user typed something */}
      {query.trim() !== "" && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Source</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="border-b text-sm">
                    <td className="py-2 px-4 capitalize">{item.type}</td>
                    <td className="py-2 px-4">{item.source}</td>
                    <td className="py-2 px-4">Rs. {item.amount}</td>
                    <td className="py-2 px-4">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                    No matching transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionSearch;
