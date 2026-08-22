const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const { veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_logo, sucursal_estado, fecha_creacion } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO Sucursal (veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_logo, sucursal_estado, fecha_creacion) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_logo, sucursal_estado, fecha_creacion]
        );
        res.status(201).json({ message: "Sucursal agregada", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al insertar la sucursal" });
    }
});

module.exports = router;
