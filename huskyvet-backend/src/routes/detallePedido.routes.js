const express = require('express');
const router = express.Router();
const detallePedidoController = require('../controllers/detallePedido.controller');

router.get('/', detallePedidoController.getAllDetallePedidos);
router.get('/:id', detallePedidoController.getDetallePedidoById);
router.post('/', detallePedidoController.createDetallePedido);
router.put('/:id', detallePedidoController.updateDetallePedido);
router.delete('/:id', detallePedidoController.deleteDetallePedido);

module.exports = router;
