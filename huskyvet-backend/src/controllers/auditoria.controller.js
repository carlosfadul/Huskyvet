const db = require('../database');

exports.getAuditorias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Auditoria');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    res.status(500).json({ message: 'Error al obtener auditorías' });
  }
};

exports.getAuditoriaById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Auditoria WHERE auditoria_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Auditoría no encontrada' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener auditoría por ID:', error);
    res.status(500).json({ message: 'Error al obtener auditoría' });
  }
};

exports.createAuditoria = async (req, res) => {
  try {
    const { tabla_afectada, id_registro, accion, usuario_id, datos_anteriores, datos_nuevos } = req.body;
    const [result] = await db.query(
      `INSERT INTO Auditoria (tabla_afectada, id_registro, accion, usuario_id, datos_anteriores, datos_nuevos) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tabla_afectada, id_registro, accion, usuario_id, datos_anteriores, datos_nuevos]
    );
    res.status(201).json({ message: 'Auditoría registrada', auditoria_id: result.insertId });
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
    res.status(500).json({ message: 'Error al registrar auditoría' });
  }
};

exports.deleteAuditoria = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Auditoria WHERE auditoria_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Auditoría no encontrada' });
    res.status(200).json({ message: 'Auditoría eliminada' });
  } catch (error) {
    console.error('Error al eliminar auditoría:', error);
    res.status(500).json({ message: 'Error al eliminar auditoría' });
  }
};
