const express = require('express');
const router = express.Router();
const controller = require('../controllers/mascotaEnfermedad.controller');

router.post('/', controller.createMascotaEnfermedad);
router.get('/', controller.getMascotaEnfermedades);
router.get('/:mascota_id/:enfermedad_id/:fecha_diagnostico', controller.getMascotaEnfermedad);
router.get('/mascota/:mascota_id', controller.getEnfermedadesPorMascota);
router.put('/:mascota_id/:enfermedad_id/:fecha_diagnostico', controller.updateMascotaEnfermedad);
router.delete('/:mascota_id/:enfermedad_id/:fecha_diagnostico', controller.deleteMascotaEnfermedad);

module.exports = router;

