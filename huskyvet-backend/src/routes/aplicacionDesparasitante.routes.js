const express = require('express');
const router = express.Router();
const aplicacionDesparasitanteController = require('../controllers/aplicacionDesparasitante.controller');

// CRUD
router.post('/', aplicacionDesparasitanteController.createAplicacion);
router.get('/', aplicacionDesparasitanteController.getAplicaciones);
router.get('/:id', aplicacionDesparasitanteController.getAplicacionById);
router.put('/:id', aplicacionDesparasitanteController.updateAplicacion);
router.delete('/:id', aplicacionDesparasitanteController.deleteAplicacion);

// 👉 Ruta por mascota (la que usa Angular)
router.get('/mascota/:mascotaId', aplicacionDesparasitanteController.getAplicacionesPorMascota);

module.exports = router;
