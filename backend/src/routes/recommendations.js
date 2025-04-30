const express = require('express');
const { generateRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

// GET /recommendations/:userId
router.get('/:userId', generateRecommendations);

module.exports = router;