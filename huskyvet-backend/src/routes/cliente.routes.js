const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.post('/', clienteController.createCliente);
router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.getClienteById);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);
router.get('/sucursal/:sucursal_id', clienteController.getClientesBySucursal);


module.exports = router;
