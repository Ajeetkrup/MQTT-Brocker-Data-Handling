const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.home);
router.use('/container', require('./containers'));

module.exports = router;