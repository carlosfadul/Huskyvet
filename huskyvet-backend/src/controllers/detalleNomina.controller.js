// src/controllers/detalleNomina.controller.js
const { validationResult } = require('express-validator');
const pool = require('../database');

// --- helpers ---
const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validación fallida');
    err.status = 400;
    err.details = errors.array();
    throw err;
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Recalcula total_nomina usando la MISMA conexión/tx (conn) y una sola sentencia.
 * Incluye reintentos en caso de ER_LOCK_WAIT_TIMEOUT.
 */
async function actualizarTotalNominaTx(conn, nominaId, { retries = 3, delayMs = 120 } = {}) {
  const sql = `
    UPDATE Nomina n
    SET
      total_nomina = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM DetalleNomina dn
        WHERE dn.nomina_id = n.nomina_id
      ),
      nomina_estado = 'calculada'
    WHERE n.nomina_id = ?`;
  for (let i = 0; i <= retries; i++) {
    try {
      await conn.query(sql, [nominaId]);
      return;
    } catch (err) {
      if (err && err.code === 'ER_LOCK_WAIT_TIMEOUT' && i < retries) {
        await sleep(delayMs * (i + 1)); // backoff lineal
        continue;
      }
      throw err;
    }
  }
}

// ================== LISTAR POR NÓMINA ==================
exports.listByNomina = async (req, res, next) => {
  try {
    handleValidation(req);
    const { nominaId } = req.params;

    const [rows] = await pool.query(
      `SELECT dn.*,
              e.empleado_nombre, e.empleado_apellido, e.empleado_cedula
       FROM DetalleNomina dn
       JOIN Empleado e ON e.empleado_id = dn.empleado_id
       WHERE dn.nomina_id = ?
       ORDER BY dn.detalleNomina_id DESC`,
      [nominaId]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ================== OBTENER POR ID ==================
exports.getById = async (req, res, next) => {
  try {
    handleValidation(req);
    const { detalleId } = req.params;

    const [rows] = await pool.query(
      `SELECT dn.*,
              e.empleado_nombre, e.empleado_apellido, e.empleado_cedula
       FROM DetalleNomina dn
       JOIN Empleado e ON e.empleado_id = dn.empleado_id
       WHERE dn.detalleNomina_id = ?`,
      [detalleId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Detalle no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ================== CREAR ==================
exports.create = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    handleValidation(req);
    const {
      nomina_id,
      empleado_id,
      cantidad_horas,
      valor_hora,
      horas_extras = 0,
      valor_horas_extras = 0,
      bonificaciones = 0,
      descuentos = 0,
    } = req.body;

    await conn.beginTransaction();

    // Validaciones de existencia dentro de la misma conexión
    const [[nomina]] = await conn.query(
      'SELECT nomina_id FROM Nomina WHERE nomina_id = ?',
      [nomina_id]
    );
    if (!nomina) {
      await conn.rollback();
      return res.status(400).json({ message: 'nomina_id no existe' });
    }

    const [[empleado]] = await conn.query(
      'SELECT empleado_id FROM Empleado WHERE empleado_id = ?',
      [empleado_id]
    );
    if (!empleado) {
      await conn.rollback();
      return res.status(400).json({ message: 'empleado_id no existe' });
    }

    // Insertar detalle
    const [result] = await conn.query(
      `INSERT INTO DetalleNomina
         (nomina_id, empleado_id, cantidad_horas, valor_hora, horas_extras,
          valor_horas_extras, bonificaciones, descuentos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomina_id,
        empleado_id,
        cantidad_horas,
        valor_hora,
        horas_extras,
        valor_horas_extras,
        bonificaciones,
        descuentos,
      ]
    );
    const detalleId = result.insertId;

    // Recalcular total dentro de la MISMA transacción
    await actualizarTotalNominaTx(conn, nomina_id);

    // Leer detalle recién creado
    const [[detalle]] = await conn.query(
      `SELECT dn.*, e.empleado_nombre, e.empleado_apellido, e.empleado_cedula
       FROM DetalleNomina dn
       JOIN Empleado e ON e.empleado_id = dn.empleado_id
       WHERE dn.detalleNomina_id = ?`,
      [detalleId]
    );

    await conn.commit();
    res.status(201).json(detalle);
  } catch (err) {
    try { await conn.rollback(); } catch {}
    next(err);
  } finally {
    conn.release();
  }
};

// ================== ACTUALIZAR ==================
exports.update = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    handleValidation(req);
    const { detalleId } = req.params;

    const allowed = [
      'empleado_id',
      'cantidad_horas',
      'valor_hora',
      'horas_extras',
      'valor_horas_extras',
      'bonificaciones',
      'descuentos',
    ];

    const fields = [];
    const values = [];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    await conn.beginTransaction();

    // Verificar existencia y obtener nomina_id
    const [[exists]] = await conn.query(
      'SELECT nomina_id FROM DetalleNomina WHERE detalleNomina_id = ?',
      [detalleId]
    );
    if (!exists) {
      await conn.rollback();
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }

    // (opcional) validar empleado si cambió
    if (req.body.empleado_id) {
      const [[emp]] = await conn.query(
        'SELECT empleado_id FROM Empleado WHERE empleado_id = ?',
        [req.body.empleado_id]
      );
      if (!emp) {
        await conn.rollback();
        return res.status(400).json({ message: 'empleado_id no existe' });
      }
    }

    await conn.query(
      `UPDATE DetalleNomina SET ${fields.join(', ')} WHERE detalleNomina_id = ?`,
      [...values, detalleId]
    );

    // Recalcular total en la misma tx
    await actualizarTotalNominaTx(conn, exists.nomina_id);

    // Leer actualizado
    const [[detalle]] = await conn.query(
      `SELECT dn.*, e.empleado_nombre, e.empleado_apellido, e.empleado_cedula
       FROM DetalleNomina dn
       JOIN Empleado e ON e.empleado_id = dn.empleado_id
       WHERE dn.detalleNomina_id = ?`,
      [detalleId]
    );

    await conn.commit();
    res.json(detalle);
  } catch (err) {
    try { await conn.rollback(); } catch {}
    next(err);
  } finally {
    conn.release();
  }
};

// ================== ELIMINAR ==================
exports.remove = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    handleValidation(req);
    const { detalleId } = req.params;

    await conn.beginTransaction();

    const [[detalle]] = await conn.query(
      'SELECT nomina_id FROM DetalleNomina WHERE detalleNomina_id = ?',
      [detalleId]
    );
    if (!detalle) {
      await conn.rollback();
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }

    await conn.query('DELETE FROM DetalleNomina WHERE detalleNomina_id = ?', [detalleId]);

    // Recalcular total en la misma tx
    await actualizarTotalNominaTx(conn, detalle.nomina_id);

    await conn.commit();
    res.json({ message: 'Detalle eliminado correctamente' });
  } catch (err) {
    try { await conn.rollback(); } catch {}
    next(err);
  } finally {
    conn.release();
  }
};

