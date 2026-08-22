const express = require('express');
const router = express.Router();
const detalleRemisionController = require('../controllers/detalleRemision.controller');

router.get('/', detalleRemisionController.getAllDetalleRemision);
router.get('/:id', detalleRemisionController.getDetalleRemisionById);
router.post('/', detalleRemisionController.createDetalleRemision);
router.put('/:id', detalleRemisionController.updateDetalleRemision);
router.delete('/:id', detalleRemisionController.deleteDetalleRemision);

module.exports = router;
