// src/routes/empleado.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const empleadoController = require('../controllers/empleado.controller');

// Configurar multer para subir la foto del empleado
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * GET /api/empleados?sucursal_id=20
 * Reusa getEmpleadosPorSucursal cuando viene el query param.
 * Si no envían sucursal_id, responde 400 para evitar ambigüedad con /:id
 */
router.get('/', (req, res, next) => {
  const { sucursal_id } = req.query || {};
  if (sucursal_id) {
    // Reutilizamos el mismo controlador
    req.params.sucursalId = sucursal_id;
    return empleadoController.getEmpleadosPorSucursal(req, res, next);
  }
  return res
    .status(400)
    .json({ message: 'Falta sucursal_id. Usa /api/empleados?sucursal_id=:id o /api/empleados/sucursal/:sucursalId' });
});

// Listado por sucursal (ruta principal que ya usabas)
router.get('/sucursal/:sucursalId', empleadoController.getEmpleadosPorSucursal);

// Alias adicional para compatibilidad: /por-sucursal/:sucursalId
router.get('/por-sucursal/:sucursalId', empleadoController.getEmpleadosPorSucursal);

// Obtener empleados sin usuario de una sucursal (más específico, va antes de /:id)
router.get('/sucursal/:sucursalId/sin-usuario', empleadoController.getEmpleadosSinUsuarioPorSucursal);

// Obtener empleado por ID (dejarla al final para no capturar rutas anteriores)
router.get('/:id', empleadoController.getEmpleadoById);

// Crear / Actualizar / Eliminar
router.post('/', upload.single('empleado_foto'), empleadoController.createEmpleado);
router.put('/:id', upload.single('empleado_foto'), empleadoController.updateEmpleado);
router.delete('/:id', empleadoController.deleteEmpleado);

module.exports = router;
