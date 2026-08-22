const express = require('express');
const router = express.Router();
const aliadoController = require('../controllers/aliado.controller');

router.get('/', aliadoController.getAliados);
router.get('/:id', aliadoController.getAliadoById);
router.post('/', aliadoController.createAliado);
router.put('/:id', aliadoController.updateAliado);
router.delete('/:id', aliadoController.deleteAliado);
router.get('/sucursal/:sucursalId', aliadoController.getAliadosPorSucursal);


module.exports = router;

