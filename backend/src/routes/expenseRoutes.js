const express = require("express");
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
    downloadExpensePDF // Added PDF function
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.get("/downloadpdf", protect, downloadExpensePDF); // Added PDF route
router.delete("/:id", protect, deleteExpense);

module.exports = router;
