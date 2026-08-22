const db = require('../database');

exports.getByAliado = async (req, res) => {
  try {
    const { aliadoId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM ServicioAliado WHERE aliado_id = ? ORDER BY fecha_creacion DESC",
      [aliadoId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error obteniendo servicios del aliado", err);
    res.status(500).json({ error: "Error al obtener servicios" });
  }
};

exports.create = async (req, res) => {
  try {
    const { aliado_id, nombre_servicioAliado, detalle_servicioAliado, precio_servicio, servicio_estado } = req.body;

    await db.query(
      `INSERT INTO ServicioAliado (
          aliado_id, nombre_servicioAliado, detalle_servicioAliado,
          precio_servicio, servicio_estado
      ) VALUES (?, ?, ?, ?, ?)`,
      [aliado_id, nombre_servicioAliado, detalle_servicioAliado, precio_servicio, servicio_estado]
    );

    res.json({ message: "Servicio creado correctamente" });
  } catch (err) {
    console.error("Error creando servicio del aliado", err);
    res.status(500).json({ error: "Error al crear servicio" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_servicioAliado, detalle_servicioAliado, precio_servicio, servicio_estado } = req.body;

    await db.query(
      `UPDATE ServicioAliado SET
        nombre_servicioAliado = ?, detalle_servicioAliado = ?, 
        precio_servicio = ?, servicio_estado = ?
      WHERE servicioAliado_id = ?`,
      [nombre_servicioAliado, detalle_servicioAliado, precio_servicio, servicio_estado, id]
    );

    res.json({ message: "Servicio actualizado" });
  } catch (err) {
    console.error("Error actualizando servicio del aliado", err);
    res.status(500).json({ error: "Error al actualizar servicio" });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query("DELETE FROM ServicioAliado WHERE servicioAliado_id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Servicio eliminado" });
  } catch (err) {
    console.error("Error eliminando servicio", err);
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
};
