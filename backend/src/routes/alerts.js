const express = require('express');
const { generateAlerts } = require('../controllers/alertController');

const router = express.Router();

// GET /alerts/:userId
router.get('/:userId', generateAlerts);

module.exports = router;