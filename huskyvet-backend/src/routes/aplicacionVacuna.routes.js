const express = require('express');
const router = express.Router();
const aplicacionVacunaController = require('../controllers/aplicacionVacuna.controller');

// CRUD básico
router.post('/', aplicacionVacunaController.createAplicacion);
router.get('/', aplicacionVacunaController.getAplicaciones);
router.get('/:id', aplicacionVacunaController.getAplicacionById);
router.put('/:id', aplicacionVacunaController.updateAplicacion);
router.delete('/:id', aplicacionVacunaController.deleteAplicacion);

// 👉 Ruta para el detalle de la mascota
router.get('/mascota/:mascotaId', aplicacionVacunaController.getAplicacionesPorMascota);

module.exports = router;
