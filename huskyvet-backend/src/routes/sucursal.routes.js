const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const sucursalController = require('../controllers/sucursalController');


// Crear sucursal con logo
router.post('/', upload.single('sucursal_logo'), sucursalController.createSucursal);

// Obtener todas las sucursales
router.get('/', sucursalController.getSucursales);

// Obtener sucursal por ID
router.get('/:id', sucursalController.getSucursalById);

// Obtener sucursales por veterinaria_id
router.get('/veterinaria/:veterinaria_id', sucursalController.getSucursalesByVeterinariaId);

// Actualizar sucursal con logo
router.put('/:id', upload.single('sucursal_logo'), sucursalController.updateSucursal);


// Eliminar sucursal
router.delete('/:id', sucursalController.deleteSucursal);

// Ruta para obtener el logo de una sucursal
router.get('/:id/logo', sucursalController.getSucursalLogo);

module.exports = router;
