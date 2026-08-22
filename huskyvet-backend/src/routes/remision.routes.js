// src/routes/remision.routes.js
const express = require('express');
const router = express.Router();

const remisionController = require('../controllers/remision.controller');

// Crear remisión
router.post('/', remisionController.createRemision);

// Listar TODAS las remisiones
router.get('/', remisionController.getRemisiones);

// 👇 Listar remisiones por mascota (NUEVO)
router.get('/mascota/:mascotaId', remisionController.getRemisionesPorMascota);

// Obtener una remisión por ID
router.get('/:id', remisionController.getRemisionById);

// Actualizar remisión
router.put('/:id', remisionController.updateRemision);

// Eliminar remisión
router.delete('/:id', remisionController.deleteRemision);

module.exports = router;
