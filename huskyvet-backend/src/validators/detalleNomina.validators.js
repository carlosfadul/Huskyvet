// src/validators/detalleNomina.validators.js
const { param, body } = require('express-validator');

// Valida un parámetro id en la URL
const idParam = (name) =>
  param(name)
    .isInt({ gt: 0 })
    .withMessage(`${name} debe ser entero positivo`);

const createDetalleNominaValidator = [
  body('nomina_id').isInt({ gt: 0 }).withMessage('nomina_id es obligatorio y debe ser entero positivo'),
  body('empleado_id').isInt({ gt: 0 }).withMessage('empleado_id es obligatorio y debe ser entero positivo'),
  body('cantidad_horas').isInt({ min: 0 }).withMessage('cantidad_horas debe ser entero >= 0'),
  body('valor_hora').isFloat({ gt: 0 }).withMessage('valor_hora debe ser número > 0'),
  body('horas_extras').optional().isInt({ min: 0 }).withMessage('horas_extras debe ser entero >= 0'),
  body('valor_horas_extras').optional().isFloat({ min: 0 }).withMessage('valor_horas_extras debe ser número >= 0'),
  body('bonificaciones').optional().isFloat({ min: 0 }).withMessage('bonificaciones debe ser número >= 0'),
  body('descuentos').optional().isFloat({ min: 0 }).withMessage('descuentos debe ser número >= 0'),
];

const updateDetalleNominaValidator = [
  // todos opcionales pero con tipado correcto
  body('empleado_id').optional().isInt({ gt: 0 }).withMessage('empleado_id debe ser entero positivo'),
  body('cantidad_horas').optional().isInt({ min: 0 }).withMessage('cantidad_horas debe ser entero >= 0'),
  body('valor_hora').optional().isFloat({ gt: 0 }).withMessage('valor_hora debe ser número > 0'),
  body('horas_extras').optional().isInt({ min: 0 }).withMessage('horas_extras debe ser entero >= 0'),
  body('valor_horas_extras').optional().isFloat({ min: 0 }).withMessage('valor_horas_extras debe ser número >= 0'),
  body('bonificaciones').optional().isFloat({ min: 0 }).withMessage('bonificaciones debe ser número >= 0'),
  body('descuentos').optional().isFloat({ min: 0 }).withMessage('descuentos debe ser número >= 0'),
];

module.exports = {
  idParam,
  createDetalleNominaValidator,
  updateDetalleNominaValidator,
};
