const db = require('../database');

// Obtener todos los detalles de venta
exports.getAllDetallesVenta = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DetalleVenta');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los detalles de venta:', error);
        res.status(500).json({ message: 'Error al obtener los detalles de venta' });
    }
};

// Obtener detalle de venta por ID
exports.getDetalleVentaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM DetalleVenta WHERE detalleVenta_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Detalle de venta no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el detalle de venta:', error);
        res.status(500).json({ message: 'Error al obtener el detalle de venta' });
    }
};

// Crear nuevo detalle de venta
exports.createDetalleVenta = async (req, res) => {
    const {
        venta_id,
        producto_id,
        detalleVenta_cantidad,
        detalleVenta_precio,
        descuento
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO DetalleVenta 
            (venta_id, producto_id, detalleVenta_cantidad, detalleVenta_precio, descuento) 
            VALUES (?, ?, ?, ?, ?)`,
            [venta_id, producto_id, detalleVenta_cantidad, detalleVenta_precio, descuento || 0]
        );

        res.status(201).json({ message: 'Detalle de venta creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear el detalle de venta:', error);
        res.status(500).json({ message: 'Error al crear el detalle de venta' });
    }
};

// Actualizar detalle de venta
exports.updateDetalleVenta = async (req, res) => {
    const { id } = req.params;
    const {
        venta_id,
        producto_id,
        detalleVenta_cantidad,
        detalleVenta_precio,
        descuento
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE DetalleVenta SET 
                venta_id = ?, 
                producto_id = ?, 
                detalleVenta_cantidad = ?, 
                detalleVenta_precio = ?, 
                descuento = ? 
            WHERE detalleVenta_id = ?`,
            [venta_id, producto_id, detalleVenta_cantidad, detalleVenta_precio, descuento || 0, id]
        );

        res.json({ message: 'Detalle de venta actualizado' });
    } catch (error) {
        console.error('Error al actualizar el detalle de venta:', error);
        res.status(500).json({ message: 'Error al actualizar el detalle de venta' });
    }
};

// Eliminar detalle de venta
exports.deleteDetalleVenta = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM DetalleVenta WHERE detalleVenta_id = ?', [id]);
        res.json({ message: 'Detalle de venta eliminado' });
    } catch (error) {
        console.error('Error al eliminar el detalle de venta:', error);
        res.status(500).json({ message: 'Error al eliminar el detalle de venta' });
    }
};

exports.getByVentaId = async (req, res) => {
  const { ventaId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT dv.*, 
              p.nombre_producto,
              p.precioVenta_producto
       FROM DetalleVenta dv
       JOIN Producto p ON dv.producto_id = p.producto_id
       WHERE dv.venta_id = ?`,
      [ventaId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener detalles de la venta:', err);
    res.status(500).json({ message: 'Error al obtener detalles de la venta' });
  }
};