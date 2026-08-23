const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Asegúrate de que la ruta sea correcta
const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta para iniciar sesión

router.post('/login', authController.login);
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
