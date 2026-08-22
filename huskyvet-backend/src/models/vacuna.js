const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const { vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO Vacuna (vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [vacuna_nombre, vacuna_laboratorio, vacuna_detalles, especie_destinada, edad_minima_semanas, frecuencia_meses]
        );
        res.status(201).json({ message: "Vacuna agregada", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al insertar la vacuna" });
    }
});

module.exports = router;
