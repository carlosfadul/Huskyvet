const express = require('express');
const router = express.Router();
const multer = require('multer');
const productoController = require('../controllers/producto.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rutas
router.get('/', productoController.getProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', upload.single('foto_producto'), productoController.createProducto);
router.put('/:id', upload.single('foto_producto'), productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);

module.exports = router;

