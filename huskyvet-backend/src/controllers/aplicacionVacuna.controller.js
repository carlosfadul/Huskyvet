const db = require('../database');

// Crear aplicación de vacuna
exports.createAplicacion = async (req, res) => {
  const {
    mascota_id,
    vacuna_id,
    usuario_id,
    fecha_aplicacion,
    proxima_dosis,
    proxima_nombre,
    proxima_detalle,
    estado,
    lote,
    observaciones
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO AplicacionVacuna (
         mascota_id,
         vacuna_id,
         usuario_id,
         aplicacionVacuna_fecha,
         proximaVacuna_fecha,
         proximaVacuna_nombre,
         proximaVacuna_detalle,
         aplicacionVacuna_estado,
         lote_vacuna,
         observaciones
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mascota_id,
        vacuna_id,
        usuario_id || null,
        fecha_aplicacion,
        proxima_dosis,
        proxima_nombre || null,
        proxima_detalle || null,
        estado || 'aplicada',
        lote || null,
        observaciones || null
      ]
    );

    res.status(201).json({ message: 'Aplicación de vacuna creada', id: result.insertId });
  } catch (error) {
    console.error('Error al crear aplicación de vacuna:', error);
    res.status(500).json({ message: 'Error al crear aplicación de vacuna' });
  }
};

// Listar todas (por si la usas en reportes)
exports.getAplicaciones = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         av.aplicacionVacuna_id,
         av.mascota_id,
         av.vacuna_id,
         av.usuario_id,
         av.aplicacionVacuna_fecha   AS fecha_aplicacion,
         av.proximaVacuna_fecha      AS proxima_dosis,
         av.proximaVacuna_nombre,
         av.proximaVacuna_detalle,
         av.aplicacionVacuna_estado  AS estado,
         av.lote_vacuna              AS lote,
         av.observaciones,
         v.vacuna_nombre
       FROM AplicacionVacuna av
       JOIN Vacuna v ON v.vacuna_id = av.vacuna_id
       ORDER BY av.aplicacionVacuna_fecha DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener aplicaciones de vacunas:', error);
    res.status(500).json({ message: 'Error al obtener aplicaciones de vacunas' });
  }
};

// 👉 Listar por mascota (la que usa el frontend)
exports.getAplicacionesPorMascota = async (req, res) => {
  const { mascotaId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
         av.aplicacionVacuna_id,
         av.mascota_id,
         av.vacuna_id,
         av.usuario_id,
         av.aplicacionVacuna_fecha   AS fecha_aplicacion,
         av.proximaVacuna_fecha      AS proxima_dosis,
         av.proximaVacuna_nombre,
         av.proximaVacuna_detalle,
         av.aplicacionVacuna_estado  AS estado,
         av.lote_vacuna              AS lote,
         av.observaciones,
         v.vacuna_nombre
       FROM AplicacionVacuna av
       JOIN Vacuna v ON v.vacuna_id = av.vacuna_id
       WHERE av.mascota_id = ?
       ORDER BY av.aplicacionVacuna_fecha DESC`,
      [mascotaId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener vacunas por mascota:', error);
    res.status(500).json({ message: 'Error al obtener vacunas por mascota' });
  }
};

exports.getAplicacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
         av.aplicacionVacuna_id,
         av.mascota_id,
         av.vacuna_id,
         av.usuario_id,
         av.aplicacionVacuna_fecha   AS fecha_aplicacion,
         av.proximaVacuna_fecha      AS proxima_dosis,
         av.proximaVacuna_nombre,
         av.proximaVacuna_detalle,
         av.aplicacionVacuna_estado  AS estado,
         av.lote_vacuna              AS lote,
         av.observaciones,
         v.vacuna_nombre
       FROM AplicacionVacuna av
       JOIN Vacuna v ON v.vacuna_id = av.vacuna_id
       WHERE av.aplicacionVacuna_id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Aplicación de vacuna no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener aplicación de vacuna:', error);
    res.status(500).json({ message: 'Error al obtener aplicación de vacuna' });
  }
};

// Actualizar
exports.updateAplicacion = async (req, res) => {
  const { id } = req.params;
  const {
    mascota_id,
    vacuna_id,
    usuario_id,
    fecha_aplicacion,
    proxima_dosis,
    proxima_nombre,
    proxima_detalle,
    estado,
    lote,
    observaciones
  } = req.body;

  try {
    await db.query(
      `UPDATE AplicacionVacuna SET
         mascota_id = ?,
         vacuna_id = ?,
         usuario_id = ?,
         aplicacionVacuna_fecha = ?,
         proximaVacuna_fecha = ?,
         proximaVacuna_nombre = ?,
         proximaVacuna_detalle = ?,
         aplicacionVacuna_estado = ?,
         lote_vacuna = ?,
         observaciones = ?
       WHERE aplicacionVacuna_id = ?`,
      [
        mascota_id,
        vacuna_id,
        usuario_id || null,
        fecha_aplicacion,
        proxima_dosis,
        proxima_nombre || null,
        proxima_detalle || null,
        estado || 'aplicada',
        lote || null,
        observaciones || null,
        id
      ]
    );

    res.json({ message: 'Aplicación de vacuna actualizada' });
  } catch (error) {
    console.error('Error al actualizar aplicación de vacuna:', error);
    res.status(500).json({ message: 'Error al actualizar aplicación de vacuna' });
  }
};

// Eliminar
exports.deleteAplicacion = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM AplicacionVacuna WHERE aplicacionVacuna_id = ?', [id]);
    res.json({ message: 'Aplicación de vacuna eliminada' });
  } catch (error) {
    console.error('Error al eliminar aplicación de vacuna:', error);
    res.status(500).json({ message: 'Error al eliminar aplicación de vacuna' });
  }
};

