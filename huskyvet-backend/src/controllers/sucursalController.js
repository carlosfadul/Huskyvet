const db = require('../database');
const pool = require('../database'); // Asegúrate de importar tu conexión a MySQL
const con = require('../database');



exports.getSucursales = async (req, res) => {
    try {
      const { veterinaria_id } = req.query;
  
      let query = 'SELECT * FROM Sucursal';
      let values = [];
  
      if (veterinaria_id) {
        query += ' WHERE veterinaria_id = ?';
        values.push(veterinaria_id);
      }
  
      const [rows] = await pool.query(query, values);
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
      res.status(500).json({ message: 'Error al obtener sucursales', error });
    }
  };
  


// Crear una nueva sucursal
exports.createSucursal = async (req, res) => {
    try {
        const { veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_estado } = req.body;
        const sucursal_logo = req.file ? req.file.buffer : null;

        const query = `INSERT INTO Sucursal (veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_logo, sucursal_estado) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [veterinaria_id, sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_logo, sucursal_estado];


        await pool.query(query, values);
        res.status(201).json({ message: 'Sucursal creada con éxito' });

    } catch (error) {
        console.error("Error en createSucursal:", error); // Agregar log en consola
        res.status(500).json({ message: 'Error al crear la sucursal', error });
    }
};

// Obtener una sucursal por ID
exports.getSucursalById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Sucursal WHERE sucursal_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener sucursal por ID:", error);
        res.status(500).json({ message: 'Error al obtener la sucursal', error });
    }
};

// Obtener sucursales por veterinaria_id
exports.getSucursalesByVeterinariaId = async (req, res) => {
    try {
        const { veterinaria_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Sucursal WHERE veterinaria_id = ?', [veterinaria_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las sucursales', error });
    }
};

// Actualizar una sucursal
exports.updateSucursal = async (req, res) => {
    try {
        const { id } = req.params;
        const { sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_estado, veterinaria_id } = req.body;
        const sucursal_logo = req.file ? req.file.buffer : null;

        let query = `UPDATE Sucursal SET 
            sucursal_nombre = ?, 
            sucursal_direccion = ?, 
            sucursal_telefono = ?, 
            sucursal_nit = ?, 
            sucursal_estado = ?,
            veterinaria_id = ?`;

        let values = [sucursal_nombre, sucursal_direccion, sucursal_telefono, sucursal_nit, sucursal_estado, veterinaria_id];

        // Si hay un logo, también lo actualiza
        if (sucursal_logo) {
            query += `, sucursal_logo = ?`;
            values.push(sucursal_logo);
        }

        query += ` WHERE sucursal_id = ?`;
        values.push(id);

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json({ message: 'Sucursal actualizada con éxito' });
    } catch (error) {
        console.error("Error al actualizar sucursal:", error); // Agregar log en consola
        res.status(500).json({ message: 'Error al actualizar la sucursal', error });
    }
};


// Eliminar una sucursal
exports.deleteSucursal = async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM Sucursal WHERE sucursal_id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
  
      res.json({ message: 'Sucursal eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar la sucursal:', error);
      res.status(500).json({ message: 'Error al eliminar la sucursal', error });
    }
  };
  


// Obtener el logo de una sucursal
exports.getSucursalLogo = async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.query(
        'SELECT sucursal_logo FROM Sucursal WHERE sucursal_id = ?',
        [id]
      );
  
      if (rows.length === 0 || !rows[0].sucursal_logo) {
        return res.status(404).send('Logo no encontrado');
      }
  
      res.setHeader('Content-Type', 'image/png');
      res.send(rows[0].sucursal_logo);
    } catch (error) {
      console.error('Error al obtener el logo de la sucursal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  


