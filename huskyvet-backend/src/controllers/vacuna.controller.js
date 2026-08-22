const db = require('../database');
const pool = require('../database'); // Asegúrate de importar tu conexión a MySQL
const con = require('../database'); // Ajusta la ruta según tu estructura


// Obtener todas las vacunas
exports.getVacunas = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Vacuna');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener vacunas:', err);
        res.status(500).json({ message: 'Error al obtener vacunas' });
    }
};

// Obtener vacuna por ID
exports.getVacunaById = async (req, res) => {
    const id = req.params.id;
    try {
        const [results] = await db.query('SELECT * FROM Vacuna WHERE vacuna_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Vacuna no encontrada' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error al obtener la vacuna por ID:', err);
        res.status(500).json({ message: 'Error al obtener la vacuna' });
    }
};

// Crear nueva vacuna
exports.createVacuna = async (req, res) => {
    const { vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Vacuna (vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses) VALUES (?, ?, ?, ?, ?, ?)',
            [vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses]
        );
        res.status(201).json({ message: 'Vacuna creada exitosamente', vacuna_id: result.insertId });
    } catch (err) {
        console.error('Error al crear la vacuna:', err);
        res.status(500).json({ message: 'Error al crear la vacuna' });
    }
};

// Actualizar vacuna
exports.updateVacuna = async (req, res) => {
    const { id } = req.params;
    const { vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Vacuna SET vacuna_nombre = ?, vacuna_laboratorio = ?, vacuna_detalles = ?, especie_destinada = ?, edad_minima_semanas = ?, frecuencia_meses = ? WHERE vacuna_id = ?',
            [vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vacuna no encontrada' });
        }
        res.json({ message: 'Vacuna actualizada exitosamente' });
    } catch (err) {
        console.error('Error al actualizar la vacuna:', err);
        res.status(500).json({ message: 'Error al actualizar la vacuna' });
    }
};

// Eliminar vacuna
exports.deleteVacuna = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Vacuna WHERE vacuna_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vacuna no encontrada' });
        }
        res.json({ message: 'Vacuna eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar la vacuna:', err);
        res.status(500).json({ message: 'Error al eliminar la vacuna' });
    }
};
