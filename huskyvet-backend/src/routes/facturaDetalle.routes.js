const express = require('express');
const router = express.Router();
const controller = require('../controllers/facturaDetalle.controller');

router.get('/', controller.getAllFacturaDetalles);
router.get('/:id', controller.getFacturaDetalleById);
router.post('/', controller.createFacturaDetalle);
router.put('/:id', controller.updateFacturaDetalle);
router.delete('/:id', controller.deleteFacturaDetalle);

module.exports = router;
