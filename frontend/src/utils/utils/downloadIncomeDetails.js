import moment from "moment";
import { toast } from "react-hot-toast";

export const handleDownloadIncomeDetails = (incomeData) => {
  if (!incomeData?.length) {
    return toast.error("No income data to download.");
  }

  const csvRows = [
    ["Source", "Amount", "Date", "Icon"],
    ...incomeData.map((item) => [
      item.source,
      item.amount,
      moment(item.date).format("YYYY-MM-DD"),
      item.icon || "",
    ]),
  ];

  const csvContent = csvRows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "income_report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
