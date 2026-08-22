const db = require('../database');
const pool = require('../database'); // Asegúrate de importar tu conexión a MySQL
const con = require('../database'); // Ajusta la ruta según tu estructura



// Obtener todas las veterinarias
exports.getVeterinarias = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Veterinaria");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener veterinarias:", error);
        res.status(500).json({ error: "Error al obtener veterinarias" });
    }
};



exports.createVeterinaria = async (req, res) => {
    try {
      const { veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono } = req.body;
      const veterinaria_logo = req.file ? req.file.buffer : null;
  
      const [result] = await pool.query(
        'INSERT INTO Veterinaria (veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_logo) VALUES (?, ?, ?, ?, ?)',
        [veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono, veterinaria_logo]
      );
  
      res.status(201).json({ message: 'Veterinaria creada', id: result.insertId });
    } catch (error) {
      console.error('Error al crear veterinaria:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
// Obtener una veterinaria por ID   
exports.getVeterinariaById = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de los parámetros de la URL
        const [rows] = await pool.query("SELECT * FROM Veterinaria WHERE veterinaria_id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        res.json(rows[0]); // Devuelve solo la veterinaria encontrada
    } catch (error) {
        console.error("Error al obtener veterinaria por ID:", error);
        res.status(500).json({ error: "Error al obtener veterinaria" });
    }
};

// Actualizar una veterinaria

exports.updateVeterinaria = async (req, res) => {
    try {
      const { veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono } = req.body;
      const veterinaria_logo = req.file ? req.file.buffer : null;
  
      const fields = ['veterinaria_nombre = ?', 'veterinaria_nit = ?', 'veterinaria_direccion = ?', 'veterinaria_telefono = ?'];
      const values = [veterinaria_nombre, veterinaria_nit, veterinaria_direccion, veterinaria_telefono];
  
      if (veterinaria_logo) {
        fields.push('veterinaria_logo = ?');
        values.push(veterinaria_logo);
      }
  
      values.push(req.params.id);
  
      const [result] = await pool.query(
        `UPDATE Veterinaria SET ${fields.join(', ')} WHERE veterinaria_id = ?`,
        values
      );
  
      res.json({ message: 'Veterinaria actualizada' });
    } catch (error) {
      console.error('Error al actualizar veterinaria:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };


// Eliminar una veterinaria (versión correcta)
exports.deleteVeterinaria = async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM Veterinaria WHERE veterinaria_id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Veterinaria no encontrada' });
      }
  
      res.json({ message: 'Veterinaria eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar veterinaria:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  // Obtener el logo de una veterinaria
exports.getLogo = async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.query("SELECT veterinaria_logo FROM Veterinaria WHERE veterinaria_id = ?", [id]);
  
      if (rows.length === 0 || !rows[0].veterinaria_logo) {
        return res.status(404).send('Logo no encontrado');
      }
  
      res.set('Content-Type', 'image/png'); // o 'image/jpeg' según el tipo
      res.send(rows[0].veterinaria_logo);
    } catch (error) {
      console.error("Error al obtener el logo:", error);
      res.status(500).json({ error: "Error interno al obtener el logo" });
    }
  };
  
