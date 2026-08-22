const db = require('../database');

exports.getConfiguraciones = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Configuracion');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ message: 'Error al obtener configuraciones' });
  }
};

exports.getConfiguracionById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Configuracion WHERE configuracion_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Configuración no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la configuración:', error);
    res.status(500).json({ message: 'Error al obtener la configuración' });
  }
};

exports.createConfiguracion = async (req, res) => {
  try {
    const { sucursal_id, veterinaria_id, configuracion_nombre, configuracion_valor, configuracion_tipo } = req.body;
    const [result] = await db.query(
      `INSERT INTO Configuracion (sucursal_id, veterinaria_id, configuracion_nombre, configuracion_valor, configuracion_tipo)
       VALUES (?, ?, ?, ?, ?)`,
      [sucursal_id || null, veterinaria_id || null, configuracion_nombre, configuracion_valor, configuracion_tipo]
    );
    res.status(201).json({ message: 'Configuración creada', configuracion_id: result.insertId });
  } catch (error) {
    console.error('Error al crear configuración:', error);
    res.status(500).json({ message: 'Error al crear configuración' });
  }
};

exports.updateConfiguracion = async (req, res) => {
  try {
    const { sucursal_id, veterinaria_id, configuracion_nombre, configuracion_valor, configuracion_tipo } = req.body;
    const [result] = await db.query(
      `UPDATE Configuracion 
       SET sucursal_id=?, veterinaria_id=?, configuracion_nombre=?, configuracion_valor=?, configuracion_tipo=? 
       WHERE configuracion_id=?`,
      [sucursal_id || null, veterinaria_id || null, configuracion_nombre, configuracion_valor, configuracion_tipo, req.params.id]
    );
    res.json({ message: 'Configuración actualizada' });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ message: 'Error al actualizar configuración' });
  }
};

exports.deleteConfiguracion = async (req, res) => {
  try {
    await db.query('DELETE FROM Configuracion WHERE configuracion_id = ?', [req.params.id]);
    res.json({ message: 'Configuración eliminada' });
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    res.status(500).json({ message: 'Error al eliminar configuración' });
  }
};
