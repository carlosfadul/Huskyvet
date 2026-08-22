const db = require('../database');

exports.getAllDetallePedidos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM DetallePedido');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener detalles de pedido:', error);
    res.status(500).json({ message: 'Error al obtener los detalles de pedido' });
  }
};

exports.getDetallePedidoById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM DetallePedido WHERE detallePedido_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el detalle de pedido:', error);
    res.status(500).json({ message: 'Error al obtener el detalle de pedido' });
  }
};

exports.createDetallePedido = async (req, res) => {
  try {
    const {
      pedido_id,
      producto_id,
      detallePedido_cantidad,
      detallePedido_precio,
      cantidad_recibida
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO DetallePedido 
      (pedido_id, producto_id, detallePedido_cantidad, detallePedido_precio, cantidad_recibida)
      VALUES (?, ?, ?, ?, ?)`,
      [pedido_id, producto_id, detallePedido_cantidad, detallePedido_precio, cantidad_recibida || 0]
    );

    res.status(201).json({ message: 'Detalle de pedido creado', id: result.insertId });
  } catch (error) {
    console.error('Error al crear el detalle de pedido:', error);
    res.status(500).json({ message: 'Error al crear el detalle de pedido' });
  }
};

exports.updateDetallePedido = async (req, res) => {
  try {
    const {
      pedido_id,
      producto_id,
      detallePedido_cantidad,
      detallePedido_precio,
      cantidad_recibida
    } = req.body;

    const [result] = await db.query(
      `UPDATE DetallePedido SET 
      pedido_id = ?, 
      producto_id = ?, 
      detallePedido_cantidad = ?, 
      detallePedido_precio = ?, 
      cantidad_recibida = ?
      WHERE detallePedido_id = ?`,
      [pedido_id, producto_id, detallePedido_cantidad, detallePedido_precio, cantidad_recibida || 0, req.params.id]
    );

    res.json({ message: 'Detalle de pedido actualizado' });
  } catch (error) {
    console.error('Error al actualizar el detalle de pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el detalle de pedido' });
  }
};

exports.deleteDetallePedido = async (req, res) => {
  try {
    await db.query('DELETE FROM DetallePedido WHERE detallePedido_id = ?', [req.params.id]);
    res.json({ message: 'Detalle de pedido eliminado' });
  } catch (error) {
    console.error('Error al eliminar el detalle de pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el detalle de pedido' });
  }
};
