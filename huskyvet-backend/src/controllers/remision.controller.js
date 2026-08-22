// src/controllers/remision.controller.js
const db = require('../database');

// Crear remisión
exports.createRemision = async (req, res) => {
  const {
    sucursal_id,
    aliado_id,
    mascota_id,
    usuario_id,
    remision_estado,
    remision_diagnostico,
    remision_observaciones,
  } = req.body;

  try {
    const [result] = await db.query(
      `
      INSERT INTO Remision (
        sucursal_id,
        aliado_id,
        mascota_id,
        usuario_id,
        remision_estado,
        remision_diagnostico,
        remision_observaciones
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sucursal_id,
        aliado_id,
        mascota_id,
        usuario_id || null,
        remision_estado || 'pendiente',
        remision_diagnostico || null,
        remision_observaciones || null,
      ]
    );

    res.status(201).json({
      message: 'Remisión creada correctamente',
      remision_id: result.insertId,
    });
  } catch (error) {
    console.error('Error al crear remisión:', error);
    res.status(500).json({ message: 'Error al crear remisión' });
  }
};

// Listar TODAS las remisiones (para administración)
exports.getRemisiones = async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Remision');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener remisiones:', error);
    res.status(500).json({ message: 'Error al obtener remisiones' });
  }
};

// 👇 Remisiones por mascota (para ficha clínica)
exports.getRemisionesPorMascota = async (req, res) => {
  const { mascotaId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        r.remision_id,
        r.mascota_id,
        r.sucursal_id,
        r.aliado_id,
        r.usuario_id,
        r.remision_fecha,
        r.remision_estado,
        r.remision_diagnostico,
        r.remision_observaciones,
        a.nombre_aliado,
        GROUP_CONCAT(sa.nombre_servicioAliado SEPARATOR ', ') AS servicios_aliado
      FROM Remision r
      LEFT JOIN Aliado a ON a.aliado_id = r.aliado_id
      LEFT JOIN DetalleRemision dr ON dr.remision_id = r.remision_id
      LEFT JOIN ServicioAliado sa ON sa.servicioAliado_id = dr.servicioAliado_id
      WHERE r.mascota_id = ?
      GROUP BY r.remision_id
      ORDER BY r.remision_fecha DESC, r.remision_id DESC
      `,
      [mascotaId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener remisiones por mascota:', error);
    res.status(500).json({ message: 'Error al obtener remisiones de la mascota' });
  }
};

// Obtener una remisión por ID
exports.getRemisionById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM Remision WHERE remision_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Remisión no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener remisión por ID:', error);
    res.status(500).json({ message: 'Error al obtener remisión' });
  }
};

// Actualizar remisión
exports.updateRemision = async (req, res) => {
  const { id } = req.params;
  const {
    sucursal_id,
    aliado_id,
    mascota_id,
    usuario_id,
    remision_estado,
    remision_diagnostico,
    remision_observaciones,
  } = req.body;

  try {
    await db.query(
      `
      UPDATE Remision SET
        sucursal_id = ?,
        aliado_id = ?,
        mascota_id = ?,
        usuario_id = ?,
        remision_estado = ?,
        remision_diagnostico = ?,
        remision_observaciones = ?
      WHERE remision_id = ?
      `,
      [
        sucursal_id,
        aliado_id,
        mascota_id,
        usuario_id || null,
        remision_estado,
        remision_diagnostico,
        remision_observaciones,
        id,
      ]
    );

    res.json({ message: 'Remisión actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar remisión:', error);
    res.status(500).json({ message: 'Error al actualizar remisión' });
  }
};

// Eliminar remisión
exports.deleteRemision = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM Remision WHERE remision_id = ?', [id]);
    res.json({ message: 'Remisión eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar remisión:', error);
    res.status(500).json({ message: 'Error al eliminar remisión' });
  }
};
