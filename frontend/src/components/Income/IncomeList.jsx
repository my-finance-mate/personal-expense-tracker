import React from "react";
import { FiEdit } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";

const IncomeList = ({ transactions, onDelete, onEdit }) => {
  const downloadPDF = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/income/downloadpdf", {
        responseType: "blob", // PDF is binary
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_report.pdf");
      document.body.appendChild(link);
      link.click();
      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    }
  };

  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mt-5">
      {transactions && transactions.length > 0 ? (
        transactions.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center p-4 border-b bg-white shadow-sm rounded-md mb-3"
          >
            {/* Left Side: Icon + Info */}
            <div className="flex items-center gap-4">
              {item.icon ? (
                <img
                  src={item.icon}
                  alt="icon"
                  className="w-9 h-9 rounded-full border"
                />
              ) : (
                <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-100 text-sm text-gray-500">
                  ?
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{item.source}</p>
                <p className="text-sm text-gray-500">
                  Rs. {item.amount} | {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Edit / Delete */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(item)}
                title="Edit"
                className="hover:text-blue-700"
              >
                <FiEdit className="text-blue-600" size={20} />
              </button>
              <button
                onClick={() => onDelete(item._id)}
                title="Delete"
                className="hover:text-red-700"
              >
                <LuTrash2 className="text-red-600" size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center mt-10">
          No income records found.
        </p>
      )}

      {/* Total Income */}
      {transactions.length > 0 && (
        <div className="text-end text-green-700 font-semibold text-lg mt-3">
          Total Income: Rs. {totalIncome}
        </div>
      )}

      {/* Download Button */}
      {transactions.length > 0 && (
        <div className="mt-4 text-end">
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Download Income PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
