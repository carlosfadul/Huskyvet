// src/controllers/tratamiento.controller.js
const db = require('../database');

// Obtener todos los tratamientos
const getTratamientos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Tratamiento ORDER BY fecha_creacion DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tratamientos:', error);
    res.status(500).json({ error: 'Error al obtener tratamientos' });
  }
};

// Obtener tratamiento por ID
const getTratamientoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Tratamiento WHERE tratamiento_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Tratamiento no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el tratamiento:', error);
    res.status(500).json({ error: 'Error al obtener el tratamiento' });
  }
};

// Crear tratamiento
const createTratamiento = async (req, res) => {
  const { nombre_tratamiento, descripcion_tratamiento, tipo_tratamiento, duracion_recomendada } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Tratamiento (nombre_tratamiento, descripcion_tratamiento, tipo_tratamiento, duracion_recomendada)
       VALUES (?, ?, ?, ?)`,
      [nombre_tratamiento, descripcion_tratamiento, tipo_tratamiento, duracion_recomendada]
    );
    res.status(201).json({ message: 'Tratamiento creado', tratamiento_id: result.insertId });
  } catch (error) {
    console.error('Error al crear tratamiento:', error);
    res.status(500).json({ error: 'Error al crear tratamiento' });
  }
};

// Actualizar tratamiento
const updateTratamiento = async (req, res) => {
  const { id } = req.params;
  const { nombre_tratamiento, descripcion_tratamiento, tipo_tratamiento, duracion_recomendada } = req.body;

  try {
    await db.query(
      `UPDATE Tratamiento SET nombre_tratamiento = ?, descripcion_tratamiento = ?, tipo_tratamiento = ?, duracion_recomendada = ?
       WHERE tratamiento_id = ?`,
      [nombre_tratamiento, descripcion_tratamiento, tipo_tratamiento, duracion_recomendada, id]
    );
    res.json({ message: 'Tratamiento actualizado' });
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);
    res.status(500).json({ error: 'Error al actualizar tratamiento' });
  }
};

// Eliminar tratamiento
const deleteTratamiento = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Tratamiento WHERE tratamiento_id = ?', [id]);
    res.json({ message: 'Tratamiento eliminado' });
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    res.status(500).json({ error: 'Error al eliminar tratamiento' });
  }
};

module.exports = {
  getTratamientos,
  getTratamientoById,
  createTratamiento,
  updateTratamiento,
  deleteTratamiento
};
