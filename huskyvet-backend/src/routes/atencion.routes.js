// src/routes/atencion.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const atencionController = require('../controllers/atencion.controller');

// ================= RUTAS ESPECÍFICAS (DEBEN IR ANTES DE '/:id') =================

// Atenciones por mascota
router.get('/mascota/:mascotaId', atencionController.getAtencionesByMascota);

// Archivo adjunto de una atención
router.get('/:id/archivoAdjunto', atencionController.getArchivoAdjunto);

// ================= CRUD PRINCIPAL =================

// Crear atención (con archivo adjunto opcional)
router.post(
  '/',
  upload.single('atencion_archivoAdjunto'),
  atencionController.createAtencion
);

// Obtener TODAS las atenciones
router.get('/', atencionController.getAtenciones);

// Obtener una atención por ID
router.get('/:id', atencionController.getAtencionById);

// Actualizar atención (con archivo adjunto opcional)
router.put(
  '/:id',
  upload.single('atencion_archivoAdjunto'),
  atencionController.updateAtencion
);

// Eliminar atención
router.delete('/:id', atencionController.deleteAtencion);

module.exports = router;
