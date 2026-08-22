const express = require('express');
const router = express.Router();
const vacunaController = require('../controllers/vacuna.controller');

// Rutas para vacunas
router.get('/', vacunaController.getVacunas);
router.post('/', vacunaController.createVacuna);
router.get('/:id', vacunaController.getVacunaById);
router.put('/:id', vacunaController.updateVacuna);
router.delete('/:id', vacunaController.deleteVacuna);

module.exports = router;
