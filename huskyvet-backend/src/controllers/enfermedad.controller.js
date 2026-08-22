const db = require('../database');

// Obtener todas las enfermedades
const getEnfermedades = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Enfermedad');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener enfermedades:', error);
    res.status(500).json({ error: 'Error al obtener enfermedades' });
  }
};

// Obtener una enfermedad por ID
const getEnfermedadById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Enfermedad WHERE enfermedad_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Enfermedad no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la enfermedad:', error);
    res.status(500).json({ error: 'Error al obtener la enfermedad' });
  }
};

// Crear una enfermedad
const createEnfermedad = async (req, res) => {
  const { nombre_enfermedad, descripcion_enfermedad, categoria, especie_afectada } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Enfermedad (nombre_enfermedad, descripcion_enfermedad, categoria, especie_afectada)
       VALUES (?, ?, ?, ?)`,
      [nombre_enfermedad, descripcion_enfermedad, categoria, especie_afectada]
    );
    res.status(201).json({ message: 'Enfermedad creada', enfermedad_id: result.insertId });
  } catch (error) {
    console.error('Error al crear enfermedad:', error);
    res.status(500).json({ error: 'Error al crear enfermedad' });
  }
};

// Actualizar enfermedad
const updateEnfermedad = async (req, res) => {
  const { id } = req.params;
  const { nombre_enfermedad, descripcion_enfermedad, categoria, especie_afectada } = req.body;

  try {
    await db.query(
      `UPDATE Enfermedad SET nombre_enfermedad = ?, descripcion_enfermedad = ?, categoria = ?, especie_afectada = ?
       WHERE enfermedad_id = ?`,
      [nombre_enfermedad, descripcion_enfermedad, categoria, especie_afectada, id]
    );
    res.json({ message: 'Enfermedad actualizada' });
  } catch (error) {
    console.error('Error al actualizar enfermedad:', error);
    res.status(500).json({ error: 'Error al actualizar enfermedad' });
  }
};

// Eliminar enfermedad
const deleteEnfermedad = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Enfermedad WHERE enfermedad_id = ?', [id]);
    res.json({ message: 'Enfermedad eliminada' });
  } catch (error) {
    console.error('Error al eliminar enfermedad:', error);
    res.status(500).json({ error: 'Error al eliminar enfermedad' });
  }
};

module.exports = {
  getEnfermedades,
  getEnfermedadById,
  createEnfermedad,
  updateEnfermedad,
  deleteEnfermedad
};
