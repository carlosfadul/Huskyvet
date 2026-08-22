const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mascotaController = require('../controllers/mascota.controller');

router.post('/', upload.single('mascota_foto'), mascotaController.createMascota);
router.get('/', mascotaController.getMascotas);
router.get('/:id', mascotaController.getMascotaById);
router.put('/:id', upload.single('mascota_foto'), mascotaController.updateMascota);
router.delete('/:id', mascotaController.deleteMascota);
router.get('/cliente/:clienteId', mascotaController.getMascotasPorCliente);
router.get('/:id/foto', mascotaController.getFotoMascota);
router.get('/sucursal/:sucursalId', mascotaController.getMascotasPorSucursal);
router.get('/mascotas/sucursal/:sucursalId', mascotaController.getMascotasPorSucursal);


module.exports = router;
