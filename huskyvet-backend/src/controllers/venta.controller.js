// src/controllers/venta.controller.js
const db = require('../database');

// ✅ Crear venta
exports.createVenta = async (req, res) => {
  try {
    const {
      cliente_id,
      sucursal_id,
      usuario_id,
      venta_estado,
      venta_detalles,
      subtotal,
      impuestos,
      descuentos,
      total,
      metodo_pago
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO Venta 
        (cliente_id, sucursal_id, usuario_id, venta_estado, venta_detalles, subtotal, impuestos, descuentos, total, metodo_pago) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cliente_id, sucursal_id, usuario_id, venta_estado, venta_detalles, subtotal, impuestos, descuentos, total, metodo_pago]
    );

    res.status(201).json({ message: 'Venta creada', venta_id: result.insertId });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta' });
  }
};

// ✅ Obtener TODAS las ventas
exports.getVentas = async (req, res) => {
  try {
    const [ventas] = await db.query('SELECT * FROM Venta');
    res.status(200).json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// ✅ NUEVO: Obtener ventas por sucursal
// GET /api/ventas/sucursal/:sucursalId
exports.getVentasPorSucursal = async (req, res) => {
  const { sucursalId } = req.params;

  try {
    const [ventas] = await db.query(
      'SELECT * FROM Venta WHERE sucursal_id = ? ORDER BY venta_fecha DESC',
      [sucursalId]
    );

    res.status(200).json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas por sucursal:', error);
    res.status(500).json({ message: 'Error al obtener las ventas de la sucursal' });
  }
};

// ✅ Obtener venta por ID
exports.getVentaById = async (req, res) => {
  try {
    const [venta] = await db.query('SELECT * FROM Venta WHERE venta_id = ?', [req.params.id]);
    if (venta.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.status(200).json(venta[0]);
  } catch (error) {
    console.error('Error al obtener la venta:', error);
    res.status(500).json({ message: 'Error al obtener la venta' });
  }
};

exports.createVentaConDetalles = async (req, res) => {
  const {
    cliente_id,
    sucursal_id,
    usuario_id,
    venta_estado = 'completada',
    venta_detalles,
    metodo_pago,
    items,
  } = req.body;

  // Validación rápida de entrada
  if (!cliente_id || !sucursal_id || !metodo_pago) {
    return res.status(400).json({
      message: 'cliente_id, sucursal_id y metodo_pago son obligatorios',
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: 'Debe enviar al menos un producto en items' });
  }

  const connection = await db.getConnection(); // suponiendo que db es un pool de mysql2/promise

  try {
    await connection.beginTransaction();

    let subtotal = 0;
    let impuestos = 0; // si más adelante manejas IVA por producto, lo calculamos aquí
    let descuentosTotal = 0;

    // Guardaremos los detalles calculados para insertarlos después
    const detallesCalculados = [];

    // 1) Recorrer items, comprobar stock, calcular totales
    for (const item of items) {
      const producto_id = item.producto_id;
      const cantidad = Number(item.cantidad) || 0;
      const descuento = Number(item.descuento) || 0;

      if (!producto_id || cantidad <= 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          message:
            'Cada item debe tener producto_id y cantidad mayor que cero',
        });
      }

      // Bloqueamos el producto para esta transacción
      const [prodRows] = await connection.query(
        'SELECT precioVenta_producto, cantidad_producto FROM Producto WHERE producto_id = ? FOR UPDATE',
        [producto_id]
      );

      if (prodRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res
          .status(400)
          .json({ message: `Producto ${producto_id} no encontrado` });
      }

      const producto = prodRows[0];

      if (producto.cantidad_producto < cantidad) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          message: `Stock insuficiente para el producto ${producto_id}. Disponible: ${producto.cantidad_producto}, solicitado: ${cantidad}`,
        });
      }

      const precio = Number(producto.precioVenta_producto);

      const lineaBruta = precio * cantidad;
      const valorDescuento = (lineaBruta * descuento) / 100;
      const lineaSubtotal = lineaBruta - valorDescuento;

      subtotal += lineaSubtotal;
      descuentosTotal += valorDescuento;

      detallesCalculados.push({
        producto_id,
        cantidad,
        precio,
        descuento,
      });
    }

    // Por ahora impuestos = 0; si luego manejas IVA, lo calculamos.
    impuestos = 0;
    const total = subtotal + impuestos;

    // 2) Insertar la Venta
    const [ventaResult] = await connection.query(
      `INSERT INTO Venta 
        (cliente_id, sucursal_id, usuario_id, venta_estado, venta_detalles, subtotal, impuestos, descuentos, total, metodo_pago)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        cliente_id,
        sucursal_id,
        usuario_id || null,
        venta_estado,
        venta_detalles || null,
        subtotal,
        impuestos,
        descuentosTotal,
        total,
        metodo_pago,
      ]
    );

    const venta_id = ventaResult.insertId;

    // 3) Insertar cada DetalleVenta y actualizar stock
    for (const det of detallesCalculados) {
      await connection.query(
        `INSERT INTO DetalleVenta 
          (venta_id, producto_id, detalleVenta_cantidad, detalleVenta_precio, descuento)
         VALUES (?,?,?,?,?)`,
        [
          venta_id,
          det.producto_id,
          det.cantidad,
          det.precio,
          det.descuento,
        ]
      );

      await connection.query(
        `UPDATE Producto 
           SET cantidad_producto = cantidad_producto - ? 
         WHERE producto_id = ?`,
        [det.cantidad, det.producto_id]
      );
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      message: 'Venta creada con detalles y stock actualizado',
      venta_id,
    });
  } catch (error) {
    console.error('Error al crear venta con detalles:', error);
    try {
      await connection.rollback();
      connection.release();
    } catch (err2) {
      console.error('Error al hacer rollback de la venta:', err2);
    }

    return res
      .status(500)
      .json({ message: 'Error al crear la venta con detalles' });
  }
};

// ✅ Actualizar venta
exports.updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cliente_id,
      sucursal_id,
      usuario_id,
      venta_estado,
      venta_detalles,
      subtotal,
      impuestos,
      descuentos,
      total,
      metodo_pago
    } = req.body;

    await db.query(
      `UPDATE Venta SET 
        cliente_id=?, sucursal_id=?, usuario_id=?, venta_estado=?, venta_detalles=?, 
        subtotal=?, impuestos=?, descuentos=?, total=?, metodo_pago=?
      WHERE venta_id=?`,
      [cliente_id, sucursal_id, usuario_id, venta_estado, venta_detalles, subtotal, impuestos, descuentos, total, metodo_pago, id]
    );

    res.status(200).json({ message: 'Venta actualizada' });
  } catch (error) {
    console.error('Error al actualizar la venta:', error);
    res.status(500).json({ message: 'Error al actualizar la venta' });
  }
};

// ✅ Eliminar venta
exports.deleteVenta = async (req, res) => {
  try {
    await db.query('DELETE FROM Venta WHERE venta_id = ?', [req.params.id]);
    res.status(200).json({ message: 'Venta eliminada' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ message: 'Error al eliminar la venta' });
  }
};
