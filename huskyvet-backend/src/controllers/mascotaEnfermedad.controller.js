const db = require('../database');

// Crear nueva relación mascota-enfermedad
exports.createMascotaEnfermedad = async (req, res) => {
    try {
        const { mascota_id, enfermedad_id, fecha_diagnostico, fecha_cura, estado, observaciones } = req.body;

        await db.query(
            `INSERT INTO MascotaEnfermedad 
            (mascota_id, enfermedad_id, fecha_diagnostico, fecha_cura, estado, observaciones)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [mascota_id, enfermedad_id, fecha_diagnostico, fecha_cura, estado, observaciones]
        );

        res.status(201).json({ message: 'Relación registrada correctamente' });
    } catch (error) {
        console.error('Error al crear relación:', error);
        res.status(500).json({ message: 'Error al crear la relación', error });
    }
};

// Obtener todas las relaciones
exports.getMascotaEnfermedades = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM MascotaEnfermedad');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las relaciones' });
    }
};

// Obtener una relación específica
exports.getMascotaEnfermedad = async (req, res) => {
    const { mascota_id, enfermedad_id, fecha_diagnostico } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM MascotaEnfermedad WHERE mascota_id = ? AND enfermedad_id = ? AND fecha_diagnostico = ?',
            [mascota_id, enfermedad_id, fecha_diagnostico]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Relación no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la relación' });
    }
};

// Obtener todas las enfermedades por mascota_id
exports.getEnfermedadesPorMascota = async (req, res) => {
    const { mascota_id } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT me.*, e.nombre_enfermedad, e.descripcion_enfermedad
             FROM MascotaEnfermedad me
             JOIN Enfermedad e ON me.enfermedad_id = e.enfermedad_id
             WHERE me.mascota_id = ?`,
            [mascota_id]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener enfermedades por mascota' });
    }
};

// Actualizar una relación
exports.updateMascotaEnfermedad = async (req, res) => {
    const { mascota_id, enfermedad_id, fecha_diagnostico } = req.params;
    const { fecha_cura, estado, observaciones } = req.body;

    try {
        await db.query(
            `UPDATE MascotaEnfermedad 
             SET fecha_cura=?, estado=?, observaciones=?
             WHERE mascota_id=? AND enfermedad_id=? AND fecha_diagnostico=?`,
            [fecha_cura, estado, observaciones, mascota_id, enfermedad_id, fecha_diagnostico]
        );

        res.json({ message: 'Relación actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la relación' });
    }
};

// Eliminar relación
exports.deleteMascotaEnfermedad = async (req, res) => {
    const { mascota_id, enfermedad_id, fecha_diagnostico } = req.params;

    try {
        await db.query(
            `DELETE FROM MascotaEnfermedad 
             WHERE mascota_id=? AND enfermedad_id=? AND fecha_diagnostico=?`,
            [mascota_id, enfermedad_id, fecha_diagnostico]
        );

        res.json({ message: 'Relación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la relación' });
    }
};
