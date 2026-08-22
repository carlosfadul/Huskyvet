const db = require('../database');

// Obtener todos los proveedores
const getProveedores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Proveedor');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};

// Obtener proveedor por ID
const getProveedorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Proveedor WHERE proveedor_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
};

// Crear proveedor
const createProveedor = async (req, res) => {
  const {
    nombre_proveedor,
    direccion_proveedor,
    telefono_proveedor,
    email_proveedor,
    nit_proveedor,
    detalles_proveedor,
    proveedor_estado = 'activo'
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Proveedor 
      (nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor, nit_proveedor, detalles_proveedor, proveedor_estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor, nit_proveedor, detalles_proveedor, proveedor_estado]
    );
    res.status(201).json({ message: 'Proveedor creado', proveedor_id: result.insertId });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
};

// Actualizar proveedor
const updateProveedor = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_proveedor,
    direccion_proveedor,
    telefono_proveedor,
    email_proveedor,
    nit_proveedor,
    detalles_proveedor,
    proveedor_estado
  } = req.body;

  try {
    await db.query(
      `UPDATE Proveedor SET nombre_proveedor = ?, direccion_proveedor = ?, telefono_proveedor = ?, email_proveedor = ?, nit_proveedor = ?, detalles_proveedor = ?, proveedor_estado = ? WHERE proveedor_id = ?`,
      [nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor, nit_proveedor, detalles_proveedor, proveedor_estado, id]
    );
    res.json({ message: 'Proveedor actualizado' });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
};

// Eliminar proveedor
const deleteProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Proveedor WHERE proveedor_id = ?', [id]);
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
};

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};
