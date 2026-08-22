const db = require('../database');

// Crear movimiento
exports.createMovimiento = async (req, res) => {
    try {
        const {
            producto_id,
            sucursal_id,
            usuario_id,
            tipo_movimiento,
            cantidad,
            referencia_id,
            referencia_tipo,
            motivo
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO MovimientoInventario (
                producto_id, sucursal_id, usuario_id,
                tipo_movimiento, cantidad, referencia_id,
                referencia_tipo, motivo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [producto_id, sucursal_id, usuario_id, tipo_movimiento, cantidad, referencia_id, referencia_tipo, motivo]
        );

        res.status(201).json({ message: 'Movimiento creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear el movimiento:', error);
        res.status(500).json({ error: 'Error al crear el movimiento' });
    }
};

// Obtener todos los movimientos
exports.getMovimientos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM MovimientoInventario');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
};

// Obtener movimiento por ID
exports.getMovimientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM MovimientoInventario WHERE movimiento_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener movimiento por ID:', error);
        res.status(500).json({ error: 'Error al obtener movimiento' });
    }
};

// Actualizar movimiento
exports.updateMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            producto_id,
            sucursal_id,
            usuario_id,
            tipo_movimiento,
            cantidad,
            referencia_id,
            referencia_tipo,
            motivo
        } = req.body;

        await db.execute(
            `UPDATE MovimientoInventario SET
                producto_id = ?, sucursal_id = ?, usuario_id = ?,
                tipo_movimiento = ?, cantidad = ?, referencia_id = ?,
                referencia_tipo = ?, motivo = ?
            WHERE movimiento_id = ?`,
            [producto_id, sucursal_id, usuario_id, tipo_movimiento, cantidad, referencia_id, referencia_tipo, motivo, id]
        );

        res.json({ message: 'Movimiento actualizado' });
    } catch (error) {
        console.error('Error al actualizar movimiento:', error);
        res.status(500).json({ error: 'Error al actualizar movimiento' });
    }
};

// Eliminar movimiento
exports.deleteMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM MovimientoInventario WHERE movimiento_id = ?', [id]);
        res.json({ message: 'Movimiento eliminado' });
    } catch (error) {
        console.error('Error al eliminar movimiento:', error);
        res.status(500).json({ error: 'Error al eliminar movimiento' });
    }
};
