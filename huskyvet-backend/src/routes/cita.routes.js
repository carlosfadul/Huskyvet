const router = require('express').Router();
const ctrl = require('../controllers/cita.controller');

router.get('/mascota/:mascota_id', ctrl.getByMascota);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
