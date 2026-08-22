const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoria.controller');

router.get('/', auditoriaController.getAuditorias);
router.get('/:id', auditoriaController.getAuditoriaById);
router.post('/', auditoriaController.createAuditoria);
router.delete('/:id', auditoriaController.deleteAuditoria);

module.exports = router;
