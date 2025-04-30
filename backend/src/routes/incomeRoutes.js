const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
  downloadIncomePDF, 
  updateIncome// Added PDF download function
} = require("../controllers/incomeController.js");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);
router.get("/downloadpdf", protect, downloadIncomePDF); // Added route for PDF download
router.delete("/:id", protect, deleteIncome);
router.put("/:id", protect, updateIncome); // ✅ Update income route


module.exports = router;
