// src/routes/desparasitante.routes.js
const express = require('express');
const router = express.Router();
const desparasitanteController = require('../controllers/desparasitante.controller');


router.post('/', desparasitanteController.createDesparasitante);
router.get('/', desparasitanteController.getDesparasitantes);
router.get('/:id', desparasitanteController.getDesparasitanteById);
router.put('/:id', desparasitanteController.updateDesparasitante);
router.delete('/:id', desparasitanteController.deleteDesparasitante);

module.exports = router;
