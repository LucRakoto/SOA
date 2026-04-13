const express = require('express');
const router = express.Router();
const chambreController = require('../controllers/chambreController');

router.get('/', chambreController.getAllChambres);
router.post('/', chambreController.createChambre);

module.exports = router;
