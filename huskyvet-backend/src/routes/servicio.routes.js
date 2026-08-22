const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicio.controller');

// Listar todos los servicios
router.get('/', servicioController.getServicios);

// Obtener un servicio por ID
router.get('/:id', servicioController.getServicioById);

// Crear servicio
router.post('/', servicioController.createServicio);

// Actualizar servicio
router.put('/:id', servicioController.updateServicio);

// Eliminar servicio
router.delete('/:id', servicioController.deleteServicio);

module.exports = router;
