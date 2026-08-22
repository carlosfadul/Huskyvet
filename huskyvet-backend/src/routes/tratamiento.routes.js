// src/routes/tratamiento.routes.js
const express = require('express');
const router = express.Router();
const tratamientoController = require('../controllers/tratamiento.controller');

router.get('/', tratamientoController.getTratamientos);
router.get('/:id', tratamientoController.getTratamientoById);
router.post('/', tratamientoController.createTratamiento);
router.put('/:id', tratamientoController.updateTratamiento);
router.delete('/:id', tratamientoController.deleteTratamiento);

module.exports = router;
