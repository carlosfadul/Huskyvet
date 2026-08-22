// src/routes/detalleNomina.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/detalleNomina.controller');
const {
  idParam,
  createDetalleNominaValidator,
  updateDetalleNominaValidator,
} = require('../validators/detalleNomina.validators');

const router = Router();

// Listar por nómina: GET /api/detalle-nomina/nomina/:nominaId
router.get('/nomina/:nominaId', idParam('nominaId'), ctrl.listByNomina);

// Obtener por id: GET /api/detalle-nomina/:detalleId
router.get('/:detalleId', idParam('detalleId'), ctrl.getById);

// Crear: POST /api/detalle-nomina  (datos en body)
router.post('/', createDetalleNominaValidator, ctrl.create);

// Actualizar: PUT /api/detalle-nomina/:detalleId
router.put('/:detalleId', idParam('detalleId'), updateDetalleNominaValidator, ctrl.update);

// Eliminar: DELETE /api/detalle-nomina/:detalleId
router.delete('/:detalleId', idParam('detalleId'), ctrl.remove);

module.exports = router;
