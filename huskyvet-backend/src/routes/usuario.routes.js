const express = require('express');
const router = express.Router();
const multer = require('multer');
const usuarioController = require('../controllers/usuario.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rutas CRUD principales
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.post('/', upload.single('usuario_foto'), usuarioController.createUsuario);
router.put('/:id', upload.single('usuario_foto'), usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

// Ruta para obtener usuarios por sucursal
router.get('/sucursal/:sucursalId', usuarioController.getUsuariosPorSucursal);

module.exports = router;
