// src/controllers/nomina.controller.js
const pool = require('../database');

// 🗓️ Función para formatear fechas a YYYY-MM-DD
function formatDate(fecha) {
  if (!fecha) return null;
  const d = new Date(fecha);
  return d.toISOString().split('T')[0];
}

// ✅ Obtener todas las nóminas
exports.getAllNominas = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT n.*, s.sucursal_nombre
      FROM Nomina n
      JOIN Sucursal s ON s.sucursal_id = n.sucursal_id
      ORDER BY n.nomina_id DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener las nóminas:', err);
    res.status(500).json({ message: 'Error al obtener las nóminas' });
  }
};

// ✅ Obtener nómina por ID
exports.getNominaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT n.*, s.sucursal_nombre
       FROM Nomina n
       JOIN Sucursal s ON s.sucursal_id = n.sucursal_id
       WHERE n.nomina_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nómina no encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error al obtener la nómina:', err);
    res.status(500).json({ message: 'Error al obtener la nómina' });
  }
};

// ✅ Crear nómina
exports.createNomina = async (req, res) => {
  const {
    sucursal_id,
    usuario_id,
    nomina_fecha,
    nomina_periodo_inicio,
    nomina_periodo_fin,
    nomina_estado,
    total_nomina,
    observaciones,
  } = req.body;

  const estadoFinal = ['borrador', 'calculada', 'pagada', 'cancelada'].includes(nomina_estado)
    ? nomina_estado
    : 'borrador';

  try {
    const [result] = await pool.query(
      `INSERT INTO Nomina (
        sucursal_id, usuario_id, nomina_fecha, nomina_periodo_inicio,
        nomina_periodo_fin, nomina_estado, total_nomina, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sucursal_id,
        usuario_id || null,
        formatDate(nomina_fecha),
        formatDate(nomina_periodo_inicio),
        formatDate(nomina_periodo_fin),
        estadoFinal,
        total_nomina || 0,
        observaciones || '',
      ]
    );

    // 🔄 recalcular total_nomina (en caso de detalles)
    await actualizarTotalNomina(result.insertId);

    res.status(201).json({
      message: 'Nómina creada correctamente',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Error al crear la nómina:', err);
    res.status(500).json({ message: 'Error al crear la nómina' });
  }
};

// ✅ Actualizar nómina
exports.updateNomina = async (req, res) => {
  const { id } = req.params;
  const {
    sucursal_id,
    usuario_id,
    nomina_fecha,
    nomina_periodo_inicio,
    nomina_periodo_fin,
    nomina_estado,
    total_nomina,
    observaciones,
  } = req.body;

  const estadoFinal = ['borrador', 'calculada', 'pagada', 'cancelada'].includes(nomina_estado)
    ? nomina_estado
    : 'borrador';

  try {
    await pool.query(
      `UPDATE Nomina SET
        sucursal_id=?, usuario_id=?, nomina_fecha=?, nomina_periodo_inicio=?,
        nomina_periodo_fin=?, nomina_estado=?, total_nomina=?, observaciones=?
       WHERE nomina_id=?`,
      [
        sucursal_id,
        usuario_id || null,
        formatDate(nomina_fecha),
        formatDate(nomina_periodo_inicio),
        formatDate(nomina_periodo_fin),
        estadoFinal,
        total_nomina || 0,
        observaciones || '',
        id,
      ]
    );

    // 🔄 recalcular total
    await actualizarTotalNomina(id);

    res.json({ message: 'Nómina actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar la nómina:', err);
    res.status(500).json({ message: 'Error al actualizar la nómina' });
  }
};

// ✅ Eliminar nómina
exports.deleteNomina = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Nomina WHERE nomina_id = ?', [id]);
    res.json({ message: 'Nómina eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar la nómina:', err);
    res.status(500).json({ message: 'Error al eliminar la nómina' });
  }
};

// ✅ Obtener nóminas por sucursal
exports.getNominasPorSucursal = async (req, res) => {
  const { sucursalId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT n.*, s.sucursal_nombre
       FROM Nomina n
       JOIN Sucursal s ON s.sucursal_id = n.sucursal_id
       WHERE n.sucursal_id = ?
       ORDER BY n.nomina_id DESC`,
      [sucursalId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener las nóminas por sucursal:', err);
    res.status(500).json({ message: 'Error al obtener las nóminas por sucursal' });
  }
};

// ✅ Recalcular total_nomina con base en los detalles
async function actualizarTotalNomina(nominaId) {
  try {
    const [rows] = await pool.query(
      `SELECT SUM(subtotal) AS total
       FROM DetalleNomina
       WHERE nomina_id = ?`,
      [nominaId]
    );

    const total = rows[0].total || 0;

    await pool.query(
      `UPDATE Nomina SET total_nomina = ?, nomina_estado = 'calculada' WHERE nomina_id = ?`,
      [total, nominaId]
    );

    console.log(`🔄 Total actualizado para la nómina ${nominaId}: ${total}`);
  } catch (err) {
    console.error('Error al actualizar total_nomina:', err);
  }
}
