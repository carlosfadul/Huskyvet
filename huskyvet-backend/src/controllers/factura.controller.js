const db = require('../database');

exports.getFacturas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Factura');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({ message: 'Error al obtener las facturas' });
    }
};

exports.getFacturaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Factura WHERE factura_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({ message: 'Error al obtener la factura' });
    }
};

exports.createFactura = async (req, res) => {
    const {
        sucursal_id, cliente_id, usuario_id, factura_numero, factura_fecha,
        factura_subtotal, factura_impuestos, factura_descuentos,
        factura_total, factura_estado, factura_metodo_pago, factura_observaciones
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO Factura (
                sucursal_id, cliente_id, usuario_id, factura_numero, factura_fecha,
                factura_subtotal, factura_impuestos, factura_descuentos,
                factura_total, factura_estado, factura_metodo_pago, factura_observaciones
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sucursal_id, cliente_id, usuario_id, factura_numero, factura_fecha,
                factura_subtotal, factura_impuestos, factura_descuentos,
                factura_total, factura_estado, factura_metodo_pago, factura_observaciones
            ]
        );
        res.status(201).json({ message: 'Factura creada', factura_id: result.insertId });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ message: 'Error al crear la factura' });
    }
};

exports.updateFactura = async (req, res) => {
    const { id } = req.params;
    const {
        sucursal_id, cliente_id, usuario_id, factura_numero, factura_fecha,
        factura_subtotal, factura_impuestos, factura_descuentos,
        factura_total, factura_estado, factura_metodo_pago, factura_observaciones
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE Factura SET 
                sucursal_id=?, cliente_id=?, usuario_id=?, factura_numero=?, factura_fecha=?,
                factura_subtotal=?, factura_impuestos=?, factura_descuentos=?,
                factura_total=?, factura_estado=?, factura_metodo_pago=?, factura_observaciones=?
             WHERE factura_id=?`,
            [
                sucursal_id, cliente_id, usuario_id, factura_numero, factura_fecha,
                factura_subtotal, factura_impuestos, factura_descuentos,
                factura_total, factura_estado, factura_metodo_pago, factura_observaciones, id
            ]
        );
        res.json({ message: 'Factura actualizada' });
    } catch (error) {
        console.error('Error al actualizar la factura:', error);
        res.status(500).json({ message: 'Error al actualizar la factura' });
    }
};

exports.deleteFactura = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Factura WHERE factura_id = ?', [id]);
        res.json({ message: 'Factura eliminada' });
    } catch (error) {
        console.error('Error al eliminar la factura:', error);
        res.status(500).json({ message: 'Error al eliminar la factura' });
    }
};

exports.getFacturasPorSucursal = async (req, res) => {
    const { sucursal_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Factura WHERE sucursal_id = ?', [sucursal_id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener facturas por sucursal:', error);
        res.status(500).json({ message: 'Error al obtener las facturas por sucursal' });
    }
};

exports.getFacturasPorCliente = async (req, res) => {
    const { cliente_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Factura WHERE cliente_id = ?', [cliente_id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener facturas por cliente:', error);
        res.status(500).json({ message: 'Error al obtener las facturas por cliente' });
    }
};
