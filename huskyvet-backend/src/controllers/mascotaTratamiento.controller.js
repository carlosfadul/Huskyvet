const db = require('../database');

// Crear relación mascota-tratamiento
exports.createMascotaTratamiento = async (req, res) => {
  const {
    mascota_id,
    tratamiento_id,
    dosis,
    frecuencia,
    fecha_inicio,
    fecha_fin,
    estado,
    observaciones
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO MascotaTratamiento (
         mascota_id,
         tratamiento_id,
         dosis,
         frecuencia,
         fecha_inicio,
         fecha_fin,
         estado,
         observaciones
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mascota_id,
        tratamiento_id,
        dosis || null,
        frecuencia || null,
        fecha_inicio || null,
        fecha_fin || null,
        estado || 'activo',
        observaciones || null
      ]
    );

    res.status(201).json({ message: 'Tratamiento asignado a la mascota', id: result.insertId });
  } catch (error) {
    console.error('Error al crear MascotaTratamiento:', error);
    res.status(500).json({ message: 'Error al crear MascotaTratamiento' });
  }
};

// Listar tratamientos por mascota
exports.getPorMascota = async (req, res) => {
  const { mascotaId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        mt.mascota_tratamiento_id,
        mt.mascota_id,
        mt.tratamiento_id,
        mt.dosis,
        mt.frecuencia,
        mt.fecha_inicio,
        mt.fecha_fin,
        mt.estado,
        mt.observaciones,
        t.nombre_tratamiento AS tratamiento_nombre
      FROM MascotaTratamiento mt
      JOIN Tratamiento t ON t.tratamiento_id = mt.tratamiento_id
      WHERE mt.mascota_id = ?
      ORDER BY mt.fecha_inicio DESC, mt.mascota_tratamiento_id DESC
      `,
      [mascotaId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tratamientos de la mascota:', error);
    res.status(500).json({ message: 'Error al obtener tratamientos de la mascota' });
  }
};


// Obtener uno por id
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
         mt.*,
         t.tratamiento_nombre
       FROM MascotaTratamiento mt
       JOIN Tratamiento t ON t.tratamiento_id = mt.tratamiento_id
       WHERE mt.mascotaTratamiento_id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Registro de tratamiento no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener MascotaTratamiento:', error);
    res.status(500).json({ message: 'Error al obtener MascotaTratamiento' });
  }
};

// Actualizar
exports.updateMascotaTratamiento = async (req, res) => {
  const { id } = req.params;
  const {
    mascota_id,
    tratamiento_id,
    dosis,
    frecuencia,
    fecha_inicio,
    fecha_fin,
    estado,
    observaciones
  } = req.body;

  try {
    await db.query(
      `UPDATE MascotaTratamiento SET
         mascota_id = ?,
         tratamiento_id = ?,
         dosis = ?,
         frecuencia = ?,
         fecha_inicio = ?,
         fecha_fin = ?,
         estado = ?,
         observaciones = ?
       WHERE mascotaTratamiento_id = ?`,
      [
        mascota_id,
        tratamiento_id,
        dosis || null,
        frecuencia || null,
        fecha_inicio || null,
        fecha_fin || null,
        estado || 'activo',
        observaciones || null,
        id
      ]
    );

    res.json({ message: 'Tratamiento de mascota actualizado' });
  } catch (error) {
    console.error('Error al actualizar MascotaTratamiento:', error);
    res.status(500).json({ message: 'Error al actualizar MascotaTratamiento' });
  }
};

// Eliminar
exports.deleteMascotaTratamiento = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      'DELETE FROM MascotaTratamiento WHERE mascotaTratamiento_id = ?',
      [id]
    );

    res.json({ message: 'Tratamiento de mascota eliminado' });
  } catch (error) {
    console.error('Error al eliminar MascotaTratamiento:', error);
    res.status(500).json({ message: 'Error al eliminar MascotaTratamiento' });
  }
};
