const express = require('express');
const containerController = require('../controllers/containerController');

const router = express.Router();

router.get('/getLatest', containerController.getLatestinfoByMac);
router.get('/reports', containerController.reports);
router.get('/history', containerController.history);

module.exports = router;