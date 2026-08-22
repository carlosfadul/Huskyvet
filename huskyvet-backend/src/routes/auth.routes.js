const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Asegúrate de que la ruta sea correcta

// Ruta para iniciar sesión

router.post('/login', authController.login);

module.exports = router;
