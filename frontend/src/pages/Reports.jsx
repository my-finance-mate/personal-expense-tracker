import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useBudget } from "../components/BudgetContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

const Reports = () => {
  const { categories } = useBudget();
  const reportRef = useRef();

  const spendingData = categories.map((cat, index) => ({
    month: `Cat-${index + 1}`,
    spent: cat.spent,
  }));

  const handleDownload = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, {
      useCORS: true,
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header Bar
    pdf.setFillColor(76, 175, 80);
    pdf.rect(0, 0, pageWidth, 20, "F");

    // Load and draw logo icon
    try {
      const logo = await loadImage("/img/briefcase.png");
      pdf.addImage(logo, "PNG", 10, 4, 10, 10);
    } catch (error) {
      console.warn("Logo not loaded:", error);
    }

    // Company Name Centered
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    const companyText = "EconoMe Pvt. Ltd.";
    const textWidth = pdf.getTextWidth(companyText);
    pdf.text(companyText, (pageWidth - textWidth) / 2, 12);

    // Report Title and Date
    const currentDate = new Date().toLocaleDateString();
    pdf.setTextColor(33, 37, 41);
    pdf.setFontSize(12);
    pdf.text(`Report Generated on: ${currentDate}`, 10, 28);
    pdf.setFontSize(14);
    const titleText = "Monthly Budget & Savings Report";
    const titleWidth = pdf.getTextWidth(titleText);
    pdf.text(titleText, (pageWidth - titleWidth) / 2, 36);

    // Report Image
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 42, imgWidth, imgHeight);

    // Footer Centered
    const footerText = "© EconoMe Pvt. Ltd. | Empowering Smart Money Habits";
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.setTextColor(150);
    pdf.setFontSize(10);
    pdf.text(footerText, (pageWidth - footerWidth) / 2, 290);

    pdf.save("MonthlyBudget&Savings_Report.pdf");
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">📊 Reports</h2>

      {/* Download Button */}
      <div className="text-right">
        <button
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          ⬇️ Download PDF
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Spending Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            📈 Spending Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spendingData}>
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="#F59E0B"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category-wise Spending List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            🗂️ Category-wise Spending
          </h3>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            {categories.map((cat, index) => (
              <li key={index}>
                <span className="font-medium text-gray-800">{cat.name}:</span>{" "}
                ${cat.spent}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
