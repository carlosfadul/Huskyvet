// src/routes/pedido.routes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

// ⚠️ Importante: las rutas más específicas van primero

// 🔹 Obtener pedidos por sucursal
router.get('/sucursal/:sucursal_id', pedidoController.getPedidosBySucursalId);

// 🔹 Obtener pedidos por proveedor
router.get('/proveedor/:proveedor_id', pedidoController.getPedidosByProveedorId);

// Rutas CRUD básicas
router.get('/', pedidoController.getPedidos); // Obtener todos los pedidos
router.get('/:id', pedidoController.getPedidoById); // Obtener pedido por ID
router.post('/', pedidoController.createPedido); // Crear nuevo pedido
router.put('/:id', pedidoController.updatePedido); // Actualizar pedido
router.delete('/:id', pedidoController.deletePedido); // Eliminar pedido

module.exports = router;

