const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoInventario.controller');

// Rutas CRUD
router.post('/', movimientoController.createMovimiento);
router.get('/', movimientoController.getMovimientos);
router.get('/:id', movimientoController.getMovimientoById);
router.put('/:id', movimientoController.updateMovimiento);
router.delete('/:id', movimientoController.deleteMovimiento);

module.exports = router;
