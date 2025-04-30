//const User = require("../models/User");
const xlsx = require("xlsx");
const Income = require("../models/Expense");

// Add Income Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

 // Get All Income Source
 exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


 // Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};



exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};



// Download PDF
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.downloadExpensePDF = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Create a PDF document
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "..", "expense_details.pdf");

    doc.pipe(fs.createWriteStream(filePath));

    // Add Title
    doc.fontSize(20).text("Expense Details", { align: "center" }).moveDown();

    // Add Table Header
    doc.fontSize(12).text("Category", 100, doc.y, { width: 150, bold: true });
    doc.text("Amount", 300, doc.y, { width: 100, bold: true });
    doc.text("Date", 400, doc.y, { width: 150, bold: true });
    doc.moveDown();

    // Add Expense Data
    expense.forEach((item) => {
      doc
        .fontSize(10)
        .text(item.category, 100, doc.y, { width: 150 })
        .text(item.amount.toString(), 300, doc.y, { width: 100 })
        .text(item.date.toISOString().split("T")[0], 400, doc.y, { width: 150 })
        .moveDown();
    });

    doc.end();

    // Wait for the file to be written and send it as a response
    doc.on("end", () => {
      res.download(filePath, "expense_details.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ message: "Error downloading PDF" });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
