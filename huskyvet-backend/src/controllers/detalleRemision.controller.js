const db = require('../database');

// Obtener todos los detalles de remisión
exports.getAllDetalleRemision = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM DetalleRemision');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los detalles de remisión:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de remisión' });
  }
};

// Obtener detalle por ID
exports.getDetalleRemisionById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM DetalleRemision WHERE detalleRemision_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Detalle no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el detalle de remisión:', error);
    res.status(500).json({ error: 'Error al obtener el detalle de remisión' });
  }
};

// Crear nuevo detalle
exports.createDetalleRemision = async (req, res) => {
  const {
    remision_id,
    servicioAliado_id,
    cantidad,
    precio,
    detalles,
    estado,
    resultados,
    observaciones
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO DetalleRemision 
        (remision_id, servicioAliado_id, cantidad, precio, detalles, estado, resultados, observaciones) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        remision_id,
        servicioAliado_id,
        cantidad,
        precio,
        detalles,
        estado,
        resultados,
        observaciones
      ]
    );
    res.status(201).json({ message: 'Detalle de remisión creado', detalleRemision_id: result.insertId });
  } catch (error) {
    console.error('Error al crear el detalle de remisión:', error);
    res.status(500).json({ error: 'Error al crear el detalle de remisión' });
  }
};

// Actualizar detalle
exports.updateDetalleRemision = async (req, res) => {
  const { id } = req.params;
  const {
    remision_id,
    servicioAliado_id,
    cantidad,
    precio,
    detalles,
    estado,
    resultados,
    observaciones
  } = req.body;

  try {
    await db.query(
      `UPDATE DetalleRemision 
       SET remision_id = ?, servicioAliado_id = ?, cantidad = ?, precio = ?, detalles = ?, estado = ?, resultados = ?, observaciones = ? 
       WHERE detalleRemision_id = ?`,
      [
        remision_id,
        servicioAliado_id,
        cantidad,
        precio,
        detalles,
        estado,
        resultados,
        observaciones,
        id
      ]
    );
    res.json({ message: 'Detalle de remisión actualizado' });
  } catch (error) {
    console.error('Error al actualizar el detalle de remisión:', error);
    res.status(500).json({ error: 'Error al actualizar el detalle de remisión' });
  }
};

// Eliminar detalle
exports.deleteDetalleRemision = async (req, res) => {
  try {
    await db.query('DELETE FROM DetalleRemision WHERE detalleRemision_id = ?', [req.params.id]);
    res.json({ message: 'Detalle de remisión eliminado' });
  } catch (error) {
    console.error('Error al eliminar el detalle de remisión:', error);
    res.status(500).json({ error: 'Error al eliminar el detalle de remisión' });
  }
};
