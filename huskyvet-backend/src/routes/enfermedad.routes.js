const express = require('express');
const router = express.Router();
const enfermedadController = require('../controllers/enfermedad.controller');

router.get('/', enfermedadController.getEnfermedades);
router.get('/:id', enfermedadController.getEnfermedadById);
router.post('/', enfermedadController.createEnfermedad);
router.put('/:id', enfermedadController.updateEnfermedad);
router.delete('/:id', enfermedadController.deleteEnfermedad);

module.exports = router;
