// src/routes/venta.routes.js

const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');

// Crear venta con detalles (venta + detalleVenta + actualizar stock)
router.post('/completa', ventaController.createVentaConDetalles);

// Ventas por sucursal
router.get('/sucursal/:sucursalId', ventaController.getVentasPorSucursal);

// CRUD básico de venta
router.post('/', ventaController.createVenta);
router.get('/', ventaController.getVentas);
router.get('/:id', ventaController.getVentaById);
router.put('/:id', ventaController.updateVenta);
router.delete('/:id', ventaController.deleteVenta);

module.exports = router;

