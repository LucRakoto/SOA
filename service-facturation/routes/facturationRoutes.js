const express = require('express');
const router = express.Router();
const facturationController = require('../controllers/facturationController');

router.get('/factures/:reservationId', facturationController.getFacture);
router.post('/paiements', facturationController.enregistrerPaiement);

module.exports = router;
