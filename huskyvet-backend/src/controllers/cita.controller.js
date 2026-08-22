const db = require('../database');

// ==================== LISTAR POR MASCOTA ====================
exports.getByMascota = async (req, res) => {
  try {
    const { mascota_id } = req.params;

    const [rows] = await db.query(
      `SELECT c.*, s.servicio_nombre, u.usuario_username
       FROM Cita c
       JOIN Servicio s ON s.servicio_id = c.servicio_id
       LEFT JOIN Usuario u ON u.usuario_id = c.usuario_id
       WHERE c.mascota_id = ?
       ORDER BY c.cita_fecha DESC`,
      [mascota_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error get citas mascota:", err);
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

// ==================== CREAR ====================
exports.create = async (req, res) => {
  try {
    const data = req.body;

    const [result] = await db.query(
      `INSERT INTO Cita
       (mascota_id, servicio_id, usuario_id, sucursal_id, cita_fecha, cita_duracion, cita_estado, cita_motivo, cita_observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.mascota_id,
        data.servicio_id,
        data.usuario_id || null,
        data.sucursal_id,
        data.cita_fecha,
        data.cita_duracion,
        data.cita_estado || 'pendiente',
        data.cita_motivo || null,
        data.cita_observaciones || null
      ]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Error crear cita:", err);
    res.status(500).json({ message: "Error al crear cita" });
  }
};

// ==================== ACTUALIZAR ====================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await db.query(
      `UPDATE Cita SET 
       servicio_id=?, usuario_id=?, cita_fecha=?, cita_duracion=?, cita_estado=?, cita_motivo=?, cita_observaciones=?
       WHERE cita_id = ?`,
      [
        data.servicio_id,
        data.usuario_id || null,
        data.cita_fecha,
        data.cita_duracion,
        data.cita_estado,
        data.cita_motivo,
        data.cita_observaciones,
        id
      ]
    );

    res.json({ message: "Cita actualizada" });
  } catch (err) {
    console.error("Error actualizar cita:", err);
    res.status(500).json({ message: "Error al actualizar cita" });
  }
};

// ==================== ELIMINAR ====================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM Cita WHERE cita_id = ?`, [id]);

    res.json({ message: "Cita eliminada" });
  } catch (err) {
    console.error("Error eliminar cita:", err);
    res.status(500).json({ message: "Error al eliminar cita" });
  }
};
