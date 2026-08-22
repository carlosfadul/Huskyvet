const express = require('express');
const router = express.Router();
const mascotaTratamientoController = require('../controllers/mascotaTratamiento.controller');

// Listar por mascota
router.get('/mascota/:mascotaId', mascotaTratamientoController.getPorMascota);

// CRUD básico
router.get('/:id', mascotaTratamientoController.getById);
router.post('/', mascotaTratamientoController.createMascotaTratamiento);
router.put('/:id', mascotaTratamientoController.updateMascotaTratamiento);
router.delete('/:id', mascotaTratamientoController.deleteMascotaTratamiento);

module.exports = router;
