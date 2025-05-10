const express = require('express');
const router = express.Router();
const { getAllIncomes } = require('../controllers/incomeController');

router.get('/', getAllIncomes);

module.exports = router;
