const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');

router.post('/', budgetController.createBudget);
router.get('/:userId', budgetController.getBudgets);

module.exports = router;
