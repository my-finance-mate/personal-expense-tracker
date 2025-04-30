const express = require("express");
const router = express.Router();
const { getCategories, saveCategories } = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", saveCategories);

module.exports = router;
