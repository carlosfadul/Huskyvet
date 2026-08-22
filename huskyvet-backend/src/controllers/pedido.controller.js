// src/controllers/pedido.controller.js
const db = require('../database');

// Obtener todos los pedidos
exports.getPedidos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Pedido');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
};

// Obtener un pedido por ID
exports.getPedidoById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM Pedido WHERE pedido_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).json({ message: 'Error al obtener el pedido' });
  }
};

// 🔹 Listar pedidos por sucursal_id
exports.getPedidosBySucursalId = async (req, res) => {
  const sucursal_id = req.params.sucursal_id;
  try {
    const [rows] = await db.query(
      'SELECT * FROM Pedido WHERE sucursal_id = ? ORDER BY pedido_fecha DESC',
      [sucursal_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos por sucursal:', error);
    res.status(500).json({ message: 'Error al obtener pedidos por sucursal' });
  }
};

// Crear un nuevo pedido
exports.createPedido = async (req, res) => {
  const {
    sucursal_id,
    proveedor_id,
    usuario_id,
    pedido_fecha,
    pedido_estado,
    pedido_detalles,
    fecha_entrega_estimada,
    fecha_entrega_real,
    subtotal,
    impuestos,
    descuentos,
    total,
    metodo_pago
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Pedido (
        sucursal_id, proveedor_id, usuario_id, pedido_fecha, pedido_estado,
        pedido_detalles, fecha_entrega_estimada, fecha_entrega_real,
        subtotal, impuestos, descuentos, total, metodo_pago
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sucursal_id,
        proveedor_id,
        usuario_id,
        pedido_fecha || new Date(),
        pedido_estado,
        pedido_detalles,
        fecha_entrega_estimada,
        fecha_entrega_real,
        subtotal,
        impuestos,
        descuentos,
        total,
        metodo_pago
      ]
    );
    res
      .status(201)
      .json({ message: 'Pedido creado correctamente', pedido_id: result.insertId });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};

// Actualizar un pedido
exports.updatePedido = async (req, res) => {
  const id = req.params.id;
  const {
    sucursal_id,
    proveedor_id,
    usuario_id,
    pedido_fecha,
    pedido_estado,
    pedido_detalles,
    fecha_entrega_estimada,
    fecha_entrega_real,
    subtotal,
    impuestos,
    descuentos,
    total,
    metodo_pago
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE Pedido SET
        sucursal_id = ?, proveedor_id = ?, usuario_id = ?, pedido_fecha = ?, pedido_estado = ?,
        pedido_detalles = ?, fecha_entrega_estimada = ?, fecha_entrega_real = ?,
        subtotal = ?, impuestos = ?, descuentos = ?, total = ?, metodo_pago = ?
       WHERE pedido_id = ?`,
      [
        sucursal_id,
        proveedor_id,
        usuario_id,
        pedido_fecha,
        pedido_estado,
        pedido_detalles,
        fecha_entrega_estimada,
        fecha_entrega_real,
        subtotal,
        impuestos,
        descuentos,
        total,
        metodo_pago,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({ message: 'Pedido actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido' });
  }
};

// Eliminar un pedido
exports.deletePedido = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM Pedido WHERE pedido_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
};

// Listar pedidos por proveedor_id
exports.getPedidosByProveedorId = async (req, res) => {
  const proveedor_id = req.params.proveedor_id;
  try {
    const [rows] = await db.query(
      'SELECT * FROM Pedido WHERE proveedor_id = ? ORDER BY pedido_fecha DESC',
      [proveedor_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos por proveedor:', error);
    res.status(500).json({ message: 'Error al obtener pedidos por proveedor' });
  }
};

