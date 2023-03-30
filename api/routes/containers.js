const express = require('express');
const containerController = require('../controllers/containerController');

const router = express.Router();

router.post('/getLatest', containerController.getLatestinfoByMac);
router.post('/reports', containerController.reports);
router.post('/history', containerController.history);

module.exports = router;