// src/controllers/desparasitante.controller.js

const db = require('../database');


// Obtener todos
exports.getDesparasitantes = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM Desparasitante ORDER BY desparasitante_nombre'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener desparasitantes:', err);
    res.status(500).json({ message: 'Error al obtener desparasitantes' });
  }
};

// Obtener por id
exports.getDesparasitanteById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM Desparasitante WHERE desparasitante_id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Desparasitante no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener desparasitante:', err);
    res.status(500).json({ message: 'Error al obtener desparasitante' });
  }
};

// Crear
exports.createDesparasitante = async (req, res) => {
  try {
    const {
      desparasitante_nombre,
      desparasitante_laboratorio,
      desparasitante_detalles,
      tipo,
      especie_destinada,
      edad_minima_semanas,
      peso_minimo,
      peso_maximo
    } = req.body;

    const [result] = await db.promise().query(
      `INSERT INTO Desparasitante (
         desparasitante_nombre,
         desparasitante_laboratorio,
         desparasitante_detalles,
         tipo,
         especie_destinada,
         edad_minima_semanas,
         peso_minimo,
         peso_maximo
       ) VALUES (?,?,?,?,?,?,?,?)`,
      [
        desparasitante_nombre,
        desparasitante_laboratorio,
        desparasitante_detalles || null,
        tipo || null,
        especie_destinada || null,
        edad_minima_semanas || null,
        peso_minimo || null,
        peso_maximo || null
      ]
    );

    const [rows] = await db
      .promise()
      .query(
        'SELECT * FROM Desparasitante WHERE desparasitante_id = ?',
        [result.insertId]
      );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error al crear desparasitante:', err);
    res.status(500).json({ message: 'Error al crear desparasitante', error: err });
  }
};

// Actualizar
exports.updateDesparasitante = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      desparasitante_nombre,
      desparasitante_laboratorio,
      desparasitante_detalles,
      tipo,
      especie_destinada,
      edad_minima_semanas,
      peso_minimo,
      peso_maximo
    } = req.body;

    await db.promise().query(
      `UPDATE Desparasitante SET
         desparasitante_nombre = ?,
         desparasitante_laboratorio = ?,
         desparasitante_detalles = ?,
         tipo = ?,
         especie_destinada = ?,
         edad_minima_semanas = ?,
         peso_minimo = ?,
         peso_maximo = ?
       WHERE desparasitante_id = ?`,
      [
        desparasitante_nombre,
        desparasitante_laboratorio,
        desparasitante_detalles || null,
        tipo || null,
        especie_destinada || null,
        edad_minima_semanas || null,
        peso_minimo || null,
        peso_maximo || null,
        id
      ]
    );

    const [rows] = await db
      .promise()
      .query(
        'SELECT * FROM Desparasitante WHERE desparasitante_id = ?',
        [id]
      );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al actualizar desparasitante:', err);
    res.status(500).json({ message: 'Error al actualizar desparasitante', error: err });
  }
};

// Eliminar
exports.deleteDesparasitante = async (req, res) => {
  const { id } = req.params;
  try {
    await db
      .promise()
      .query('DELETE FROM Desparasitante WHERE desparasitante_id = ?', [id]);
    res.json({ message: 'Desparasitante eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar desparasitante:', err);
    res.status(500).json({ message: 'Error al eliminar desparasitante' });
  }
};
