
const db = require('../database');

// Obtener todos los aliados
const getAliados = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Aliado');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener aliados:', error);
    res.status(500).json({ error: 'Error al obtener aliados' });
  }
};

// Obtener aliado por ID
const getAliadoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Aliado WHERE aliado_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Aliado no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el aliado:', error);
    res.status(500).json({ error: 'Error al obtener el aliado' });
  }
};

// Crear nuevo aliado
const createAliado = async (req, res) => {
  const {
    nombre_aliado,
    direccion_aliado,
    telefono_aliado,
    email_aliado,
    nit_aliado,
    aliado_detalles,
    aliado_estado,
    sucursal_id
  } = req.body;

  if (!sucursal_id) {
    return res.status(400).json({ error: 'sucursal_id es requerido' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Aliado (sucursal_id, nombre_aliado, direccion_aliado, telefono_aliado, email_aliado, nit_aliado, aliado_detalles, aliado_estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sucursal_id,
        nombre_aliado,
        direccion_aliado,
        telefono_aliado,
        email_aliado,
        nit_aliado,
        aliado_detalles,
        aliado_estado || 'activo'
      ]
    );
    res.status(201).json({ message: 'Aliado creado', aliado_id: result.insertId });
  } catch (error) {
    console.error('Error al crear el aliado:', error);
    res.status(500).json({ error: 'Error al crear el aliado' });
  }
};


// Actualizar aliado
const updateAliado = async (req, res) => {
  const { id } = req.params;
  const { nombre_aliado, direccion_aliado, telefono_aliado, email_aliado, nit_aliado, aliado_detalles, aliado_estado } = req.body;

  try {
    await db.query(
      `UPDATE Aliado SET nombre_aliado = ?, direccion_aliado = ?, telefono_aliado = ?, email_aliado = ?, nit_aliado = ?, aliado_detalles = ?, aliado_estado = ?
       WHERE aliado_id = ?`,
      [nombre_aliado, direccion_aliado, telefono_aliado, email_aliado, nit_aliado, aliado_detalles, aliado_estado, id]
    );
    res.json({ message: 'Aliado actualizado' });
  } catch (error) {
    console.error('Error al actualizar aliado:', error);
    res.status(500).json({ error: 'Error al actualizar aliado' });
  }
};

// Eliminar aliado
const deleteAliado = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Aliado WHERE aliado_id = ?', [id]);
    res.json({ message: 'Aliado eliminado' });
  } catch (error) {
    console.error('Error al eliminar aliado:', error);
    res.status(500).json({ error: 'Error al eliminar aliado' });
  }
};

// Obtener aliados por sucursal
const getAliadosPorSucursal = async (req, res) => {
  const { sucursalId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Aliado WHERE sucursal_id = ?', [sucursalId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener aliados por sucursal:', error);
    res.status(500).json({ error: 'Error al obtener aliados por sucursal' });
  }
};


module.exports = {
  getAliados,
  getAliadoById,
  createAliado,
  updateAliado,
  deleteAliado,
  getAliadosPorSucursal
};
