const db = require('../database');

// Crear
exports.createAplicacion = async (req, res) => {
  const {
    mascota_id,
    desparasitante_id,
    usuario_id,
    fecha_aplicacion,
    proxima_dosis,
    proxima_nombre,
    proxima_detalle,
    estado,
    dosis,
    observaciones
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO AplicacionDesparasitante (
         mascota_id,
         desparasitante_id,
         usuario_id,
         aplicacionDesparasitante_fecha,
         proximoDesparasitante_fecha,
         proximoDesparasitante_nombre,
         proximoDesparasitante_detalle,
         aplicacionDesparasitante_estado,
         dosis,
         observaciones
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mascota_id,
        desparasitante_id,
        usuario_id || null,
        fecha_aplicacion,
        proxima_dosis,
        proxima_nombre || null,
        proxima_detalle || null,
        estado || 'aplicada',
        dosis || null,
        observaciones || null
      ]
    );

    res.status(201).json({ message: 'Desparasitación registrada', id: result.insertId });
  } catch (error) {
    console.error('Error al crear desparasitación:', error);
    res.status(500).json({ message: 'Error al crear desparasitación' });
  }
};

// Listar todas (opcional)
exports.getAplicaciones = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         ad.*,
         d.desparasitante_nombre
       FROM AplicacionDesparasitante ad
       JOIN Desparasitante d ON d.desparasitante_id = ad.desparasitante_id
       ORDER BY ad.aplicacionDesparasitante_fecha DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener desparasitaciones:', error);
    res.status(500).json({ message: 'Error al obtener desparasitaciones' });
  }
};

// 👉 Por mascota (la que pide el frontend)
exports.getAplicacionesPorMascota = async (req, res) => {
  const { mascotaId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
         ad.aplicacionDesparasitante_id,
         ad.mascota_id,
         ad.desparasitante_id,
         ad.usuario_id,
         ad.aplicacionDesparasitante_fecha AS fecha_aplicacion,
         ad.proximoDesparasitante_fecha   AS proxima_dosis,
         ad.proximoDesparasitante_nombre,
         ad.proximoDesparasitante_detalle,
         ad.aplicacionDesparasitante_estado AS estado,
         ad.dosis,
         ad.observaciones,
         d.desparasitante_nombre
       FROM AplicacionDesparasitante ad
       JOIN Desparasitante d ON d.desparasitante_id = ad.desparasitante_id
       WHERE ad.mascota_id = ?
       ORDER BY ad.aplicacionDesparasitante_fecha DESC`,
      [mascotaId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener desparasitaciones por mascota:', error);
    res.status(500).json({ message: 'Error al obtener desparasitaciones por mascota' });
  }
};

exports.getAplicacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
         ad.aplicacionDesparasitante_id,
         ad.mascota_id,
         ad.desparasitante_id,
         ad.usuario_id,
         ad.aplicacionDesparasitante_fecha AS fecha_aplicacion,
         ad.proximoDesparasitante_fecha   AS proxima_dosis,
         ad.proximoDesparasitante_nombre,
         ad.proximoDesparasitante_detalle,
         ad.aplicacionDesparasitante_estado AS estado,
         ad.dosis,
         ad.observaciones,
         d.desparasitante_nombre
       FROM AplicacionDesparasitante ad
       JOIN Desparasitante d ON d.desparasitante_id = ad.desparasitante_id
       WHERE ad.aplicacionDesparasitante_id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Desparasitación no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener desparasitación:', error);
    res.status(500).json({ message: 'Error al obtener desparasitación' });
  }
};

exports.updateAplicacion = async (req, res) => {
  const { id } = req.params;
  const {
    mascota_id,
    desparasitante_id,
    usuario_id,
    fecha_aplicacion,
    proxima_dosis,
    proxima_nombre,
    proxima_detalle,
    estado,
    dosis,
    observaciones
  } = req.body;

  try {
    await db.query(
      `UPDATE AplicacionDesparasitante SET
         mascota_id = ?,
         desparasitante_id = ?,
         usuario_id = ?,
         aplicacionDesparasitante_fecha = ?,
         proximoDesparasitante_fecha = ?,
         proximoDesparasitante_nombre = ?,
         proximoDesparasitante_detalle = ?,
         aplicacionDesparasitante_estado = ?,
         dosis = ?,
         observaciones = ?
       WHERE aplicacionDesparasitante_id = ?`,
      [
        mascota_id,
        desparasitante_id,
        usuario_id || null,
        fecha_aplicacion,
        proxima_dosis,
        proxima_nombre || null,
        proxima_detalle || null,
        estado || 'aplicada',
        dosis || null,
        observaciones || null,
        id
      ]
    );

    res.json({ message: 'Desparasitación actualizada' });
  } catch (error) {
    console.error('Error al actualizar desparasitación:', error);
    res.status(500).json({ message: 'Error al actualizar desparasitación' });
  }
};

exports.deleteAplicacion = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      'DELETE FROM AplicacionDesparasitante WHERE aplicacionDesparasitante_id = ?',
      [id]
    );
    res.json({ message: 'Desparasitación eliminada' });
  } catch (error) {
    console.error('Error al eliminar desparasitación:', error);
    res.status(500).json({ message: 'Error al eliminar desparasitación' });
  }
};
