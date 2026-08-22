const express = require('express');
const router = express.Router();
const servicioAliadoCtrl = require('../controllers/servicioAliado.controller');

router.get('/:aliadoId', servicioAliadoCtrl.getByAliado);
router.post('/', servicioAliadoCtrl.create);
router.put('/:id', servicioAliadoCtrl.update);
router.delete('/:id', servicioAliadoCtrl.delete);

module.exports = router;
