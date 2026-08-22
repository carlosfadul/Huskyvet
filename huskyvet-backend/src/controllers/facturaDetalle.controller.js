const db = require('../database');

// Obtener todos los detalles de facturas
exports.getAllFacturaDetalles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM FacturaDetalle');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los detalles de facturas:', error);
        res.status(500).json({ message: 'Error al obtener los detalles de facturas' });
    }
};

// Obtener detalle por ID
exports.getFacturaDetalleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM FacturaDetalle WHERE facturaDetalle_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Detalle no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        res.status(500).json({ message: 'Error al obtener detalle' });
    }
};

// Crear nuevo detalle
exports.createFacturaDetalle = async (req, res) => {
    const {
        factura_id,
        venta_id,
        remision_id,
        atencion_id,
        facturaDetalle_descripcion,
        facturaDetalle_cantidad,
        facturaDetalle_precio_unitario,
        facturaDetalle_descuento,
        tipo_transaccion
    } = req.body;

    try {
        await db.query(
            `INSERT INTO FacturaDetalle 
            (factura_id, venta_id, remision_id, atencion_id, facturaDetalle_descripcion, facturaDetalle_cantidad, 
            facturaDetalle_precio_unitario, facturaDetalle_descuento, tipo_transaccion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                factura_id,
                venta_id || null,
                remision_id || null,
                atencion_id || null,
                facturaDetalle_descripcion,
                facturaDetalle_cantidad,
                facturaDetalle_precio_unitario,
                facturaDetalle_descuento || 0,
                tipo_transaccion
            ]
        );
        res.status(201).json({ message: 'Detalle creado exitosamente' });
    } catch (error) {
        console.error('Error al crear detalle:', error);
        res.status(500).json({ message: 'Error al crear detalle' });
    }
};

// Actualizar detalle
exports.updateFacturaDetalle = async (req, res) => {
    const { id } = req.params;
    const {
        factura_id,
        venta_id,
        remision_id,
        atencion_id,
        facturaDetalle_descripcion,
        facturaDetalle_cantidad,
        facturaDetalle_precio_unitario,
        facturaDetalle_descuento,
        tipo_transaccion
    } = req.body;

    try {
        await db.query(
            `UPDATE FacturaDetalle SET 
                factura_id = ?, venta_id = ?, remision_id = ?, atencion_id = ?, 
                facturaDetalle_descripcion = ?, facturaDetalle_cantidad = ?, 
                facturaDetalle_precio_unitario = ?, facturaDetalle_descuento = ?, 
                tipo_transaccion = ?
            WHERE facturaDetalle_id = ?`,
            [
                factura_id,
                venta_id || null,
                remision_id || null,
                atencion_id || null,
                facturaDetalle_descripcion,
                facturaDetalle_cantidad,
                facturaDetalle_precio_unitario,
                facturaDetalle_descuento || 0,
                tipo_transaccion,
                id
            ]
        );
        res.json({ message: 'Detalle actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar detalle:', error);
        res.status(500).json({ message: 'Error al actualizar detalle' });
    }
};

// Eliminar detalle
exports.deleteFacturaDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM FacturaDetalle WHERE facturaDetalle_id = ?', [id]);
        res.json({ message: 'Detalle eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar detalle:', error);
        res.status(500).json({ message: 'Error al eliminar detalle' });
    }
};
