const db = require('../database');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Producto');
    const productos = rows.map(prod => ({
      ...prod,
      foto_producto: prod.foto_producto ? `data:image/jpeg;base64,${prod.foto_producto.toString('base64')}` : null
    }));
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Producto WHERE producto_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });

    const producto = rows[0];
    if (producto.foto_producto) {
      producto.foto_producto = `data:image/jpeg;base64,${producto.foto_producto.toString('base64')}`;
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Crear producto
const createProducto = async (req, res) => {
  const {
    proveedor_id,
    categoria_producto,
    nombre_producto,
    codigoBarras_producto,
    cantidad_producto,
    unidades_producto,
    precioCompra_producto,
    precioVenta_producto,
    marca_producto,
    descripcion_producto,
    producto_estado,
    fecha_vencimiento
  } = req.body;

  const foto_producto = req.file ? req.file.buffer : null;

  try {
    const [result] = await db.query(
      `INSERT INTO Producto (
        proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto,
        cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto,
        marca_producto, descripcion_producto, foto_producto, producto_estado, fecha_vencimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto,
        cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto,
        marca_producto, descripcion_producto, foto_producto, producto_estado, fecha_vencimiento
      ]
    );

    res.status(201).json({ message: 'Producto creado', producto_id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar producto
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const {
    proveedor_id,
    categoria_producto,
    nombre_producto,
    codigoBarras_producto,
    cantidad_producto,
    unidades_producto,
    precioCompra_producto,
    precioVenta_producto,
    marca_producto,
    descripcion_producto,
    producto_estado,
    fecha_vencimiento
  } = req.body;

  const foto_producto = req.file ? req.file.buffer : null;

  try {
    await db.query(
      `UPDATE Producto SET
        proveedor_id = ?, categoria_producto = ?, nombre_producto = ?, codigoBarras_producto = ?,
        cantidad_producto = ?, unidades_producto = ?, precioCompra_producto = ?, precioVenta_producto = ?,
        marca_producto = ?, descripcion_producto = ?, foto_producto = ?, producto_estado = ?, fecha_vencimiento = ?
       WHERE producto_id = ?`,
      [
        proveedor_id, categoria_producto, nombre_producto, codigoBarras_producto,
        cantidad_producto, unidades_producto, precioCompra_producto, precioVenta_producto,
        marca_producto, descripcion_producto, foto_producto, producto_estado, fecha_vencimiento, id
      ]
    );

    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto
const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Producto WHERE producto_id = ?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
