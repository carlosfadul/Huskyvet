const express = require('express');
const router = express.Router();
const nominaController = require('../controllers/nomina.controller');
const detalleNominaController = require('../controllers/detalleNomina.controller');
const { idParam } = require('../validators/detalleNomina.validators');

// 🔹 Obtener todas las nóminas de una sucursal
router.get('/sucursal/:sucursalId', idParam('sucursalId'), nominaController.getNominasPorSucursal);

// 🔹 Obtener una nómina por su ID
router.get('/:id', idParam('id'), nominaController.getNominaById);

// 🔹 Crear una nueva nómina
router.post('/', nominaController.createNomina);

// 🔹 Actualizar una nómina
router.put('/:id', idParam('id'), nominaController.updateNomina);

// 🔹 Eliminar una nómina
router.delete('/:id', idParam('id'), nominaController.deleteNomina);

// 🔹 Obtener detalles de nómina (ruta espejo)
router.get('/:nominaId/detalles', idParam('nominaId'), detalleNominaController.listByNomina);

module.exports = router;
