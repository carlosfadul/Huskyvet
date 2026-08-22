const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const controller = require('../controllers/detalleAtencion.controller');

router.post('/', upload.single('archivoAdjunto'), controller.createDetalleAtencion);
router.get('/', controller.getAllDetalleAtencion);
router.get('/:id', controller.getDetalleAtencionById);
router.put('/:id', upload.single('archivoAdjunto'), controller.updateDetalleAtencion);
router.delete('/:id', controller.deleteDetalleAtencion);

module.exports = router;
