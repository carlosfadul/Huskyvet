const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const { veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_estado, veterinaria_logo, fecha_creacion} = req.body;

    try {
        const result = await db.query(
            `INSERT INTO Veterinaria (veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_estado, veterinaria_logo, fecha_creacion) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_estado, veterinaria_logo, fecha_creacion]
        );
        res.status(201).json({ message: "Veterinaria agregada", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al insertar la veterinaria" });
    }
});

module.exports = router;